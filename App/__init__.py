import sqlite3
import os
from flask import Flask, render_template,session,g,request,jsonify,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_babel import Babel, _, get_locale

from .routes.auth import auth_bp
from .routes.dashboard import dash_bp
from .routes.salesAPI import salesbp
from .routes.stock_management import stockbp


# app.py

import sqlite3
from flask import Flask
from .extentions import db, migrate, init_extensions
from .routes.expensesAPI import expensebp

def create_app(test_config=None):
    app = Flask(__name__)
    database_url = os.environ.get("DATABASE_URL")

    # Render sometimes provides postgres:// instead of postgresql://
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url # 'sqlite:///my_database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    secret_key = os.environ.get("SECRET_KEY", "testing")
    app.config['SECRET_KEY'] = secret_key

    init_extensions(app) 
    with app.app_context():
        db.create_all()
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    app.config['BABEL_TRANSLATION_DIRECTORIES'] = os.path.join(basedir, 'translations')
    app.config['LANGUAGES'] = ['en', 'rw']

    def get_locale():
        # First check if language is in session
        if 'lang' in session:
            return session['lang']
        # Then check URL parameter
        lang = request.args.get('lang')
        if lang:
            session['lang'] = lang
            return lang
        # Finally, browser preference
        return request.accept_languages.best_match(app.config.get('LANGUAGES', ['en']))

    babel = Babel(app, locale_selector=get_locale)
    @app.context_processor
    def inject_locale():
        return dict(get_locale=get_locale)
    @app.route('/set_language/<lang>')
    def set_language(lang):
        if lang in app.config['LANGUAGES']:
            session['lang'] = lang
        # Return to the previous page or home
        return redirect(request.referrer or url_for('index'))
    app.register_blueprint(auth_bp)
    app.register_blueprint(expensebp)
    app.register_blueprint(dash_bp)
    app.register_blueprint(salesbp)
    app.register_blueprint(stockbp)

    @app.route('/')
    def index():
        return render_template('font/font.html')

    @app.before_request
    def load_user_id():
        user_id = session.get('user_id')
        email= session.get('email')
        if user_id == None:
            g.user_id = None
            g.email = None
        else:
            g.user_id = user_id
            email = email 
            
   
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app