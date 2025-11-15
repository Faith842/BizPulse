from flask import flash, session, jsonify, render_template, g, redirect, url_for, Blueprint, request
from ..extentions import db
from datetime import datetime
from ..models import Expenses, Sales
import re
from operator import itemgetter
from flask_babel import _  # Import _ for translations

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

@dash_bp.route('/dashboard', methods=['GET'])
def dashboard():
    formatted_top_five = []
    formatted_top_fiv = []

    try:
        # --- Fetch top 5 expenses ---
        all_records = db.session.query(Expenses).filter_by(userid=g.user_id).all()
        if all_records:
            product_totals = {}
            for record in all_records:
                product_name = record.productname
                amount = clean_amount_to_float(record.amount)
                if product_name and amount > 0:
                    product_totals[product_name] = product_totals.get(product_name, 0) + amount

            sorted_list = sorted(
                [{'productname': k, 'total_amount': v} for k, v in product_totals.items()],
                key=itemgetter('total_amount'),
                reverse=True
            )

            top_five = sorted_list[:5]
            formatted_top_five = [
                {'productname': item['productname'], 'total_amount': f"{item['total_amount']:.2f}"}
                for item in top_five
            ]

    except Exception as e:
        flash(_(f"Error fetching top five product expenses: {e}"))

    try:
        # --- Fetch top 5 sales ---
        salesrecords = db.session.query(Sales).filter_by(userid=g.user_id).all()
        if salesrecords:
            saleproducts = {}
            for record in salesrecords:
                product_name = record.productname
                amount = clean_amount_to_float(record.amount)
                if product_name and amount > 0:
                    saleproducts[product_name] = saleproducts.get(product_name, 0) + amount

            sorted_list = sorted(
                [{'productname': k, 'total_amount': v} for k, v in saleproducts.items()],
                key=itemgetter('total_amount'),
                reverse=True
            )

            top_fiv = sorted_list[:5]
            formatted_top_fiv = [
                {'productname': item['productname'], 'total_amount': f"{item['total_amount']:.2f}"}
                for item in top_fiv
            ]

    except Exception as e:
        flash(_(f"Error fetching top five sales: {e}"))

    # --- Render template ---
    return render_template('dashboard.html', top_five=formatted_top_five, top_fiv=formatted_top_fiv)


@dash_bp.route('/stock', methods=['GET'])
def stock():
    return render_template('stock.html')
