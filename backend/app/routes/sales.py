from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from ..database import get_db, sales_collection
from ..models import Sale

router = APIRouter(
    prefix="/sales",
    tags=["sales"]
)

@router.get("", response_model=List[Sale])
def get_sales(
    skip: int = 0, 
    limit: int = 100,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    gender: Optional[str] = None
):
    query = {}
    
    if start_date or end_date:
        query["Date"] = {}
        if start_date:
            query["Date"]["$gte"] = start_date
        if end_date:
            query["Date"]["$lte"] = end_date
    
    if category and category != "all":
        query["Product Category"] = category
        
    if gender and gender != "all":
        query["Gender"] = gender

    sales_cursor = sales_collection.find(query).skip(skip).limit(limit)
    sales = list(sales_cursor)
    
    results = []
    for sale in sales:
        normalized_sale = {k.lower().replace(' ', '_'): v for k, v in sale.items()}
        results.append(normalized_sale)
        
    return results
