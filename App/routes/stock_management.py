from flask import flash,session,jsonify,render_template, redirect, url_for, Blueprint,request,g
from ..extentions import db
from datetime import datetime
from ..models import Stock
from flask_babel import _

stockbp = Blueprint('stock',__name__,url_prefix='/stockrecord')
#endpoint to add stock record
@stockbp.route('/addrecord',methods=['POST','GET'])
def add_record():
    if request.method =='POST':
        productname = request.form.get('productname')
        buyingprice = request.form.get('buyingprice')
        quantity = request.form.get('quantity')
        debit_credit = request.form.get('debit_credit')
        date = request.form.get('date')
        stockstatus = request.form.get('stockstatus')
        description = request.form.get('description')
        
        try:
            parse_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            flash(_('Invalid date format!'),'danger')
            return redirect(url_for('stock.displayall'))
            
        if not all([productname, stockstatus, quantity, buyingprice]):
            flash(_("Please provide at least product name, stock status, quantity, and buying price"),'info')
            return redirect(url_for('stock.displayall'))
        
        try:
            newstock = Stock(
                productname=productname,
                quantity=quantity,
                buyingprice=buyingprice,
                debit_credit=debit_credit,
                stockstatus=stockstatus,
                description=description,
                date=parse_date
            )
            newstock.userid = g.user_id
            db.session.add(newstock)
            db.session.commit()
            flash(_('Record added successfully'), 'success')
            return redirect(url_for('stock.displayall'))
        except Exception as e:
            db.session.rollback()
            flash(_(f'Unexpected error occurred: {e}'),'danger')
            return redirect(url_for('stock.displayall'))
    return redirect(url_for('stock.displayall'))
#endpoint to edit stock record

@stockbp.route('/editrecord/<int:id>', methods=['POST'])
def edit_record(id):
    changes = request.form
    stock = db.session.query(Stock).filter_by(stockid=id).first()

    if not stock:
        flash(_('Stock record not found'),'danger')
        return redirect(url_for('stock.displayall'))
        
    if not changes:
        flash(_('No changes detected'),'info')
        return redirect(url_for('stock.displayall'))
        
    try:
        changes_made = False

        for k, v in changes.items():
            if not v:  # skip empty fields
                continue
            if k == 'date':
                try:
                    parse_date = datetime.strptime(v, '%Y-%m-%d').date()
                    setattr(stock, k, parse_date)
                    changes_made = True
                except ValueError:
                    flash(_('Invalid date format!'),'danger')
            elif k in stock.__table__.columns.keys():
                setattr(stock, k, v)
                changes_made = True

        if changes_made:
            db.session.commit()
            flash(_('Stock updated successfully!'), 'success')
        else:
            flash(_('No valid changes detected'), 'info')
            
    except Exception as e:
        db.session.rollback()
        flash(_(f'Unexpected error occurred: {e}'), 'danger')
        
    return redirect(url_for('stock.displayall'))
#endpoint to remove stock record
        
@stockbp.route('/removerecord/<int:id>',methods=['DELETE'])
def remove_record(id):
    record = db.session.query(Stock).filter_by(stockid=id).first()
    if not record:
        flash(_('Record no longer exists'),'info')
        return redirect(url_for('stock.displayall'))
    
    try:
        db.session.delete(record)
        db.session.commit()
        flash(_('Record deleted successfully'),'success')
        return redirect(url_for('stock.displayall'))
    except Exception as e:
        db.session.rollback()
        flash(_(f"Unexpected error occurred: {e}"),'danger')
        return redirect(url_for('stock.displayall'))
#endpoint to display all stock records
@stockbp.route('/displayall',methods=['GET'])
def displayall():
    all_recor = db.session.query(Stock).filter_by(userid=g.user_id).all()
    return render_template('stock.html',all_recor=all_recor)














# from flask import flash,session,jsonify,render_template, redirect, url_for, Blueprint,request,g
# from ..extentions import db
# from datetime import datetime
# from ..models import Expenses, Sales,Stock
# from flask_babel import Babel, _, get_locale

