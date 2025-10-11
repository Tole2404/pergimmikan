const Notification = require('../models/notification.model');
const User = require('../models/user.model');

class NotificationHelper {
  // Notification types
  static TYPES = {
    JOURNEY: 'journey',
    COMMENT: 'comment',
    SAVINGS: 'savings',
    EVENT: 'event',
    ACTIVITY: 'activity',
    TEAM: 'team',
    GALLERY: 'gallery',
    LEGACY: 'legacy',
    QUOTE: 'quote',
    SYSTEM: 'system'
  };

  // Send notification to a single user
  static async sendToUser(userId, { type, title, message, link = null }) {
    try {
      await Notification.create({
        user_id: userId,
        type,
        title,
        message,
        link
      });
      return true;
    } catch (error) {
      console.error('Error sending notification to user:', error);
      return false;
    }
  }

  // Send notification to multiple users
  static async sendToUsers(userIds, { type, title, message, link = null }) {
    try {
      await Notification.createForMultipleUsers(userIds, {
        type,
        title,
        message,
        link
      });
      return true;
    } catch (error) {
      console.error('Error sending notification to users:', error);
      return false;
    }
  }

  // Send notification to all users
  static async sendToAllUsers({ type, title, message, link = null }) {
    try {
      const users = await User.findAll();
      const userIds = users.map(user => user.id);
      
      if (userIds.length === 0) return false;
      
      await Notification.createForMultipleUsers(userIds, {
        type,
        title,
        message,
        link
      });
      return true;
    } catch (error) {
      console.error('Error sending notification to all users:', error);
      return false;
    }
  }

  // Journey notifications
  static async notifyNewJourney(journeyId, journeyTitle, authorName) {
    return await this.sendToAllUsers({
      type: this.TYPES.JOURNEY,
      title: 'New Journey Posted! 📖',
      message: `${authorName} just shared a new journey: "${journeyTitle}"`,
      link: `/journey/${journeyId}`
    });
  }

  // Savings notifications
  static async notifySavingsUpdate(userId, amount, type = 'deposit') {
    const message = type === 'deposit' 
      ? `Your deposit of Rp ${amount.toLocaleString('id-ID')} has been recorded`
      : `Your withdrawal of Rp ${amount.toLocaleString('id-ID')} has been processed`;

    return await this.sendToUser(userId, {
      type: this.TYPES.SAVINGS,
      title: 'Savings Update 💰',
      message,
      link: '/savings'
    });
  }

  // Event notifications
  static async notifyNewEvent(eventTitle, eventDate) {
    return await this.sendToAllUsers({
      type: this.TYPES.EVENT,
      title: 'New Event Scheduled! 📅',
      message: `"${eventTitle}" is scheduled for ${eventDate}`,
      link: '/events'
    });
  }

  static async notifyEventReminder(eventTitle, daysUntil) {
    const message = daysUntil === 0 
      ? `"${eventTitle}" is happening today!`
      : `"${eventTitle}" is coming up in ${daysUntil} day${daysUntil > 1 ? 's' : ''}!`;

    return await this.sendToAllUsers({
      type: this.TYPES.EVENT,
      title: 'Event Reminder 📅',
      message,
      link: '/events'
    });
  }

  // Activity notifications
  static async notifyNewActivity(activityTitle) {
    return await this.sendToAllUsers({
      type: this.TYPES.ACTIVITY,
      title: 'New Activity Posted! 🎯',
      message: `Check out our latest activity: "${activityTitle}"`,
      link: '/activities'
    });
  }

  // Gallery notifications
  static async notifyNewGallery(photoCount) {
    return await this.sendToAllUsers({
      type: this.TYPES.GALLERY,
      title: 'New Photos Added! 📸',
      message: `${photoCount} new photo${photoCount > 1 ? 's' : ''} added to the gallery`,
      link: '/#gallery'
    });
  }

  // Team notifications
  static async notifyNewTeamMember(memberName) {
    return await this.sendToAllUsers({
      type: this.TYPES.TEAM,
      title: 'New Team Member! 👥',
      message: `Welcome ${memberName} to the team!`,
      link: '/team'
    });
  }

  // Quote notifications
  static async notifyNewQuote(quote, author) {
    return await this.sendToAllUsers({
      type: this.TYPES.QUOTE,
      title: 'Quote of the Day 💭',
      message: `"${quote}" - ${author}`,
      link: '/#quotes'
    });
  }

  // System notifications
  static async notifySystemMessage(userId, message) {
    return await this.sendToUser(userId, {
      type: this.TYPES.SYSTEM,
      title: 'System Notification',
      message,
      link: null
    });
  }

  // Welcome notification for new users
  static async sendWelcomeNotification(userId, username) {
    return await this.sendToUser(userId, {
      type: this.TYPES.SYSTEM,
      title: 'Welcome to PERGIMMIKAN! 🎉',
      message: `Hi ${username}! Thanks for joining us. Explore our journey, activities, and connect with the team!`,
      link: '/'
    });
  }
}

module.exports = NotificationHelper;
