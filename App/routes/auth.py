from flask import jsonify,request, Blueprint,render_template,session,flash,redirect,g,url_for
from ..models import User
from sqlalchemy.exc import IntegrityError
from ..extentions import db
from flask_babel import Babel, _, get_locale

auth_bp = Blueprint('auth', __name__,url_prefix='/auth')

@auth_bp.route('/register',methods=['POST','GET'])
def register():
    if request.method=='POST':

        email=request.form.get('email')
        username=request.form.get('username')
        password=request.form.get('password')
        if not email or not password:
            flash(_('you need to provide atleast email and password!!'),'danger')
            return render_template('signup.html')
        try:
            newuser = User(email=email,username=username)
            newuser.set_hashpassword(password)
            db.session.add(newuser)

            db.session.commit()
            flash(_('you registered successfully pleas login!!'),'success')
            return redirect(url_for('auth.login'))
        except IntegrityError:
            db.session.rollback()
            flash(_('user already exits login instead!!'),'danger')
            return redirect(url_for('auth.login'))
        except Exception as e:
            db.session.rollback()
            flash(_(f'unexpected error occured: {e}'),'danger')
            return render_template('signup.html')
    return render_template('signup.html')
@auth_bp.route('/login',methods=['POST','GET'])
def login():
    if request.method=='POST':
        username=request.form.get('username')
        password=request.form.get('password')

        if not username and not password:
            flash(_('please provide your username and password before proceeding!!'),'info')
            return render_template('login.html')
            
        user = db.session.query(User).filter_by(username=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.userid
            session['username']=user.username
            flash(_(f'logged in successfully as {user.username}'), 'success')
            return render_template('additional_info.html')
        flash(_('invalid email or password!! please check and try again!!'),'danger')
        return render_template('login.html')
        
    return render_template('login.html')
    
@auth_bp.route('/logout')
def logout():
    session.pop('user_id',None)
    session.pop('email',None)
    flash(_('you have been logout successfully, you might want to login again'),'success')
    return render_template('font/font.html')
    