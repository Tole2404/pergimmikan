const API_URL = import.meta.env.VITE_API_URL;

class CommentService {
  // Helper to get token
  static getToken() {
    return localStorage.getItem('token') || localStorage.getItem('adminToken');
  }

  // Get comments for content
  static async getComments(contentType, contentId) {
    try {
      const response = await fetch(`${API_URL}/api/comments/${contentType}/${contentId}`);
      
      if (!response.ok) throw new Error('Failed to fetch comments');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  // Get comment count
  static async getCommentCount(contentType, contentId) {
    try {
      const response = await fetch(`${API_URL}/api/comments/${contentType}/${contentId}/count`);
      
      if (!response.ok) throw new Error('Failed to fetch comment count');
      
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching comment count:', error);
      return 0;
    }
  }

  // Create comment
  static async createComment(contentType, contentId, comment, parentId = null) {
    const token = this.getToken();
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          comment,
          parent_id: parentId
        })
      });

      if (!response.ok) throw new Error('Failed to create comment');

      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  // Update comment
  static async updateComment(commentId, comment) {
    const token = this.getToken();
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment })
      });

      if (!response.ok) throw new Error('Failed to update comment');

      return await response.json();
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  // Delete comment
  static async deleteComment(commentId) {
    const token = this.getToken();
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Get reaction summary
  static async getReactionSummary(contentType, contentId) {
    try {
      const token = this.getToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(
        `${API_URL}/api/comments/reactions/${contentType}/${contentId}`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to fetch reactions');

      return await response.json();
    } catch (error) {
      console.error('Error fetching reactions:', error);
      return { like: 0, love: 0, laugh: 0, wow: 0, sad: 0, angry: 0, total: 0, userReaction: null };
    }
  }

  // Add or update reaction
  static async addReaction(contentType, contentId, reactionType) {
    const token = this.getToken();
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_URL}/api/comments/reactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          reaction_type: reactionType
        })
      });

      if (!response.ok) throw new Error('Failed to add reaction');

      return await response.json();
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  // Remove reaction
  static async removeReaction(contentType, contentId) {
    const token = this.getToken();
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(
        `${API_URL}/api/comments/reactions/${contentType}/${contentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to remove reaction');

      return await response.json();
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  }
}

export default CommentService;
