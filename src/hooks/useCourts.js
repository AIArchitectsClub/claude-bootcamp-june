import { useState, useEffect } from 'react';

export function useCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courts')
      .then(r => r.json())
      .then(setCourts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { courts, loading };
}
