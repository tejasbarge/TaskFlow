import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import Notification from './components/Notification';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering & Searching States
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Notification Queue State
  const [notifications, setNotifications] = useState([]);

  // Fetch all tasks from backend API
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks from the server');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError(
        'Could not connect to the backend server. Please verify the backend is running on port 5000 and MongoDB is active.'
      );
      addNotification('Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Helper helper to queue notifications
  const addNotification = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Add a task
  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      const newTask = await response.json();
      // Dynamically prepend new task to state
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      setIsModalOpen(false);
      addNotification(`Task "${newTask.title}" created successfully!`, 'success');
    } catch (err) {
      addNotification(err.message, 'error');
    }
  };

  // Edit details of a task
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }

      const updatedTask = await response.json();
      // Dynamically update task in local state array
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
      setIsModalOpen(false);
      setEditingTask(null);
      addNotification(`Task "${updatedTask.title}" updated!`, 'success');
    } catch (err) {
      addNotification(err.message, 'error');
    }
  };

  // Change task status quickly
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      const updatedTask = await response.json();
      // Update state
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === id ? updatedTask : t))
      );
      addNotification(`Status updated to "${newStatus}"`, 'success');
    } catch (err) {
      addNotification(err.message, 'error');
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }

      // Remove from local state
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      addNotification('Task deleted successfully', 'success');
    } catch (err) {
      addNotification(err.message, 'error');
    }
  };

  // Prepare modal for creating
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Prepare modal for editing
  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle modal submit
  const handleModalSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  // Filter tasks based on Search Query and Status Tabs
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = activeFilter === 'All' || task.status === activeFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="app-container">
      {/* Navigation and Counters */}
      <Navbar onAddTaskClick={openCreateModal} tasks={tasks} />

      {/* Tool bar: Status filters & Search inputs */}
      <div className="toolbar">
        <div className="filter-group">
          {['All', 'Pending', 'In Progress', 'Completed'].map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading state, errors or the list */}
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: 'var(--color-danger)' }}>
          <h3 style={{ color: 'var(--color-danger)' }}>Connection Error</h3>
          <p style={{ maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchTasks}>
            Retry Connection
          </button>
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTaskClick={openCreateModal}
        />
      )}

      {/* Unified Create/Edit Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
        editingTask={editingTask}
      />

      {/* Corner Notifications Toast alerts */}
      <Notification notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
}

export default App;
