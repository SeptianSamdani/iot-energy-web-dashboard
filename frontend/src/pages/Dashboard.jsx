import { useEffect, useState } from "react";
import { powerApi } from "../api/powerApi";
import { formatNumber } from "../utils/formatters";
import StatCard from "../components/StatCard";
import { AlertCard } from "../components/AlertCard";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { AlertTriangle, Activity, CheckCircle2 } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusData, summaryData, trendData, distData, statsData] = await Promise.all([
        powerApi.getStatus(),
        powerApi.getSummary(),
        powerApi.getTrend(50),
        powerApi.getDistribution(),
        powerApi.getStatistics()
      ]);

      setStatus(statusData);
      setSummary(summaryData);
      setTrend(trendData);
      setDistribution(distData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  const trendChartData = trend ? {
    labels: trend.timestamps?.slice(-20).map(t => 
      new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    ) || [],
    datasets: [{
      label: 'Daya (W)',
      data: trend.power?.slice(-20) || [],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  } : null;

  const distChartData = distribution?.distribution ? {
    labels: Object.keys(distribution.distribution),
    datasets: [{
      data: Object.values(distribution.distribution),
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  } : null;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="Tegangan" 
          value={formatNumber(status?.voltage, 1)} 
          unit="V"
          status={status?.voltage < 200 || status?.voltage > 230 ? 'warning' : 'normal'}
        />
        <StatCard 
          label="Arus" 
          value={formatNumber(status?.current, 3)} 
          unit="A"
          status={status?.current > 10 ? 'danger' : 'normal'}
        />
        <StatCard 
          label="Daya" 
          value={formatNumber(status?.power, 1)} 
          unit="W"
          status={status?.power > 600 ? 'danger' : status?.power > 100 ? 'warning' : 'normal'}
        />
        <StatCard 
          label="Power Factor" 
          value={formatNumber(status?.pf, 2)} 
          unit=""
          status={status?.pf < 0.7 ? 'warning' : 'normal'}
        />
      </div>

      {/* Status Beban & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mb-10">
{/* Status Beban */}
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
      Status Beban
    </h3>
    <span
  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full
    ${
      status?.status === "Beban Tinggi"
        ? "text-red-600"
        : status?.status === "Beban Sedang"
        ? "text-amber-600"
        : "text-emerald-600"
    }`}
>
  {status?.status === "Beban Tinggi" ? (
    <AlertTriangle size={14} className="text-red-600" />
  ) : status?.status === "Beban Sedang" ? (
    <Activity size={14} className="text-amber-600" />
  ) : (
    <CheckCircle2 size={14} className="text-emerald-600" />
  )}
  {status?.status || "-"}
</span>
  </div>

  {/* Middle Section - Ringkasan Power */}
  <div className="flex flex-col items-center justify-center py-3 mb-4 border-y border-gray-100">
    <div className="text-[2.2rem] font-bold leading-tight text-gray-900 mb-1">
      {formatNumber(status?.power, 1)} <span className="text-lg text-gray-500">W</span>
    </div>
    <div className="text-xs text-gray-500 tracking-wide uppercase">
      Konsumsi Daya Saat Ini
    </div>
  </div>

  {/* Detail Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm justify-items-center">
    <div className="flex flex-col items-center text-center">
      <div className="text-xs text-gray-500 uppercase mb-1">Frekuensi</div>
      <div className="text-gray-900 font-semibold">
        {formatNumber(status?.frequency, 1)}{" "}
        <span className="text-gray-500 text-xs">Hz</span>
      </div>
    </div>
    <div className="flex flex-col items-start">
      <div className="text-xs text-gray-500 uppercase mb-1">Energi</div>
      <div className="text-gray-900 font-semibold">
        {formatNumber(status?.energy, 2)}{" "}
        <span className="text-gray-500 text-xs">J</span>
      </div>
    </div>
    <div className="flex flex-col items-start">
      <div className="text-xs text-gray-500 uppercase mb-1">Diperbarui</div>
      <div className="text-gray-700 text-xs font-medium">
        {status?.timestamp
          ? new Date(status.timestamp).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "-"}
      </div>
    </div>
  </div>
</div>


        {/* Alerts */}
        <AlertCard alerts={status?.alerts} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Trend Daya (20 Data Terakhir)</h3>
          <div style={{ height: '220px' }}>
            {trendChartData && (
              <Line 
                data={trendChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `Daya: ${context.parsed.y.toFixed(1)} W`
                      }
                    }
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => value + ' W'
                      }
                    },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Distribusi Beban</h3>
          <div style={{ height: '220px' }}>
            {distChartData && (
              <Doughnut
                data={distChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'bottom',
                      labels: {
                        padding: 15,
                        font: { size: 11 }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const percent = distribution?.percentages?.[label] || 0;
                          return `${label}: ${value} (${percent}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-md font-semibold text-gray-900 uppercase tracking-wide">
            Ringkasan Statistik
          </h3>
          <span className="text-xs text-gray-500">
            Diperbarui otomatis setiap 10 detik
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Records */}
          <div className="flex flex-col items-start justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 hover:shadow-sm transition-all">
            <div className="text-xs text-gray-500 uppercase mb-1">Total Records</div>
            <div className="text-2xl font-semibold text-green-700">
              {summary?.total_records || 0}
            </div>
          </div>

          {/* Rata-rata Daya */}
          <div className="flex flex-col items-start justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 hover:shadow-sm transition-all">
            <div className="text-xs text-gray-500 uppercase mb-1">Rata-rata Daya</div>
            <div className="text-2xl font-semibold text-green-700">
              {formatNumber(summary?.avg_power, 2)}{" "}
              <span className="text-sm text-gray-500 font-medium">W</span>
            </div>
          </div>

          {/* Range Daya */}
          <div className="flex flex-col items-start justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 hover:shadow-sm transition-all">
            <div className="text-xs text-gray-500 uppercase mb-1">Range Daya</div>
            <div className="text-lg font-semibold text-green-700">
              {formatNumber(summary?.min_power, 1)} -{" "}
              {formatNumber(summary?.max_power, 1)}{" "}
              <span className="text-sm text-gray-500 font-medium">W</span>
            </div>
          </div>

          {/* Total Energi */}
          <div className="flex flex-col items-start justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 hover:shadow-sm transition-all">
            <div className="text-xs text-gray-500 uppercase mb-1">Total Energi</div>
            <div className="text-2xl font-semibold text-green-700">
              {formatNumber(summary?.total_energy, 2)}{" "}
              <span className="text-sm text-gray-500 font-medium">J</span>
            </div>
          </div>
        </div>
      </div>

    {statistics && (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Detail Statistik per Kategori Beban
          </h3>
          <span className="text-xs text-gray-500">Data agregasi real-time</span>
        </div>

        <div className="space-y-5">
          {Object.entries(statistics).map(([category, data]) => {
            const isHigh = category === "Beban Tinggi";
            const isMedium = category === "Beban Sedang";
            const icon = isHigh ? (
              <AlertTriangle size={16} className="text-red-600" />
            ) : isMedium ? (
              <Activity size={16} className="text-amber-600" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-600" />
            );

            const borderColor = isHigh
              ? "border-red-400"
              : isMedium
              ? "border-amber-400"
              : "border-emerald-400";

            return (
              <div
                key={category}
                className={`border-l-4 ${borderColor} bg-gray-50/50 rounded-r-xl rounded-l-none px-5 py-4 hover:bg-gray-50 transition-all duration-200`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {icon}
                    <h4 className="font-semibold text-gray-900">{category}</h4>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {data.count} records • {data.percentage}%
                  </span>
                </div>

                {/* Grid Detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Avg Power
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatNumber(data.avg_power, 2)}{" "}
                      <span className="text-gray-500 text-xs">W</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Power Range
                    </div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {formatNumber(data.min_power, 1)} – {formatNumber(data.max_power, 1)}{" "}
                      <span className="text-gray-500 text-xs">W</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Avg Current
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatNumber(data.avg_current, 3)}{" "}
                      <span className="text-gray-500 text-xs">A</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Avg Voltage
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatNumber(data.avg_voltage, 2)}{" "}
                      <span className="text-gray-500 text-xs">V</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Avg PF</div>
                    <div className="font-semibold text-gray-900">
                      {formatNumber(data.avg_pf, 2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
    </div>
  );
};