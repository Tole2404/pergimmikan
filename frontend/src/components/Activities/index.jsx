import { useState, useEffect } from 'react';
import RetroModal from '../common/RetroModal';
import DownloadImageButton from '../common/DownloadImageButton';
import { ActivitiesSkeleton } from '../common/Skeleton';
import { FaCamera, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Activities.css';

const API_URL = import.meta.env.VITE_API_URL;

const ITEMS_PER_PAGE = 5;

const truncateText = (text, maxLength = 500) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchActivities();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filter, categoryFilter, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/activities/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/activities`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setActivities(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.status === filter;
    const matchesCategory = categoryFilter === 'all' || activity.category?.id === parseInt(categoryFilter);
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    // For mobile, show limited pagination
    const isMobile = window.innerWidth <= 576;
    
    let pageButtons = [];
    if (isMobile) {
      // On mobile, show current page and one on each side if available
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`pgm-activities__page-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // On desktop, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`pgm-activities__page-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    }

    return (
      <div className="pgm-activities__pagination">
        <button
          className="pgm-activities__pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>
        
        {pageButtons}
        
        <button
          className="pgm-activities__pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  const handleViewPhotos = async (activity) => {
    try {
      const response = await fetch(`${API_URL}/api/activities/${activity.id}/gallery`);
      if (!response.ok) {
        throw new Error('Failed to fetch gallery');
      }
      const gallery = await response.json();
      setSelectedActivity({
        ...activity,
        gallery: gallery.map(img => ({
          src: `${API_URL}${img.image_url}`,
          caption: img.caption || ''
        }))
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  if (loading) {
    return (
      <div className="pgm-activities">
        <ActivitiesSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pgm-activities__error">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pgm-activities">
      {/* Decorative Scrapbook Pins */}
      <div className="scrapbook-pin pin-top-left">📌</div>
      <div className="scrapbook-pin pin-top-right">📌</div>
      <div className="scrapbook-pin pin-bottom-left">📌</div>
      <div className="scrapbook-pin pin-bottom-right">📌</div>

      <div className="pgm-activities__header">
        <h1 className="pgm-activities__title">Our Activities</h1>
        <p className="pgm-activities__subtitle">Capturing Moments, Creating Memories Together</p>
      </div>

      {/* Mobile Filters Toggle Button */}
      <div className="pgm-activities__mobile-filters-trigger">
        <button 
          className={`pgm-activities__mobile-toggle-btn ${showFiltersMobile ? 'active' : ''}`}
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
        >
          🔍 {showFiltersMobile ? 'Close Filters' : 'Filter & Search'}
        </button>
      </div>

      <div className="pgm-activities__content-wrapper">
        {/* Left Column - Filters */}
        <div className={`pgm-activities__filters-column ${showFiltersMobile ? 'show-mobile' : ''}`}>
          <div className="pgm-activities__filter-card">
            <h3 className="pgm-activities__filter-heading">Event Filters</h3>
            
            <div className="pgm-activities__filter-section">
              <h4 className="pgm-activities__filter-subheading">Event Status</h4>
              <div className="pgm-activities__status-filters">
                <button
                  className={`pgm-activities__filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setFilter('all');
                    setShowFiltersMobile(false);
                  }}
                >
                  All Activities
                </button>
                <button
                  className={`pgm-activities__filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                  onClick={() => {
                    setFilter('upcoming');
                    setShowFiltersMobile(false);
                  }}
                >
                  Upcoming Events
                </button>
                <button
                  className={`pgm-activities__filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => {
                    setFilter('completed');
                    setShowFiltersMobile(false);
                  }}
                >
                  Past Events
                </button>
              </div>
            </div>
            
            <div className="pgm-activities__filter-section">
              <h4 className="pgm-activities__filter-subheading">Categories</h4>
              <div className="pgm-activities__category-filter">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setShowFiltersMobile(false);
                  }}
                  className="pgm-activities__category-select"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pgm-activities__filter-section">
              <h4 className="pgm-activities__filter-subheading">Search</h4>
              <div className="pgm-activities__search">
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pgm-activities__search-input"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Activities List */}
        <div className="pgm-activities__list-column">
          <div className="pgm-activities__list">
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((activity) => (
                <div key={activity.id} className="pgm-activities__item">
                  {/* Polaroid Frame Image Wrapper */}
                  <div className="pgm-activities__item-image-polaroid">
                    {/* Washi tape graphic */}
                    <div className="polaroid-washi-tape"></div>
                    
                    <div className="polaroid-photo-frame">
                      <DownloadImageButton 
                        imageUrl={`${API_URL}${activity.image_url}`}
                        fileName={`activity-${activity.title.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <img 
                        src={`${API_URL}${activity.image_url}`} 
                        alt={activity.title}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="pgm-activities__item-category-badge">
                      {activity.category?.name || 'Uncategorized'}
                    </div>
                    <div className="pgm-activities__item-status-badge">
                      {activity.status === 'upcoming' ? 'Coming Soon' : 'Past Event'}
                    </div>
                  </div>
                  
                  {/* Journal Notebook content wrapper */}
                  <div className="pgm-activities__item-content-journal">
                    <div className="journal-red-margin-line"></div>
                    
                    {/* Mobile Badges (hidden on desktop) */}
                    <div className="journal-mobile-badges">
                      <span className="journal-mobile-badge category">
                        {activity.category?.name || 'Uncategorized'}
                      </span>
                      <span className="journal-mobile-badge status">
                        {activity.status === 'upcoming' ? 'Coming Soon' : 'Past Event'}
                      </span>
                    </div>
                    
                    <h2 className="pgm-activities__item-title">{activity.title}</h2>
                    <div className="pgm-activities__item-details">
                      <span><FaCalendarAlt /> {new Date(activity.date).toLocaleDateString()}</span>
                      <span><FaClock /> {activity.time}</span>
                      <span><FaMapMarkerAlt /> {activity.location}</span>
                    </div>
                    
                    <p className="pgm-activities__item-description">
                      {truncateText(activity.description)}
                    </p>
                    
                    <button 
                      className="pgm-activities__item-btn-stamp"
                      onClick={() => handleViewPhotos(activity)}
                      aria-label="View photo gallery"
                    >
                      <span>View Photos</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="pgm-activities__empty">
                <p>No activities found matching your filters</p>
              </div>
            )}
          </div>
          
          {/* Pagination controls */}
          {renderPagination()}
        </div>
      </div>

      {selectedActivity && (
        <RetroModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedActivity(null);
          }}
          images={selectedActivity.gallery}
          title={`${selectedActivity.title} - Photo Gallery`}
        />
      )}
    </div>
  );
}
