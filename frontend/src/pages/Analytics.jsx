import { useEffect, useState } from "react";
import { powerApi } from "../api/powerApi";
import { formatNumber } from "../utils/formatters";

export const Analytics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await powerApi.getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Memuat data...</div>;

  const stats = statistics || {};

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analitik Detail</h2>
      
      <div className="space-y-4">
        {Object.entries(stats).map(([category, data]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="grid grid-cols-5 gap-4 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Jumlah</div>
                <div className="font-semibold">{data.count || 0} ({data.percentage || 0}%)</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Avg Power</div>
                <div className="font-semibold">{formatNumber(data.avg_power, 1)} W</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Range</div>
                <div className="font-semibold">{formatNumber(data.min_power, 0)} - {formatNumber(data.max_power, 0)} W</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Avg Current</div>
                <div className="font-semibold">{formatNumber(data.avg_current, 2)} A</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Avg Voltage</div>
                <div className="font-semibold">{formatNumber(data.avg_voltage, 1)} V</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};