import { useEffect, useState } from "react";
import { powerApi } from "../api/powerApi";
import { formatCurrency, formatNumber } from "../utils/formatters";
import { Zap, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

export const CostEstimate = () => {
  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCost = async () => {
      try {
        const data = await powerApi.getCostEstimate();
        setCostData(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCost();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Memuat data...
      </div>
    );

  const totalEnergyKwh = costData?.breakdown
    ? Object.values(costData.breakdown).reduce(
        (sum, item) => sum + item.energy_kwh,
        0
      )
    : 0;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Estimasi Biaya Listrik
        </h2>
        <span className="text-xs text-gray-500">
          Diperbarui otomatis setiap 10 detik
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase text-gray-500">Total Biaya</div>
            <Zap size={16} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(costData?.total_cost_idr)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Dalam Rupiah (IDR)</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase text-gray-500">Total Energi</div>
            <Activity size={16} className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(totalEnergyKwh, 4)}{" "}
            <span className="text-sm text-gray-500">kWh</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Konsumsi energi keseluruhan
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase text-gray-500">Tarif Listrik</div>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(costData?.kwh_price)}
          </div>
          <div className="text-xs text-gray-500 mt-1">per kWh</div>
        </div>
      </div>

      {/* Breakdown by Category */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-5">
          Rincian Biaya per Kategori Beban
        </h3>

        {costData?.breakdown && Object.keys(costData.breakdown).length > 0 ? (
          <div className="space-y-5">
            {Object.entries(costData.breakdown).map(([category, data]) => {
              const percentage =
                totalEnergyKwh > 0
                  ? (data.energy_kwh / totalEnergyKwh) * 100
                  : 0;
              const isHigh = category === "Beban Tinggi";
              const isMedium = category === "Beban Sedang";

              const borderColor = isHigh
                ? "border-red-600"
                : isMedium
                ? "border-amber-600"
                : "border-emerald-600";

              const icon = isHigh ? (
                <AlertTriangle size={16} className="text-red-600" />
              ) : isMedium ? (
                <Activity size={16} className="text-amber-600" />
              ) : (
                <CheckCircle2 size={16} className="text-emerald-600" />
              );

              return (
                <div
                  key={category}
                  className={`border-l-4 ${borderColor} bg-gray-50/50 rounded-r-xl rounded-l-none px-5 py-4 hover:bg-gray-50 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {icon}
                      <h4 className="font-semibold text-gray-900">
                        {category}
                      </h4>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(data.cost_idr)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        Energi
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatNumber(data.energy_kwh, 4)} kWh
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        Rata-rata Daya
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatNumber(data.avg_power_w, 1)} W
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        Durasi (Records)
                      </div>
                      <div className="font-semibold text-gray-900">
                        {data.duration_records}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        Persentase
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatNumber(percentage, 1)}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          isHigh
                            ? "bg-red-500"
                            : isMedium
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 text-sm">
            Tidak ada data biaya tersedia
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            Catatan Perhitungan
          </h4>
          <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <li>• Energi dihitung dari akumulasi data sensor dalam Joule</li>
            <li>• Konversi: 1 kWh = 3.600.000 Joule</li>
            <li>• Biaya = Total Energi (kWh) × Tarif Listrik</li>
            <li>• Data diambil dari semua record aktif (power &gt; 0)</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            Rekomendasi Penghematan
          </h4>
          <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <li>✓ Kurangi penggunaan pada jam beban puncak</li>
            <li>✓ Perhatikan peralatan dengan power factor rendah</li>
            <li>✓ Matikan peralatan yang tidak digunakan</li>
            <li>✓ Gunakan peralatan hemat energi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
