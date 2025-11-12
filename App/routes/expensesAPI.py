from flask import flash,session,jsonify,render_template, redirect, url_for, Blueprint,request
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
        cost_per_unit=request.form.get('price')
        credit =request.form.get('credit')
        category = request.form.get('category')
        date=request.form.get('date')
        paymentmethod=request.form.get('payment')
        description=request.form.get('description')
        try:
            parse_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            #flash('invalid format!!','danger')
            return jsonify({"message":"error occured"})
        if not [productname ,cost_per_unit,credit,quantity,amount]:
            return jsonify({"message":"please provide atleast productname, cost_per_unit,amount, or qauntity"}),500
        
        try:
            newexpense= Expenses(productname=productname,amount=amount,quantity=quantity,cost_per_unit=cost_per_unit,
                                 credit=credit,category=category,paymentmethod=paymentmethod,description=description,date=parse_date)
            db.session.add(newexpense)
            db.session.commit()
            return jsonify({"message":'expense record added successfully'}),201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message":f"unexpected error occured: {e}"}),500
@expensebp.route('/editrecord/<int:id>', methods=['POST'])
def edit_record(id):
    data = request.get_json()
    expense = db.session.query(Expenses).filter_by(expenseid=id).first()
    if not data:
        return jsonify({"message":"no changes provided"}),200
    try:
        changes_made = False

        for k, v in data.items():
            if not v:  # skip empty fields
                continue

            
            elif k in expense.__table__.columns.keys():
                setattr(expense, k, v)
                changes_made = True
            else:
                #flash(f'Unknown field: {k}', 'danger')
                return jsonify({"message":"unknown field"}),500

        if changes_made:
            db.session.commit()
           # flash('competition updated successfully!', 'success')
            return jsonify({"message":"record editted successfully"}),201
        else:
            #flash('No valid changes detected', 'info')
            return jsonify({"message":"no changes made"}),200

    except Exception as e:
        db.session.rollback()
        #flash(f'Unexpected error occurred: {e}', 'danger')
        return jsonify({"message":f"unexpected error occued {e}"})
@expensebp.route('/removerecord/<int:id>',methods=['DELETE'])
def remove_record(id):
    record = db.session.query(Expenses).filter_by(expenseid=id).first()
    if not record:
        return jsonify({"message":"record not found"}),500
    
    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message":"record deleted successfully"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message":f"unexpected error occured: {e}"})
@expensebp.route('/displayall',methods=['GET'])
def display_all():
    all_records = db.session.query(Expenses).all()
    data =[expense.to_dict() for expense in all_records]

    return jsonify(data), 200


    

