import Next from '../components/Next';
import SEOHead from '../components/common/SEOHead';

export default function NextPage() {
  return (
    <>
      <SEOHead
        title="Trip Calculator PERGIMMIKAN - Hitung Biaya Perjalanan"
        description="Kalkulator trip PERGIMMIKAN - hitung estimasi biaya perjalanan wisata Indonesia. Transportasi, akomodasi, perlengkapan, dan biaya lainnya."
        keywords="trip calculator, kalkulator perjalanan, biaya trip, estimasi wisata, pergimmikan, traveling indonesia"
        url="https://pergimmikan.site/next"
        image="/images/og-image.jpg"
      />
      <Next />
    </>
  );
}