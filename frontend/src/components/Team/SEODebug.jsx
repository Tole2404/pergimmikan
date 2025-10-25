import { useEffect, useState } from 'react';

export default function SEODebug() {
  const [seoData, setSeoData] = useState({});

  useEffect(() => {
    // Wait longer for React Helmet AND API to update
    const checkSEO = () => {
      const keywords = document.querySelector('meta[name="keywords"]')?.content || 'Not found';
      const description = document.querySelector('meta[name="description"]')?.content || 'Not found';
      const title = document.querySelector('title')?.textContent || 'Not found';
      
      const structuredDataEl = document.querySelector('script[type="application/ld+json"]:not([id])');
      let structuredData = 'Not found';
      let memberCount = 0;
      
      if (structuredDataEl) {
        try {
          const data = JSON.parse(structuredDataEl.textContent);
          structuredData = 'Found';
          memberCount = data.itemListElement?.length || 0;
        } catch (e) {
          structuredData = 'Invalid JSON';
        }
      }

      setSeoData({
        title,
        keywords,
        description,
        structuredData,
        memberCount
      });
    };

    // Check immediately
    checkSEO();
    
    // Check again after 2 seconds (after API loads)
    const timer1 = setTimeout(checkSEO, 2000);
    
    // Check again after 4 seconds (final check)
    const timer2 = setTimeout(checkSEO, 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #2c5f2d',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '12px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#2c5f2d' }}>🔍 SEO Debug</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Title:</strong>
        <div style={{ color: '#666', wordBreak: 'break-word' }}>{seoData.title}</div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Keywords:</strong>
        <div style={{ color: '#666', wordBreak: 'break-word', maxHeight: '100px', overflow: 'auto' }}>
          {seoData.keywords}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Description:</strong>
        <div style={{ color: '#666', wordBreak: 'break-word', maxHeight: '80px', overflow: 'auto' }}>
          {seoData.description}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Structured Data:</strong>
        <div style={{ color: seoData.structuredData === 'Found' ? 'green' : 'red' }}>
          {seoData.structuredData}
          {seoData.memberCount > 0 && ` (${seoData.memberCount} members)`}
        </div>
      </div>

      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
        <strong>Member Name Test:</strong>
        {['Tunggul Bayu Kusuma', 'Deva', 'Akbar', 'Fira', 'Jordi', 'Zul', 'Kahfi', 'Farrel'].map(name => {
          const found = seoData.keywords?.includes(name);
          return (
            <div key={name} style={{ color: found ? 'green' : 'red' }}>
              {name}: {found ? '✅ Found' : '❌ Not found'}
            </div>
          );
        })}
      </div>
    </div>
  );
}
