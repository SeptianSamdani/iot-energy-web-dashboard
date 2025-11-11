import { useEffect, useState } from "react";
import { getClassify } from "../api/api";

export default function DataTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getClassify(10);
        setRows(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "Beban Tinggi")
      return "bg-red-100 text-red-700 border-red-200";
    if (status === "Beban Sedang")
      return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden">
      <div className="p-6 border-b border-warm-200">
        <h3 className="text-lg font-semibold text-warm-800">Data Klasifikasi Terbaru</h3>
        <p className="text-sm text-warm-700 mt-1">10 data terakhir</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-warm-200">
          <thead className="bg-warm-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-warm-700 uppercase tracking-wider">
                Waktu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-warm-700 uppercase tracking-wider">
                Daya
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-warm-700 uppercase tracking-wider">
                Arus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-warm-700 uppercase tracking-wider">
                Tegangan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-warm-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-warm-200">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-warm-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-warm-800">
                  {new Date(row.timestamp).toLocaleTimeString("id-ID")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-warm-800">
                  {row.power} W
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-warm-700">
                  {row.current} A
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-warm-700">
                  {row.voltage} V
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${getStatusBadge(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}