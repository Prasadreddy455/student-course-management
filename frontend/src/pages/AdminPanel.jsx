import { useEffect, useState } from 'react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';

const emptyForm = { title: '', code: '', description: '', instructor: '', credits: 3, capacity: 30 };

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('courses');

  const fetchCourses = async () => {
    const res = await api.get('/courses');
    setCourses(res.data.courses);
  };

  const fetchEnrollments = async () => {
    const res = await api.get('/enrollments');
    setEnrollments(res.data.enrollments);
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'credits' || name === 'capacity' ? Number(value) : value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, form);
        setMessage('Course updated.');
      } else {
        await api.post('/courses', form);
        setMessage('Course created.');
      }
      resetForm();
      await fetchCourses();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      code: course.code,
      description: course.description,
      instructor: course.instructor,
      credits: course.credits,
      capacity: course.capacity,
    });
    setTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This will also remove its enrollments.')) return;
    try {
      await api.delete(`/courses/${id}`);
      setMessage('Course deleted.');
      await fetchCourses();
      await fetchEnrollments();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="page">
      <h1>Admin Panel</h1>
      <div className="tabs">
        <button className={tab === 'courses' ? 'tab active' : 'tab'} onClick={() => setTab('courses')}>Manage Courses</button>
        <button className={tab === 'enrollments' ? 'tab active' : 'tab'} onClick={() => setTab('enrollments')}>All Enrollments</button>
      </div>

      {message && <div className="info-msg">{message}</div>}

      {tab === 'courses' && (
        <>
          <form className="course-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Course' : 'Add New Course'}</h3>
            <div className="form-grid">
              <input name="title" placeholder="Course title" value={form.title} onChange={handleChange} required />
              <input name="code" placeholder="Course code (e.g. CS101)" value={form.code} onChange={handleChange} required />
              <input name="instructor" placeholder="Instructor" value={form.instructor} onChange={handleChange} />
              <input name="credits" type="number" min="1" placeholder="Credits" value={form.credits} onChange={handleChange} />
              <input name="capacity" type="number" min="1" placeholder="Capacity" value={form.capacity} onChange={handleChange} />
            </div>
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Add'} Course</button>
              {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
            </div>
          </form>

          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}

      {tab === 'enrollments' && (
        <table className="enroll-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Course</th>
              <th>Code</th>
              <th>Enrolled On</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e._id}>
                <td>{e.student?.name}</td>
                <td>{e.student?.email}</td>
                <td>{e.course?.title}</td>
                <td>{e.course?.code}</td>
                <td>{new Date(e.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
