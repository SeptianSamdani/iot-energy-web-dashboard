import { useEffect, useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { CostEstimate } from "./pages/CostEstimate";
import Navbar from "./components/layout/Navbar";
import Header from "./components/layout/Header";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastUpdate(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-inter antialiased">
      {/* Navbar Horizontal */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Header with Info */}
      <Header lastUpdate={lastUpdate} onRefresh={handleRefresh} />
      
      {/* Main Content */}
      <main>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'cost' && <CostEstimate />}
      </main>
    </div>
  );
}