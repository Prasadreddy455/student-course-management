const express = require('express');
const router = express.Router();
const {
  enroll,
  unenroll,
  myEnrollments,
  allEnrollments,
} = require('../controllers/enrollmentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/me', protect, myEnrollments);
router.get('/', protect, adminOnly, allEnrollments);
router.post('/:courseId', protect, enroll);
router.delete('/:courseId', protect, unenroll);

module.exports = router;
