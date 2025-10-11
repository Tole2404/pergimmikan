import React, { useState, useEffect } from 'react';
import NotificationService from '../../utils/notificationService';

const NotificationDebug = () => {
  const [debug, setDebug] = useState({
    token: null,
    user: null,
    count: 0,
    notifications: [],
    error: null
  });

  useEffect(() => {
    const checkNotifications = async () => {
      // Check localStorage
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('user');
      
      console.log('🔍 DEBUG INFO:');
      console.log('Token:', token);
      console.log('AdminToken:', adminToken);
      console.log('User:', userStr);
      
      setDebug(prev => ({
        ...prev,
        token: token || adminToken,
        user: userStr ? JSON.parse(userStr) : null
      }));

      if (!token && !adminToken) {
        setDebug(prev => ({
          ...prev,
          error: 'No token found. Please login first.'
        }));
        return;
      }

      // Try to fetch notifications
      try {
        const count = await NotificationService.getUnreadCount();
        const data = await NotificationService.getNotifications(10);
        
        console.log('📊 Unread Count:', count);
        console.log('📋 Notifications:', data);
        
        setDebug(prev => ({
          ...prev,
          count,
          notifications: data?.notifications || [],
          error: null
        }));
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        setDebug(prev => ({
          ...prev,
          error: error.message
        }));
      }
    };

    checkNotifications();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: 'white',
      border: '2px solid #333',
      borderRadius: 8,
      padding: 20,
      maxWidth: 400,
      maxHeight: 500,
      overflow: 'auto',
      zIndex: 9999,
      fontSize: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>🔔 Notification Debug</h3>
      
      <div style={{ marginBottom: 10 }}>
        <strong>Token:</strong> {debug.token ? '✅ Found' : '❌ Not Found'}
      </div>
      
      <div style={{ marginBottom: 10 }}>
        <strong>User:</strong> {debug.user ? `✅ ${debug.user.username}` : '❌ Not Found'}
      </div>
      
      <div style={{ marginBottom: 10 }}>
        <strong>Unread Count:</strong> {debug.count}
      </div>
      
      {debug.error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: 10, 
          borderRadius: 4,
          marginBottom: 10
        }}>
          <strong>Error:</strong> {debug.error}
        </div>
      )}
      
      <div>
        <strong>Notifications ({debug.notifications.length}):</strong>
        {debug.notifications.length === 0 ? (
          <div style={{ color: '#999', marginTop: 5 }}>No notifications</div>
        ) : (
          <div style={{ marginTop: 5 }}>
            {debug.notifications.slice(0, 3).map(notif => (
              <div key={notif.id} style={{ 
                background: '#f5f5f5', 
                padding: 8, 
                marginBottom: 5,
                borderRadius: 4
              }}>
                <div style={{ fontWeight: 'bold' }}>{notif.title}</div>
                <div style={{ fontSize: 11, color: '#666' }}>
                  {notif.message.substring(0, 50)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button 
          onClick={() => {
            window.dispatchEvent(new Event('notificationRefresh'));
            window.location.reload();
          }}
          style={{
            flex: 1,
            padding: '8px 16px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          🔄 Refresh Notif
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{
            flex: 1,
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          🔃 Refresh Page
        </button>
      </div>
    </div>
  );
};

export default NotificationDebug;
