import { useEffect, useState } from "react";
import { getDistribution } from "../api/api";

export default function DistributionChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDistribution();
        setData(res.data);
      } catch (error) {
        console.error("Error fetching distribution:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) return null;

  const items = Object.entries(data.distribution).map(([status, count]) => ({
    status,
    count,
    percentage: data.percentages[status],
  }));

  const getColor = (status) => {
    if (status === "Beban Tinggi") 
      return { bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500" };
    if (status === "Beban Sedang") 
      return { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" };
    return { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-warm-200">
      <h3 className="text-lg font-semibold text-warm-800 mb-4">Distribusi Beban</h3>
      
      <div className="space-y-4">
        {items.map((item) => {
          const colors = getColor(item.status);
          return (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${colors.text}`}>
                  {item.status}
                </span>
                <div className="text-right">
                  <span className="text-lg font-bold text-warm-800">{item.count}</span>
                  <span className="text-xs text-warm-700 ml-2">({item.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-warm-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`${colors.bar} h-3 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-warm-200">
        <p className="text-sm text-warm-700">
          Total: <span className="font-semibold text-warm-800">{data.total_records}</span> data aktif
        </p>
      </div>
    </div>
  );
}