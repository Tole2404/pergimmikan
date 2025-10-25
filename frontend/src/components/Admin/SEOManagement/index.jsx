import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faEdit, faTrash, faSave, faTimes, 
  faEye, faGlobe, faImage, faCode, faRobot 
} from '@fortawesome/free-solid-svg-icons';
import { showSuccess, showError, showConfirm } from '../../../utils/sweetalert';
import axios from 'axios';
import './SEOManagement.css';

const API_URL = import.meta.env.VITE_API_URL;

const SEOManagement = () => {
  const [seoSettings, setSeoSettings] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('settings'); // settings | templates
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [settingsRes, templatesRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/seo`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/admin/seo/templates`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSeoSettings(settingsRes.data);
      setTemplates(templatesRes.data);
    } catch (error) {
      showError('Failed to load SEO data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem({
      page_type: '',
      page_id: null,
      title: '',
      description: '',
      keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      twitter_title: '',
      twitter_description: '',
      twitter_image: '',
      canonical_url: '',
      robots: 'index, follow',
      is_active: true
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'settings') {
        if (editingItem.id) {
          // Update
          await axios.put(
            `${API_URL}/api/admin/seo/${editingItem.id}`,
            editingItem,
            { headers }
          );
          showSuccess('SEO setting updated successfully!');
        } else {
          // Create
          await axios.post(
            `${API_URL}/api/admin/seo`,
            editingItem,
            { headers }
          );
          showSuccess('SEO setting created successfully!');
        }
      } else {
        // Update template
        await axios.put(
          `${API_URL}/api/admin/seo/templates/${editingItem.id}`,
          editingItem,
          { headers }
        );
        showSuccess('Template updated successfully!');
      }

      fetchData();
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to save');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm(
      'Are you sure?',
      'This SEO setting will be deleted permanently.'
    );

    if (confirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/admin/seo/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSuccess('SEO setting deleted successfully!');
        fetchData();
      } catch (error) {
        showError('Failed to delete SEO setting');
        console.error(error);
      }
    }
  };

  const handlePreview = (item) => {
    setPreviewData(item);
  };

  const filteredSettings = seoSettings.filter(seo =>
    seo.page_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="seo-management">
        <div className="loading">Loading SEO data...</div>
      </div>
    );
  }

  return (
    <div className="seo-management">
      <div className="seo-management__header">
        <h1>
          <FontAwesomeIcon icon={faGlobe} /> SEO Management
        </h1>
        <p>Manage SEO settings for all pages dynamically</p>
      </div>

      {/* Tabs */}
      <div className="seo-management__tabs">
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FontAwesomeIcon icon={faGlobe} /> SEO Settings
        </button>
        <button
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <FontAwesomeIcon icon={faCode} /> Templates
        </button>
      </div>

      {/* SEO Settings Tab */}
      {activeTab === 'settings' && (
        <>
          {/* Search & Add */}
          <div className="seo-management__toolbar">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="Search by page type or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-add" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlus} /> Add SEO Setting
            </button>
          </div>

          {/* SEO Settings Table */}
          <div className="seo-management__table">
            <table>
              <thead>
                <tr>
                  <th>Page Type</th>
                  <th>Page ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSettings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No SEO settings found
                    </td>
                  </tr>
                ) : (
                  filteredSettings.map((seo) => (
                    <tr key={seo.id}>
                      <td>
                        <span className="badge badge-primary">
                          {seo.page_type}
                        </span>
                      </td>
                      <td>{seo.page_id || '-'}</td>
                      <td className="title-cell">{seo.title}</td>
                      <td className="description-cell">
                        {seo.description.substring(0, 80)}...
                      </td>
                      <td>
                        <span className={`badge ${seo.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {seo.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn-icon btn-preview"
                          onClick={() => handlePreview(seo)}
                          title="Preview"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(seo)}
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(seo.id)}
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="seo-management__templates">
          <div className="templates-info">
            <FontAwesomeIcon icon={faCode} />
            <p>
              Templates use variables like <code>{'{title}'}</code>, <code>{'{name}'}</code>, <code>{'{location}'}</code> 
              to generate dynamic SEO content.
            </p>
          </div>

          <div className="templates-grid">
            {templates.map((template) => (
              <div key={template.id} className="template-card">
                <div className="template-card__header">
                  <h3>{template.template_name}</h3>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => {
                      setEditingItem({ ...template });
                      setShowModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
                <div className="template-card__body">
                  <div className="template-field">
                    <label>Title Template:</label>
                    <code>{template.title_template}</code>
                  </div>
                  <div className="template-field">
                    <label>Description Template:</label>
                    <code>{template.description_template}</code>
                  </div>
                  <div className="template-field">
                    <label>Keywords Template:</label>
                    <code>{template.keywords_template}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {showModal && editingItem && (
        <SEOModal
          item={editingItem}
          isTemplate={activeTab === 'templates'}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          onChange={setEditingItem}
        />
      )}

      {/* Preview Modal */}
      {previewData && (
        <PreviewModal
          data={previewData}
          onClose={() => setPreviewData(null)}
        />
      )}
    </div>
  );
};

// SEO Edit/Add Modal Component
const SEOModal = ({ item, isTemplate, onSave, onClose, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={isTemplate ? faCode : faGlobe} />
            {item.id ? 'Edit' : 'Add'} {isTemplate ? 'Template' : 'SEO Setting'}
          </h2>
          <button className="btn-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          {isTemplate ? (
            // Template Form
            <>
              <div className="form-group">
                <label>Template Name</label>
                <input
                  type="text"
                  value={item.template_name || ''}
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label>
                  Title Template <span className="hint">Use {'{variable}'} for dynamic content</span>
                </label>
                <input
                  type="text"
                  value={item.title_template || ''}
                  onChange={(e) => handleChange('title_template', e.target.value)}
                  placeholder="{title} - PERGIMMIKAN"
                />
              </div>

              <div className="form-group">
                <label>Description Template</label>
                <textarea
                  value={item.description_template || ''}
                  onChange={(e) => handleChange('description_template', e.target.value)}
                  placeholder="Baca cerita {title} di {location}..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Keywords Template</label>
                <textarea
                  value={item.keywords_template || ''}
                  onChange={(e) => handleChange('keywords_template', e.target.value)}
                  placeholder="{title}, {location}, PERGIMMIKAN"
                  rows="2"
                />
              </div>
            </>
          ) : (
            // SEO Setting Form
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Page Type *</label>
                  <select
                    value={item.page_type || ''}
                    onChange={(e) => handleChange('page_type', e.target.value)}
                    required
                  >
                    <option value="">Select page type</option>
                    <option value="home">Home</option>
                    <option value="team">Team</option>
                    <option value="journey">Journey</option>
                    <option value="gallery">Gallery</option>
                    <option value="about">About</option>
                    <option value="contact">Contact</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Page ID <span className="hint">(optional)</span></label>
                  <input
                    type="number"
                    value={item.page_id || ''}
                    onChange={(e) => handleChange('page_id', e.target.value || null)}
                    placeholder="Leave empty for general page"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Page Title - PERGIMMIKAN"
                  required
                />
                <small>{item.title?.length || 0} / 60 characters (optimal)</small>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Page description for search engines..."
                  rows="3"
                  required
                />
                <small>{item.description?.length || 0} / 160 characters (optimal)</small>
              </div>

              <div className="form-group">
                <label>Keywords</label>
                <textarea
                  value={item.keywords || ''}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  rows="2"
                />
              </div>

              {/* Open Graph */}
              <div className="form-section">
                <h3><FontAwesomeIcon icon={faImage} /> Open Graph (Facebook)</h3>
                
                <div className="form-group">
                  <label>OG Title</label>
                  <input
                    type="text"
                    value={item.og_title || ''}
                    onChange={(e) => handleChange('og_title', e.target.value)}
                    placeholder="Leave empty to use main title"
                  />
                </div>

                <div className="form-group">
                  <label>OG Description</label>
                  <textarea
                    value={item.og_description || ''}
                    onChange={(e) => handleChange('og_description', e.target.value)}
                    placeholder="Leave empty to use main description"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>OG Image URL</label>
                  <input
                    type="text"
                    value={item.og_image || ''}
                    onChange={(e) => handleChange('og_image', e.target.value)}
                    placeholder="https://pergimmikan.site/images/og-image.jpg"
                  />
                </div>
              </div>

              {/* Twitter */}
              <div className="form-section">
                <h3><FontAwesomeIcon icon={faImage} /> Twitter Card</h3>
                
                <div className="form-group">
                  <label>Twitter Title</label>
                  <input
                    type="text"
                    value={item.twitter_title || ''}
                    onChange={(e) => handleChange('twitter_title', e.target.value)}
                    placeholder="Leave empty to use OG title"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter Description</label>
                  <textarea
                    value={item.twitter_description || ''}
                    onChange={(e) => handleChange('twitter_description', e.target.value)}
                    placeholder="Leave empty to use OG description"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter Image URL</label>
                  <input
                    type="text"
                    value={item.twitter_image || ''}
                    onChange={(e) => handleChange('twitter_image', e.target.value)}
                    placeholder="Leave empty to use OG image"
                  />
                </div>
              </div>

              {/* Other Settings */}
              <div className="form-section">
                <h3><FontAwesomeIcon icon={faRobot} /> Other Settings</h3>
                
                <div className="form-group">
                  <label>Canonical URL</label>
                  <input
                    type="text"
                    value={item.canonical_url || ''}
                    onChange={(e) => handleChange('canonical_url', e.target.value)}
                    placeholder="https://pergimmikan.site/page"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Robots</label>
                    <select
                      value={item.robots || 'index, follow'}
                      onChange={(e) => handleChange('robots', e.target.value)}
                    >
                      <option value="index, follow">Index, Follow</option>
                      <option value="noindex, follow">No Index, Follow</option>
                      <option value="index, nofollow">Index, No Follow</option>
                      <option value="noindex, nofollow">No Index, No Follow</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={item.is_active ? 'true' : 'false'}
                      onChange={(e) => handleChange('is_active', e.target.value === 'true')}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </button>
          <button className="btn btn-primary" onClick={onSave}>
            <FontAwesomeIcon icon={faSave} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Preview Modal Component
const PreviewModal = ({ data, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faEye} /> SEO Preview
          </h2>
          <button className="btn-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          {/* Google Preview */}
          <div className="preview-section">
            <h3>Google Search Preview</h3>
            <div className="google-preview">
              <div className="google-url">{data.canonical_url || 'https://pergimmikan.site'}</div>
              <div className="google-title">{data.title}</div>
              <div className="google-description">{data.description}</div>
            </div>
          </div>

          {/* Facebook Preview */}
          <div className="preview-section">
            <h3>Facebook Preview</h3>
            <div className="facebook-preview">
              {data.og_image && (
                <div className="fb-image">
                  <img src={data.og_image} alt="OG Preview" />
                </div>
              )}
              <div className="fb-content">
                <div className="fb-title">{data.og_title || data.title}</div>
                <div className="fb-description">
                  {data.og_description || data.description}
                </div>
                <div className="fb-url">{data.canonical_url || 'pergimmikan.site'}</div>
              </div>
            </div>
          </div>

          {/* Twitter Preview */}
          <div className="preview-section">
            <h3>Twitter Preview</h3>
            <div className="twitter-preview">
              {(data.twitter_image || data.og_image) && (
                <div className="twitter-image">
                  <img src={data.twitter_image || data.og_image} alt="Twitter Preview" />
                </div>
              )}
              <div className="twitter-content">
                <div className="twitter-title">
                  {data.twitter_title || data.og_title || data.title}
                </div>
                <div className="twitter-description">
                  {data.twitter_description || data.og_description || data.description}
                </div>
                <div className="twitter-url">{data.canonical_url || 'pergimmikan.site'}</div>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="preview-section">
            <h3>Meta Information</h3>
            <div className="meta-info">
              <div className="meta-row">
                <strong>Keywords:</strong>
                <span>{data.keywords || 'None'}</span>
              </div>
              <div className="meta-row">
                <strong>Robots:</strong>
                <span>{data.robots}</span>
              </div>
              <div className="meta-row">
                <strong>Status:</strong>
                <span className={`badge ${data.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {data.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOManagement;
