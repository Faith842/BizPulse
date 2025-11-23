from flask import flash, session, jsonify, render_template, g, redirect, url_for, Blueprint, request
from ..extentions import db
from datetime import datetime, timedelta
from ..models import Expenses, Sales
import re
from operator import itemgetter
from flask_babel import _
from sqlalchemy import extract, func
import calendar

dash_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

def clean_amount_to_float(amount_str):
    """Strips currency symbols and commas, then converts the amount string to a float."""
    if not isinstance(amount_str, str):
        return 0.0
    cleaned_str = re.sub(r'[^\d.]', '', amount_str)
    try:
        return float(cleaned_str)
    except ValueError:
        return 0.0

def get_date_range(period):
    """Calculate date range based on period selection."""
    today = datetime.now().date()
    
    if period == 'current_month':
        start_date = today.replace(day=1)
        end_date = today
    elif period == 'last_month':
        first_day_current_month = today.replace(day=1)
        end_date = first_day_current_month - timedelta(days=1)
        start_date = end_date.replace(day=1)
    elif period == 'last_3_months':
        end_date = today
        start_date = today - timedelta(days=90)
    elif period == 'last_6_months':
        end_date = today
        start_date = today - timedelta(days=180)
    elif period == 'current_year':
        start_date = today.replace(month=1, day=1)
        end_date = today
    else:  # custom or default
        start_date = today.replace(day=1)
        end_date = today
    
    return start_date, end_date

def get_chart_data(user_id, start_date, end_date):
    """Generate chart data for the given date range."""
    # Get all sales and expenses in the date range
    sales_data = db.session.query(Sales).filter(
        Sales.userid == user_id,
        Sales.date >= start_date,
        Sales.date <= end_date
    ).all()
    
    expenses_data = db.session.query(Expenses).filter(
        Expenses.userid == user_id,
        Expenses.date >= start_date,
        Expenses.date <= end_date
    ).all()
    
    # Group by month
    monthly_data = {}
    
    # Initialize months in range
    current = start_date.replace(day=1)
    while current <= end_date:
        month_key = current.strftime('%Y-%m')
        monthly_data[month_key] = {
            'revenue': 0.0,
            'expenses': 0.0,
            'label': current.strftime('%b %Y')
        }
        # Move to next month
        if current.month == 12:
            current = current.replace(year=current.year + 1, month=1)
        else:
            current = current.replace(month=current.month + 1)
    
    # Process sales data
    for sale in sales_data:
        month_key = sale.date.strftime('%Y-%m')
        if month_key in monthly_data:
            monthly_data[month_key]['revenue'] += clean_amount_to_float(sale.amount)
    
    # Process expenses data
    for expense in expenses_data:
        month_key = expense.date.strftime('%Y-%m')
        if month_key in monthly_data:
            monthly_data[month_key]['expenses'] += clean_amount_to_float(expense.amount)
    
    # Convert to chart format
    months = []
    revenue = []
    expenses = []
    
    for month_data in sorted(monthly_data.values(), key=lambda x: x['label']):
        months.append(month_data['label'])
        revenue.append(month_data['revenue'])
        expenses.append(month_data['expenses'])
    
    return {
        'months': months,
        'revenue': revenue,
        'expenses': expenses
    }

@dash_bp.route('/dashboard', methods=['GET'])
def dashboard():
    """Render the main dashboard page."""
    return render_template('dashboard.html')

