import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading...', size = 'medium' }) => {
  return (
    <div className="common-loading-container">
      <div className={`common-loading-spinner ${size}`}>
        <div className="common-spinner-ring"></div>
        <div className="common-spinner-ring"></div>
        <div className="common-spinner-ring"></div>
      </div>
      {message && <p className="common-loading-message">{message}</p>}
    </div>
  );
};

export default Loading;
