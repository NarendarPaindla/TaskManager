const Task = require('../models/Task');
const sendEmail = require('../utils/sendEmail');
// @desc    Get all tasks
// @route   GET /api/tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const { completed, search, sort, page = 1, limit = 5 } = req.query;

    // Build query object
    const queryObject = { user: req.user._id };

    if (completed) {
      queryObject.completed = completed === 'true';
    }

    if (search) {
      queryObject.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Base query
    let query = Task.find(queryObject);

    // Sorting
    if (sort) {
      const sortList = sort.split(',').join(' ');
      query = query.sort(sortList); // e.g., "createdAt,-title"
    } else {
      query = query.sort('-createdAt'); // default: newest first
    }

    // Pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(Number(limit));

    const tasks = await query;

    res.status(200).json({
      success: true,
      count: tasks.length,
      page: Number(page),
      limit: Number(limit),
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};



// @desc    Get single task by ID
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found or not authorized');
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};


// @desc    Create a task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });

    // Send email
    await sendEmail({
      email: req.user.email,
      subject: `✅ Task Created: ${task.title}`,
      message: `
        <h3>Your Task Has Been Created</h3>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description || 'N/A'}</p>
        <p><strong>Status:</strong> ${task.completed ? '✅ Completed' : '❌ Not Completed'}</p>
      `,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404);
      throw new Error('Task not found or not authorized');
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};


// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found or not authorized');
    }

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

