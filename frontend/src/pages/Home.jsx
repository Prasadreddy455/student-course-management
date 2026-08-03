import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="page home-page">
      <h1>Student Course Management System</h1>
      <p>Manage courses, enrollments, and students — all in one place.</p>
      {user ? (
        <Link className="btn btn-primary" to="/courses">Go to Courses</Link>
      ) : (
        <div className="home-actions">
          <Link className="btn btn-primary" to="/signup">Get Started</Link>
          <Link className="btn btn-secondary" to="/login">Login</Link>
        </div>
      )}
    </div>
  );
}
