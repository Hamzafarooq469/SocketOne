import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../Services/Firebase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/api/user/signIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Backend sign in failed');
      }

      console.log('Signed in successfully:', data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/api/user/signIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Signed in with Google successfully:', data);
        navigate('/');
        return;
      }

      // If user not found in database (401), automatically register them in backend
      if (response.status === 401) {
        const signUpRes = await fetch(`${BACKEND_URL}/api/user/signUp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: result.user.displayName || result.user.email.split('@')[0],
            email: result.user.email,
            uid: result.user.uid,
            token: idToken
          })
        });
        const signUpData = await signUpRes.json();
        if (!signUpRes.ok) {
          throw new Error(signUpData.message || 'Backend sign up failed');
        }
        console.log('Registered and signed in with Google successfully:', signUpData);
        navigate('/');
        return;
      }

      throw new Error(data.message || 'Backend authentication failed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Sign In</h2>
      {error && <div style={{ color: 'red', margin: '0.5rem 0', fontSize: '0.875rem' }}>{error}</div>}
      <form onSubmit={handleEmailSignIn} style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In with Email'}
        </button>
      </form>

      <div style={{ margin: '1rem 0', textAlign: 'center', color: '#888' }}>OR</div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="btn"
        style={{ width: '100%', backgroundColor: '#4285F4' }}
        disabled={loading}
      >
        Sign In with Google
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
        Need an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default SignIn;
