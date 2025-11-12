import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export default function StatCard({ label, value, unit, status = "normal" }) {
  const getStatusStyle = () => {
    switch (status) {
      case "danger":
        return {
          ring: "ring-1 ring-red-400/70 bg-red-50",
          border: "border-l-4 border-red-500",
          icon: <AlertCircle className="text-red-500" size={18} />,
          text: "text-red-700",
        };
      case "warning":
        return {
          ring: "ring-1 ring-yellow-400/70 bg-yellow-50",
          border: "border-l-4 border-yellow-400",
          icon: <AlertTriangle className="text-yellow-500" size={18} />,
          text: "text-yellow-700",
        };
      default:
        return {
          ring: "ring-1 ring-gray-200 bg-white",
          border: "border-l-4 border-green-500",
          icon: <CheckCircle2 className="text-green-500" size={18} />,
          text: "text-green-600",
        };
    }
  };

  const { ring, border, icon, text } = getStatusStyle();

  return (
    <div
      className={`flex flex-col justify-between ${ring} ${border} rounded-r-xl rounded-l-none p-5 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </h3>
        {icon}
      </div>

      <div className="text-3xl font-bold text-gray-900 leading-tight">
        {value}
        <span className="text-base font-medium text-gray-500 ml-1">
          {unit}
        </span>
      </div>

      <div className={`text-xs mt-2 ${text}`}>
        {status === "danger"
          ? "Perlu perhatian segera"
          : status === "warning"
          ? "Perlu diperiksa"
          : "Kondisi normal"}
      </div>
    </div>
  );
}
