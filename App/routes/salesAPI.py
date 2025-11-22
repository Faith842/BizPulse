from flask import flash,session,jsonify,render_template, redirect, url_for, Blueprint,request,g
from ..extentions import db
from datetime import datetime
from ..models import Expenses, Sales
from flask_babel import Babel, _, get_locale

salesbp = Blueprint('sale',__name__,url_prefix='/salerecord')

@salesbp.route('/addrecord',methods=['POST','GET'])
def add_record():
    if request.method =='POST':

        productname= request.form.get('productname')
        amount=request.form.get('amount')
        quantity=request.form.get('quantity')
        price_per_unit=request.form.get('price_per_unit')
        debi =request.form.get('debi')
        date=request.form.get('date')
        paymentmethod=request.form.get('paymentmethod')
        description=request.form.get('description')
        try:
            parse_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            flash(_('invalid format!!'),'danger')
            
        if not [productname ,price_per_unit,debi,quantity,amount]:
            flash(_("please provide atleast productname, cost_per_unit,amount, or qauntity"),'info')
            return redirect(url_for('sale.displayall'))
        
        try:
            newexpense= Sales(productname=productname,amount=amount,quantity=quantity,price_per_unit=price_per_unit,
                                 debi=debi,paymentmethod=paymentmethod,description=description,date=parse_date)
            newexpense.userid= g.user_id
            db.session.add(newexpense)
            db.session.commit()
            flash(_('record added successfully'), 'success')
            return redirect(url_for('sale.displayall'))
        except Exception as e:
            db.session.rollback()
            flash(_(f'unexpected error occured as {e}'),'danger')
            return redirect(url_for('sale.displayall'))
    return redirect(url_for('sale.displayall'))
@salesbp.route('/editrecord/<int:id>', methods=['POST'])
def edit_record(id):
    changes = request.form
    expense = db.session.query(Sales).filter_by(salesid=id).first()

    if not changes:
        flash(_('no changes detected'),'info')
        return redirect(url_for('sale.displayall'))
    try:
        changes_made = False

        for k, v in changes.items():
            if not v:  # skip empty fields
                continue
            if k == 'date':
                try:
                    parse_date = datetime.strptime(v, '%Y-%m-%d').date()
                except ValueError:
                    flash(_('invalid format!!'),'danger')
                setattr(expense, k, parse_date)
                changes_made = True
            
            elif k in expense.__table__.columns.keys():
                setattr(expense, k, v)
                changes_made = True
            else:
                flash(_(f'Unknown field: {k}'), 'danger')
                return redirect(url_for('sale.displayall'))
                

        if changes_made:
            db.session.commit()
            flash(_('sale updated successfully!'), 'success')
            return redirect(url_for('sale.displayall'))
            
        else:
            flash(_('No valid changes detected'), 'info')
            return redirect(url_for('sale.displayall'))
            

    except Exception as e:
        db.session.rollback()
        flash(_(f'Unexpected error occurred: {e}'), 'danger')
        return redirect(url_for('sale.displayall'))
        
@salesbp.route('/removerecord/<int:id>',methods=['DELETE'])
def remove_record(id):
    record = db.session.query(Sales).filter_by(salesid=id).first()
    if not record:
        flash(_('record no longer exists'),'info')
        return redirect(url_for('sale.displayall'))
    
    try:
        db.session.delete(record)
        db.session.commit()
        flash(_('record deleted successfully'),'success')
        return redirect(url_for('sale.displayall'))
    except Exception as e:
        db.session.rollback()
        flash(_(f"unexpected error occured: {e}"),'danger')
        return redirect(url_for('sale.displayall'))
@salesbp.route('/displayall',methods=['GET'])
def displayall():
    all_record = db.session.query(Sales).filter_by(userid=g.user_id).all()
    #data =[expense.to_dict() for expense in all_records]
    return render_template('sales.html',all_record=all_record)

   


    

