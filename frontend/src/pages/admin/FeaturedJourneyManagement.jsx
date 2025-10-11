import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaStar, FaMapMarkedAlt, FaCalendarAlt, FaMountain } from 'react-icons/fa';
import './styles/Admin.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function FeaturedJourneyManagement() {
  const [featuredJourneys, setFeaturedJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentJourney, setCurrentJourney] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_path: '',
    link: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    location: '',
    latitude: '',
    longitude: '',
    duration: 1,
    difficulty: 'Moderate',
    category: 'Mountain',
    featured: true
  });
  const [allJourneys, setAllJourneys] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [journeyToDelete, setJourneyToDelete] = useState(null);

  useEffect(() => {
    fetchFeaturedJourneys();
    fetchAllJourneys();
  }, []);

  const fetchFeaturedJourneys = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/api/admin/featured-journeys`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch featured journeys');
      }

      const data = await response.json();
      setFeaturedJourneys(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching featured journeys:', err);
      setError('Failed to load featured journeys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJourneys = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/api/admin/journeys`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch journeys');
      }

      const data = await response.json();
      setAllJourneys(data);
    } catch (err) {
      console.error('Error fetching journeys:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user changes it
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.image_path.trim()) errors.image_path = "Image path is required";
    if (!formData.link.trim()) errors.link = "Link is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    
    if (formData.duration <= 0) errors.duration = "Duration must be positive";
    
    // Validate coordinates if provided
    if (formData.latitude && (isNaN(formData.latitude) || parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90)) {
      errors.latitude = "Latitude must be between -90 and 90";
    }
    
    if (formData.longitude && (isNaN(formData.longitude) || parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180)) {
      errors.longitude = "Longitude must be between -180 and 180";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = currentJourney 
        ? `${API_URL}/api/admin/featured-journeys/${currentJourney.id}` 
        : `${API_URL}/api/admin/featured-journeys`;
      
      const method = currentJourney ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save featured journey');
      }

      setShowModal(false);
      fetchFeaturedJourneys();
      
      // Reset form data
      setFormData({
        title: '',
        description: '',
        image_path: '',
        link: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        location: '',
        latitude: '',
        longitude: '',
        duration: 1,
        difficulty: 'Moderate',
        category: 'Mountain',
        featured: true
      });
      
    } catch (err) {
      console.error('Error saving featured journey:', err);
      setError(err.message || 'Failed to save featured journey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (journey) => {
    setCurrentJourney(journey);
    setFormData({
      title: journey.title,
      description: journey.description,
      image_path: journey.image_path,
      link: journey.link,
      year: journey.year,
      month: journey.month,
      location: journey.location,
      latitude: journey.latitude || '',
      longitude: journey.longitude || '',
      duration: journey.duration,
      difficulty: journey.difficulty,
      category: journey.category,
      featured: journey.featured
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!journeyToDelete) return;
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/api/admin/featured-journeys/${journeyToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete featured journey');
      }

      // Remove from state
      setFeaturedJourneys(featuredJourneys.filter(journey => journey.id !== journeyToDelete.id));
      setShowDeleteModal(false);
      setJourneyToDelete(null);
      
    } catch (err) {
      console.error('Error deleting featured journey:', err);
      setError('Failed to delete featured journey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (journey) => {
    setJourneyToDelete(journey);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentJourney(null);
    setFormErrors({});
    setFormData({
      title: '',
      description: '',
      image_path: '',
      link: '',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      location: '',
      latitude: '',
      longitude: '',
      duration: 1,
      difficulty: 'Moderate', 
      category: 'Mountain',
      featured: true
    });
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      'Easy': 'success',
      'Moderate': 'warning',
      'Hard': 'danger',
      'Extreme': 'dark'
    };
    
    return <Badge bg={colors[difficulty] || 'primary'}>{difficulty}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'Mountain': 'secondary',
      'Beach': 'info',
      'Underwater': 'primary',
      'Forest': 'success',
      'Cultural': 'warning',
      'Other': 'light'
    };
    
    return <Badge bg={colors[category] || 'primary'}>{category}</Badge>;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading featured journeys...</span>
      </div>
    );
  }

  return (
    <div className="featured-journey-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Featured Journeys</h2>
          <p className="text-muted">Manage journeys highlighted on the home page</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => {
            setCurrentJourney(null);
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" /> Add Featured Journey
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <div className="journey-grid mb-4">
        {featuredJourneys.length > 0 ? (
          <Row>
            {featuredJourneys.map((journey) => (
              <Col md={4} className="mb-4" key={journey.id}>
                <Card className="journey-card h-100">
                  <div className="journey-image-container">
                    <img 
                      src={journey.image_path.startsWith('http') 
                        ? journey.image_path 
                        : `${API_URL}${journey.image_path}`} 
                      alt={journey.title} 
                      className="journey-card-img" 
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 80'%3E%3Crect width='100%' height='100%' fill='%23f8f9fa'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='14' text-anchor='middle' fill='%23000000'%3EImage Not Found%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="journey-featured-badge">
                      <FaStar /> Featured
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title>{journey.title}</Card.Title>
                    <Card.Text className="journey-description">
                      {journey.description}
                    </Card.Text>
                    <div className="journey-details">
                      <div className="journey-detail-item">
                        <FaMapMarkedAlt className="journey-icon" />
                        <span>{journey.location}</span>
                      </div>
                      <div className="journey-detail-item">
                        <FaCalendarAlt className="journey-icon" />
                        <span>{monthNames[journey.month - 1]} {journey.year}</span>
                      </div>
                      <div className="journey-detail-item">
                        <FaMountain className="journey-icon" />
                        <span>
                          {getDifficultyBadge(journey.difficulty)} {getCategoryBadge(journey.category)}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-flex justify-content-between">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => handleEdit(journey)}
                      >
                        <FaEdit className="me-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => confirmDelete(journey)}
                      >
                        <FaTrash className="me-1" /> Remove
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center p-5 bg-light rounded">
            <p className="mb-0">No featured journeys found. Add some using the button above.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentJourney ? 'Edit Featured Journey' : 'Add Featured Journey'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.title}
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Link</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="link" 
                    value={formData.link} 
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.link}
                    placeholder="/journey/1"
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.link}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image Path</Form.Label>
              <Form.Control 
                type="text" 
                name="image_path" 
                value={formData.image_path} 
                onChange={handleInputChange}
                isInvalid={!!formErrors.image_path}
                placeholder="/images/featured/journey-name.jpg"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.image_path}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Path to image, e.g., /images/featured/bromo.jpg
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="year" 
                    value={formData.year} 
                    onChange={handleInputChange}
                    min="2000"
                    max="2050"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Month</Form.Label>
                  <Form.Select 
                    name="month" 
                    value={formData.month} 
                    onChange={handleInputChange}
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index + 1}>{month}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange}
                isInvalid={!!formErrors.location}
                maxLength={100}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.location}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="latitude" 
                    value={formData.latitude} 
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.latitude}
                    placeholder="Optional"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.latitude}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="longitude" 
                    value={formData.longitude} 
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.longitude}
                    placeholder="Optional"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.longitude}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (days)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="duration" 
                    value={formData.duration} 
                    onChange={handleInputChange}
                    min="1"
                    isInvalid={!!formErrors.duration}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.duration}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select 
                    name="difficulty" 
                    value={formData.difficulty} 
                    onChange={handleInputChange}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                    <option value="Extreme">Extreme</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                  >
                    <option value="Mountain">Mountain</option>
                    <option value="Beach">Beach</option>
                    <option value="Underwater">Underwater</option>
                    <option value="Forest">Forest</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Featured</Form.Label>
                  <Form.Check 
                    type="checkbox"
                    id="featured-checkbox"
                    label="Show on homepage"
                    name="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                'Save Journey'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{journeyToDelete?.title}</strong> from featured journeys?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .journey-grid {
          margin-top: 1.5rem;
        }
        
        .journey-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .journey-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .journey-image-container {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        
        .journey-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .journey-card:hover .journey-card-img {
          transform: scale(1.05);
        }
        
        .journey-featured-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--retro-orange);
          color: white;
          padding: 0.3rem 0.7rem;
          border-radius: 20px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .journey-description {
          height: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        
        .journey-details {
          margin-top: 1rem;
        }
        
        .journey-detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .journey-icon {
          color: var(--retro-orange);
        }
      `}</style>
    </div>
  );
}
