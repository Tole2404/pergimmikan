import React, { useState } from 'react';
import { FaFilePdf, FaDownload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ExportButton.css';

const ExportButton = ({ elementId, fileName = 'journey', title = 'Journey' }) => {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    setExporting(true);
    
    try {
      // Get the element to export
      const element = document.getElementById(elementId);
      
      if (!element) {
        throw new Error('Element not found');
      }

      // Show loading toast
      const loadingToast = toast.info('Preparing PDF...', { autoClose: false });

      // Clone element to avoid modifying original
      const clone = element.cloneNode(true);
      
      // Apply styles for better PDF output
      clone.style.width = '800px';
      clone.style.padding = '40px';
      clone.style.background = 'white';
      
      // Temporarily add to body
      document.body.appendChild(clone);

      // Convert to canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
      });

      // Remove clone
      document.body.removeChild(clone);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      const timestamp = new Date().toISOString().split('T')[0];
      pdf.save(`${fileName}-${timestamp}.pdf`);

      // Close loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button 
      className="export-button"
      onClick={exportToPDF}
      disabled={exporting}
      title="Export as PDF"
    >
      {exporting ? (
        <>
          <FaSpinner className="export-spinner" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <FaFilePdf />
          <span>Export PDF</span>
        </>
      )}
    </button>
  );
};

export default ExportButton;
