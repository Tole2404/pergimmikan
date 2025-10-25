import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Stories.css';

const API_URL = import.meta.env.VITE_API_URL;

const StoryCard = ({ story }) => {
  const { image, title, date, description, id, photos = [] } = story;
  const [activePhoto, setActivePhoto] = useState(0);
  
  // Refs for GSAP animations
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);
  
  // Add GSAP animations for card elements
  useEffect(() => {
    // Only animate if refs are available
    if (cardRef.current && imageRef.current && contentRef.current && footerRef.current) {
      // Create a timeline for this card
      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });
      
      // Add animations to timeline
      cardTl
        .fromTo(cardRef.current, 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.6, clearProps: "all" }
        )
        .fromTo(imageRef.current, 
          { opacity: 0, scale: 0.9 }, 
          { opacity: 1, scale: 1, duration: 0.5, clearProps: "all" }, 
          "-=0.4"
        )
        .fromTo(contentRef.current, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.5, clearProps: "all" }, 
          "-=0.3"
        )
        .fromTo(footerRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.4, clearProps: "all" }, 
          "-=0.2"
        );
      
      return () => {
        // Clean up ScrollTrigger instance when component unmounts
        if (cardTl.scrollTrigger) {
          cardTl.scrollTrigger.kill();
        }
      };
    }
  }, []);
  
  // Get up to 3 photos for thumbnails, with fallbacks
  const thumbnails = photos.length > 1 
    ? photos.slice(0, 3) 
    : [image, image, image].slice(0, 3);
  
  // Current main image to display
  const mainImage = photos.length > 0 ? photos[activePhoto]?.src || image : image;
  
  const handleThumbnailClick = (index) => {
    setActivePhoto(index);
  };

  return (
    <div className="story-card mobile-story-card" ref={cardRef}>
      <div className="story-main">
        <div className="story-image" ref={imageRef}>
          <img 
            src={`${API_URL}${mainImage}`} 
            alt={title} 
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Adventure+Awaits';
            }}
          />
          <div className="image-overlay">
            <div className="overlay-content">
              <span>Explore Story</span>
            </div>
          </div>
        </div>
        <div className="story-content" ref={contentRef}>
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="story-meta">
            <span className="story-date">{date}</span>
            <Link to={`/journey/${id}`} className="read-more">
              Read full story <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="story-footer" ref={footerRef}>
        <div className="story-thumbnails">
          {thumbnails.map((photo, index) => (
            <div 
              key={index} 
              className={`thumbnail ${index === activePhoto ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img 
                src={`${API_URL}${typeof photo === 'string' ? photo : photo?.src}`} 
                alt={`thumbnail ${index + 1}`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x100?text=Photo';
                }}
              />
            </div>
          ))}
        </div>
        <div className="story-badges">
          <span className="year-badge">{date}</span>
          <span className="photo-count-badge">{photos.length} photos</span>
        </div>
      </div>
    </div>
  );
};

StoryCard.propTypes = {
  story: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    photos: PropTypes.array
  }).isRequired,
};

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stampRef = useRef(null);
  const titleRef = useRef(null);
  const dividerRef = useRef(null);
  const descriptionRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const arrowsRef = useRef(null);
  const footerRef = useRef(null);
  const decorativeBottomRef = useRef(null);
  const dividerTopRef = useRef(null);
  const decorLeftRef = useRef(null);
  const decorRightRef = useRef(null);
  const viewAllBtnRef = useRef(null);

  useEffect(() => {
    fetchStories();
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Set up initial animations when component mounts
    const setupAnimations = () => {
      if (sectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
        
        // Fade in the section
        tl.from(sectionRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      }
      
      if (dividerTopRef.current) {
        gsap.from(dividerTopRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: dividerTopRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }
      
      if (decorLeftRef.current && decorRightRef.current) {
        gsap.from(decorLeftRef.current, {
          x: -50,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
        
        gsap.from(decorRightRef.current, {
          x: 50,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      }
      
      if (headerRef.current) {
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
      
      // Add animation for sliderContainerRef
      if (sliderContainerRef.current) {
        gsap.fromTo(sliderContainerRef.current,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            delay: 0.7,
            clearProps: "all",
            scrollTrigger: {
              trigger: sliderContainerRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }

      if (arrowsRef.current) {
        gsap.from(arrowsRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.8,
          scrollTrigger: {
            trigger: sliderContainerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }
      
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.9,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }
      
      if (viewAllBtnRef.current) {
        gsap.from(viewAllBtnRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          delay: 1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }
      
      if (decorativeBottomRef.current) {
        gsap.from(decorativeBottomRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          scrollTrigger: {
            trigger: decorativeBottomRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }
    };
    
    // Set up the animations when component is mounted or updated
    setupAnimations();
    
    // Set up a window resize handler to refresh ScrollTrigger
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Add animation when stories are loaded 
  useEffect(() => {
    if (!loading && stories.length > 0) {
      // Refresh ScrollTrigger to recognize new content
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }
  }, [loading, stories]);

  const fetchStories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/journeys`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch stories');
      
      const data = await response.json();
      
      // Process and transform journey data into story format with better handling
      const storyData = data.map(journey => ({
        id: journey.id,
        image: journey.photos && journey.photos.length > 0 
          ? journey.photos[0].src 
          : '/placeholder.jpg',
        title: journey.title || `Adventure ${journey.year}`,
        date: journey.year?.toString() || 'Unknown',
        description: journey.description || 'An exciting journey awaits!',
        photos: journey.photos || []
      }));

      setStories(storyData);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const gotoNext = () => {
    sliderRef.current.slickNext();
  };

  const gotoPrev = () => {
    sliderRef.current.slickPrev();
  };

  const settings = {
    dots: true,
    infinite: stories.length > 2,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: false, // We'll use custom arrows
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '60px'
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px'
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: '0'
        }
      }
    ]
  };

  if (loading) {
    return (
      <section className="stories-section">
        <div className="container">
          <div className="section-header retro">
            <div className="vintage-stamp">
              <span className="vintage-stamp-text">STORIES</span>
            </div>
            <div className="header-content">
              <h2 className="section-title-landing">Our Journey Stories</h2>
              <div className="section-divider">
                <span className="divider-star">★</span>
                <span className="divider-line"></span>
                <span className="divider-star">★</span>
                <span className="divider-line"></span>
                <span className="divider-star">★</span>
              </div>
            </div>
          </div>
          
          <div className="stories-loading-container">
            <div className="stories-loading-card">
              <div className="stories-loading-cards-wrapper">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="stories-loading-storycard" style={{ '--delay': `${index * 0.2}s` }}>
                    <div className="stories-loading-image">
                      <div className="stories-loading-shimmer"></div>
                      <div className="stories-loading-overlay"></div>
                    </div>
                    <div className="stories-loading-content">
                      <div className="stories-loading-title"></div>
                      <div className="stories-loading-text"></div>
                      <div className="stories-loading-text stories-loading-text-short"></div>
                      <div className="stories-loading-meta">
                        <div className="stories-loading-date"></div>
                        <div className="stories-loading-link"></div>
                      </div>
                    </div>
                    <div className="stories-loading-thumbnails">
                      <div className="stories-loading-thumbnail"></div>
                      <div className="stories-loading-thumbnail"></div>
                      <div className="stories-loading-thumbnail"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="stories-loading-navigation">
                <div className="stories-loading-arrow stories-loading-arrow-left">←</div>
                <div className="stories-loading-status">Unfolding stories...</div>
                <div className="stories-loading-arrow stories-loading-arrow-right">→</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="stories-section">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">!</div>
            <p>{error}</p>
            <button onClick={fetchStories} className="retry-button">Try Again</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stories-section" id="stories" ref={sectionRef}>
      <div className="section-divider-top" ref={dividerTopRef}>
        <div className="divider-edge left"></div>
        <div className="divider-line-top"></div>
        <span className="divider-star-top">★</span>
        <div className="divider-line-top"></div>
        <div className="divider-edge right"></div>
      </div>
      
      <div className="decorative-element left" ref={decorLeftRef}></div>
      <div className="decorative-element right" ref={decorRightRef}></div>
      
      <div className="container">
        <div className="section-header retro" ref={headerRef}>
          <div className="vintage-stamp" ref={stampRef}>
            <span className="vintage-stamp-text">STORIES</span>
          </div>
          <div className="header-content">
            <h2 className="section-title-landing" ref={titleRef}>Our Journey Stories</h2>
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
          <p>Exploring memorable adventures, year by year. <span className="highlight">#PergimikanStory</span></p>
        </div>
        
        {stories.length === 0 ? (
          <div className="no-stories">
            <p>No stories available yet. Check back soon for our upcoming adventures!</p>
          </div>
        ) : (
          <div className="stories-slider-container" ref={sliderContainerRef}>
            <div className="stories-slider">
              <Slider ref={sliderRef} {...settings}>
                {stories.map((story) => (
                  <div key={story.id} className="slider-item">
                    <StoryCard story={story} />
                  </div>
                ))}
              </Slider>
            </div>
            
            <div className="custom-arrows" ref={arrowsRef}>
              <button className="arrow-btn prev" onClick={gotoPrev} aria-label="Previous slide">
                <span className="arrow-icon">←</span>
              </button>
              <button className="arrow-btn next" onClick={gotoNext} aria-label="Next slide">
                <span className="arrow-icon">→</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="section-footer" ref={footerRef}>
          <p>Stay tuned for more <span className="emphasis">epic adventures</span> ahead</p>
          <Link to="/journey" className="view-all-btn" ref={viewAllBtnRef}>
            View All Stories <span className="arrow">→</span>
          </Link>
        </div>
      </div>
      
      <div className="decorative-bottom" ref={decorativeBottomRef}></div>
    </section>
  );
};

export default Stories;
