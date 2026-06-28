import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

function TaskFormModal({ isOpen, onClose, onSubmit, editingTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setStatus(editingTask.status || 'Pending');
      // Format date to YYYY-MM-DD for input type="date"
      if (editingTask.dueDate) {
        setDueDate(new Date(editingTask.dueDate).toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    } else {
      // Clear fields for new task creation
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setDueDate('');
    }
    setErrors({});
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form Validation
    const validationErrors = {};
    if (!title || title.trim() === '') {
      validationErrors.title = 'Task title is required';
    } else if (title.length > 100) {
      validationErrors.title = 'Title cannot exceed 100 characters';
    }

    if (description && description.length > 500) {
      validationErrors.description = 'Description cannot exceed 500 characters';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit valid task details
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      dueDate: dueDate || null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingTask ? 'Edit Task Details' : 'Create New Task'}
          </h3>
          <button className="btn-icon" onClick={onClose} title="Close Modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">
              Title *
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="e.g. Complete math assignment"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: null }));
                }
              }}
            />
            {errors.title && (
              <span className="form-error">
                <AlertCircle size={14} />
                {errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              className="form-textarea"
              placeholder="Describe the task details..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: null }));
                }
              }}
            />
            {errors.description && (
              <span className="form-error">
                <AlertCircle size={14} />
                {errors.description}
              </span>
            )}
          </div>

          {/* Grid Layout for Status and Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Status */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">
                Status
              </label>
              <select
                id="task-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-due-date">
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;
