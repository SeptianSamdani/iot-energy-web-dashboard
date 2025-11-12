import { useEffect, useState } from "react";
import { powerApi } from "../api/powerApi";
import { formatNumber } from "../utils/formatters";
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export const Analytics = () => {
  const [statistics, setStatistics] = useState(null);
  const [trend, setTrend] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, trendData, distData] = await Promise.all([
          powerApi.getStatistics(),
          powerApi.getTrend(100),
          powerApi.getDistribution()
        ]);
        setStatistics(statsData);
        setTrend(trendData);
        setDistribution(distData);
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

  // Chart untuk perbandingan power per kategori
  const comparisonChartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Rata-rata Daya (W)',
        data: Object.values(stats).map(s => s.avg_power),
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  // Chart untuk trend lengkap
  const fullTrendData = trend ? {
    labels: trend.timestamps?.map(t => 
      new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    ) || [],
    datasets: [
      {
        label: 'Daya (W)',
        data: trend.power || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 1
      },
      {
        label: 'Tegangan (V)',
        data: trend.voltage || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 1,
        yAxisID: 'y1'
      }
    ]
  } : null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analitik Detail</h2>
      
      {/* Distribution Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">Total Data Aktif</div>
          <div className="text-3xl font-bold text-gray-900">{distribution?.total_records || 0}</div>
          <div className="text-xs text-gray-500 mt-2">records</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">Kategori Beban</div>
          <div className="text-3xl font-bold text-gray-900">
            {distribution?.distribution ? Object.keys(distribution.distribution).length : 0}
          </div>
          <div className="text-xs text-gray-500 mt-2">kategori terdeteksi</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">Dominan</div>
          <div className="text-lg font-bold text-gray-900">
            {distribution?.distribution ? 
              Object.entries(distribution.distribution).sort((a, b) => b[1] - a[1])[0]?.[0] : '-'
            }
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {distribution?.percentages ? 
              Object.entries(distribution.percentages).sort((a, b) => b[1] - a[1])[0]?.[1] : 0
            }% dari total
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Perbandingan Rata-rata Daya per Kategori</h3>
        <div style={{ height: '250px' }}>
          <Bar
            data={comparisonChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.parsed.y.toFixed(2)} W`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => value + ' W'
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Full Trend Chart */}
      {fullTrendData && (
        <div className="border border-gray-200 rounded-lg p-6 bg-white mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Trend Data Lengkap (100 Data Terakhir)</h3>
          <div style={{ height: '300px' }}>
            <Line
              data={fullTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false
                },
                plugins: {
                  legend: { 
                    position: 'top',
                    labels: { usePointStyle: true }
                  }
                },
                scales: {
                  y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Daya (W)' }
                  },
                  y1: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'Tegangan (V)' },
                    grid: { drawOnChartArea: false }
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Detailed Statistics Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Detail Statistik per Kategori</h3>
        {Object.entries(stats).map(([category, data]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{data.count}</span>
                <span className="text-sm text-gray-600 ml-2">({data.percentage}%)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-600 mb-1 text-xs">Avg Power</div>
                <div className="font-semibold text-gray-900">{formatNumber(data.avg_power, 2)} W</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-600 mb-1 text-xs">Min Power</div>
                <div className="font-semibold text-gray-900">{formatNumber(data.min_power, 1)} W</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-600 mb-1 text-xs">Max Power</div>
                <div className="font-semibold text-gray-900">{formatNumber(data.max_power, 1)} W</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-600 mb-1 text-xs">Avg Current</div>
                <div className="font-semibold text-gray-900">{formatNumber(data.avg_current, 3)} A</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-600 mb-1 text-xs">Avg Voltage</div>
                <div className="font-semibold text-gray-900">{formatNumber(data.avg_voltage, 2)} V</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-600 mb-1 text-xs">Avg PF</div>
                <div className="font-semibold text-gray-900">{formatNumber(data.avg_pf, 2)}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Total Energi: <span className="font-semibold text-gray-900">{formatNumber(data.total_energy, 2)} J</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};