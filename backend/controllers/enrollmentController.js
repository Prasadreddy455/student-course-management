const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc  Enroll current student in a course
// @route POST /api/enrollments/:courseId
exports.enroll = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const count = await Enrollment.countDocuments({ course: courseId });
    if (count >= course.capacity) {
      return res.status(400).json({ message: 'Course is at full capacity' });
    }

    const exists = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (exists) return res.status(400).json({ message: 'Already enrolled in this course' });

    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
    res.status(201).json({ enrollment });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    next(err);
  }
};

// @desc  Unenroll current student from a course
// @route DELETE /api/enrollments/:courseId
exports.unenroll = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const result = await Enrollment.findOneAndDelete({ student: req.user._id, course: courseId });
    if (!result) return res.status(404).json({ message: 'Enrollment not found' });
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get current student's enrollments
// @route GET /api/enrollments/me
exports.myEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate('course');
    res.json({ enrollments });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all enrollments (admin)
// @route GET /api/enrollments
exports.allEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title code');
    res.json({ enrollments });
  } catch (err) {
    next(err);
  }
};
