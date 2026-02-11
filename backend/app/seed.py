import pandas as pd
from pymongo import MongoClient
import os
from app.config import settings

def seed_data():
    # Helper to connect synchronously for seeding
    client = MongoClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    sales_collection = db["sales"]

    # Check if data already exists
    if sales_collection.count_documents({}) > 0:
        print("Data already exists in MongoDB. Skipping seed.")
        return

    csv_path = os.path.join(os.path.dirname(__file__), "../../database/retail_sales_dataset.csv")
    
    if not os.path.exists(csv_path):
        print(f"Dataset not found at {csv_path}")
        return

    print("Seeding data from CSV...")
    df = pd.read_csv(csv_path)
    
    # basic cleanup if needed, though instructions say use preloaded dataset
    # Convert 'Date' to standard format if requested, but instructions say 'date' field
    # We will insert as dictionaries
    
    records = df.to_dict(orient="records")
    
    # Bulk insert
    if records:
        sales_collection.insert_many(records)
        print(f"Successfully inserted {len(records)} records.")
    else:
        print("No records found in CSV.")

if __name__ == "__main__":
    seed_data()
