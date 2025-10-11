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
    if (!loading) {
      setTimeout(() => {
        setupAnimations();
      }, 100);
    }
  }, [loading]);

  const setupAnimations = () => {
    // Basic fade in for mobile
    if (isMobile) {
      // Simple fade in for the whole section
      gsap.to(sectionRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power1.out"
      });

      // Simple animation for quote container
      if (quoteContainerRef.current) {
        gsap.fromTo(quoteContainerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.2,
            ease: "power1.out"
          }
        );
      }

      // Simple animations for quote elements
      const elements = [
        { ref: quoteTextRef.current, delay: 0.3 },
        { ref: quoteAuthorRef.current, delay: 0.4 }
      ];

      elements.forEach(({ ref, delay }) => {
        if (ref) {
          gsap.fromTo(ref,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay,
              ease: "power1.out"
            }
          );
        }
      });

      // Simple fade in for quote marks
      const quoteMarks = [
        { ref: quoteMarkLeftRef.current, x: -10 },
        { ref: quoteMarkRightRef.current, x: 10 }
      ];

      quoteMarks.forEach(({ ref, x }) => {
        if (ref) {
          gsap.fromTo(ref,
            { opacity: 0, x },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              delay: 0.5,
              ease: "power1.out"
            }
          );
        }
      });

      return; // Exit early for mobile
    }

    // Desktop animations with optimizations
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          clearProps: "all",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Quote container animation
    if (quoteContainerRef.current) {
      gsap.fromTo(quoteContainerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          clearProps: "all",
          scrollTrigger: {
            trigger: quoteContainerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Quote marks animation
    const quoteMarks = [
      { ref: quoteMarkLeftRef.current, x: -30 },
      { ref: quoteMarkRightRef.current, x: 30 }
    ];

    quoteMarks.forEach(({ ref, x }) => {
      if (ref) {
        gsap.fromTo(ref,
          { x, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.4,
            clearProps: "all",
            scrollTrigger: {
              trigger: quoteContainerRef.current,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    // Quote text animation
    if (quoteTextRef.current) {
      gsap.fromTo(quoteTextRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.6,
          clearProps: "all",
          scrollTrigger: {
            trigger: quoteContainerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Quote author animation
    if (quoteAuthorRef.current) {
      gsap.fromTo(quoteAuthorRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.8,
          clearProps: "all",
          scrollTrigger: {
            trigger: quoteContainerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }
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
