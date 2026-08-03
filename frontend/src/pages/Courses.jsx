import { useEffect, useState } from 'react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const fetchCourses = async (term = '') => {
    const res = await api.get('/courses', { params: { search: term } });
    setCourses(res.data.courses);
  };

  const fetchMyEnrollments = async () => {
    if (user?.role !== 'student') return;
    const res = await api.get('/enrollments/me');
    setMyEnrollments(res.data.enrollments.map((e) => e.course._id));
  };

  useEffect(() => {
    fetchCourses();
    fetchMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchCourses(search);
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/enrollments/${courseId}`);
      setMessage('Enrolled successfully!');
      await fetchCourses(search);
      await fetchMyEnrollments();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enroll failed');
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      await api.delete(`/enrollments/${courseId}`);
      setMessage('Unenrolled.');
      await fetchCourses(search);
      await fetchMyEnrollments();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unenroll failed');
    }
  };

  return (
    <div className="page">
      <h1>Available Courses</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title, code, or instructor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      {message && <div className="info-msg">{message}</div>}
      <div className="course-grid">
        {courses.length === 0 && <p>No courses found.</p>}
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            isEnrolled={myEnrollments.includes(course._id)}
            onEnroll={handleEnroll}
            onUnenroll={handleUnenroll}
          />
        ))}
      </div>
    </div>
  );
}
