import { useEffect, useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { CostEstimate } from "./pages/CostEstimate";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastUpdate(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1">
        <Header lastUpdate={lastUpdate} />
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'cost' && <CostEstimate />}
      </div>
    </div>
  );
}
