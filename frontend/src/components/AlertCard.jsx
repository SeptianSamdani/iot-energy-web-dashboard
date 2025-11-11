export const AlertCard = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Sistem</h3>
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div key={idx} className="text-sm text-gray-700">{alert}</div>
        ))}
      </div>
    </div>
  );
};