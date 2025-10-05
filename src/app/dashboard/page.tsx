'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        window.location.href = '/admin';
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin';
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Logged in as: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}