from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate() # Correctly instantiate the Migrate object

def init_extensions(app):
    db.init_app(app)
    # The Migrate object needs to be initialized with both the app and the db object
    migrate.init_app(app, db)