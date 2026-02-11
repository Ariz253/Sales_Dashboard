from pymongo import MongoClient
from .config import settings

client = MongoClient(settings.MONGO_URI)
db = client[settings.DB_NAME]
sales_collection = db["sales"]
reports_collection = db["reports"]

def get_db():
    return db
