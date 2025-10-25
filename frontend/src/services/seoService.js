import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const seoService = {
  /**
   * Get SEO for specific page
   * @param {string} pageType - Type of page (home, team, journey, etc)
   * @param {number|null} pageId - Specific page ID (optional)
   */
  async getSEO(pageType, pageId = null) {
    try {
      const url = pageId 
        ? `${API_URL}/api/seo/${pageType}/${pageId}`
        : `${API_URL}/api/seo/${pageType}`;
      
      console.log('🌐 Fetching SEO from:', url);
      const response = await axios.get(url);
      console.log('✅ SEO Response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: Object.keys(response.data || {}),
        keywordsLength: response.data?.keywords?.length || 0
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching SEO:', error.response?.status, error.message);
      return null;
    }
  },

  /**
   * Generate SEO from template
   * @param {string} templateName - Template name (journey_detail, team_member, etc)
   * @param {object} variables - Variables to replace in template
   */
  async generateSEO(templateName, variables) {
    try {
      const response = await axios.post(`${API_URL}/api/seo/generate`, {
        templateName,
        variables
      });
      return response.data;
    } catch (error) {
      console.error('Error generating SEO:', error);
      return null;
    }
  }
};
