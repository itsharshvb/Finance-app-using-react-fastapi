
from pydantic import BaseModel


class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str


class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True
    """
    orm_mode = True: This is particularly important when working with Object-Relational Mapping 
    (ORM) libraries like SQLAlchemy.
By default, Pydantic expects data to be passed as dictionaries (i.e., dict or JSON-like objects).
However, when working with ORMs (like SQLAlchemy), the data returned from the database is 
typically not a dictionary, but an object (instance of a model class).
orm_mode = True tells Pydantic that the data coming from the ORM should be treated as if it were
 a dictionary. This allows you to use Pydantic models with ORM objects, and Pydantic will 
 automatically extract the data from the ORM model instance (e.g., SQLAlchemy model instance) 
 and map it to the Pydantic model.
"""
