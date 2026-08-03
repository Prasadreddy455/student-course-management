import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">SCMS</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/courses">Courses</Link>
            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            <span className="nav-user">Hi, {user.name} ({user.role})</span>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
