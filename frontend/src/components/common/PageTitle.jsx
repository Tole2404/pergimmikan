import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Komponen untuk mengatur title halaman dinamis
 * @param {string} title - Judul halaman yang akan ditampilkan
 * @param {string} defaultTitle - Judul default "PERGIMMIKAN" 
 */
const PageTitle = ({ title, defaultTitle = "PERGIMMIKAN" }) => {
  const pageTitle = title ? `${defaultTitle} - ${title}` : defaultTitle;
  
  return (
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet>
  );
};

export default PageTitle;
