import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { gsap } from 'gsap';
import heroBg from '../../assets/images/hero-bg.jpg';
import './Hero.css'; 

const Hero = () => {
  const titleRef = useRef(null);
  const audioRef = useRef(null);
  const heroRef = useRef(null);
  const subtitleRef = useRef(null);
  const dividerRef = useRef(null);
  const h2Ref = useRef(null);
  const descriptionRef = useRef(null);
  const musicPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  useEffect(() => {
    // Typewriter effect
    const title = titleRef.current;
    if (title) {
      title.classList.add('typewriter-active');
    }
    
    // Set initial states for elements to ensure they're visible
    gsap.set([subtitleRef.current, dividerRef.current, h2Ref.current, descriptionRef.current, musicPlayerRef.current], {
      opacity: 1,
      y: 0,
      scale: 1
    });
    
    // GSAP animations
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Make elements initially invisible
    gsap.set(subtitleRef.current, { opacity: 0, y: -30 });
    gsap.set(dividerRef.current, { opacity: 0, scale: 0.5 });
    gsap.set(h2Ref.current, { opacity: 0, y: 30 });
    gsap.set(descriptionRef.current, { opacity: 0, y: 30 });
    gsap.set(musicPlayerRef.current, { opacity: 0, y: 30 });
    
    // Stagger the animations
    timeline
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3
      })
      .to(dividerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "+=0.4")
      .to(h2Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.3
      }, "+=0.3")
      .to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3
      }, "+=0.3")
      .to(musicPlayerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3
      }, "+=0.2");
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(!isMuted);
  };

  return (
    <section ref={heroRef} className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-content">
        <span ref={subtitleRef} className="hero-subtitle">Welcome to</span>
        <h1 ref={titleRef} className="typewriter">PERGIMMIKAN</h1>
        <div ref={dividerRef} className="hero-divider">★ ★ ★</div>
        <h2 ref={h2Ref}>Memories & Moments</h2>
        <p ref={descriptionRef} className="hero-description">
          A collective journey of friendship, captured through our lens
        </p>
        
        <div ref={musicPlayerRef} className="hero-music-player">
          <audio ref={audioRef} loop>
            <source src="/music/Hindia-Kitakesana.mp3" type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <div className="music-player-container">
            <div className="music-player-disc">
              <div className={`disc-inner ${isPlaying ? 'spinning' : ''}`}>
                <div className="disc-center"></div>
              </div>
            </div>
            <div className="music-info-container">
              <div className="music-title-container">
                <span className="music-title">Hindia - Kita ke sana</span>
              </div>
              <div className="music-waves">
                {[...Array(7)].map((_, i) => (
                  <span key={i} className={`wave ${isPlaying ? 'active' : ''}`} style={{ '--i': i }}></span>
                ))}
              </div>
              <div className="music-controls">
                <button 
                  className={`music-btn play-btn ${isPlaying ? 'playing' : ''}`}
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? 'Pause music' : 'Play music'}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button 
                  className={`music-btn volume-btn ${isMuted ? 'muted' : ''}`}
                  onClick={handleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
