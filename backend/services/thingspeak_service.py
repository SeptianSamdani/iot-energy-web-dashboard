import requests
import pandas as pd
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
CHANNEL_ID = os.getenv("THINGSPEAK_CHANNEL_ID", "1866623")
RESULTS_LIMIT = os.getenv("THINGSPEAK_RESULTS", "8000")
THINGSPEAK_URL = f"https://api.thingspeak.com/channels/{CHANNEL_ID}/feeds.json?results={RESULTS_LIMIT}"
CSV_FILE = Path("feeds.csv")
DATA_SOURCE = os.getenv("DATA_SOURCE", "api")  # 'api' or 'csv'


def fetch_data(use_csv=None):
    """
    Fetch data from ThingSpeak API or CSV file
    
    Args:
        use_csv: Override DATA_SOURCE setting. If None, use .env setting
        
    Returns:
        DataFrame with sensor data
    """
    # Determine source
    source = use_csv if use_csv is not None else (DATA_SOURCE == "csv")
    
    if source and CSV_FILE.exists():
        print(f"📂 Loading data from CSV: {CSV_FILE}")
        return load_from_csv()
    
    # Try API
    try:
        print(f"🌐 Fetching data from ThingSpeak API...")
        response = requests.get(THINGSPEAK_URL, timeout=10)
        response.raise_for_status()
        data = response.json().get("feeds", [])
        
        if not data:
            print("⚠️ API returned empty data")
            if CSV_FILE.exists():
                print("📂 Falling back to CSV...")
                return load_from_csv()
            return pd.DataFrame()
        
        print(f"✅ Loaded {len(data)} records from ThingSpeak API")
        return process_data(data)
        
    except Exception as e:
        print(f"❌ API Error: {e}")
        if CSV_FILE.exists():
            print("📂 Falling back to CSV...")
            return load_from_csv()
        return pd.DataFrame()


def load_from_csv():
    """Load and process data from CSV file"""
    try:
        df = pd.read_csv(CSV_FILE)
        
        # Validate columns
        required_cols = ["created_at", "field1", "field2", "field3", "field4", "field5", "field6"]
        if not all(col in df.columns for col in required_cols):
            raise ValueError(f"CSV must contain columns: {required_cols}")
        
        # Rename columns
        df = df[required_cols].copy()
        df.columns = ["timestamp", "voltage", "current", "frequency", "power", "energy", "pf"]
        
        # Convert to numeric
        for col in ["voltage", "current", "frequency", "power", "energy", "pf"]:
            df[col] = pd.to_numeric(df[col], errors="coerce")
        
        # Remove invalid data
        df = df.dropna()
        
        # IMPORTANT: Filter out sensor OFF data (power = 0)
        df = df[df["power"] > 0].copy()
        
        print(f"✅ Loaded {len(df)} valid records from CSV")
        return df
        
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        return pd.DataFrame()


def process_data(feeds):
    """Process raw API response data"""
    try:
        df = pd.DataFrame(feeds)
        
        # Extract and rename columns
        df = df[["created_at", "field1", "field2", "field3", "field4", "field5", "field6"]].copy()
        df.columns = ["timestamp", "voltage", "current", "frequency", "power", "energy", "pf"]
        
        # Convert to numeric
        for col in ["voltage", "current", "frequency", "power", "energy", "pf"]:
            df[col] = pd.to_numeric(df[col], errors="coerce")
        
        # Remove invalid data
        df = df.dropna()
        
        # Filter out sensor OFF data
        df = df[df["power"] > 0].copy()
        
        return df
        
    except Exception as e:
        print(f"❌ Error processing data: {e}")
        return pd.DataFrame()