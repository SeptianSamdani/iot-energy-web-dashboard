import { useEffect, useState } from "react";
import { getSummary } from "../api/api";

export default function SummaryCards() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getSummary();
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-warm-200 animate-pulse">
            <div className="h-3 bg-warm-200 rounded w-2/3 mb-3"></div>
            <div className="h-6 bg-warm-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Rata-rata Daya", value: `${summary.avg_power} W`, icon: "⚡", color: "bg-blue-50" },
    { label: "Daya Maksimum", value: `${summary.max_power} W`, icon: "📊", color: "bg-purple-50" },
    { label: "Rata-rata Tegangan", value: `${summary.avg_voltage} V`, icon: "🔌", color: "bg-green-50" },
    { label: "Total Record", value: summary.total_records, icon: "📈", color: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.color} rounded-xl shadow-sm p-5 border border-warm-200 hover:shadow-md transition-all cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className="text-xs text-warm-700 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-warm-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
}