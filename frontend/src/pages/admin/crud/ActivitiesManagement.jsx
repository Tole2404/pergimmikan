import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaImages, FaCalendarAlt, FaMapMarkerAlt, FaTag, FaSearch, FaSync, FaFolderOpen, FaTags } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/ManagementComponents.css';
import Loading from '../../../components/common/Loading';
import { showSuccess, showError, showConfirm, showLoading, closePopup, showInfo } from '../../../utils/sweetalert';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

const ActivitiesManagement = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadingStatus, setUploadingStatus] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch activities');

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to load activities. Please try again.');
      showError('Error', 'Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/activities/categories/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Error', 'Failed to load categories. Please try again.');
    }
  };

  const handleShowGalleryModal = async (activity) => {
    setSelectedActivity(activity);
    showLoading('LOADING GALLERY...', 'Please wait while we load the gallery images');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/activities/${activity.id}/gallery`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch gallery');

      const data = await response.json();
      setGalleryImages(data);
      closePopup();
      setShowGalleryModal(true);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      closePopup();
      showError('Error', 'Failed to load gallery images. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm(
      'Delete Activity?', 
      'Are you sure you want to delete this activity? This action cannot be undone.',
      'YES, DELETE',
      'CANCEL'
    );

    if (!result.isConfirmed) return;

    showLoading('DELETING...', 'Please wait while we delete this activity');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete activity');

      closePopup();
      showSuccess('SUCCESS!', 'Activity successfully deleted');
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      closePopup();
      showError('Error', 'Failed to delete activity. Please try again.');
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await showConfirm(
      'Delete Category?', 
      'Are you sure you want to delete this category? This may affect associated activities.',
      'YES, DELETE',
      'CANCEL'
    );

    if (!result.isConfirmed) return;

    showLoading('DELETING...', 'Please wait while we delete this category');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/activities/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete category');

      closePopup();
      showSuccess('SUCCESS!', 'Category successfully deleted');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      closePopup();
      showError('Error', 'Failed to delete category. Please try again.');
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Tampilkan loading saat kompresi
    showLoading('Compressing Images', 'Please wait while we optimize your images...');
    
    try {
      // Opsi kompresi
      const options = {
        maxSizeMB: 1,             // Maksimum 1MB
        maxWidthOrHeight: 1920,   // Maksimum lebar/tinggi 1920px
        useWebWorker: true,       // Gunakan web worker untuk proses di background
        initialQuality: 0.7,      // Kualitas awal 70%
      };
      
      // Proses semua file secara paralel
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            // Lewati kompresi jika file sudah kecil (kurang dari 1MB)
            if (file.size <= 1024 * 1024) return file;
            
            const compressedFile = await imageCompression(file, options);
            console.log(`Kompresi: ${file.name} dari ${file.size / 1024 / 1024}MB menjadi ${compressedFile.size / 1024 / 1024}MB`);
            return compressedFile;
          } catch (error) {
            console.error('Error saat mengompres file:', error);
            return file; // Kembalikan file asli jika terjadi error
          }
        })
      );
      
      // Tutup loading dialog
      closePopup();
      
      // Upload file satu per satu
      const token = localStorage.getItem('adminToken');
      let successCount = 0;
      
      for (let i = 0; i < compressedFiles.length; i++) {
        showLoading(
          `Uploading Image ${i + 1}/${compressedFiles.length}`,
          `Uploading image ${i + 1} of ${compressedFiles.length}`
        );

        try {
          // Buat FormData baru untuk setiap gambar
          const formData = new FormData();
          
          // Pastikan file memiliki ekstensi yang benar
          const file = compressedFiles[i];
          
          // Tambahkan file ke formData dengan nama yang benar
          formData.append('images', file, file.name || `image-${i}.jpg`);

          // Upload gambar
          const response = await fetch(`${API_URL}/api/admin/activities/${selectedActivity.id}/gallery`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`Failed to upload image ${i + 1}: ${response.status} ${errorText}`);
          }

          successCount++;
        } catch (error) {
          console.error(`Error uploading image ${i + 1}:`, error);
          // Tidak perlu menampilkan error untuk setiap gambar
        }
      }

      closePopup();
      if (successCount === compressedFiles.length) {
        showSuccess('Success', 'All images uploaded successfully');
      } else if (successCount > 0) {
        showInfo('Partial Success', `${successCount} out of ${compressedFiles.length} images uploaded successfully`);
      } else {
        showError('Upload Failed', 'Failed to upload all images. Please try again.');
      }

      // Refresh galeri
      handleShowGalleryModal(selectedActivity);
    } catch (error) {
      console.error('Error in upload process:', error);
      closePopup();
      showError('Error', 'Failed to process images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    const result = await showConfirm(
      'Delete Image?', 
      'Are you sure you want to delete this image? This action cannot be undone.',
      'YES, DELETE',
      'CANCEL'
    );

    if (!result.isConfirmed) return;

    showLoading('DELETING...', 'Please wait while we delete this image');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/activities/gallery/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete image');

      closePopup();
      showSuccess('SUCCESS!', 'Image deleted successfully');
      handleShowGalleryModal(selectedActivity);
    } catch (error) {
      console.error('Error deleting image:', error);
      closePopup();
      showError('Error', 'Failed to delete image. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadgeVariant = (status) => {
    let variant = 'secondary';
    
    switch(status?.toLowerCase()) {
      case 'upcoming':
        variant = 'primary';
        break;
      case 'ongoing':
        variant = 'success';
        break;
      case 'completed':
        variant = 'info';
        break;
      case 'cancelled':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    
    return variant;
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'No Category';
  };

  const filteredActivities = activities.filter(activity => 
    activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryNameById(activity.categoryId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container fluid className="activities-container_management">
        <Loading size="medium" overlay={false} text="Loading activities data..." />
      </Container>
    );
  }

  const ActivityCard = ({ activity }) => {
    return (
      <Card className="mb-3 activity-card-mobile_management">
        <Card.Header className="activity-card-header-mobile_management">
          <div className="d-flex justify-content-between align-items-center">
            <div className="activity-title-mobile_management">{activity.title}</div>
            <Badge 
              bg={getStatusBadgeVariant(activity.status)} 
              className="activity-status-badge_management"
            >
              {activity.status}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="activity-card-body-mobile_management">
          <div className="activity-detail-item_management mb-2">
            <FaCalendarAlt className="me-2 activity-icon_management" />
            {formatDate(activity.date)}
          </div>
          <div className="activity-detail-item_management mb-2">
            <FaMapMarkerAlt className="me-2 activity-icon_management" />
            {activity.location || 'N/A'}
          </div>
          <div className="activity-detail-item_management mb-3">
            <FaTag className="me-2 activity-icon_management" />
            {getCategoryNameById(activity.categoryId)}
          </div>
          <div className="activity-actions-mobile_management mt-2">
            <Button 
              variant="info" 
              size="sm" 
              className="mobile-action-btn_management"
              onClick={() => handleShowGalleryModal(activity)}
            >
              <FaImages className="me-1" /> Gallery
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="mobile-action-btn_management"
              onClick={() => navigate(`/dashboard/activities/edit/${activity.id}`)}
            >
              <FaEdit className="me-1" /> Edit
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              className="mobile-action-btn_management"
              onClick={() => handleDelete(activity.id)}
            >
              <FaTrash className="me-1" /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const CategoryCard = ({ category }) => {
    const count = activities.filter(a => a.categoryId === category.id).length;
    
    return (
      <Card className="mb-3 category-card-mobile_management">
        <Card.Body className="category-card-body-mobile_management">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="category-name-mobile_management">
              <FaTag className="me-2 category-icon_management" />
              {category.name}
            </div>
            <Badge 
              bg={count > 0 ? "primary" : "secondary"} 
              className="category-activities-count-mobile_management"
            >
              {count} {count === 1 ? 'Activity' : 'Activities'}
            </Badge>
          </div>
          <div className="category-actions-mobile_management">
            <Button 
              variant="primary" 
              size="sm" 
              className="mobile-action-btn_management"
              onClick={() => navigate(`/dashboard/categories/edit/${category.id}`)}
            >
              <FaEdit className="me-1" /> Edit
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              className="mobile-action-btn_management"
              onClick={() => handleDeleteCategory(category.id)}
            >
              <FaTrash className="me-1" /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="activities-container_management">
      <div className="activities-header_management">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
        <div className="activities-title_management">
          <h5>Activities Management</h5>
          <p className="activities-subtitle_management">Kelola semua activities di satu tempat</p>
        </div>
        </Col>
      </div>

      <Card className="activities-card_management mb-4">
        <Card.Header className="activities-card-header_management">
          <Tabs
            activeKey={activeTab}
            onSelect={k => setActiveTab(k)}
            className="activities-tabs_management"
          >
            <Tab eventKey="activities" title="Activities">
              <div className="tab-content-placeholder"></div>
            </Tab>
            <Tab eventKey="categories" title="Categories">
              <div className="tab-content-placeholder"></div>
            </Tab>
          </Tabs>
        </Card.Header>

        {/* Tab content container */}
        <div className="activities-tab-content_management">
          {activeTab === 'activities' && (
            <>
              <div className="activities-toolbar_management">
                <div className="activities-search_management">
                  <div className="search-input-container_management">
                    <Form.Control
                      type="text"
                      placeholder="Cari activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input_management"
                    />
                  </div>
                </div>
                <div className="activities-actions_management">
                  <Button 
                    variant="primary" 
                    className="activities-add-button_management"
                    onClick={() => navigate('/dashboard/activities/add')}
                  >
                    <FaPlus className="me-2" /> Tambah Activity
                  </Button>
                </div>
              </div>

              {error && (
                <div className="activities-error-alert_management">
                  <strong>Error loading activities:</strong> {error}
                  <Button variant="link" onClick={fetchActivities} className="p-0 ms-2">
                    Try Again
                  </Button>
                </div>
              )}

              {filteredActivities.length === 0 ? (
                <div className="activities-empty_management">
                  <FaFolderOpen className="activities-empty-icon_management text-muted" />
                  <h5>Tidak ada activities</h5>
                  <p className="text-muted">
                    {activities.length === 0
                      ? "Anda belum membuat activities."
                      : "Tidak ada activities yang cocok dengan pencarian Anda."}
                  </p>
                </div>
              ) : (
                <>
                  {isMobile ? (
                    <div className="activities-cards-container_management">
                      {filteredActivities.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  ) : (
                    <div className="d-none d-md-block">
                      <div className="activities-table-container_management">
                        <Table hover responsive className="activities-table_management">
                          <thead className="activities-table-header_management">
                            <tr>
                              <th style={{ width: '25%' }}>Title</th>
                              <th style={{ width: '15%' }}>Date</th>
                              <th style={{ width: '20%' }}>Location</th>
                              <th style={{ width: '15%' }}>Category</th>
                              <th style={{ width: '10%' }}>Status</th>
                              <th style={{ width: '15%' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredActivities.map((activity) => (
                              <tr key={activity.id} className="activities-table-row_management">
                                <td className="activity-title-cell_management">
                                  <span className="activity-title_management">{activity.title}</span>
                                </td>
                                <td>
                                  <div className="activity-date_management">
                                    <FaCalendarAlt className="me-2 activity-icon_management" />
                                    {formatDate(activity.date)}
                                  </div>
                                </td>
                                <td>
                                  <div className="activity-location_management">
                                    <FaMapMarkerAlt className="me-2 activity-icon_management" />
                                    {activity.location || 'N/A'}
                                  </div>
                                </td>
                                <td>
                                  <div className="activity-category_management">
                                    <FaTag className="me-2 activity-icon_management" />
                                    {getCategoryNameById(activity.categoryId)}
                                  </div>
                                </td>
                                <td>
                                  <Badge 
                                    bg={getStatusBadgeVariant(activity.status)} 
                                    className="activity-status-badge_management"
                                  >
                                    {activity.status}
                                  </Badge>
                                </td>
                                <td>
                                  <div className="activity-actions_management">
                                    <Button
                                      variant="info"
                                      size="sm"
                                      className="me-1 activity-gallery-btn_management"
                                      onClick={() => handleShowGalleryModal(activity)}
                                    >
                                      <FaImages />
                                    </Button>
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      className="me-1 activity-edit-btn_management"
                                      onClick={() => navigate(`/dashboard/activities/edit/${activity.id}`)}
                                    >
                                      <FaEdit />
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="activity-delete-btn_management"
                                      onClick={() => handleDelete(activity.id)}
                                    >
                                      <FaTrash />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'categories' && (
            <>
              <div className="categories-toolbar_management">
                <div className="categories-count_management">
                  <Badge bg="info" className="category-count-badge_management">
                    {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
                  </Badge>
                </div>
                <div className="categories-actions_management">
                  <Button 
                    variant="success" 
                    className="categories-add-button_management"
                    onClick={() => navigate('/dashboard/activities/categories/add')}
                  >
                    <FaPlus className="me-2" /> Tambah Category
                  </Button>
                </div>
              </div>

              {categories.length === 0 ? (
                <div className="categories-empty_management">
                  <FaTags className="categories-empty-icon_management text-muted" />
                  <h5>No categories found</h5>
                  <p className="text-muted">
                    You haven't created any categories yet.
                  </p>
                </div>
              ) : (
                <>
                  {isMobile ? (
                    <div className="categories-cards-container_management">
                      {categories.map(category => (
                        <CategoryCard key={category.id} category={category} />
                      ))}
                    </div>
                  ) : (
                    <div className="d-none d-md-block">
                      <div className="categories-table-container_management">
                        <Table responsive hover className="categories-table_management">
                          <thead className="categories-table-header_management">
                            <tr>
                              <th style={{ width: '40%' }}>Category Name</th>
                              <th style={{ width: '40%' }}>Activities</th>
                              <th style={{ width: '20%' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((category) => {
                              const count = activities.filter(a => a.categoryId === category.id).length;
                              return (
                                <tr key={category.id} className="categories-table-row_management">
                                  <td>
                                    <div className="category-name_management">
                                      <FaTag className="me-2 category-icon_management" />
                                      {category.name}
                                    </div>
                                  </td>
                                  <td>
                                    <Badge
                                      bg={count > 0 ? "primary" : "secondary"}
                                      className="category-activities-count_management"
                                    >
                                      {count} {count === 1 ? 'Activity' : 'Activities'}
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="category-actions_management">
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        className="me-1 category-edit-btn_management"
                                        onClick={() => navigate(`/dashboard/categories/edit/${category.id}`)}
                                      >
                                        <FaEdit />
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="category-delete-btn_management"
                                        onClick={() => handleDeleteCategory(category.id)}
                                      >
                                        <FaTrash />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Gallery Modal */}
      <Modal 
        show={showGalleryModal} 
        onHide={() => setShowGalleryModal(false)} 
        size="xl"
        className="gallery-modal_management"
      >
        <Modal.Header closeButton className="gallery-modal-header_management">
          <Modal.Title>
            <FaImages className="me-2" />
            Gallery: {selectedActivity?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="gallery-modal-body_management">
          <Form.Group className="mb-4 gallery-upload-section_management">
            <div className="gallery-upload-container_management">
              <div className="gallery-upload-label_management">
                <FaImages className="me-2" />
                Upload New Images
              </div>
              <Form.Control
                type="file"
                multiple
                onChange={handleGalleryUpload}
                accept="image/*"
                disabled={uploading}
                className="gallery-file-input_management"
              />
              {uploading && (
                <div className="mt-3 gallery-upload-progress_management">
                  <div className="d-flex justify-content-between mb-1">
                    <small>{uploadingStatus}</small>
                    <small>{currentFileIndex} of {totalFiles} ({uploadProgress}%)</small>
                  </div>
                  <ProgressBar 
                    now={uploadProgress} 
                    variant="info" 
                    animated 
                    className="gallery-progress-bar_management" 
                  />
                </div>
              )}
            </div>
          </Form.Group>
          
          {galleryImages.length === 0 ? (
            <div className="gallery-empty_management">
              <div className="gallery-empty-icon_management">🖼️</div>
              <h4>No Images Yet</h4>
              <p>Upload some images to get started</p>
            </div>
          ) : (
            <Row className="gallery-images-container_management">
              {galleryImages.map((image) => (
                <Col key={image.id} lg={3} md={4} sm={6} xs={12} className="mb-3">
                  <Card className="gallery-image-card_management">
                    <div className="gallery-image-wrapper_management">
                      <Card.Img 
                        variant="top" 
                        src={`${API_URL}${image.image_url}`} 
                        className="gallery-image_management"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                    </div>
                    <Card.Body className="gallery-image-body_management">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id)}
                        className="gallery-delete-btn_management"
                        disabled={uploading}
                      >
                        <FaTrash className="me-1" /> Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ActivitiesManagement;
