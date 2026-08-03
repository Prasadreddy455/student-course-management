const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc  Get all courses (supports ?search=term)
// @route GET /api/courses
exports.getCourses = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [{ title: regex }, { code: regex }, { instructor: regex }, { description: regex }],
      };
    }
    const courses = await Course.find(query).sort({ createdAt: -1 });

    // Attach enrolled count to each course
    const withCounts = await Promise.all(
      courses.map(async (c) => {
        const count = await Enrollment.countDocuments({ course: c._id });
        return { ...c.toObject(), enrolledCount: count };
      })
    );

    res.json({ courses: withCounts });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single course
// @route GET /api/courses/:id
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (err) {
    next(err);
  }
};

// @desc  Create course (admin)
// @route POST /api/courses
exports.createCourse = async (req, res, next) => {
  try {
    const { title, code, description, instructor, credits, capacity } = req.body;
    if (!title || !code) {
      return res.status(400).json({ message: 'Title and code are required' });
    }
    const course = await Course.create({
      title,
      code,
      description,
      instructor,
      credits,
      capacity,
      createdBy: req.user._id,
    });
    res.status(201).json({ course });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Course code already exists' });
    }
    next(err);
  }
};

// @desc  Update course (admin)
// @route PUT /api/courses/:id
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete course (admin)
// @route DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await Enrollment.deleteMany({ course: course._id });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
};
