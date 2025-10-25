import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  author = 'PERGIMMIKAN',
  keywords = 'journey, travel, adventure, photography',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://pergimmikan.site';
  const fullUrl = url || window.location.href;
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/og-image.jpg`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook - Enhanced */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:secure_url" content={fullImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="PERGIMMIKAN" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Article specific tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
          <meta property="article:author" content={author} />
        </>
      )}

      {/* Twitter - Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@pergimmikan" />
      <meta name="twitter:creator" content="@pergimmikan" />

      {/* WhatsApp specific */}
      <meta property="og:image:width" content="300" />
      <meta property="og:image:height" content="300" />

      {/* Additional SEO */}
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Indonesian" />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#2c5f2d" />
    </Helmet>
  );
};

export default SEOHead;
