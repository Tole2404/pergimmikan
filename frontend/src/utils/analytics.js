/**
 * Google Analytics Helper Functions
 * 
 * Usage:
 * import { trackEvent, trackPageView, trackShare } from './utils/analytics';
 * 
 * trackEvent('button_click', { button_name: 'share' });
 * trackPageView('/journey/1', 'Journey Detail');
 * trackShare('whatsapp', 'journey-1');
 */

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {object} params - Event parameters
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log('📊 GA Event:', eventName, params);
  }
};

/**
 * Track page view (for SPA navigation)
 * @param {string} path - Page path
 * @param {string} title - Page title
 */
export const trackPageView = (path, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: window.location.href,
      page_path: path
    });
    console.log('📊 GA Page View:', path, title);
  }
};

/**
 * Track social share
 * @param {string} platform - Social platform (whatsapp, facebook, instagram, twitter)
 * @param {string} contentId - Content being shared (journey ID, etc)
 */
export const trackShare = (platform, contentId) => {
  trackEvent('share', {
    method: platform,
    content_type: 'journey',
    item_id: contentId
  });
};

/**
 * Track file download
 * @param {string} fileName - Name of downloaded file
 * @param {string} fileType - Type of file (image, pdf, etc)
 */
export const trackDownload = (fileName, fileType = 'image') => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType
  });
};

/**
 * Track comment submission
 * @param {string} journeyId - Journey ID where comment was posted
 */
export const trackComment = (journeyId) => {
  trackEvent('submit_comment', {
    journey_id: journeyId,
    engagement_type: 'comment'
  });
};

/**
 * Track reaction (like, love, etc)
 * @param {string} reactionType - Type of reaction
 * @param {string} contentId - Content ID
 */
export const trackReaction = (reactionType, contentId) => {
  trackEvent('reaction', {
    reaction_type: reactionType,
    content_id: contentId,
    engagement_type: 'reaction'
  });
};

/**
 * Track search
 * @param {string} searchTerm - Search query
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (searchTerm, resultsCount) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
};

/**
 * Track filter usage
 * @param {string} filterType - Type of filter (location, date, etc)
 * @param {string} filterValue - Filter value
 */
export const trackFilter = (filterType, filterValue) => {
  trackEvent('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue
  });
};

/**
 * Track video play
 * @param {string} videoId - Video identifier
 * @param {string} videoTitle - Video title
 */
export const trackVideoPlay = (videoId, videoTitle) => {
  trackEvent('video_play', {
    video_id: videoId,
    video_title: videoTitle
  });
};

/**
 * Track music player interaction
 * @param {string} action - play, pause, skip
 * @param {string} songTitle - Song title
 */
export const trackMusicPlayer = (action, songTitle) => {
  trackEvent('music_player', {
    action: action,
    song_title: songTitle
  });
};

/**
 * Track gallery view
 * @param {string} galleryId - Gallery identifier
 * @param {number} photoCount - Number of photos
 */
export const trackGalleryView = (galleryId, photoCount) => {
  trackEvent('gallery_view', {
    gallery_id: galleryId,
    photo_count: photoCount
  });
};

/**
 * Track image zoom
 * @param {string} imageId - Image identifier
 */
export const trackImageZoom = (imageId) => {
  trackEvent('image_zoom', {
    image_id: imageId,
    engagement_type: 'zoom'
  });
};

/**
 * Track scroll depth
 * @param {number} percentage - Scroll percentage (25, 50, 75, 100)
 */
export const trackScrollDepth = (percentage) => {
  trackEvent('scroll', {
    percent_scrolled: percentage
  });
};

/**
 * Track outbound link click
 * @param {string} url - External URL
 * @param {string} linkText - Link text
 */
export const trackOutboundLink = (url, linkText) => {
  trackEvent('click', {
    link_url: url,
    link_text: linkText,
    link_type: 'outbound'
  });
};

/**
 * Track form submission
 * @param {string} formName - Name of the form
 * @param {boolean} success - Whether submission was successful
 */
export const trackFormSubmit = (formName, success = true) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success
  });
};

/**
 * Track error
 * @param {string} errorType - Type of error
 * @param {string} errorMessage - Error message
 */
export const trackError = (errorType, errorMessage) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage
  });
};

/**
 * Track timing (performance)
 * @param {string} category - Timing category
 * @param {string} variable - Timing variable
 * @param {number} value - Time in milliseconds
 */
export const trackTiming = (category, variable, value) => {
  trackEvent('timing_complete', {
    name: variable,
    value: value,
    event_category: category
  });
};

export default {
  trackEvent,
  trackPageView,
  trackShare,
  trackDownload,
  trackComment,
  trackReaction,
  trackSearch,
  trackFilter,
  trackVideoPlay,
  trackMusicPlayer,
  trackGalleryView,
  trackImageZoom,
  trackScrollDepth,
  trackOutboundLink,
  trackFormSubmit,
  trackError,
  trackTiming
};
