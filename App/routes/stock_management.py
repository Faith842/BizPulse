from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base, Session

DB_URL = "sqlite:///./stocks.db"
engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

class Stock(Base):
    __tablename__ = "stocks"
    id = Column(Integer, primary_key=True, index=True)
    productname = Column(String, index=True)
    credit = Column(String)
    cp = Column(Float)   # cost price
    sp = Column(Float)   # selling price
    quantity = Column(Integer)
    profit_margin = Column(Float)

Base.metadata.create_all(bind=engine)

class StockCreate(BaseModel):
    productname: str
    credit: str = "no"
    cp: float
    sp: float
    quantity: int
    profit_margin: float

class StockRead(StockCreate):
    id: int

    class Config:
        orm_mode = True

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/stock/addrecord", response_model=StockRead)
def add_record(stock: StockCreate, db: Session = Depends(get_db)):
    db_stock = Stock(**stock.dict())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

@app.put("/stock/editrecord/{id}", response_model=StockRead)
def edit_record(id: int, stock: StockCreate, db: Session = Depends(get_db)):
    db_stock = db.query(Stock).filter(Stock.id == id).first()
    if not db_stock:
        raise HTTPException(404, "Record not found")
    for field, value in stock.dict().items():
        setattr(db_stock, field, value)
    db.commit()
    db.refresh(db_stock)
    return db_stock

@app.delete("/stock/removerecord/{id}")
def remove_record(id: int, db: Session = Depends(get_db)):
    db_stock = db.query(Stock).filter(Stock.id == id).first()
    if not db_stock:
        raise HTTPException(404, "Record not found")
    db.delete(db_stock)
    db.commit()
    return {"message": "record deleted successfully"}

@app.get("/stock/displayall", response_model=List[StockRead])
def display_all(db: Session = Depends(get_db)):
    return db.query(Stock).all()
