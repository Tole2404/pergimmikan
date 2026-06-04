import JourneyComponent from '../components/Journey';
import SEOHead from '../components/common/SEOHead';

export default function Journey() {
  return (
    <>
      <SEOHead
        title="Perjalanan PERGIMMIKAN - Cerita Trip & Petualangan Kami"
        description="Jelajahi cerita perjalanan PERGIMMIKAN - dokumentasi trip, adventure, dan momen kebersamaan komunitas mahasiswa Budi Luhur. Dari gunung hingga pantai."
        keywords="journey pergimmikan, trip, petualangan, traveling, wisata, dokumentasi perjalanan, budi luhur"
        url="https://pergimmikan.site/journey"
        image="/images/bg-journey.jpg"
      />
      <JourneyComponent />
    </>
  );
}