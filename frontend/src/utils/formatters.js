/**
 * Format a number as Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to include the 'Rp' symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  let formatted = formatter.format(amount);
  
  // Remove the currency symbol if not needed
  if (!showSymbol) {
    formatted = formatted.replace('Rp', '').trim();
  }
  
  return formatted;
};

/**
 * Format a date string to Indonesian format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

/**
 * Format a datetime string to Indonesian format with time
 * @param {string} dateString - The datetime string to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateString) => {
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString('id-ID', options);
};
