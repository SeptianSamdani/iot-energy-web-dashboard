import pandas as pd

# ================================
# RULE-BASED CLASSIFICATION
# ================================

class LoadClassifier:
    """
    Simple rule-based classifier for electrical load classification
    Based on power consumption thresholds
    """
    
    def __init__(self, 
                 light_threshold=50, 
                 medium_threshold=500):
        """
        Initialize classifier with power thresholds
        
        Args:
            light_threshold: Max power (W) for light load (default: 50W)
            medium_threshold: Max power (W) for medium load (default: 500W)
        """
        self.light_threshold = light_threshold
        self.medium_threshold = medium_threshold
    
    def classify_single(self, power, current=None, voltage=None):
        """
        Classify a single power reading
        
        Args:
            power: Power in watts
            current: Current in amperes (optional)
            voltage: Voltage in volts (optional)
            
        Returns:
            str: Classification label
        """
        # Handle sensor OFF state
        if power == 0 or (current is not None and current == 0):
            return "Sensor OFF"
        
        # Rule-based classification
        if power < self.light_threshold:
            return "Beban Ringan"
        elif power < self.medium_threshold:
            return "Beban Sedang"
        else:
            return "Beban Tinggi"
    
    def classify_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Classify entire dataframe
        
        Args:
            df: DataFrame with columns: power, current, voltage
            
        Returns:
            DataFrame with added 'status' column
        """
        result = df.copy()
        
        # Apply classification to each row
        result['status'] = result.apply(
            lambda row: self.classify_single(
                row['power'], 
                row.get('current'), 
                row.get('voltage')
            ),
            axis=1
        )
        
        return result
    
    def get_statistics(self, df: pd.DataFrame) -> dict:
        """
        Get classification statistics
        
        Args:
            df: Classified DataFrame with 'status' column
            
        Returns:
            dict: Statistics for each class
        """
        if 'status' not in df.columns:
            df = self.classify_dataframe(df)
        
        # Filter out Sensor OFF data
        df_active = df[df['status'] != 'Sensor OFF'].copy()
        
        if df_active.empty:
            return {}
        
        stats = {}
        for status in df_active['status'].unique():
            subset = df_active[df_active['status'] == status]
            stats[status] = {
                'count': len(subset),
                'percentage': round(len(subset) / len(df_active) * 100, 1),
                'avg_power': round(subset['power'].mean(), 2),
                'min_power': round(subset['power'].min(), 2),
                'max_power': round(subset['power'].max(), 2),
                'avg_current': round(subset['current'].mean(), 3),
                'avg_voltage': round(subset['voltage'].mean(), 2),
                'avg_pf': round(subset['pf'].mean(), 2) if 'pf' in subset.columns else None,
                'total_energy': round(subset['energy'].sum(), 2) if 'energy' in subset.columns else None
            }
        
        return stats
    
    def get_alerts(self, power, voltage, pf, current) -> list:
        """
        Generate alerts based on current readings
        
        Args:
            power: Current power (W)
            voltage: Current voltage (V)
            pf: Power factor
            current: Current (A)
            
        Returns:
            list: Alert messages
        """
        alerts = []
        
        if power > 600:
            alerts.append("⚠️ Konsumsi daya sangat tinggi!")
        
        if voltage < 200 or voltage > 230:
            alerts.append("⚠️ Tegangan tidak stabil")
        
        if pf < 0.7 and power > 10:
            alerts.append("⚠️ Power factor rendah - efisiensi buruk")
        
        if current > 10:
            alerts.append("⚠️ Arus terlalu tinggi - risiko overload")
        
        if not alerts:
            alerts.append("✅ Semua parameter normal")
        
        return alerts


# Default classifier instance
default_classifier = LoadClassifier(light_threshold=50, medium_threshold=500)