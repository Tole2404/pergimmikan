import React, { useState, useEffect } from 'react';
import CommentService from '../../utils/commentService';
import { toast } from 'react-toastify';
import './CommentSection.css';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23d4af37' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const CommentSection = ({ contentType, contentId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    
    // Fetch comments
    fetchComments();
  }, [contentType, contentId]);

  const fetchComments = async () => {
    setLoading(true);
    const data = await CommentService.getComments(contentType, contentId);
    setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await CommentService.createComment(
        contentType,
        contentId,
        newComment.trim(),
        replyTo?.id || null
      );
      
      setNewComment('');
      setReplyTo(null);
      await fetchComments();
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await CommentService.updateComment(commentId, editText.trim());
      setEditingId(null);
      setEditText('');
      await fetchComments();
      toast.success('Comment updated!');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await CommentService.deleteComment(commentId);
      await fetchComments();
      toast.success('Comment deleted!');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

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

  const renderComment = (comment, isReply = false) => {
    const isOwner = currentUser && currentUser.id === comment.user_id;
    const isEditing = editingId === comment.id;

    return (
      <div key={comment.id} className={`comment ${isReply ? 'comment-reply' : ''}`}>
        <img 
          src={comment.user_avatar ? `${API_URL}${comment.user_avatar}` : DEFAULT_AVATAR}
          alt={comment.username}
          className="comment-avatar"
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
        />
        <div className="comment-content">
          <div className="comment-header">
            <span className="comment-author">{comment.username}</span>
            <span className="comment-time">{formatTimeAgo(comment.created_at)}</span>
          </div>
          
          {isEditing ? (
            <div className="comment-edit-form">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="comment-edit-input"
                rows="2"
              />
              <div className="comment-edit-actions">
                <button onClick={() => handleEdit(comment.id)} className="btn-save">
                  Save
                </button>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setEditText('');
                  }} 
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="comment-text">{comment.comment}</p>
              <div className="comment-actions">
                {!isReply && currentUser && (
                  <button 
                    onClick={() => setReplyTo(comment)}
                    className="comment-action-btn"
                  >
                    Reply
                  </button>
                )}
                {isOwner && (
                  <>
                    <button 
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditText(comment.comment);
                      }}
                      className="comment-action-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="comment-action-btn delete"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="comment-form">
          {replyTo && (
            <div className="reply-indicator">
              Replying to <strong>{replyTo.username}</strong>
              <button 
                type="button"
                onClick={() => setReplyTo(null)}
                className="reply-cancel"
              >
                ×
              </button>
            </div>
          )}
          <div className="comment-form-content">
            <img 
              src={currentUser.image_url ? `${API_URL}${currentUser.image_url}` : DEFAULT_AVATAR}
              alt={currentUser.username}
              className="comment-avatar"
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? `Reply to ${replyTo.username}...` : 'Write a comment...'}
              className="comment-input"
              rows="3"
            />
          </div>
          <button type="submit" className="comment-submit-btn">
            {replyTo ? 'Reply' : 'Comment'}
          </button>
        </form>
      ) : (
        <div className="comment-login-prompt">
          Please <a href="/login">login</a> to comment
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="comment-loading">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="comment-empty">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id}>
              {renderComment(comment)}
              {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                  {comment.replies.map(reply => renderComment(reply, true))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
