import pandas as pd
from datetime import datetime

def calculate_metrics(sales_data: list) -> dict:
    if not sales_data:
        return {}

    df = pd.DataFrame(sales_data)
    
    # Normalize columns
    required_cols = ['total_amount', 'quantity', 'price_per_unit', 'date', 'product_category', 'gender', 'age', 'customer_id']
    # keys in DB might be Title Case 'Total Amount', 'Date' etc based on CSV
    # We normalize to snake_case
    df.columns = [c.lower().replace(' ', '_') for c in df.columns]
            
    # Re-check columns
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        print(f"Missing columns for analytics: {missing}")
        return {}

    df['total_amount'] = pd.to_numeric(df['total_amount'], errors='coerce')
    df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')
    df['price_per_unit'] = pd.to_numeric(df['price_per_unit'], errors='coerce')
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['age'] = pd.to_numeric(df['age'], errors='coerce')
    
    # Drop invalid rows
    df.dropna(subset=['total_amount', 'date', 'customer_id'], inplace=True)

    if df.empty:
        return {}

    # 1. Broad KPIs
    total_revenue = float(df['total_amount'].sum())
    total_transactions = int(len(df))
    avg_transaction_value = float(df['total_amount'].mean())
    avg_basket_size = float(df['quantity'].mean())

    # 2. Product Category Analysis
    category_group = df.groupby('product_category')['total_amount'].sum()
    if not category_group.empty:
        top_category = category_group.idxmax()
        worst_performing_category = category_group.idxmin()
        sales_by_category = category_group.to_dict()
    else:
        top_category = "N/A"
        worst_performing_category = "N/A"
        sales_by_category = {}
    
    quantity_by_category = df.groupby('product_category')['quantity'].sum().to_dict()

    # 3. Trends (Time Series)
    daily_sales = df.groupby(df['date'].dt.strftime('%Y-%m-%d'))['total_amount'].sum()
    monthly_sales = df.groupby(df['date'].dt.strftime('%Y-%m'))['total_amount'].sum()
    
    if not daily_sales.empty:
        peak_sales_day = daily_sales.idxmax()
        lowest_sales_day = daily_sales.idxmin()
    else:
        peak_sales_day = "N/A"
        lowest_sales_day = "N/A"

    daily_sales_dict = daily_sales.to_dict()
    monthly_sales_dict = monthly_sales.to_dict()

    # 4. Demographics (Gender & Age)
    gender_spending = df.groupby('gender')['total_amount'].sum().to_dict()
    
    # Age Binning
    bins = [0, 18, 25, 35, 50, 150]
    labels = ['<18', '18-25', '26-35', '36-50', '50+']
    df['age_group'] = pd.cut(df['age'], bins=bins, labels=labels, right=False)
    sales_by_age_group = df.groupby('age_group', observed=False)['total_amount'].sum().to_dict()
    avg_spend_by_age_group = df.groupby('age_group', observed=False)['total_amount'].mean().to_dict()

    # 5. Customer Behavior
    customer_counts = df['customer_id'].value_counts()
    repeat_customers = int((customer_counts > 1).sum())
    single_purchase_customers = int((customer_counts == 1).sum())

    # 6. Price Sensitivity Data (Scatter/Bubble)
    price_sensitivity = df[['price_per_unit', 'quantity', 'total_amount', 'product_category']].to_dict(orient='records')

    metrics = {
        "total_revenue": total_revenue,
        "avg_transaction_value": avg_transaction_value,
        "total_transactions": total_transactions,
        "avg_basket_size": avg_basket_size,
        "top_category": top_category,
        "worst_performing_category": worst_performing_category,
        "sales_by_category": sales_by_category,
        "quantity_by_category": quantity_by_category,
        "gender_spending": gender_spending,
        "sales_by_age_group": sales_by_age_group,
        "avg_spend_by_age_group": avg_spend_by_age_group,
        "price_sensitivity": price_sensitivity,
        "daily_sales": daily_sales_dict,
        "monthly_sales": monthly_sales_dict,
        "peak_sales_day": peak_sales_day,
        "lowest_sales_day": lowest_sales_day,
        "customer_behavior": {
             "repeat_customers": repeat_customers,
             "one_time_customers": single_purchase_customers
        }
    }

    return metrics
