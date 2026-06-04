import React, { useEffect } from 'react';
import Hero from '../components/sections/Hero';
import Stories from '../components/sections/Stories';
import Quotes from '../components/sections/Quotes';
import Gallery from '../components/sections/Gallery';
import Events from '../components/sections/Events';
import Legacy from '../components/sections/Legacy';
import SEOHead from '../components/common/SEOHead';
import '../components/sections/styles/RetroHeaders.css';
// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Landing() {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-in-out',
      offset: 120,
    });

    window.addEventListener('resize', () => {
      AOS.refresh();
    });

    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh();
      });
    };
  }, []);

  return (
    <>
      <SEOHead
        title="PERGIMMIKAN - Komunitas Petualangan & Persahabatan Mahasiswa Budi Luhur"
        description="PERGIMMIKAN adalah komunitas petualangan dan persahabatan mahasiswa Universitas Budi Luhur. Temukan cerita journey, galeri foto, event seru, dan kenali 20+ anggota kami!"
        keywords="pergimmikan, komunitas, petualangan, travel, trip, nongkrong, budi luhur, universitas budi luhur, mahasiswa, jakarta"
        url="https://pergimmikan.site/"
        image="/images/og-image.jpg"
      />
      <Hero />
      <Stories />
      <Quotes />
      <Gallery />
      <Events />
      <Legacy />
    </>
  );
}
