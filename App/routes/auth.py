from flask import jsonify,request, Blueprint
from ..models import User
from ..extentions import db

auth_bp = Blueprint('auth', __name__,url_prefix='/auth')

@auth_bp.route('/register',methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    phone = data.get('phone')
    name = data.get('name')
    if not email or not name:
        return jsonify({"message":"please provide email and name"}), 422
    try:
        newuser = User(email=email,name=name,phonenumber=phone)
        db.session.add(newuser)
        db.session.commit()
        return jsonify({"message":"user stored to db successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message":f"unexpected error occured {e}"}),500