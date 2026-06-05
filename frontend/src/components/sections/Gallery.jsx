import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Gallery.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaShareAlt, FaHeart, FaRegHeart, FaRegBookmark } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_PLACEHOLDER = '/images/offline-image.svg';

const Gallery = () => {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedMoments, setLikedMoments] = useState({});
  const [popupImage, setPopupImage] = useState(null);

  // Refs for animations
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stampRef = useRef(null);
  const titleRef = useRef(null);
  const dividerRef = useRef(null);
  const descriptionRef = useRef(null);
  const galleryWrapperRef = useRef(null);
  const polaroidRefs = useRef([]);
  const vintageTextRef = useRef(null);
  const signatureRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Drag / Swipe Ref states
  const dragStart = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = (clientX) => {
    dragStart.current = clientX;
    isDragging.current = true;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging.current || moments.length === 0) return;
    const diff = clientX - dragStart.current;
    // Lower threshold to 30px for highly sensitive dragging
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        // swipe right -> show previous card (loop to end if at beginning)
        setActiveIndex(prev => (prev - 1 + moments.length) % moments.length);
      } else {
        // swipe left -> show next card (loop to start if at end)
        setActiveIndex(prev => (prev + 1) % moments.length);
      }
      // Reset drag start to allow continuous sliding without lifting finger!
      dragStart.current = clientX;
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();

  const handleMouseDown = (e) => handleDragStart(e.clientX);
  const handleMouseMove = (e) => handleDragMove(e.clientX);
  const handleMouseUp = () => handleDragEnd();

  const toggleLike = (id) => {
    if (!id) return;
    setLikedMoments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = (moment) => {
    if (!moment) return;
    if (navigator.share) {
      navigator.share({
        title: moment.caption || 'Moment',
        text: `Check out this moment by ${moment.author}`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      alert(`Link shared: ${window.location.origin}${moment.imageUrl}`);
    }
  };

  const handleBookmark = (moment) => {
    if (!moment) return;
    alert('Moment bookmarked to your collection!');
  };

  useEffect(() => {
    fetchGalleries();

    gsap.registerPlugin(ScrollTrigger);

    // Set up animations when component mounts
    const setupAnimations = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return; // Skip GSAP animations on mobile to prevent invisible cards

      if (sectionRef.current) {
        // Fade in the entire section
        gsap.from(sectionRef.current, {
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }

      if (headerRef.current) {
        // Animate header
        gsap.from(headerRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }

      if (stampRef.current) {
        // Zoom in the stamp
        gsap.from(stampRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }

      if (titleRef.current) {
        // Fade up the title
        gsap.from(titleRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.4,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }

      if (dividerRef.current) {
        // Fade in the divider
        gsap.from(dividerRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.5,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }

      if (descriptionRef.current) {
        // Fade up the description
        gsap.from(descriptionRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.6,
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }

      if (galleryWrapperRef.current) {
        // Fade up the gallery wrapper
        gsap.from(galleryWrapperRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: 0.7,
          scrollTrigger: {
            trigger: galleryWrapperRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }

      // Animate each polaroid card
      polaroidRefs.current.forEach((ref, index) => {
        if (ref) {
          // Calculate animation type based on index
          const isEven = index % 2 === 0;
          const row = Math.floor(index / 3);
          const col = index % 3;
          const delay = 0.8 + (row * 0.1) + (col * 0.1);

          // Choose different animations based on position
          const animationType = index % 3;

          if (animationType === 0) {
            // Fade up
            gsap.from(ref, {
              y: 30,
              opacity: 0,
              duration: 0.6,
              delay: delay,
              scrollTrigger: {
                trigger: galleryWrapperRef.current,
                start: "top 90%",
                toggleActions: "play none none none"
              }
            });
          } else if (animationType === 1) {
            // Zoom in
            gsap.from(ref, {
              scale: 0.8,
              opacity: 0,
              duration: 0.6,
              delay: delay,
              scrollTrigger: {
                trigger: galleryWrapperRef.current,
                start: "top 90%",
                toggleActions: "play none none none"
              }
            });
          } else {
            // Fade up with rotation
            gsap.from(ref, {
              y: 20,
              rotation: isEven ? 5 : -5,
              opacity: 0,
              duration: 0.6,
              delay: delay,
              scrollTrigger: {
                trigger: galleryWrapperRef.current,
                start: "top 90%",
                toggleActions: "play none none none"
              }
            });
          }
        }
      });

      if (vintageTextRef.current) {
        // Fade up the vintage text
        gsap.from(vintageTextRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.9,
          scrollTrigger: {
            trigger: vintageTextRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }

      if (signatureRef.current) {
        // Fade in the signature
        gsap.from(signatureRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 1,
          scrollTrigger: {
            trigger: vintageTextRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }

      if (scrollIndicatorRef.current) {
        // Fade in the scroll indicator
        gsap.from(scrollIndicatorRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.8,
          scrollTrigger: {
            trigger: galleryWrapperRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }
    };

    // Initialize animations after data is loaded
    if (!loading && moments.length > 0) {
      setupAnimations();
    }

    // Set up a window resize handler to refresh ScrollTrigger
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [loading, moments.length]); // Run this effect when loading state or moments array changes

  const fetchGalleries = async () => {
    try {
      const response = await fetch(`${API_URL}/api/galleries`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch galleries');

      const data = await response.json();
      console.log('Raw API Response:', data);

      // Transform gallery data and sort by date descending
      const galleryData = data
        .map(gallery => ({
          id: gallery.id,
          caption: gallery.caption,
          date: gallery.date,
          author: gallery.author,
          imageUrl: gallery.images?.[0]?.image_url,
          tags: gallery.tags || []
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 9);  // Exact 3x3 grid layout as preferred in the gallery memory

      console.log('Transformed Gallery Data:', galleryData);
      setMoments(galleryData);

      // Initialize refs array for polaroids after data is loaded
      polaroidRefs.current = galleryData.map(() => React.createRef());
    } catch (err) {
      console.error('Error fetching galleries:', err);
      setError('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header retro">
          <div className="vintage-stamp">
            <span className="vintage-stamp-text">GALLERY</span>
          </div>
          <div className="header-content">
            <h2 className="section-title-landing">BEST MOMENTS</h2>
            <div className="section-divider">
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
            </div>
          </div>
        </div>
        <div className="section-description">
          <p>Capturing our journey through photographs</p>
        </div>

        <div className="gallery-loading-container">
          <div className="gallery-loading-polaroids">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="gallery-loading-polaroid" style={{ '--delay': `${index * 0.2}s` }}>
                <div className="gallery-loading-frame">
                  <div className="gallery-loading-image">
                    <div className="gallery-loading-shimmer"></div>
                  </div>
                  <div className="gallery-loading-caption">
                    <div className="gallery-loading-line gallery-loading-line-lg"></div>
                    <div className="gallery-loading-line gallery-loading-line-sm"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="gallery-loading-status">
            <div className="gallery-loading-camera">
              <div className="gallery-loading-lens"></div>
              <div className="gallery-loading-flash"></div>
            </div>
            <div className="gallery-loading-text">Developing memories...</div>
          </div>
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header retro">
          <div className="vintage-stamp">
            <span className="vintage-stamp-text">GALLERY</span>
          </div>
          <div className="header-content">
            <h2 className="section-title-landing">BEST MOMENTS</h2>
            <div className="section-divider">
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
            </div>
          </div>
        </div>
        <div className="section-description">
          <p>Capturing our journey through photographs</p>
        </div>
        <div className="error-text">{error}</div>
      </div>
    </section>
  );

  if (moments.length === 0) return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header retro">
          <div className="vintage-stamp">
            <span className="vintage-stamp-text">GALLERY</span>
          </div>
          <div className="header-content">
            <h2 className="section-title-landing">BEST MOMENTS</h2>
            <div className="section-divider">
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
            </div>
          </div>
        </div>
        <div className="section-description">
          <p>Capturing our journey through photographs</p>
        </div>
        <div className="empty-text">No moments captured yet.</div>
      </div>
    </section>
  );

  return (
    <section className="gallery-section" ref={sectionRef}>
      <div className="retro-overlay"></div>
      <div className="container">
        <div className="section-header retro" ref={headerRef}>
          <div className="vintage-stamp" ref={stampRef}>
            <span className="vintage-stamp-text">GALLERY</span>
          </div>
          <div className="header-content">
            <h2 className="section-title-landing" ref={titleRef}>BEST MOMENTS</h2>
            <div className="section-divider" ref={dividerRef}>
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
            </div>
          </div>
        </div>
        <div className="section-description" ref={descriptionRef}>
          <p>Capturing our journey through photographs</p>
        </div>

        {isMobile ? (
          /* WeChat Moments Mobile Carousel */
          <div className="pgm-gallery__wechat-container">
            {/* The Radial Carousel */}
            <div
              className="pgm-gallery__wechat-carousel"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="pgm-gallery__wechat-wheel-container">
                <div className="pgm-gallery__wechat-wheel">
                  {moments.map((moment, idx) => {
                    let diff = idx - activeIndex;
                    // Circular buffer logic for seamless infinite loop
                    const half = Math.floor(moments.length / 2);
                    if (diff > half) diff -= moments.length;
                    else if (diff < -half) diff += moments.length;

                    // Calculate rotation angle (40deg ensures 5 cards fan out beautifully)
                    const angle = diff * 40;
                    // Calculate scale (active card pops out heavily to look big)
                    const scale = diff === 0 ? 1.15 : 0.92;
                    // Calculate zIndex
                    const zIndex = diff === 0 ? 5 : 5 - Math.abs(diff);
                    // Calculate opacity: show 5 cards (diff <= 2)
                    const opacity = Math.abs(diff) <= 2 ? 1 : 0;

                    return (
                      <div
                        key={moment.id}
                        className={`pgm-gallery__wechat-slice ${diff === 0 ? 'active' : ''}`}
                        style={{
                          transform: `rotate(${angle}deg) scale(${scale})`,
                          zIndex: zIndex,
                          opacity: opacity,
                          pointerEvents: Math.abs(diff) > 2 ? 'none' : 'auto'
                        }}
                        onClick={() => {
                          if (diff === 0) {
                            // If it's already in the center, open popup
                            setPopupImage(moment);
                          } else {
                            // Otherwise, rotate it to the center
                            setActiveIndex(idx);
                          }
                        }}
                      >
                        <img
                          src={moment.imageUrl ? `${API_URL}${moment.imageUrl}` : DEFAULT_PLACEHOLDER}
                          alt={moment.caption || 'Gallery image'}
                        />
                        {/* Red Ink Vintage Stamp Overlay */}
                        <div className="pgm-gallery__vintage-stamp-overlay">
                          <span>BEST</span>
                          <span className="star">★</span>
                          <span>MOMENT</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Central Hub (Wax Seal / Dial) */}
                <div className="pgm-gallery__wechat-hub">
                  <button
                    className="pgm-gallery__wechat-hub-btn"
                    onClick={() => handleShare(moments[activeIndex])}
                    title="Share"
                  >
                    <FaShareAlt />
                  </button>
                  <button
                    className={`pgm-gallery__wechat-hub-btn like ${likedMoments[moments[activeIndex]?.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(moments[activeIndex]?.id)}
                    title="Like"
                  >
                    {likedMoments[moments[activeIndex]?.id] ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button
                    className="pgm-gallery__wechat-hub-btn"
                    onClick={() => handleBookmark(moments[activeIndex])}
                    title="Bookmark"
                  >
                    <FaRegBookmark />
                  </button>
                </div>
              </div>
            </div>

            {/* Elegant Minimal Caption below the Wheel */}
            {moments[activeIndex] && (
              <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 20px' }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: '1.05rem',
                  color: 'var(--retro-brown)',
                  margin: '0 0 6px 0',
                  lineHeight: '1.4'
                }}>
                  {moments[activeIndex].caption || 'Captured moments.'}
                </p>
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.75rem',
                  color: 'var(--retro-brown-light)',
                  letterSpacing: '0.5px'
                }}>
                  {moments[activeIndex].author} • {moments[activeIndex].date ? new Date(moments[activeIndex].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Classic Polaroid Grid on Desktop */
          <div className="gallery-wrapper" ref={galleryWrapperRef}>
            <div className="pgm-gallery__grid">
              {moments.map((moment, index) => (
                <div
                  className="pgm-gallery__polaroid"
                  key={moment.id}
                  ref={el => polaroidRefs.current[index] = el}
                >
                  <div className="pgm-gallery__frame">
                    <div
                      className="pgm-gallery__image-wrapper"
                      onClick={() => setPopupImage(moment)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={moment.imageUrl ? `${API_URL}${moment.imageUrl}` : DEFAULT_PLACEHOLDER}
                        alt={moment.caption || 'Gallery image'}
                        loading="lazy"
                        onError={(e) => {
                          if (e.target.src !== DEFAULT_PLACEHOLDER) {
                            console.error('Image failed to load:', e.target.src);
                            e.target.src = DEFAULT_PLACEHOLDER;
                          }
                        }}
                      />
                      {/* Red Ink Vintage Stamp Overlay (Desktop) */}
                      <div className="pgm-gallery__vintage-stamp-overlay-desktop">
                        <span>BEST</span>
                        <span className="star">★</span>
                        <span>MOMENT</span>
                      </div>
                    </div>
                    <div className="pgm-gallery__caption">
                      {moment.caption && (
                        <span className="pgm-gallery__caption-text">{moment.caption}</span>
                      )}
                      <div className="pgm-gallery__caption-info">
                        <span className="pgm-gallery__caption-author">{moment.author || 'Anonymous'}</span>
                        <span className="pgm-gallery__caption-date">
                          {moment.date ? new Date(moment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>
                      {moment.tags && moment.tags.length > 0 && (
                        <div className="pgm-gallery__caption-tags">
                          {moment.tags.map(tag => (
                            <span key={tag.id} className="pgm-gallery__tag">{tag.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isMobile && <div className="scroll-indicator mobile-only" ref={scrollIndicatorRef}>← Swipe to see more →</div>}
        <div className="vintage-text" ref={vintageTextRef}>
          <p>Every photograph tells a story, every story holds a memory.</p>
          <span className="vintage-signature" ref={signatureRef}>- The Crew</span>
        </div>
      </div>

      {/* Fullscreen Image Popup (Rendered via React Portal at body level for full viewport coverage) */}
      {popupImage && createPortal(
        <div className="pgm-gallery__popup" onClick={() => setPopupImage(null)}>
          <div className="pgm-gallery__popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="pgm-gallery__popup-close" onClick={() => setPopupImage(null)}>
              &times;
            </button>
            <img
              src={popupImage.imageUrl ? `${API_URL}${popupImage.imageUrl}` : DEFAULT_PLACEHOLDER}
              alt={popupImage.caption || 'Gallery popup'}
            />
            {popupImage.caption && (
              <p className="pgm-gallery__popup-caption">{popupImage.caption}</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Gallery;
