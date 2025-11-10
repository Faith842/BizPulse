from flask import flash,session,jsonify,render_template, redirect, url_for, Blueprint,request
from ..extentions import db
from datetime import datetime
from ..models import Expenses

dash_bp=Blueprint('dashboard',__name__,url_prefix='/dashboard')

@dash_bp.route('/dashboard',methods=['GET'])
def dashboard():
    return render_template('dashboard.html')