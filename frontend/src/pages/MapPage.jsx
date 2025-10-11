import React from 'react';
import Layout from '../components/layout/Layout';
import InteractiveMap from '../components/InteractiveMap';
import PageTitle from '../components/common/PageTitle';

const MapPage = () => {
  return (
    <Layout>
      <PageTitle title="Journey Map" />
      <InteractiveMap />
    </Layout>
  );
};

export default MapPage;
