import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

function Notification({ notifications = [], onDismiss }) {
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      const timer = setTimeout(() => {
        onDismiss(latest.id);
      }, 4000); // Auto-dismiss after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [notifications, onDismiss]);

  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className="notifications-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification-toast ${n.type || 'info'}`}>
          {getIcon(n.type)}
          <span style={{ fontSize: '0.85rem', flexGrow: 1 }}>{n.message}</span>
          <button
            className="btn-icon"
            style={{ padding: '0.2rem', marginLeft: '0.5rem' }}
            onClick={() => onDismiss(n.id)}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notification;
