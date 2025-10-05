'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic
    alert(`Login attempted for user: ${username}`);
    // TODO: Hook into Supabase Auth
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: '0 auto' }}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}