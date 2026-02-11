# Retail Sales Analytics Dashboard

A full-stack application for analyzing retail sales data. Built with **FastAPI** (Backend), **MongoDB** (Database), and **React** (Frontend).

## 🚀 Features
- **Interactive Dashboard**: visualize sales trends, revenue by category, and customer demographics.
- **Data Filtering**: Filter analytics by date range.
- **RESTful API**: fast and documented API built with FastAPI.
- **Responsive Design**: Modern UI built with React and Chart.js.

## 🛠️ Tech Stack
- **Backend**: Python, FastAPI, Pandas, PyMongo
- **Frontend**: React, Vite, Chart.js, Lucide React
- **Database**: MongoDB

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (Running locally or cloud)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `backend/` if needed (default connects to local MongoDB).

Run the server:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 Usage
1. Ensure MongoDB is running.
2. Start the backend server (http://localhost:8000).
3. Start the frontend dev server (http://localhost:5173).
4. The application will automatically seed the database with sample data on first run.

## 📝 API Documentation
Once the backend is running, visit:
`http://localhost:8000/docs` based on OpenAPI/Swagger.
