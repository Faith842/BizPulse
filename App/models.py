from .extentions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__='users'
    userid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(50),unique=True)
    name = db.Column(db.String(255))
    phonenumber = db.Column(db.Integer)
    password=db.Column(db.String(50))

    def set_hashpassword(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, entered_password):
        return check_password_hash(self.password, entered_password)
class Expenses(db.Model):
    __tablename__='expenses'
    expenseid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category = db.Column(db.String(50))
    description = db.Column(db.String(255))
    amount = db.Column(db.String(255))
    quantity = db.Column(db.String(50))
    cost_per_unit = db.Column(db.String(50))
    productname = db.Column(db.String(255))
    credit = db.Column(db.String(50))
    paymentmethod= db.Column(db.String(50))
    userid= db.Column(db.Integer, db.ForeignKey('users.userid'))
    date = db.Column(db.DateTime)

    def to_dict(self):

        return {
            'expenseid': self.expenseid,
            'category':self.category,
            'description':self.description,
            'amount':self.amount,
            'quantity':self.quantity,
            'cost_per_unit':self.cost_per_unit,
            'productname':self.productname,
            'credit':self.credit,
            'paymentmethod':self.paymentmethod,
            'date':self.date
        }

    user = db.relationship('User',backref='expenses',lazy=True)

class Sales(db.Model):
    __tablename__='sales'
    salesid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(255))
    amount = db.Column(db.String(255))
    quantity = db.Column(db.String(50))
    price_per_unit = db.Column(db.String(50))
    productname = db.Column(db.String(255))
    debit = db.Column(db.Boolean)
    paymentmethod= db.Column(db.String(50))
    userid= db.Column(db.Integer, db.ForeignKey('users.userid'))
    date = db.Column(db.DateTime)

    user = db.relationship('User',backref='sales',lazy=True)

class Stock(db.Model):
    __tablename__='stock'
    stockid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(255))
    productname = db.Column(db.String(255))
    quantity = db.Column(db.String(50))
    costprice = db.Column(db.String(50))
    sellingprice= db.Column(db.String(255))
    debit = db.Column(db.Boolean)
    credit=db.Column(db.Boolean)
    Stockstatus=db.Column(db.String(50))
    userid= db.Column(db.Integer, db.ForeignKey('users.userid'))
    expectedprofit=db.Column(db.String(50))
    date = db.Column(db.DateTime)

    user = db.relationship('User',backref='stock',lazy=True)

