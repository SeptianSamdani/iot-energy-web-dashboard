export const AlertCard = ({ alerts }) => {
  const hasAlerts = alerts && alerts.length > 0;

  // Tentukan status utama dari daftar alert (jika ada)
  let mainStatus = "Normal";
  let statusColor = "text-green-600";
  let description = "Semua sistem berjalan dengan normal.";

  if (hasAlerts) {
    const alertText = alerts.join(" ");
    if (alertText.includes("⚠️")) {
      mainStatus = "Peringatan";
      statusColor = "text-amber-600";
      description = "Beberapa parameter berada di luar batas ideal.";
    } else if (alertText.includes("❌") || alertText.includes("🚨")) {
      mainStatus = "Kritis";
      statusColor = "text-red-600";
      description = "Terdeteksi kondisi tidak normal pada sistem.";
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex flex-col justify-center text-center">
      <h3 className="text-md font-normal text-gray-900 tracking-wide mb-3">
        Status Sistem
      </h3>

      <div className={`text-3xl font-bold ${statusColor} mb-4`}>
        {mainStatus}
      </div>

      <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
};
