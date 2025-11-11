import { useEffect, useState } from "react";
import { powerApi } from "../api/powerApi";
import { formatNumber } from "../utils/formatters";
import StatCard from "../components/StatCard";
import { AlertCard } from "../components/AlertCard";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// Main Dashboard Component
export const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusData, summaryData, trendData, distData] = await Promise.all([
        powerApi.getStatus(),
        powerApi.getSummary(),
        powerApi.getTrend(50),
        powerApi.getDistribution()
      ]);

      setStatus(statusData);
      setSummary(summaryData);
      setTrend(trendData);
      setDistribution(distData);
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
    labels: trend.timestamps?.slice(-20).map(t => new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })) || [],
    datasets: [{
      label: 'Daya (W)',
      data: trend.power?.slice(-20) || [],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  } : null;

  const distChartData = distribution ? {
    labels: Object.keys(distribution.distribution || {}),
    datasets: [{
      data: Object.values(distribution.distribution || {}),
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  } : null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="Tegangan" 
          value={formatNumber(status?.voltage, 1)} 
          unit="V"
          status={status?.voltage < 200 || status?.voltage > 230 ? 'warning' : 'normal'}
        />
        <StatCard 
          label="Arus" 
          value={formatNumber(status?.current, 2)} 
          unit="A"
          status={status?.current > 10 ? 'danger' : 'normal'}
        />
        <StatCard 
          label="Daya" 
          value={formatNumber(status?.power, 1)} 
          unit="W"
          status={status?.power > 600 ? 'danger' : 'normal'}
        />
        <StatCard 
          label="Power Factor" 
          value={formatNumber(status?.pf, 2)} 
          unit=""
          status={status?.pf < 0.7 ? 'warning' : 'normal'}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Status Beban</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">{status?.status || '-'}</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Frekuensi</div>
                <div className="font-semibold">{formatNumber(status?.frequency, 1)} Hz</div>
              </div>
              <div>
                <div className="text-gray-600">Energi</div>
                <div className="font-semibold">{formatNumber(status?.energy, 2)} J</div>
              </div>
              <div>
                <div className="text-gray-600">Timestamp</div>
                <div className="font-semibold text-xs">{status?.timestamp ? new Date(status.timestamp).toLocaleTimeString('id-ID') : '-'}</div>
              </div>
            </div>
          </div>
        </div>
        <AlertCard alerts={status?.alerts} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-white h-64">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Trend Daya (20 Data Terakhir)</h3>
          {trendChartData && (
            <Line 
              data={trendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-white h-64">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Distribusi Beban</h3>
          {distChartData && (
            <Doughnut
              data={distChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
          )}
        </div>

      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Ringkasan Statistik</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-gray-600 mb-1">Total Records</div>
            <div className="text-lg font-semibold">{summary?.total_records || 0}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Rata-rata Daya</div>
            <div className="text-lg font-semibold">{formatNumber(summary?.avg_power, 1)} W</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Daya Min/Max</div>
            <div className="text-lg font-semibold">{formatNumber(summary?.min_power, 0)} / {formatNumber(summary?.max_power, 0)} W</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Total Energi</div>
            <div className="text-lg font-semibold">{formatNumber(summary?.total_energy, 0)} J</div>
          </div>
        </div>
      </div>
    </div>
  );
};