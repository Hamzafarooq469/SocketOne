import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <h1>404</h1>
      <p style={{ margin: '1rem 0' }}>Page not found.</p>
      <Link to="/" className="btn">Back to Home</Link>
    </div>
  );
}

export default NotFound;
