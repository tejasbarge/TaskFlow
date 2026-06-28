import React from 'react';
import { Calendar, Edit, Trash2, AlertCircle } from 'lucide-react';

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { _id, title, description, status, dueDate } = task;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!dueDate || status === 'Completed') return false;
    // Set hours to 0 to compare days rather than exact times
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const overdue = isOverdue();

  return (
    <div className={`task-card ${status.toLowerCase().replace(' ', '-')}`}>
      <div>
        <div className="task-header">
          <h4 className="task-title" title={title}>{title}</h4>
          <span className="task-status-badge">{status}</span>
        </div>
        <p className="task-description">
          {description || 'No description provided.'}
        </p>
      </div>

      <div className="task-footer">
        <div className={`task-date ${overdue ? 'overdue' : ''}`} title={overdue ? 'Task is overdue!' : 'Due Date'}>
          {overdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
          <span>{formatDate(dueDate)}</span>
        </div>

        <div className="task-actions">
          {/* Status Quick Select */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
            value={status}
            onChange={(e) => onStatusChange(_id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Edit Button */}
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit size={16} />
          </button>

          {/* Delete Button */}
          <button
            className="btn-icon delete"
            onClick={() => onDelete(_id)}
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
