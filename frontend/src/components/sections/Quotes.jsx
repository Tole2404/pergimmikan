import React, { useState, useEffect, useRef } from 'react';
import './Quotes.css';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const API_URL = import.meta.env.VITE_API_URL;

const Quotes = () => {
  const [quote, setQuote] = useState({
    text: 'Life is not about the moments we capture, but the stories we create together.',
    author_name: 'Pergimmikan',
    author_title: 'Est. 2021'
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Refs for animation
  const sectionRef = useRef(null);
  const quoteContainerRef = useRef(null);
  const quoteMarkLeftRef = useRef(null);
  const quoteMarkRightRef = useRef(null);
  const quoteTextRef = useRef(null);
  const quoteAuthorRef = useRef(null);

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Update isMobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch quote data
  useEffect(() => {
    fetchFeaturedQuote();
  }, []);

  // Setup animations when loading completes
  useEffect(() => {
    let timeline;
    if (!loading) {
      setTimeout(() => {
        timeline = setupAnimations();
      }, 100);
    }
    
    // Cleanup
    return () => {
      if (timeline) {
        timeline.kill();
      }
    };
  }, [loading]);

  const setupAnimations = () => {
    // Optimized animations for both mobile and desktop
    const timeline = gsap.timeline({
      defaults: {
        ease: "power2.out",
        clearProps: "all"
      }
    });

    // Batch animation for mobile
    if (isMobile) {
      timeline
        .to(sectionRef.current, {
          opacity: 1,
          duration: 0.4
        })
        .to(quoteContainerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4
        }, "-=0.2")
        .to([quoteTextRef.current, quoteAuthorRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1
        }, "-=0.2")
        .to([quoteMarkLeftRef.current, quoteMarkRightRef.current], {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.1
        }, "-=0.2");

      return timeline;
    }

    // Desktop animations - single ScrollTrigger
    const desktopTimeline = gsap.timeline({
      defaults: {
        ease: "power2.out",
        clearProps: "all"
      },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true // Only play once
      }
    });

    desktopTimeline
      .fromTo(sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }
      )
      .fromTo(quoteContainerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      );

    // Add remaining animations to desktop timeline
    desktopTimeline
      .fromTo([quoteMarkLeftRef.current, quoteMarkRightRef.current],
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
        "-=0.3"
      )
      .fromTo(quoteTextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(quoteAuthorRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.2"
      );

    return desktopTimeline;
  };

  const fetchFeaturedQuote = async () => {
    try {
      const response = await fetch(`${API_URL}/api/quotes/featured`);
      
      if (!response.ok) {
        // Jika tidak ada featured quote, gunakan default quote
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data) {
        setQuote(data);
      }
    } catch (error) {
      // Silent fail - gunakan default quote yang sudah ada di state
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="quotes-section" ref={sectionRef}>
        <div className="container">
          <div className="quote-container" ref={quoteContainerRef}>
            <div className="quote-content">
              <p className="quote-text">Loading...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="quotes-section" ref={sectionRef}>
      <div className="container">
        <div className="quote-container" ref={quoteContainerRef}>
          <div className="quote-mark left" ref={quoteMarkLeftRef}>❝</div>
          <div className="quote-content">
            <p className="quote-text" ref={quoteTextRef}>{quote.text}</p>
            <div className="quote-author" ref={quoteAuthorRef}>
              <span className="author-name">{quote.author_name}</span>
              <span className="author-title">{quote.author_title}</span>
            </div>
          </div>
          <div className="quote-mark right" ref={quoteMarkRightRef}>❞</div>
        </div>
      </div>
    </section>
  );
};

export default Quotes;
