from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SaleBase(BaseModel):
    transaction_id: str | int
    date: str
    customer_id: str
    gender: str
    age: int
    product_category: str
    quantity: int
    price_per_unit: float
    total_amount: float

class Sale(SaleBase):
    pass

class AnalyticsReport(BaseModel):
    report_id: str
    date_generated: datetime
    total_revenue: float
    avg_transaction_value: float
    total_transactions: int
    top_category: str
    peak_sales_day: str
    sales_by_category: dict
    visualizations: dict # Placeholder for chart data if needed

class AnalyticsResponse(BaseModel):
    report_id: str
    metrics: dict
