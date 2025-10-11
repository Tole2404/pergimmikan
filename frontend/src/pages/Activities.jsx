import React from 'react';
import Activities from '../components/Activities';
import Layout from '../components/layout/Layout';
import PageTitle from '../components/common/PageTitle';

const ActivitiesPage = () => {
  return (
    <Layout>
      <PageTitle title="Aktivitas" />
      <Activities />
    </Layout>
  );
};

export default ActivitiesPage;
