export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analitik' },
    { id: 'cost', label: 'Estimasi Biaya' }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-xl font-bold mb-8">Power Monitor</h1>
      <nav className="space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-2 rounded transition-colors ${
              activeTab === tab.id 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}