@dash_bp.route('/data', methods=['GET'])
def dashboard_data():
    """API endpoint to get live dashboard data."""
    try:
        # Get filter parameters
        period = request.args.get('period', 'current_month')
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        # Calculate date range
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        else:
            start_date, end_date = get_date_range(period)
        
        # Calculate totals
        total_revenue = 0.0
        total_expenses = 0.0
        
        # Get revenue total
        sales_records = db.session.query(Sales).filter(
            Sales.userid == g.user_id,
            Sales.date >= start_date,
            Sales.date <= end_date
        ).all()
        
        for sale in sales_records:
            total_revenue += clean_amount_to_float(sale.amount)
        
        # Get expenses total
        expense_records = db.session.query(Expenses).filter(
            Expenses.userid == g.user_id,
            Expenses.date >= start_date,
            Expenses.date <= end_date
        ).all()
        
        for expense in expense_records:
            total_expenses += clean_amount_to_float(expense.amount)
        
        # Calculate derived values
        net_profit = total_revenue - total_expenses
        total_balance = net_profit  # This could be adjusted based on your business logic
        
        # Get top expenses
        expense_totals = {}
        for record in expense_records:
            product_name = record.productname
            amount = clean_amount_to_float(record.amount)
            if product_name and amount > 0:
                expense_totals[product_name] = expense_totals.get(product_name, 0) + amount
        
        top_expenses = sorted(
            [{'productname': k, 'total_amount': v} for k, v in expense_totals.items()],
            key=itemgetter('total_amount'),
            reverse=True
        )[:5]
        
        # Get top sales
        sales_totals = {}
        for record in sales_records:
            product_name = record.productname
            amount = clean_amount_to_float(record.amount)
            if product_name and amount > 0:
                sales_totals[product_name] = sales_totals.get(product_name, 0) + amount
        
        top_sales = sorted(
            [{'productname': k, 'total_amount': v} for k, v in sales_totals.items()],
            key=itemgetter('total_amount'),
            reverse=True
        )[:5]
        
        # Get chart data
        chart_data = get_chart_data(g.user_id, start_date, end_date)
        
        # Format period text
        period_text = f"{start_date.strftime('%b %d, %Y')} to {end_date.strftime('%b %d, %Y')}"
        
        response_data = {
            'total_balance': total_balance,
            'total_revenue': total_revenue,
            'total_expenses': total_expenses,
            'net_profit': net_profit,
            'period': period_text,
            'top_expenses': top_expenses,
            'top_sales': top_sales,
            'chart_data': chart_data
        }
        
        return jsonify({
            'success': True,
            'data': response_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@dash_bp.route('/visuals', methods=['GET'])
def visuals():
    return render_template('visuals.html')














# from flask import flash, session, jsonify, render_template, g, redirect, url_for, Blueprint, request
# from ..extentions import db
# from datetime import datetime
# from ..models import Expenses, Sales
# import re
# from operator import itemgetter
# from flask_babel import _  # Import _ for translations

# dash_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

# def clean_amount_to_float(amount_str):
#     """Strips currency symbols and commas, then converts the amount string to a float."""
#     if not isinstance(amount_str, str):
#         return 0.0
#     cleaned_str = re.sub(r'[^\d.]', '', amount_str)
#     try:
#         return float(cleaned_str)
#     except ValueError:
#         return 0.0

# @dash_bp.route('/dashboard', methods=['GET'])
# def dashboard():
#     formatted_top_five = []
#     formatted_top_fiv = []

#     try:
#         # --- Fetch top 5 expenses ---
#         all_records = db.session.query(Expenses).filter_by(userid=g.user_id).all()
#         if all_records:
#             product_totals = {}
#             for record in all_records:
#                 product_name = record.productname
#                 amount = clean_amount_to_float(record.amount)
#                 if product_name and amount > 0:
#                     product_totals[product_name] = product_totals.get(product_name, 0) + amount

#             sorted_list = sorted(
#                 [{'productname': k, 'total_amount': v} for k, v in product_totals.items()],
#                 key=itemgetter('total_amount'),
#                 reverse=True
#             )

#             top_five = sorted_list[:5]
#             formatted_top_five = [
#                 {'productname': item['productname'], 'total_amount': f"{item['total_amount']:.2f}"}
#                 for item in top_five
#             ]

#     except Exception as e:
#         flash(_(f"Error fetching top five product expenses: {e}"),'danger')

#     try:
#         # --- Fetch top 5 sales ---
#         salesrecords = db.session.query(Sales).filter_by(userid=g.user_id).all()
#         if salesrecords:
#             saleproducts = {}
#             for record in salesrecords:
#                 product_name = record.productname
#                 amount = clean_amount_to_float(record.amount)
#                 if product_name and amount > 0:
#                     saleproducts[product_name] = saleproducts.get(product_name, 0) + amount

#             sorted_list = sorted(
#                 [{'productname': k, 'total_amount': v} for k, v in saleproducts.items()],
#                 key=itemgetter('total_amount'),
#                 reverse=True
#             )

#             top_fiv = sorted_list[:5]
#             formatted_top_fiv = [
#                 {'productname': item['productname'], 'total_amount': f"{item['total_amount']:.2f}"}
#                 for item in top_fiv
#             ]

#     except Exception as e:
#         flash(_(f"Error fetching top five sales: {e}"))

#     # --- Render template ---
#     return render_template('dashboard.html', top_five=formatted_top_five, top_fiv=formatted_top_fiv)

