import React, { useState } from 'react';
import { FaDownload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './DownloadImageButton.css';

const DownloadImageButton = ({ imageUrl, fileName = 'image', className = '' }) => {
  const [downloading, setDownloading] = useState(false);

  const downloadImage = async () => {
    if (!imageUrl) {
      toast.error('No image to download');
      return;
    }

    setDownloading(true);

    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get file extension from URL or default to jpg
      const extension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
      link.download = `${fileName}.${extension}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      toast.success('Image downloaded!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button 
      className={`download-image-button ${className}`}
      onClick={downloadImage}
      disabled={downloading}
      title="Download this image"
    >
      {downloading ? (
        <FaSpinner className="download-spinner" />
      ) : (
        <FaDownload />
      )}
    </button>
  );
};

export default DownloadImageButton;
