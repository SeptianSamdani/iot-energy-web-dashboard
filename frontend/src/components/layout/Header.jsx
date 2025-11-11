export default function Header({ lastUpdate }) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Monitoring Daya Listrik</h2>
        <div className="text-sm text-gray-500">
          Update terakhir: {lastUpdate ? new Date(lastUpdate).toLocaleString('id-ID') : '-'}
        </div>
      </div>
    </div>
  );
}