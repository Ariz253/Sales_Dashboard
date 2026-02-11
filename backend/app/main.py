from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import sales, analytics
from app.seed import seed_data
import threading

app = FastAPI(title="Retail Sales Analytics API")

# CORS Configuration
origins = [
    "http://localhost:5173", # Vite local
    "http://localhost:3000", # React default
    "http://127.0.0.1:5173",
    "*" # Allow all for simplicity during development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(sales.router)
app.include_router(analytics.router)

@app.on_event("startup")
async def startup_event():
    # Run seeding in a separate thread or just check logic 
    # synchronus seed is fine for startup script in this context
    try:
        t = threading.Thread(target=seed_data)
        t.start()
    except Exception as e:
        print(f"Seeding failed: {e}")

@app.get("/health")
def health_check():
    return {"status": "ok"}
