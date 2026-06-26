export default function BookingList({ bookings, onCancel }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-4">🎾</div>
        <p className="text-lg font-medium text-gray-500">No bookings yet</p>
        <p className="text-sm mt-1">Head to the Courts tab to make your first booking.</p>
      </div>
    );
  }

  const sorted = [...bookings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const now = new Date();

  return (
    <div className="flex flex-col gap-4">
      {sorted.map(b => {
        const bookingDate = new Date(`${b.date}T${b.time}`);
        const isPast = bookingDate < now;
        return (
          <div
            key={b.id}
            className={`bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm ${
              isPast ? 'opacity-60 border-gray-200' : 'border-green-200'
            }`}
          >
            <div className="text-4xl hidden sm:block">🎾</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{b.courtName}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {new Date(b.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}{b.time} – {addHours(b.time, b.duration)}
                {' · '}{b.duration}h
              </p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span>👤 {b.playerName}</span>
                <span>🎾 {b.players} player{b.players > 1 ? 's' : ''}</span>
                {isPast && <span className="text-gray-400 italic">Past</span>}
              </div>
            </div>
            {!isPast && (
              <button
                onClick={() => onCancel(b.id)}
                className="text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function addHours(time, h) {
  const [hh, mm] = time.split(':').map(Number);
  const total = hh + h;
  return `${String(total).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
