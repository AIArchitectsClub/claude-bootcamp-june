import { useState, useEffect } from 'react';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function addBooking(booking) {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create booking.');
    }
    const newBooking = await res.json();
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  }

  async function cancelBooking(id) {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    setBookings(prev => prev.filter(b => b.id !== id));
  }

  function isSlotBooked(courtId, date, time) {
    return bookings.some(b => b.courtId === courtId && b.date === date && b.time === time);
  }

  return { bookings, loading, addBooking, cancelBooking, isSlotBooked };
}
