from flask import flash,session,jsonify,render_template, redirect, url_for, Blueprint,request,g
from ..extentions import db
from datetime import datetime
from ..models import Expenses

expensebp = Blueprint('expense',__name__,url_prefix='/record')

@expensebp.route('/addrecord',methods=['POST','GET'])
def add_record():
    if request.method =='POST':

        productname= request.form.get('productname')
        amount=request.form.get('amount')
        quantity=request.form.get('quantity')
        cost_per_unit=request.form.get('cost_per_unit')
        credit =request.form.get('credit')
        category = request.form.get('category')
        date=request.form.get('date')
        paymentmethod=request.form.get('paymentmethod')
        description=request.form.get('description')
        try:
            parse_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            flash('invalid format!!','danger')
            
        if not [productname ,cost_per_unit,credit,quantity,amount]:
            flash("please provide atleast productname, cost_per_unit,amount, or qauntity",'info')
            return redirect(url_for('expense.display_all'))
        
        try:
            newexpense= Expenses(productname=productname,amount=amount,quantity=quantity,cost_per_unit=cost_per_unit,
                                 credit=credit,category=category,paymentmethod=paymentmethod,description=description,date=parse_date)
            newexpense.userid= g.user_id
            db.session.add(newexpense)
            db.session.commit()
            flash('record added successfully', 'success')
            return redirect(url_for('expense.display_all'))
        except Exception as e:
            db.session.rollback()
            flash(f'unexpected error occured as {e}','danger')
            return redirect(url_for('expense.display_all'))
    return redirect(url_for('expense.display_all'))
@expensebp.route('/editrecord/<int:id>', methods=['POST'])
def edit_record(id):
    changes = request.form
    expense = db.session.query(Expenses).filter_by(expenseid=id).first()

    if not changes:
        flash('no changes detected','info')
        return redirect(url_for('expense.display_all'))
    try:
        changes_made = False

        for k, v in changes.items():
            if not v:  # skip empty fields
                continue
            if k == 'date':
                try:
                    parse_date = datetime.strptime(v, '%Y-%m-%d').date()
                except ValueError:
                    flash('invalid format!!','danger')
                setattr(expense, k, parse_date)
                changes_made = True
            
            elif k in expense.__table__.columns.keys():
                setattr(expense, k, v)
                changes_made = True
            else:
                flash(f'Unknown field: {k}', 'danger')
                return redirect(url_for('expense.display_all'))
                

        if changes_made:
            db.session.commit()
            flash('competition updated successfully!', 'success')
            return redirect(url_for('expense.display_all'))
            
        else:
            flash('No valid changes detected', 'info')
            return redirect(url_for('expense.display_all'))
            

    except Exception as e:
        db.session.rollback()
        flash(f'Unexpected error occurred: {e}', 'danger')
        return redirect(url_for('expense.display_all'))
        
@expensebp.route('/removerecord/<int:id>',methods=['DELETE'])
def remove_record(id):
    record = db.session.query(Expenses).filter_by(expenseid=id).first()
    if not record:
        flash('record no longer exists','info')
        return redirect(url_for('expense.display_all'))
    
    try:
        db.session.delete(record)
        db.session.commit()
        flash('record deleted successfully','success')
        return redirect(url_for('expense.display_all'))
    except Exception as e:
        db.session.rollback()
        flash(f"unexpected error occured: {e}")
        return redirect(url_for('expense.display_all'))
@expensebp.route('/displayall',methods=['GET'])
def display_all():
    all_records = db.session.query(Expenses).all()
    #data =[expense.to_dict() for expense in all_records]
    return render_template('expense.html',all_records=all_records)

   


    

