import { Clock, RefreshCw } from "lucide-react";

export default function Header({ onRefresh }) {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex justify-between items-center">
        {/* Title ringkas */}
        <h2 className="text-base font-semibold text-gray-800 tracking-tight">
          Monitoring Energi Real-time
        </h2>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Tombol refresh */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={16} className="text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
