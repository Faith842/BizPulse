from flask import jsonify,request, Blueprint,render_template,session,flash,redirect,g,url_for
from ..models import User
from sqlalchemy.exc import IntegrityError
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
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message":"user already exist"}),500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message":f"unexpected error occured {e}"}),500
    
@auth_bp.route('/login',methods=['POST','GET'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if not email and not password:
            flash('please provide your email and password before proceeding!!','info')
            return render_template('login.html')
        user = db.session.query(User).filter_by(email=email).first()
        if user and user.check_password(password):
            session['user_id'] = user.userid
            session['email']=user.email
            flash(f'logged in successfully as {user.email}', 'success')
            return redirect(url_for('talent.display_all'))
        flash('invalid email or password!! please check and try again!!','danger')
        return render_template('login.html')
    return render_template('login.html')
@auth_bp.route('/logout')
def logout():
    session.pop('user_id',None)
    session.pop('email',None)
    flash('you have been logout successfully, you might want to login again','success')
    return render_template('home.html')