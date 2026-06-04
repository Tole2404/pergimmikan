import React from 'react';
import Activities from '../components/Activities';
import Layout from '../components/layout/Layout';
import SEOHead from '../components/common/SEOHead';

const ActivitiesPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Aktivitas & Event PERGIMMIKAN - Kegiatan Komunitas Budi Luhur"
        description="Lihat aktivitas dan event PERGIMMIKAN - kegiatan seru komunitas mahasiswa Budi Luhur. Trip wisata, nongkrong, gathering, dan berbagai acara menarik."
        keywords="aktivitas pergimmikan, event, kegiatan, gathering, trip, nongkrong, budi luhur, mahasiswa"
        url="https://pergimmikan.site/activities"
        image="/images/og-image.jpg"
      />
      <Activities />
    </Layout>
  );
};

export default ActivitiesPage;
