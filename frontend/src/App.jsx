
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Chat from './Pages/Chat';
import NotFound from './Pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" className="app-logo">SocketOne</Link>
          <nav className="app-nav">
            <Link to="/">Home</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;

