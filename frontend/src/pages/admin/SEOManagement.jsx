import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import './styles/SEOManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SEOManagement = () => {
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSEO, setCurrentSEO] = useState({
    page_type: '',
    page_id: null,
    title: '',
    description: '',
    keywords: '',
    robots: 'index, follow',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    structured_data: ''
  });

  const pageTypes = [
    { value: 'home', label: 'Home Page' },
    { value: 'journey', label: 'Journey List' },
    { value: 'journey-detail', label: 'Journey Detail' },
    { value: 'activities', label: 'Activities' },
    { value: 'team', label: 'Team' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'events', label: 'Events' },
    { value: 'trip-calculator', label: 'Trip Calculator' },
    { value: 'about', label: 'About' },
    { value: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/seo`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSeoData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      Swal.fire('Error', 'Failed to load SEO data', 'error');
      setLoading(false);
    }
  };

  const handleOpenModal = (seo = null) => {
    if (seo) {
      setCurrentSEO(seo);
      setEditMode(true);
    } else {
      setCurrentSEO({
        page_type: '',
        page_id: null,
        title: '',
        description: '',
        keywords: '',
        robots: 'index, follow',
        canonical_url: '',
        og_title: '',
        og_description: '',
        og_image: '',
        twitter_title: '',
        twitter_description: '',
        twitter_image: '',
        structured_data: ''
      });
      setEditMode(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSEO(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editMode) {
        await axios.put(`${API_URL}/api/admin/seo/${currentSEO.id}`, currentSEO, config);
        Swal.fire('Success', 'SEO data updated successfully', 'success');
      } else {
        await axios.post(`${API_URL}/api/admin/seo`, currentSEO, config);
        Swal.fire('Success', 'SEO data created successfully', 'success');
      }

      fetchSEOData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving SEO:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save SEO data', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This SEO data will be deleted permanently',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/admin/seo/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'SEO data has been deleted', 'success');
        fetchSEOData();
      } catch (error) {
        console.error('Error deleting SEO:', error);
        Swal.fire('Error', 'Failed to delete SEO data', 'error');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading SEO data...</div>;
  }

  return (
    <div className="seo-management">
      <div className="seo-header">
        <h1><FaSearch /> SEO Management</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <FaPlus /> Add New SEO
        </button>
      </div>

      <div className="seo-table-container">
        <table className="seo-table">
          <thead>
            <tr>
              <th>Page Type</th>
              <th>Title</th>
              <th>Description</th>
              <th>Keywords</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seoData.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No SEO data found</td>
              </tr>
            ) : (
              seoData.map(seo => (
                <tr key={seo.id}>
                  <td>
                    <span className="page-type-badge">{seo.page_type}</span>
                  </td>
                  <td className="title-cell">{seo.title}</td>
                  <td className="description-cell">{seo.description?.substring(0, 80)}...</td>
                  <td className="keywords-cell">{seo.keywords?.substring(0, 50)}...</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleOpenModal(seo)}>
                      <FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(seo.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit SEO Data' : 'Add New SEO Data'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="seo-form">
              <div className="form-group">
                <label>Page Type *</label>
                <select
                  name="page_type"
                  value={currentSEO.page_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Page Type</option>
                  {pageTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={currentSEO.title}
                  onChange={handleInputChange}
                  placeholder="Page title for SEO"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={currentSEO.description}
                  onChange={handleInputChange}
                  placeholder="Meta description (150-160 characters recommended)"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={currentSEO.keywords}
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="form-group">
                <label>Robots</label>
                <select
                  name="robots"
                  value={currentSEO.robots}
                  onChange={handleInputChange}
                >
                  <option value="index, follow">Index, Follow</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
              </div>

              <div className="form-group">
                <label>Canonical URL</label>
                <input
                  type="url"
                  name="canonical_url"
                  value={currentSEO.canonical_url}
                  onChange={handleInputChange}
                  placeholder="https://pergimmikan.site/page"
                />
              </div>

              <div className="form-section">
                <h3>Open Graph (Facebook)</h3>
                
                <div className="form-group">
                  <label>OG Title</label>
                  <input
                    type="text"
                    name="og_title"
                    value={currentSEO.og_title}
                    onChange={handleInputChange}
                    placeholder="Title for social media sharing"
                  />
                </div>

                <div className="form-group">
                  <label>OG Description</label>
                  <textarea
                    name="og_description"
                    value={currentSEO.og_description}
                    onChange={handleInputChange}
                    placeholder="Description for social media"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>OG Image URL</label>
                  <input
                    type="url"
                    name="og_image"
                    value={currentSEO.og_image}
                    onChange={handleInputChange}
                    placeholder="https://pergimmikan.site/images/og-image.jpg"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Twitter Card</h3>
                
                <div className="form-group">
                  <label>Twitter Title</label>
                  <input
                    type="text"
                    name="twitter_title"
                    value={currentSEO.twitter_title}
                    onChange={handleInputChange}
                    placeholder="Title for Twitter"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter Description</label>
                  <textarea
                    name="twitter_description"
                    value={currentSEO.twitter_description}
                    onChange={handleInputChange}
                    placeholder="Description for Twitter"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter Image URL</label>
                  <input
                    type="url"
                    name="twitter_image"
                    value={currentSEO.twitter_image}
                    onChange={handleInputChange}
                    placeholder="https://pergimmikan.site/images/twitter-image.jpg"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn-save">
                  <FaSave /> {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOManagement;
