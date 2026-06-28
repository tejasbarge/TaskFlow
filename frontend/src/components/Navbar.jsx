import React from 'react';
import { Plus, CheckSquare } from 'lucide-react';

function Navbar({ onAddTaskClick, tasks = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <nav className="navbar">
      <div className="logo">
        <CheckSquare className="logo-icon" size={28} />
        <span>TaskFlow</span>
      </div>

      <div className="nav-actions">
        {totalTasks > 0 && (
          <div className="stats-summary">
            <div className="stat-item" title="All Tasks">
              <span>All: <strong>{totalTasks}</strong></span>
            </div>
            <div className="stat-item" title="Pending or In Progress">
              <span className="stat-dot pending"></span>
              <span>Active: <strong>{pendingTasks}</strong></span>
            </div>
            <div className="stat-item" title="Completed Tasks">
              <span className="stat-dot completed"></span>
              <span>Completed: <strong>{completedTasks}</strong></span>
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={onAddTaskClick}>
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
