import { authClient } from '../lib/authClient';

export default function Header({ view, onViewChange, user }) {
  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎾</span>
          <h1 className="text-xl font-bold tracking-tight">Court Booker</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex gap-1">
            <button
              onClick={() => onViewChange('courts')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'courts'
                  ? 'bg-white text-green-700'
                  : 'text-green-100 hover:bg-green-600'
              }`}
            >
              Courts
            </button>
            <button
              onClick={() => onViewChange('bookings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'bookings'
                  ? 'bg-white text-green-700'
                  : 'text-green-100 hover:bg-green-600'
              }`}
            >
              My Bookings
            </button>
          </nav>
          <div className="flex items-center gap-2 ml-3 pl-3 border-l border-green-600">
            <span className="text-sm text-green-100 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-green-100 hover:bg-green-600 px-3 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
