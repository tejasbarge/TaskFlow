const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// @desc    Get all tasks (sorted by newest first)
// @route   GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Get a single task
// @route   GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Create a new task
// @route   POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = new Task({
      title,
      description,
      status,
      dueDate: dueDate || undefined
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Validation error: ' + error.message });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Apply updates if they are provided in request body
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ message: 'Task title cannot be empty' });
      }
      task.title = title;
    }
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(400).json({ message: 'Validation error: ' + error.message });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed successfully', id: req.params.id });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
