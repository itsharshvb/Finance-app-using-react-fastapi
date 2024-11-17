from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import SessionLocal, engine, get_db
import models
from fastapi.middleware.cors import CORSMiddleware
from schemas import TransactionBase, TransactionModel
from typing import Annotated, List

app = FastAPI()

origins = [
    # an application running on localhost 3000 can can call our backend
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_dependency):
    try:
        db_transaction = models.Transactions(**transaction.model_dump())
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    except SQLAlchemyError as e:
        db.rollback()  # Ensure the session is rolled back in case of error
        raise HTTPException(status_code=500, detail="Database error")


@app.get('/transactions/', response_model=List[TransactionModel])
async def read_transactions(db: db_dependency, skip: int = 0, limit: int = 100):
    try:
        transactions = db.query(models.Transactions).offset(
            skip).limit(limit).all()
        return transactions
    except SQLAlchemyError as e:
        # Handle database-specific errors (e.g., connection issues, query failures)
        raise HTTPException(status_code=500, detail="Database error occurred.")
    except Exception as e:
        # Catch all other exceptions and provide a general error response
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred.")
