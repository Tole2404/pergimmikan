import React, { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loading from './components/common/Loading';
import ScrollToTop from './components/ScrollToTop';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import { ToastContainer } from 'react-toastify';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/index.css';
import './styles/scrollToTop.css';

const App = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Set default animation parameters
    gsap.defaults({
      duration: 0.5,
      ease: "power1.out"
    });

    // Refresh ScrollTrigger on window resize for responsiveness
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh(true);
    }, { passive: true });

    return () => {
      window.removeEventListener('resize', () => {
        ScrollTrigger.refresh(true);
      });
      
      // Kill all ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      {isLoading && <Loading overlay size="medium" text="Loading mass..." />}
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <ToastContainer position="bottom-right" />
      <PWAInstallPrompt />
    </div>
  );
};

export default App;
