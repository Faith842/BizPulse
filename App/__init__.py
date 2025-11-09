import sqlite3
import os
from flask import Flask, render_template,session,g,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from .routes.auth import auth_bp


# app.py

import sqlite3
from flask import Flask
from .extentions import db, migrate, init_extensions
from .routes.expensesAPI import expensebp

def create_app(test_config=None):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'testing'

    init_extensions(app) 
    #with app.app_context():
        #db.create_all()
    app.register_blueprint(auth_bp)
    app.register_blueprint(expensebp)

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