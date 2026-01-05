import os
from flask import Flask, render_template, session, g, request, redirect, url_for
from flask_babel import Babel
from .extentions import db, migrate, init_extensions

# Import blueprints
from .routes.auth import auth_bp
from .routes.dashboard import dash_bp
from .routes.salesAPI import salesbp
from .routes.stock_management import stockbp
from .routes.expensesAPI import expensebp

def create_app(test_config=None):
    app = Flask(__name__)

    # --------------------------
    # BASIC CONFIG
    # --------------------------
    app.config['SECRET_KEY'] = 'secret_key'  # replace with env var in production
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --------------------------
    # FORCE SQLITE (IGNORE DATABASE_URL)
    # --------------------------
    basedir = os.path.abspath(os.path.dirname(__file__))
    sqlite_path = os.path.join(basedir, 'app.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{sqlite_path}"

    # --------------------------
    # INIT EXTENSIONS
    # --------------------------
    init_extensions(app)

    # --------------------------
    # CREATE TABLES (SAFE FOR SQLITE)
    # --------------------------
    with app.app_context():
        db.create_all()

    # --------------------------
    # BABEL / I18N CONFIG
    # --------------------------
    app.config['LANGUAGES'] = ['en', 'rw']
    app.config['BABEL_TRANSLATION_DIRECTORIES'] = os.path.join(basedir, 'translations')

    def get_locale():
        # Check session first
        if 'lang' in session:
            return session['lang']

        # Then check URL parameter
        lang = request.args.get('lang')
        if lang in app.config['LANGUAGES']:
            session['lang'] = lang
            return lang

        # Finally, browser preference
        return request.accept_languages.best_match(app.config['LANGUAGES'])

    babel = Babel(app, locale_selector=get_locale)

    @app.context_processor
    def inject_locale():
        return dict(get_locale=get_locale)

    @app.route('/set_language/<lang>')
    def set_language(lang):
        if lang in app.config['LANGUAGES']:
            session['lang'] = lang
        return redirect(request.referrer or url_for('index'))

    # --------------------------
    # LOAD USER SESSION BEFORE REQUEST
    # --------------------------
    @app.before_request
    def load_user_id():
        g.user_id = session.get('user_id')
        g.email = session.get('email')

    # --------------------------
    # MAIN ROUTE
    # --------------------------
    @app.route('/')
    def index():
        return render_template('font/font.html')

    # --------------------------
    # REGISTER BLUEPRINTS
    # --------------------------
    app.register_blueprint(auth_bp)
    app.register_blueprint(expensebp)
    app.register_blueprint(dash_bp)
    app.register_blueprint(salesbp)
    app.register_blueprint(stockbp)

    # --------------------------
    # TEST CONFIG
    # --------------------------
    if test_config:
        app.config.from_mapping(test_config)

    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app
