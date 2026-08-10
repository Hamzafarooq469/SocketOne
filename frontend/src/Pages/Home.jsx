import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Services/Firebase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch(`${BACKEND_URL}/api/user/signOut`, { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <h1>Welcome to SocketOne</h1>
      {currentUser ? (
        <div>
          <p style={{ margin: '1rem 0', color: '#333' }}>
            Logged in as: <strong>{currentUser.email}</strong> ({currentUser.displayName || 'No display name'})
          </p>
          <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#d9534f' }}>
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p style={{ margin: '1rem 0 2rem', color: '#666' }}>
            Real-time communication app.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/signin" className="btn">Sign In</Link>
            <Link to="/signup" className="btn">Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
