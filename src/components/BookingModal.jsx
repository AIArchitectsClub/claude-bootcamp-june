import { useState } from 'react';
import { TIME_SLOTS } from '../data/courts';

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export default function BookingModal({ court, isSlotBooked, onConfirm, onClose, user }) {
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [playerName, setPlayerName] = useState(user?.name || '');
  const [players, setPlayers] = useState(2);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!time) return setError('Please select a time slot.');
    if (!playerName.trim()) return setError('Please enter your name.');

    for (let i = 0; i < duration; i++) {
      const slotIndex = TIME_SLOTS.indexOf(time) + i;
      if (slotIndex >= TIME_SLOTS.length) return setError('Not enough consecutive slots for that duration.');
      if (isSlotBooked(court.id, date, TIME_SLOTS[slotIndex])) {
        return setError(`Slot ${TIME_SLOTS[slotIndex]} is already taken.`);
      }
    }

    setSubmitting(true);
    setError('');
    try {
      await onConfirm({ courtId: court.id, courtName: court.name, date, time, duration, playerName: playerName.trim(), players });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const totalPrice = court.pricePerHour * duration;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Book {court.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="e.g. Alex Smith"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              min={todayISO()}
              onChange={e => { setDate(e.target.value); setTime(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => {
                const booked = isSlotBooked(court.id, date, slot);
                const selected = slot === time;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={booked}
                    onClick={() => setTime(slot)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                      booked
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                        : selected
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Players</label>
              <select
                value={players}
                onChange={e => setPlayers(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} player{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="bg-green-50 rounded-lg px-4 py-3 flex justify-between items-center text-sm">
            <span className="text-gray-600">Total</span>
            <span className="font-semibold text-green-700 text-base">£{totalPrice}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {submitting ? 'Booking…' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
