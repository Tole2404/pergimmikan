import React, { useState, useEffect, useRef } from 'react';
import './Legacy.css';
import retroTv from '../../assets/images/retro/tv.png';
import retroCamera from '../../assets/images/retro/camera.png';
import retroRadio from '../../assets/images/retro/radio.png';
import retroPhone from '../../assets/images/retro/phone.png';
import retroTypewriter from '../../assets/images/retro/typewriter.png';
import retroGramophone from '../../assets/images/retro/gramophone.png';
import { toast } from 'react-toastify';
// Animasi GSAP dinonaktifkan
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

const API_URL = import.meta.env.VITE_API_URL;

const Legacy = () => {
  const [legacies, setLegacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Refs untuk komponen, tetapi tidak digunakan untuk animasi
  const sectionRef = useRef(null);
  const leftDecorationsRef = useRef(null);
  const rightDecorationsRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const timelineRef = useRef(null);
  const leftTimelineDecorRef = useRef(null);
  const rightTimelineDecorRef = useRef(null);
  const legacyClosingRef = useRef(null);
  const stampRef = useRef(null);
  const closingTextRef = useRef(null);

  // Update isMobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP animations dinonaktifkan
  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);
    
  //   const handleResize = () => {
  //     ScrollTrigger.refresh();
  //   };
    
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //     ScrollTrigger.getAll().forEach(st => st.kill());
  //   };
  // }, []);

  // Fetch legacy data
  useEffect(() => {
    fetchLegacies();
  }, []);

  // Setup animations dinonaktifkan
  // useEffect(() => {
  //   if (!loading && legacies.length > 0) {
  //     setTimeout(() => {
  //       setupAnimations();
  //     }, 100);
  //   }
  // }, [loading, legacies]);

  // Fungsi setupAnimations dinonaktifkan
  // const setupAnimations = () => {
  //   // Kode animasi yang dinonaktifkan
  // };

  const fetchLegacies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/legacies`);
      
      if (!response.ok) throw new Error('Failed to fetch legacies');

      const data = await response.json();
      // Sort legacies by year in ascending order
      const sortedLegacies = data.sort((a, b) => a.year - b.year);
      setLegacies(sortedLegacies);
    } catch (error) {
      console.error('Error fetching legacies:', error);
      toast.error('Failed to load legacy timeline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="legacy-section" ref={sectionRef}>
        <div className="container">
          <div className="legacy-content">
            <h2 className="legacy-title" ref={titleRef}>Loading...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="legacy-section" ref={sectionRef} style={{ opacity: 1 }}>
      <div className="retro-decorations left" ref={leftDecorationsRef}>
        <div className="decoration-item">
          <img src={retroTv} alt="Retro TV" className="retro-item tv" />
        </div>
        <div className="decoration-item">
          <img src={retroCamera} alt="Vintage Camera" className="retro-item camera" />
        </div>
        <div className="decoration-item">
          <img src={retroRadio} alt="Retro Radio" className="retro-item radio" />
        </div>
      </div>
      <div className="retro-decorations right" ref={rightDecorationsRef}>
        <div className="decoration-item">
          <img src={retroPhone} alt="Retro Phone" className="retro-item phone" />
        </div>
        <div className="decoration-item">
          <img src={retroTypewriter} alt="Vintage Typewriter" className="retro-item typewriter" />
        </div>
        <div className="decoration-item">
          <img src={retroGramophone} alt="Classic Gramophone" className="retro-item gramophone" />
        </div>
      </div>
      <div className="container">
        <div className="legacy-content">
          <h2 className="legacy-title" ref={titleRef}>Legacy</h2>
          <p className="legacy-subtitle" ref={subtitleRef}>"We don't just take pictures, we craft stories that last forever"</p>
          
          <div className="timeline" ref={timelineRef}>
            <div className="timeline-decoration left" ref={leftTimelineDecorRef}>
              <div className="decoration-item">★</div>
              <div className="decoration-item">◆</div>
              <div className="decoration-item">●</div>
              <div className="decoration-item">✦</div>
              <div className="decoration-item">♦</div>
            </div>
            <div className="timeline-decoration right" ref={rightTimelineDecorRef}>
              <div className="decoration-item">✦</div>
              <div className="decoration-item">♦</div>
              <div className="decoration-item">★</div>
              <div className="decoration-item">●</div>
              <div className="decoration-item">◆</div>
            </div>
            {legacies.map((legacy, index) => (
              <div 
                key={legacy.id} 
                className="timeline-item"
                style={{ opacity: 1 }}
              >
                <div className="timeline-marker">
                  <span className="year">{legacy.year}</span>
                  <div className="dot"></div>
                </div>
                <div className="timeline-content">
                  <h3>{legacy.title}</h3>
                  <p>{legacy.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="legacy-closing" ref={legacyClosingRef}>
            <div className="stamp" ref={stampRef}>
              <span>EST.</span>
              <span className="year">2021</span>
            </div>
            <p className="closing-text text-center" ref={closingTextRef}>
              "We don't just take pictures, we craft stories that last forever"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Legacy;
