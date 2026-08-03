import { useAuth } from '../context/AuthContext';

export default function CourseCard({ course, isEnrolled, onEnroll, onUnenroll, onEdit, onDelete }) {
  const { user } = useAuth();
  const full = course.enrolledCount >= course.capacity;

  return (
    <div className="course-card">
      <div className="course-card-header">
        <h3>{course.title}</h3>
        <span className="course-code">{course.code}</span>
      </div>
      <p className="course-desc">{course.description || 'No description provided.'}</p>
      <div className="course-meta">
        <span>Instructor: {course.instructor}</span>
        <span>Credits: {course.credits}</span>
        <span>
          Enrolled: {course.enrolledCount}/{course.capacity}
        </span>
      </div>
      <div className="course-actions">
        {user?.role === 'student' &&
          (isEnrolled ? (
            <button className="btn btn-secondary" onClick={() => onUnenroll(course._id)}>
              Unenroll
            </button>
          ) : (
            <button className="btn btn-primary" disabled={full} onClick={() => onEnroll(course._id)}>
              {full ? 'Full' : 'Enroll'}
            </button>
          ))}
        {user?.role === 'admin' && (
          <>
            <button className="btn btn-secondary" onClick={() => onEdit(course)}>Edit</button>
            <button className="btn btn-danger" onClick={() => onDelete(course._id)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
