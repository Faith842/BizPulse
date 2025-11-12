from flask import flash,session,jsonify,render_template, redirect, url_for, Blueprint,request
from ..extentions import db
from datetime import datetime
from ..models import Expenses
import re
from operator import itemgetter

dash_bp=Blueprint('dashboard',__name__,url_prefix='/dashboard')

def clean_amount_to_float(amount_str):
    """Strips currency symbols and commas, then converts the amount string to a float."""
    if not isinstance(amount_str, str):
        return 0.0
    
    # Keep only digits and the decimal point
    cleaned_str = re.sub(r'[^\d.]', '', amount_str)
    
    try:
        # Use float() for proper numerical summing
        return float(cleaned_str)
    except ValueError:
        return 0.0

@dash_bp.route('/dashboard',methods=['GET'])
def dashboard():
    """
    Fetches all expense records, aggregates amounts by product name, 
    and returns the top 5 products with the highest total expense.
    """
    try:
        # 1. Fetch all expense records
        all_records = db.session.query(Expenses).all() 
        product_totals = {}

        # 2. Aggregate Totals by Product Name
        for record in all_records:
            product_name = record.productname 
            amount_str = record.amount
            
            # Clean and convert the string amount
            amount = clean_amount_to_float(amount_str)

            if not product_name or amount <= 0:
                continue
            
            # Sum the amounts for the product
            product_totals[product_name] = product_totals.get(product_name, 0) + amount
        
        # 3. Transform Dictionary to List for Sorting
        # Convert {product: total_amount} into a list of tuples or dictionaries
        # We use a list of dictionaries for clear key naming
        totals_list = [
            {'productname': name, 'total_amount': total}
            for name, total in product_totals.items()
        ]

        # 4. Sort the List and Get Top 5
        # Sort by 'total_amount' in reverse (descending) order
        sorted_list = sorted(totals_list, key=itemgetter('total_amount'), reverse=True)
        
        # Take the top 5 elements
        top_five = sorted_list[:5] 
        
        # 5. Format for JSON (Optional: format amounts to 2 decimals)
        formatted_top_five = []
        for item in top_five:
            formatted_top_five.append({
                'productname': item['productname'],
                'total_amount': f"{item['total_amount']:.2f}"
            })

        return render_template('dashboard.html',top_five=formatted_top_five)

    except Exception as e:
        flash(_(f"Error fetching top five product expenses: {e}"))
        return render_template('dashboard.html')

        