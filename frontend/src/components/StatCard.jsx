import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatNumber } from "../utils/formatters";

export default function StatCard({ title, data }) {
  if (!data) return null;

  // Tentukan status visual berdasarkan rata-rata daya
  let status = "normal";
  if (data.avg_power > 600) status = "danger";
  else if (data.avg_power > 100) status = "warning";

  const getStatusStyle = () => {
    switch (status) {
      case "danger":
        return {
          border: "border-red-400",
          bg: "bg-red-50",
          icon: <AlertCircle className="text-red-500" size={18} />,
        };
      case "warning":
        return {
          border: "border-yellow-400",
          bg: "bg-yellow-50",
          icon: <AlertTriangle className="text-yellow-500" size={18} />,
        };
      default:
        return {
          border: "border-gray-200",
          bg: "bg-white",
          icon: <CheckCircle2 className="text-green-500" size={18} />,
        };
    }
  };

  const { border, bg, icon } = getStatusStyle();

  return (
    <div
      className={`flex flex-col justify-between ${border} ${bg} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>

      {/* Nilai utama */}
      <div className="text-3xl font-bold text-gray-900 mb-4">
        {formatNumber(data.avg_power, 1)}{" "}
        <span className="text-base font-normal text-gray-500">W</span>
      </div>

      {/* Sub-informasi */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
        <div>
          <div className="text-gray-500">Tegangan</div>
          <div className="font-medium text-gray-900">
            {formatNumber(data.avg_voltage, 1)} V
          </div>
        </div>
        <div>
          <div className="text-gray-500">Arus</div>
          <div className="font-medium text-gray-900">
            {formatNumber(data.avg_current, 2)} A
          </div>
        </div>
        <div>
          <div className="text-gray-500">Power Factor</div>
          <div className="font-medium text-gray-900">
            {formatNumber(data.avg_pf, 2)}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Energi Total</div>
          <div className="font-medium text-gray-900">
            {formatNumber(data.total_energy, 2)} J
          </div>
        </div>
      </div>

      {/* Persentase (opsional bar kecil di bawah) */}
      <div className="mt-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              status === "danger"
                ? "bg-red-500"
                : status === "warning"
                ? "bg-yellow-400"
                : "bg-green-500"
            }`}
            style={{ width: `${data.percentage || 0}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatNumber(data.percentage, 1)}% dari total sampel
        </p>
      </div>
    </div>
  );
}
