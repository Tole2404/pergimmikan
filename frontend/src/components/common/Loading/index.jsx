import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css';
import loadingImage from '../../../assets/images/retro/loading.jpg';

const Loading = ({ size = 'small', overlay = false, text = 'Loading mass...' }) => {
  const sizeClass = `pgm-loading--${size}`;
  
  const loadingContent = (
    <div className={`pgm-loading ${sizeClass}`}>
      <div className="pgm-loading__container">
        <img 
          src={loadingImage} 
          alt="Loading animation" 
          className="pgm-loading__image"
        />
        {text && <p className="pgm-loading__text">{text}</p>}
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="pgm-loading-overlay">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

Loading.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  overlay: PropTypes.bool,
  text: PropTypes.string
};

export default Loading;
