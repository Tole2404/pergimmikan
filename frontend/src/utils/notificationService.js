const API_URL = import.meta.env.VITE_API_URL;

class NotificationService {
  // Helper to get token (check both token and adminToken)
  static getToken() {
    return localStorage.getItem('token') || localStorage.getItem('adminToken');
  }

  // Get all notifications
  static async getNotifications(limit = 50) {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/api/notifications?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return null;
    }
  }

  // Get unread notifications
  static async getUnreadNotifications(limit = 50) {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/api/notifications/unread?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch unread notifications');

      return await response.json();
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return null;
    }
  }

  // Get unread count
  static async getUnreadCount() {
    const token = this.getToken();
    
    if (!token) {
      return 0;
    }

    try {
      const response = await fetch(`${API_URL}/api/notifications/unread/count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId) {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Delete all read notifications
  static async deleteAllRead() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/api/notifications/read/all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      return false;
    }
  }
}

export default NotificationService;
