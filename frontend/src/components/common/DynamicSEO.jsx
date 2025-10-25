import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { seoService } from '../../services/seoService';

const DynamicSEO = ({ pageType, pageId = null, fallback = {}, autoGenerate = null }) => {
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        setLoading(true);
        
        // Try to get SEO from database
        let data = await seoService.getSEO(pageType, pageId);
        
        // If not found and autoGenerate provided, generate from template
        if (!data && autoGenerate) {
          data = await seoService.generateSEO(
            autoGenerate.template,
            autoGenerate.variables
          );
        }
        
        setSEO(data);
      } catch (error) {
        console.error('Error loading SEO:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();
  }, [pageType, pageId, autoGenerate]);

  // Merge fetched SEO with fallback
  // Database values override fallback, but only if they're not empty
  const seoData = seo 
    ? {
        title: seo.title || fallback.title,
        description: seo.description || fallback.description,
        keywords: seo.keywords || fallback.keywords,
        robots: seo.robots || fallback.robots,
        canonical_url: seo.canonical_url || fallback.canonical_url,
        og_title: seo.og_title || fallback.og_title,
        og_description: seo.og_description || fallback.og_description,
        og_image: seo.og_image || fallback.og_image,
        twitter_title: seo.twitter_title || fallback.twitter_title,
        twitter_description: seo.twitter_description || fallback.twitter_description,
        twitter_image: seo.twitter_image || fallback.twitter_image,
        structured_data: seo.structured_data || fallback.structured_data,
      }
    : fallback;

  // Don't render if still loading and no fallback
  if (loading && !fallback.title) {
    return null;
  }

  return (
    <Helmet>
      {/* Title */}
      <title>{seoData.title || 'PERGIMMIKAN'}</title>
      
      {/* Meta Tags */}
      {seoData.description && (
        <meta name="description" content={seoData.description} />
      )}
      {seoData.keywords && (
        <meta name="keywords" content={seoData.keywords} />
      )}
      <meta name="robots" content={seoData.robots || 'index, follow'} />
      
      {/* Canonical */}
      {seoData.canonical_url && (
        <link rel="canonical" href={seoData.canonical_url} />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={seoData.og_title || seoData.title} />
      {seoData.og_description && (
        <meta property="og:description" content={seoData.og_description || seoData.description} />
      )}
      {seoData.og_image && (
        <meta property="og:image" content={seoData.og_image} />
      )}
      <meta property="og:type" content="website" />
      {seoData.canonical_url && (
        <meta property="og:url" content={seoData.canonical_url} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.twitter_title || seoData.og_title || seoData.title} />
      {(seoData.twitter_description || seoData.og_description || seoData.description) && (
        <meta name="twitter:description" content={seoData.twitter_description || seoData.og_description || seoData.description} />
      )}
      {(seoData.twitter_image || seoData.og_image) && (
        <meta name="twitter:image" content={seoData.twitter_image || seoData.og_image} />
      )}
      
      {/* Structured Data */}
      {seoData.structured_data && (
        <script type="application/ld+json">
          {typeof seoData.structured_data === 'string' 
            ? seoData.structured_data 
            : JSON.stringify(seoData.structured_data)}
        </script>
      )}
    </Helmet>
  );
};

export default DynamicSEO;