# stockbp = Blueprint('stock',__name__,url_prefix='/stockrecord')

# @stockbp.route('/addrecord',methods=['POST','GET'])
# def add_record():
#     if request.method =='POST':

#         productname= request.form.get('productname')
#         buyingprice=request.form.get('buyingprice')
#         quantity=request.form.get('quantity')
#         debit_credit =request.form.get('debit_credit')
#         date=request.form.get('date')
#         stockstatus=request.form.get('stockstatus')
#         description=request.form.get('description')
#         try:
#             parse_date = datetime.strptime(date, '%Y-%m-%d').date()
#         except ValueError:
#             flash(_('invalid format!!'),'danger')
            
#         if not [productname ,stockstatus,quantity,buyingprice]:
#             flash(_("please provide atleast productname, stockstatus, or "),'info')
#             return redirect(url_for('stock.displayall'))
        
#         try:
#             newexpense= Stock(productname=productname,quantity=quantity,buyingprice=buyingprice,
#                                  debit_credit=debit_credit,stockstatus=stockstatus,description=description,date=parse_date)
#             newexpense.userid= g.user_id
#             db.session.add(newexpense)
#             db.session.commit()
#             flash(_('record added successfully'), 'success')
#             return redirect(url_for('stock.displayall'))
#         except Exception as e:
#             db.session.rollback()
#             flash(_(f'unexpected error occured as {e}'),'danger')
#             return redirect(url_for('stock.displayall'))
#     return redirect(url_for('stock.displayall'))
# @stockbp.route('/editrecord/<int:id>', methods=['POST'])
# def edit_record(id):
#     changes = request.form
#     expense = db.session.query(Stock).filter_by(stockid=id).first()

#     if not changes:
#         flash(_('no changes detected'),'info')
#         return redirect(url_for('stock.displayall'))
#     try:
#         changes_made = False

#         for k, v in changes.items():
#             if not v:  # skip empty fields
#                 continue
#             if k == 'date':
#                 try:
#                     parse_date = datetime.strptime(v, '%Y-%m-%d').date()
#                 except ValueError:
#                     flash(_('invalid format!!'),'danger')
#                 setattr(expense, k, parse_date)
#                 changes_made = True
            
#             elif k in expense.__table__.columns.keys():
#                 setattr(expense, k, v)
#                 changes_made = True
#             else:
#                 flash(_(f'Unknown field: {k}'), 'danger')
#                 return redirect(url_for('stock.displayall'))
                

#         if changes_made:
#             db.session.commit()
#             flash(_('stock updated successfully!'), 'success')
#             return redirect(url_for('stock.displayall'))
            
#         else:
#             flash(_('No valid changes detected'), 'info')
#             return redirect(url_for('stock.displayall'))
            

#     except Exception as e:
#         db.session.rollback()
#         flash(_(f'Unexpected error occurred: {e}'), 'danger')
#         return redirect(url_for('stock.displayall'))
        
# @stockbp.route('/removerecord/<int:id>',methods=['DELETE'])
# def remove_record(id):
#     record = db.session.query(Stock).filter_by(stockid=id).first()
#     if not record:
#         flash(_('record no longer exists'),'info')
#         return redirect(url_for('stock.displayall'))
    
#     try:
#         db.session.delete(record)
#         db.session.commit()
#         flash(_('record deleted successfully'),'success')
#         return redirect(url_for('stock.displayall'))
#     except Exception as e:
#         db.session.rollback()
#         flash(_(f"unexpected error occured: {e}"),'danger')
#         return redirect(url_for('stock.displayall'))
# @stockbp.route('/displayall',methods=['GET'])
# def displayall():
#     all_recor = db.session.query(Stock).filter_by(userid=g.user_id).all()
#     #data =[expense.to_dict() for expense in all_records]
#     return render_template('stock.html',all_recor=all_recor)
