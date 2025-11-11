import { useEffect, useState } from "react";
import { powerApi } from "../api/powerApi";
import { formatCurrency, formatNumber } from "../utils/formatters";

export const CostEstimate = () => {
  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCost = async () => {
      try {
        const data = await powerApi.getCostEstimate();
        setCostData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCost();
  }, []);

  if (loading) return <div className="p-8">Memuat data...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Estimasi Biaya Listrik</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">Total Biaya</div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(costData?.total_cost_idr)}</div>
          <div className="text-sm text-gray-500 mt-2">Tarif: {formatCurrency(costData?.kwh_price)}/kWh</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">Total Energi</div>
          <div className="text-3xl font-bold text-gray-900">{costData?.total_energy_kwh} kWh</div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rincian per Kategori</h3>
        <div className="space-y-3">
          {costData?.breakdown && Object.entries(costData.breakdown).map(([category, data]) => (
            <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <div className="font-semibold text-gray-900">{category}</div>
                <div className="text-sm text-gray-600">
                  {formatNumber(data.energy_kwh, 4)} kWh • Avg: {formatNumber(data.avg_power_w, 1)} W
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(data.cost_idr)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};