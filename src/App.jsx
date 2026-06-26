import { useState } from 'react';
import Header from './components/Header';
import CourtCard from './components/CourtCard';
import BookingModal from './components/BookingModal';
import BookingList from './components/BookingList';
import AuthPage from './components/AuthPage';
import { useBookings } from './hooks/useBookings';
import { useCourts } from './hooks/useCourts';
import { authClient } from './lib/authClient';

export default function App() {
  const { data: session, isPending } = authClient.useSession();
  const [view, setView] = useState('courts');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const { courts, loading: courtsLoading } = useCourts();
  const { bookings, loading: bookingsLoading, addBooking, cancelBooking, isSlotBooked } = useBookings();

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  if (!session) return <AuthPage />;

  async function handleConfirm(booking) {
    await addBooking(booking);
    setView('bookings');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header view={view} onViewChange={setView} user={session.user} />

      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        {view === 'courts' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Courts</h2>
              <p className="text-gray-500 mt-1">Select a court and choose your time slot.</p>
            </div>
            {courtsLoading ? (
              <div className="text-center py-20 text-gray-400">Loading courts…</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {courts.map(court => (
                  <CourtCard key={court.id} court={court} onBook={setSelectedCourt} />
                ))}
              </div>
            )}
          </>
        )}

        {view === 'bookings' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                <p className="text-gray-500 mt-1">
                  {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setView('courts')}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                + New Booking
              </button>
            </div>
            {bookingsLoading ? (
              <div className="text-center py-20 text-gray-400">Loading bookings…</div>
            ) : (
              <BookingList bookings={bookings} onCancel={cancelBooking} />
            )}
          </>
        )}
      </main>

      {selectedCourt && (
        <BookingModal
          court={selectedCourt}
          isSlotBooked={isSlotBooked}
          onConfirm={handleConfirm}
          onClose={() => setSelectedCourt(null)}
          user={session.user}
        />
      )}
    </div>
  );
}
