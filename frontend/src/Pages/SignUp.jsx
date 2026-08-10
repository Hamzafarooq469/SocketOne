import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../Services/Firebase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/api/user/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || email.split('@')[0],
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          token
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Backend sign up failed');
      }

      console.log('Signed up successfully:', data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/api/user/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName || result.user.email.split('@')[0],
          email: result.user.email,
          uid: result.user.uid,
          token
        })
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Registered with Google successfully:', data);
        navigate('/');
        return;
      }

      // If user already exists in backend, attempt sign-in instead
      if (response.status === 400 && data.message?.includes('already exists')) {
        const signInRes = await fetch(`${BACKEND_URL}/api/user/signIn`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: token })
        });
        const signInData = await signInRes.json();
        if (!signInRes.ok) {
          throw new Error(signInData.message || 'Backend authentication failed');
        }
        console.log('Signed in with Google successfully:', signInData);
        navigate('/');
        return;
      }

      throw new Error(data.message || 'Backend sign up failed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>
      {error && <div style={{ color: 'red', margin: '0.5rem 0', fontSize: '0.875rem' }}>{error}</div>}
      <form onSubmit={handleSignUp} style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          {loading ? 'Creating Account...' : 'Sign Up with Email'}
        </button>
      </form>

      <div style={{ margin: '1rem 0', textAlign: 'center', color: '#888' }}>OR</div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="btn"
        style={{ width: '100%', backgroundColor: '#4285F4' }}
        disabled={loading}
      >
        Sign Up with Google
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
        Already have an account? <Link to="/signup">Sign In</Link>
      </p>
    </div>
  );
}

export default SignUp;
