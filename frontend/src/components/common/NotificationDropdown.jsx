import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../../utils/notificationService';
import { toast } from 'react-toastify';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    const data = await NotificationService.getNotifications(20);
    if (data) {
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    }
    setLoading(false);
  };

  // Fetch unread count (for polling)
  const fetchUnreadCount = async () => {
    const count = await NotificationService.getUnreadCount();
    setUnreadCount(count);
  };

  // Initial fetch
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    if (token || adminToken) {
      fetchUnreadCount();
      
      // Poll every 10 seconds (faster for better UX)
      const interval = setInterval(fetchUnreadCount, 10000);
      
      // Listen for custom notification refresh event
      const handleNotificationRefresh = () => {
        fetchUnreadCount();
      };
      window.addEventListener('notificationRefresh', handleNotificationRefresh);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationRefresh', handleNotificationRefresh);
      };
    }
  }, []);

  // Fetch full notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await NotificationService.markAsRead(notification.id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
    }

    // Navigate to link if exists
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    const success = await NotificationService.markAllAsRead();
    if (success) {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    }
  };

  // Delete notification
  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    
    const success = await NotificationService.deleteNotification(notificationId);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'journey':
        return '📖';
      case 'comment':
        return '💬';
      case 'savings':
        return '💰';
      case 'event':
        return '📅';
      case 'activity':
        return '🎯';
      case 'team':
        return '👥';
      default:
        return '🔔';
    }
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button 
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-menu">
          <div className="notification-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && unreadCount > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="empty-icon">🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{formatTimeAgo(notification.created_at)}</div>
                  </div>
                  <button
                    className="notification-delete"
                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                    aria-label="Delete notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
