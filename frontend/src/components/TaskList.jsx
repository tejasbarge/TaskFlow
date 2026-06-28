import React from 'react';
import TaskCard from './TaskCard';
import { ClipboardList, Plus } from 'lucide-react';

function TaskList({ tasks, onEdit, onDelete, onStatusChange, onAddTaskClick }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList className="empty-state-icon" />
        <h3>No tasks found</h3>
        <p>Stay organized by adding tasks for your day, week, or project.</p>
        <button className="btn btn-primary" onClick={onAddTaskClick}>
          <Plus size={16} />
          <span>Create your first task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

export default TaskList;
