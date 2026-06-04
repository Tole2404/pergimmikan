import React from 'react';
import TeamComponent from '../components/Team';
import SEOHead from '../components/common/SEOHead';

const TeamPage = () => {
  return (
    <>
      <SEOHead
        title="Tim PERGIMMIKAN - Kenali Anggota Komunitas Kami | Budi Luhur"
        description="Kenali tim PERGIMMIKAN - komunitas mahasiswa Universitas Budi Luhur yang gemar berpetualang. Tunggul Bayu Kusuma (Ketua), Deva, Akbar, Aldi, dan 16 anggota lainnya."
        keywords="tim pergimmikan, anggota pergimmikan, tunggul bayu kusuma, budi luhur, mahasiswa, komunitas"
        url="https://pergimmikan.site/team"
        image="/images/og-image.jpg"
      />
      <TeamComponent />
    </>
  );
};

export default TeamPage;