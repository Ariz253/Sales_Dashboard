from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime
import uuid
from typing import List, Optional
from ..database import get_db, sales_collection, reports_collection
from ..models import AnalyticsResponse, AnalyticsReport
from ..analytics import calculate_metrics

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"]
)

@router.get("/run", response_model=AnalyticsResponse)
def run_analytics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[List[str]] = Query(None),
    gender: Optional[str] = None,
    age_min: Optional[int] = None,
    age_max: Optional[int] = None
):
    # 1. Build Query
    query = {}
    
    # Date Filtering (Stored as 'YYYY-MM-DD' strings in DB)
    if start_date or end_date:
        query["Date"] = {}
        if start_date:
            query["Date"]["$gte"] = start_date
        if end_date:
            query["Date"]["$lte"] = end_date
    
    # Category Filtering (Multi-select)
    if category:
        query["Product Category"] = {"$in": category}
        
    # Gender Filtering
    if gender and gender.lower() != "all":
        query["Gender"] = gender
        
    # Age Range Filtering
    if age_min is not None or age_max is not None:
        query["Age"] = {}
        if age_min is not None:
            query["Age"]["$gte"] = age_min
        if age_max is not None:
            query["Age"]["$lte"] = age_max

    # 2. Fetch Filtered Data
    sales_cursor = sales_collection.find(query)
    sales_data = list(sales_cursor)
    
    if not sales_data:
        # Return empty metrics structure
        empty_metrics = {
            "total_revenue": 0, "avg_transaction_value": 0, "total_transactions": 0, "avg_basket_size": 0,
            "top_category": "N/A", "worst_performing_category": "N/A",
            "sales_by_category": {}, "quantity_by_category": {},
            "gender_spending": {}, "sales_by_age_group": {},
            "daily_sales": {}, "monthly_sales": {},
            "peak_sales_day": "N/A", "lowest_sales_day": "N/A",
            "customer_behavior": {"repeat_customers": 0, "one_time_customers": 0}
        }
        return {"report_id": "no-data", "metrics": empty_metrics}

    # 3. Run Analytics using existing Logic
    metrics = calculate_metrics(sales_data)
    
    if not metrics:
         raise HTTPException(status_code=500, detail="Failed to calculate metrics")

    # 4. Save to MongoDB (Include filters in report!)
    report_id = str(uuid.uuid4())
    report_doc = {
        "report_id": report_id,
        "date_generated": datetime.utcnow(),
        "filters": {
            "start_date": start_date,
            "end_date": end_date,
            "category": category,
            "gender": gender,
            "age_min": age_min,
            "age_max": age_max
        },
        **metrics
    }
    
    reports_collection.insert_one(report_doc)
    
    return {"report_id": report_id, "metrics": metrics}

@router.get("/reports", response_model=list)
def get_reports():
    reports_cursor = reports_collection.find().sort("date_generated", -1).limit(20)
    reports = list(reports_cursor)
    for r in reports:
        r["_id"] = str(r["_id"])
    return reports
