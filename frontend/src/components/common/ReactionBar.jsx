import React, { useState, useEffect } from 'react';
import CommentService from '../../utils/commentService';
import { toast } from 'react-toastify';
import './ReactionBar.css';

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'laugh', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' }
];

const ReactionBar = ({ contentType, contentId }) => {
  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0,
    total: 0,
    userReaction: null
  });
  const [showPicker, setShowPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    
    // Fetch reactions
    fetchReactions();
  }, [contentType, contentId]);

  const fetchReactions = async () => {
    const data = await CommentService.getReactionSummary(contentType, contentId);
    setReactions(data);
  };

  const handleReaction = async (reactionType) => {
    if (!currentUser) {
      toast.error('Please login to react');
      return;
    }

    try {
      if (reactions.userReaction === reactionType) {
        // Remove reaction if clicking the same one
        const data = await CommentService.removeReaction(contentType, contentId);
        setReactions({ ...data, userReaction: null });
      } else {
        // Add or change reaction
        const data = await CommentService.addReaction(contentType, contentId, reactionType);
        setReactions({ ...data, userReaction: reactionType });
      }
      setShowPicker(false);
    } catch (error) {
      toast.error('Failed to react');
    }
  };

  const getTopReactions = () => {
    return REACTIONS
      .filter(r => reactions[r.type] > 0)
      .sort((a, b) => reactions[b.type] - reactions[a.type])
      .slice(0, 3);
  };

  const topReactions = getTopReactions();

  return (
    <div className="reaction-bar">
      <div className="reaction-summary">
        {topReactions.length > 0 ? (
          <>
            <div className="reaction-emojis">
              {topReactions.map(r => (
                <span key={r.type} className="reaction-emoji-small">
                  {r.emoji}
                </span>
              ))}
            </div>
            <span className="reaction-count">{reactions.total}</span>
          </>
        ) : (
          <span className="reaction-empty">Be the first to react</span>
        )}
      </div>

      <div className="reaction-button-container">
        <button
          className={`reaction-button ${reactions.userReaction ? 'reacted' : ''}`}
          onClick={() => setShowPicker(!showPicker)}
        >
          {reactions.userReaction ? (
            <>
              {REACTIONS.find(r => r.type === reactions.userReaction)?.emoji}
              <span>{REACTIONS.find(r => r.type === reactions.userReaction)?.label}</span>
            </>
          ) : (
            <>
              <span>👍</span>
              <span>React</span>
            </>
          )}
        </button>

        {showPicker && (
          <div className="reaction-picker">
            {REACTIONS.map(reaction => (
              <button
                key={reaction.type}
                className={`reaction-option ${reactions.userReaction === reaction.type ? 'active' : ''}`}
                onClick={() => handleReaction(reaction.type)}
                title={reaction.label}
              >
                <span className="reaction-emoji">{reaction.emoji}</span>
                {reactions[reaction.type] > 0 && (
                  <span className="reaction-option-count">{reactions[reaction.type]}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionBar;
