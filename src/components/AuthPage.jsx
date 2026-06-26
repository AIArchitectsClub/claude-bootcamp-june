import { useState } from 'react';
import { authClient } from '../lib/authClient';

export default function AuthPage() {
  const [tab, setTab] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function switchTab(t) {
    setTab(t);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'signin') {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) setError(error.message);
      } else {
        const { error } = await authClient.signUp.email({ email, password, name });
        if (error) setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎾</div>
          <h1 className="text-2xl font-bold text-gray-900">Court Booker</h1>
          <p className="text-sm text-gray-500 mt-1">Book your court, play your game</p>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => switchTab('signin')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'signin' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Smith"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors mt-1"
          >
            {loading
              ? (tab === 'signin' ? 'Signing in…' : 'Creating account…')
              : (tab === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
