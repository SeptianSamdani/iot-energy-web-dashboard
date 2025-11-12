import { Activity, BarChart3, DollarSign, Zap, Clock, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar({ activeTab, setActiveTab }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "analytics", label: "Analitik", icon: BarChart3 },
    { id: "cost", label: "Estimasi Biaya", icon: DollarSign },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Zap className="text-green-600" size={22} />
            <span className="text-lg font-semibold text-gray-900 tracking-tight">
              PowerMonitor
            </span>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex space-x-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-2 py-2 text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>

                  {/* Active Border Bottom */}
                  {isActive && (
                    <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-green-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side - Clock + Hamburger */}
          <div className="flex items-center space-x-3">
            {/* Current Time */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {currentTime.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            >
              {menuOpen ? (
                <X size={20} className="text-gray-700" />
              ) : (
                <Menu size={20} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="px-6 py-3 flex flex-col space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMenuOpen(false); // tutup menu setelah pilih
                  }}
                  className={`flex items-center space-x-3 px-2 py-2 text-sm font-medium rounded-md transition ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Waktu tampil di bawah menu pada mobile */}
            <div className="flex items-center space-x-2 mt-3 text-sm text-gray-700 border-t border-gray-100 pt-3">
              <Clock size={15} className="text-gray-500" />
              <span>
                {currentTime.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
