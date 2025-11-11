import { useEffect, useState } from "react";
import { getStatus } from "../api/api";

export default function StatusCard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getStatus();
        setStatus(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching status:", error);
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-warm-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-warm-200 rounded w-1/3"></div>
          <div className="h-8 bg-warm-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const getStatusColor = (status) => {
    if (status === "Beban Tinggi") return "bg-red-50 border-red-200";
    if (status === "Beban Sedang") return "bg-amber-50 border-amber-200";
    return "bg-green-50 border-green-200";
  };

  const getTextColor = (status) => {
    if (status === "Beban Tinggi") return "text-red-700";
    if (status === "Beban Sedang") return "text-amber-700";
    return "text-green-700";
  };

  return (
    <div className={`rounded-2xl shadow-sm p-6 border-2 transition-all ${getStatusColor(status.status)}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-warm-700 mb-1">Status Sistem</p>
          <h2 className={`text-3xl font-bold ${getTextColor(status.status)}`}>
            {status.status}
          </h2>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-warm-700 mb-1">Daya</p>
          <p className="text-xl font-semibold text-warm-800">{status.power} W</p>
        </div>
        <div>
          <p className="text-xs text-warm-700 mb-1">Arus</p>
          <p className="text-xl font-semibold text-warm-800">{status.current} A</p>
        </div>
        <div>
          <p className="text-xs text-warm-700 mb-1">Tegangan</p>
          <p className="text-xl font-semibold text-warm-800">{status.voltage} V</p>
        </div>
        <div>
          <p className="text-xs text-warm-700 mb-1">Power Factor</p>
          <p className="text-xl font-semibold text-warm-800">{status.pf}</p>
        </div>
      </div>

      <div className="space-y-2">
        {status.alerts?.map((alert, idx) => (
          <div
            key={idx}
            className={`text-sm px-3 py-2 rounded-lg transition-colors ${
              alert.startsWith("✅")
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {alert}
          </div>
        ))}
      </div>

      <p className="text-xs text-warm-700 mt-4">
        {new Date(status.timestamp).toLocaleString("id-ID")}
      </p>
    </div>
  );
}