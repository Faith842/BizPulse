from flask import jsonify,request, Blueprint,render_template,session,flash,redirect,g,url_for
from ..models import User
from sqlalchemy.exc import IntegrityError
from ..extentions import db

auth_bp = Blueprint('auth', __name__,url_prefix='/auth')

@auth_bp.route('/register',methods=['POST'])
def register():
    email=request.form.get('email')
    username=request.form.get('username')
    password=request.form.get('password')
    if not email or not password:
        flash('you need to provide atleast email and password!!','danger')
        return render_template('Register/register.html')
    try:
        newuser = User(email=email,username=username,password=password)
        db.session.add(newuser)
        db.session.commit()
        flash('you registered successfully pleas login!!','success')
        return redirect(url_for('auth.login'))
    except IntegrityError:
        db.session.rollback()
        flash('user already exits login instead!!','danger')
        return redirect(url_for('auth.login'))
    except Exception as e:
        db.session.rollback()
        flash(f'unexpected error occured: {e}','danger')
        return render_template('Register/register.html')
    
@auth_bp.route('/login',methods=['POST','GET'])
def login():
    if request.method=='POST':
        username=request.form.get('username')
        password=request.form.get('password')

        if not username and not password:
            flash('please provide your username and password before proceeding!!','info')
            return render_template('Login/login.html')
            
        user = db.session.query(User).filter_by(username=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.userid
            session['username']=user.username
            flash(f'logged in successfully as {user.username}', 'success')
            return render_template('additional_info.html')
        flash('invalid email or password!! please check and try again!!','danger')
        return render_template('login.html')
        
    return render_template('Login/login.html')
    
@auth_bp.route('/logout')
def logout():
    session.pop('user_id',None)
    session.pop('email',None)
    flash('you have been logout successfully, you might want to login again','success')
    return render_template('font/font.html')
    