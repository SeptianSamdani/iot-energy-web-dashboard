from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from services.thingspeak_service import fetch_data
from classifier.rule_based import default_classifier
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="IoT Power Monitoring API",
    description="Rule-based electrical load classification system",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# ENDPOINTS
# ================================

@app.get("/")
def root():
    """API Information"""
    return {
        "name": "IoT Power Monitoring API",
        "version": "2.0.0",
        "classification": "Rule-Based",
        "endpoints": {
            "data": "/classify",
            "status": "/status",
            "summary": "/summary",
            "trend": "/trend",
            "statistics": "/statistics",
            "distribution": "/distribution",
            "cost": "/cost_estimate"
        }
    }


@app.get("/classify")
def classify_data(limit: int = Query(10, ge=1, le=100)):
    """
    Get classified sensor data
    
    Args:
        limit: Number of latest records to return (default: 10)
    """
    try:
        df = fetch_data()
        if df.empty:
            raise HTTPException(status_code=404, detail="Tidak ada data tersedia")
        
        # Classify data
        result = default_classifier.classify_dataframe(df)
        
        # Return latest records
        return result.tail(limit).to_dict(orient="records")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/status")
def get_status():
    """Get latest sensor reading with classification and alerts"""
    try:
        df = fetch_data()
        if df.empty:
            raise HTTPException(status_code=404, detail="Tidak ada data")
        
        # Classify
        result = default_classifier.classify_dataframe(df)
        latest = result.tail(1).iloc[0]
        
        # Generate alerts
        alerts = default_classifier.get_alerts(
            latest['power'],
            latest['voltage'],
            latest['pf'],
            latest['current']
        )
        
        return {
            "timestamp": latest["timestamp"],
            "voltage": round(latest["voltage"], 2),
            "current": round(latest["current"], 3),
            "power": round(latest["power"], 2),
            "pf": round(latest["pf"], 2),
            "frequency": round(latest["frequency"], 1),
            "energy": round(latest["energy"], 2),
            "status": latest["status"],
            "alerts": alerts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/summary")
def get_summary():
    """Get overall data summary"""
    try:
        df = fetch_data()
        if df.empty:
            return {"message": "Tidak ada data"}
        
        summary = {
            "total_records": len(df),
            "avg_voltage": round(df["voltage"].mean(), 2),
            "avg_current": round(df["current"].mean(), 3),
            "avg_power": round(df["power"].mean(), 2),
            "min_power": round(df["power"].min(), 2),
            "max_power": round(df["power"].max(), 2),
            "avg_pf": round(df["pf"].mean(), 2),
            "total_energy": round(df["energy"].sum(), 2),
        }
        return summary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/trend")
def get_trend(limit: int = Query(50, ge=10, le=200)):
    """
    Get time series data for visualization
    
    Args:
        limit: Number of latest records (default: 50)
    """
    try:
        df = fetch_data()
        if df.empty:
            raise HTTPException(status_code=404, detail="Tidak ada data")
        
        df_latest = df.tail(limit)
        
        return {
            "timestamps": df_latest["timestamp"].tolist(),
            "power": df_latest["power"].round(2).tolist(),
            "voltage": df_latest["voltage"].round(2).tolist(),
            "current": df_latest["current"].round(3).tolist(),
            "pf": df_latest["pf"].round(2).tolist(),
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/statistics")
def get_statistics():
    """Get detailed classification statistics"""
    try:
        df = fetch_data()
        if df.empty:
            raise HTTPException(status_code=404, detail="Tidak ada data")
        
        stats = default_classifier.get_statistics(df)
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/distribution")
def get_distribution():
    """Get load distribution summary"""
    try:
        df = fetch_data()
        if df.empty:
            raise HTTPException(status_code=404, detail="Tidak ada data")
        
        result = default_classifier.classify_dataframe(df)
        
        # Filter out Sensor OFF
        result = result[result['status'] != 'Sensor OFF']
        
        if result.empty:
            return {"message": "Tidak ada data aktif"}
        
        distribution = result['status'].value_counts().to_dict()
        
        return {
            "total_records": len(result),
            "distribution": distribution,
            "percentages": {
                status: round(count / len(result) * 100, 1)
                for status, count in distribution.items()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/cost_estimate")
def estimate_cost(kwh_price: float = Query(None, description="Price per kWh (IDR)")):
    """
    Estimate electricity cost
    
    Args:
        kwh_price: Electricity rate (IDR/kWh). If None, use .env value
    """
    try:
        # Get price from env or parameter
        if kwh_price is None:
            kwh_price = float(os.getenv("ELECTRICITY_RATE", 1444.70))
        
        df = fetch_data()
        if df.empty:
            raise HTTPException(status_code=404, detail="Tidak ada data")
        
        result = default_classifier.classify_dataframe(df)
        
        # Calculate costs
        total_cost = 0
        breakdown = {}
        
        for status in result['status'].unique():
            if status == "Sensor OFF":
                continue
                
            subset = result[result['status'] == status]
            energy_kwh = subset['energy'].sum() / 3600  # Joule to kWh
            cost = energy_kwh * kwh_price
            total_cost += cost
            
            breakdown[status] = {
                "energy_kwh": round(energy_kwh, 4),
                "cost_idr": round(cost, 2),
                "avg_power_w": round(subset['power'].mean(), 2),
                "duration_records": len(subset)
            }
        
        return {
            "total_cost_idr": round(total_cost, 2),
            "kwh_price": kwh_price,
            "breakdown": breakdown
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "iot-monitoring-api"}