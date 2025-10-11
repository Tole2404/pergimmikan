import React, { useState, useEffect, useRef } from 'react';
import './Gallery.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/300x300?text=No+Image';

const Gallery = () => {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  useEffect(() => {
    fetchGalleries();
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Set up animations when component mounts
    const setupAnimations = () => {
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
            <h2 className="section-title">BEST MOMENTS</h2>
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
            <h2 className="section-title">BEST MOMENTS</h2>
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
            <h2 className="section-title">BEST MOMENTS</h2>
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
            <h2 className="section-title" ref={titleRef}>BEST MOMENTS</h2>
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
        <div className="gallery-wrapper" ref={galleryWrapperRef}>
          <div className="polaroid-grid">
            {moments.map((moment, index) => (
              <div 
                className="polaroid" 
                key={moment.id}
                ref={el => polaroidRefs.current[index] = el}
              >
                <div className="polaroid-frame">
                  <div className="polaroid-image-wrapper">
                    <img 
                      src={moment.imageUrl ? `${API_URL}${moment.imageUrl}` : DEFAULT_PLACEHOLDER}
                      alt={moment.caption} 
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src !== DEFAULT_PLACEHOLDER) {
                          console.error('Image failed to load:', e.target.src);
                          e.target.src = DEFAULT_PLACEHOLDER;
                        }
                      }}
                    />
                  </div>
                  <div className="polaroid-caption">
                    <span className="caption-text">{moment.caption}</span>
                    <div className="caption-info">
                      <span className="caption-author">{moment.author}</span>
                      <span className="caption-date">{new Date(moment.date).getFullYear()}</span>
                    </div>
                    {moment.tags && moment.tags.length > 0 && (
                      <div className="caption-tags">
                        {moment.tags.map(tag => (
                          <span key={tag.id} className="tag">{tag.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="scroll-indicator mobile-only" ref={scrollIndicatorRef}>← Swipe to see more →</div>
        <div className="vintage-text" ref={vintageTextRef}>
          <p>Every photograph tells a story, every story holds a memory.</p>
          <span className="vintage-signature" ref={signatureRef}>- The Crew</span>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
