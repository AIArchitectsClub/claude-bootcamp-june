import { SURFACE_COLORS } from '../data/courts';

const SURFACE_ICONS = { Hard: '🔵', Clay: '🟠', Grass: '🟢' };

export default function CourtCard({ court, onBook }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="bg-green-100 h-36 flex items-center justify-center text-6xl">
        🎾
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{court.name}</h2>
        <p className="text-sm text-gray-500">{court.description}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${SURFACE_COLORS[court.surface]}`}>
            {SURFACE_ICONS[court.surface]} {court.surface}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${court.indoor ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800'}`}>
            {court.indoor ? '🏠 Indoor' : '☀️ Outdoor'}
          </span>
          {court.lights && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              💡 Floodlit
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700">
            £{court.pricePerHour} <span className="font-normal text-gray-400">/ hr</span>
          </span>
          <button
            onClick={() => onBook(court)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
