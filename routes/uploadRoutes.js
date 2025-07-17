const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @route POST /api/upload
// @access Private
router.post('/', protect, upload.single('file'), (req, res) => {
  res.status(200).json({
    success: true,
    filePath: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
