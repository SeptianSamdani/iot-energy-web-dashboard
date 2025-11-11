import { useEffect, useState } from "react";
import { getTrend } from "../api/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function TrendChart() {
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await getTrend(50);
        setTrend(res.data);
      } catch (error) {
        console.error("Error fetching trend:", error);
      }
    };

    fetchTrend();
    const interval = setInterval(fetchTrend, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!trend) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-warm-200">
        <div className="animate-pulse">
          <div className="h-4 bg-warm-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-warm-100 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: trend.timestamps.map((t) =>
      new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    ),
    datasets: [
      {
        label: "Daya (W)",
        data: trend.power,
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(14, 165, 233, 0.5)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { callback: (value) => `${value}W` },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-warm-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-warm-800">Tren Konsumsi Daya</h3>
        <span className="text-xs text-warm-700 bg-warm-100 px-3 py-1 rounded-full">
          50 Data Terakhir
        </span>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}