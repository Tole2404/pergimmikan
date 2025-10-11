const API_URL = import.meta.env.VITE_API_URL;

class MapService {
  // Get all journeys with coordinates for map
  async getMapData() {
    try {
      const response = await fetch(`${API_URL}/api/journeys/map/data`);
      if (!response.ok) {
        throw new Error('Failed to fetch map data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching map data:', error);
      throw error;
    }
  }

  // Get map statistics
  async getMapStatistics() {
    try {
      const response = await fetch(`${API_URL}/api/journeys/map/statistics`);
      if (!response.ok) {
        throw new Error('Failed to fetch map statistics');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching map statistics:', error);
      throw error;
    }
  }

  // Get marker icon based on destination type
  getMarkerIcon(destinationType) {
    const icons = {
      gunung: '🏔️',
      pantai: '🏖️',
      hutan: '🌲',
      air_terjun: '💧',
      gua: '🕳️',
      danau: '🏞️',
      default: '📍'
    };
    return icons[destinationType] || icons.default;
  }

  // Get color based on destination type
  getMarkerColor(destinationType) {
    const colors = {
      gunung: '#8B4513',      // Brown
      pantai: '#4A90E2',      // Blue
      hutan: '#2ECC71',       // Green
      air_terjun: '#3498DB',  // Light Blue
      gua: '#95A5A6',         // Gray
      danau: '#1ABC9C',       // Teal
      default: '#E74C3C'      // Red
    };
    return colors[destinationType] || colors.default;
  }
}

export default new MapService();
