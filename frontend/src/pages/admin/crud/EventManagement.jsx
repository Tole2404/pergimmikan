import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner, Collapse, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaClock, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { showSuccess, showError, showConfirm, showLoading, closePopup } from '../../../utils/sweetalert';
import Loading from '../../../components/common/Loading';
import '../styles/EventManagement.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minParticipants: '',
    maxParticipants: '',
    fromDate: '',
    toDate: '',
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    max_participants: '',
    registration_deadline: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Update active filters whenever filters change
    const newActiveFilters = [];
    
    if (filters.location) {
      newActiveFilters.push({ 
        key: 'location', 
        label: `Location: ${filters.location}`, 
        value: filters.location 
      });
    }
    
    if (filters.minParticipants) {
      newActiveFilters.push({ 
        key: 'minParticipants', 
        label: `Min Participants: ${filters.minParticipants}`, 
        value: filters.minParticipants 
      });
    }
    
    if (filters.maxParticipants) {
      newActiveFilters.push({ 
        key: 'maxParticipants', 
        label: `Max Participants: ${filters.maxParticipants}`, 
        value: filters.maxParticipants 
      });
    }
    
    if (filters.fromDate) {
      const formattedDate = new Date(filters.fromDate).toLocaleDateString();
      newActiveFilters.push({ 
        key: 'fromDate', 
        label: `From: ${formattedDate}`, 
        value: filters.fromDate 
      });
    }
    
    if (filters.toDate) {
      const formattedDate = new Date(filters.toDate).toLocaleDateString();
      newActiveFilters.push({ 
        key: 'toDate', 
        label: `To: ${formattedDate}`, 
        value: filters.toDate 
      });
    }
    
    setActiveFilters(newActiveFilters);
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
      await showError('Error', 'Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const loadingAlert = showLoading(selectedEvent ? 'Updating Event' : 'Creating Event', 'Please wait...');

    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedEvent 
        ? `${API_URL}/api/admin/events/${selectedEvent.id}`
        : `${API_URL}/api/admin/events`;

      const method = selectedEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save event');

      closePopup();
      await showSuccess(
        selectedEvent ? 'Event Updated!' : 'Event Created!',
        selectedEvent ? 'The event has been successfully updated.' : 'The event has been successfully created.'
      );
      
      setShowModal(false);
      fetchEvents();
      resetForm();
    } catch (err) {
      closePopup();
      console.error('Error saving event:', err);
      setError('Failed to save event');
      await showError('Error', 'Failed to save event. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm(
      'Delete Event?',
      'Are you sure you want to delete this event? This action cannot be undone.',
      'Yes, Delete It!',
      'Cancel'
    );

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/api/admin/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete event');

        await showSuccess('Event Deleted!', 'The event has been successfully deleted.');
        fetchEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
        await showError('Error', 'Failed to delete event. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      max_participants: '',
      registration_deadline: ''
    });
    setSelectedEvent(null);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      minParticipants: '',
      maxParticipants: '',
      fromDate: '',
      toDate: '',
    });
  };

  const removeFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: ''
    }));
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date.split('T')[0],
      event_time: event.event_time,
      location: event.location,
      max_participants: event.max_participants,
      registration_deadline: event.registration_deadline?.split('.')[0] || ''
    });
    setShowModal(true);
  };

  // Apply filters and search term
  const filteredEvents = events.filter(event => {
    // Text search
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower);
    
    if (!matchesSearch) return false;

    // Location filter
    if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Participants range filter
    const participants = parseInt(event.max_participants);
    if (filters.minParticipants && participants < parseInt(filters.minParticipants)) {
      return false;
    }
    if (filters.maxParticipants && participants > parseInt(filters.maxParticipants)) {
      return false;
    }
    
    // Date range filter
    const eventDate = new Date(event.event_date);
    if (filters.fromDate && eventDate < new Date(filters.fromDate)) {
      return false;
    }
    if (filters.toDate && eventDate > new Date(filters.toDate)) {
      return false;
    }
    
    return true;
  });

  if (loading && events.length === 0) {
    return <Loading text="Loading events..." overlay={true} />;
  }

  return (
    <Container fluid className="py-4 event-dashboard">
      <div className="management-header__event d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <h5 className="mb-0 fw-bold">Event Management</h5>
          <p className="text-muted small mb-0 d-none d-md-block">
            Kelola semua event di satu tempat
          </p>
        </Col>
        <Button 
          variant="primary" 
          className="action-create"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" />
          <span className="d-none d-md-inline">Tambah Event Baru</span>
        </Button>
      </div>

      {/* Search and filter section */}
      <div className="search-area mb-4 p-3 rounded">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-center mb-3">
          <div className="search-container position-relative flex-grow-1 w-100">
            <FaSearch className="search-indicator position-absolute" />
            <Form.Control
              type="text"
              placeholder="Cari event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-4 search-field"
            />
          </div>
          <Button 
            variant="outline-secondary" 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="me-2" />
            <span>Filters</span>
            {showFilters ? <FaChevronUp className="ms-2" /> : <FaChevronDown className="ms-2" />}
          </Button>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="active-filters mb-3 d-flex flex-wrap gap-2 align-items-center">
            <span className="text-muted me-2">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter.key} className="filter-badge">
                {filter.label}
                <FaTimes 
                  className="ms-2 remove-filter-icon" 
                  onClick={() => removeFilter(filter.key)} 
                />
              </Badge>
            ))}
            <Button 
              variant="link" 
              className="reset-filters p-0 ms-2"
              onClick={resetFilters}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Filter panel */}
        <Collapse in={showFilters}>
          <div className="filter-panel py-3">
            <Form>
              <Row>
                <Col xs={12} md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Filter by location"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Date Range</Form.Label>
                    <div className="d-flex gap-2 flex-column flex-sm-row">
                      <Form.Control 
                        type="date" 
                        placeholder="From"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                        className="mb-2 mb-sm-0"
                      />
                      <Form.Control 
                        type="date" 
                        placeholder="To"
                        value={filters.toDate}
                        onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Participants Range</Form.Label>
                    <div className="d-flex gap-2 flex-column flex-sm-row">
                      <Form.Control 
                        type="number" 
                        placeholder="Min"
                        value={filters.minParticipants}
                        onChange={(e) => setFilters({...filters, minParticipants: e.target.value})}
                        className="mb-2 mb-sm-0"
                      />
                      <Form.Control 
                        type="number" 
                        placeholder="Max"
                        value={filters.maxParticipants}
                        onChange={(e) => setFilters({...filters, maxParticipants: e.target.value})}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>
        </Collapse>

        <div className="d-flex align-items-center">
          <small className="text-muted me-2">
            <strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'} found
          </small>
        </div>
      </div>

      {loading && events.length > 0 && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" className="loading-indicator" />
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="text-center py-5 no-data">
          <h3> Event Tidak di temukan</h3>
          <p className="text-muted">Tidak ada event yang cocok dengan kriteria pencarian Anda.</p>
        </div>
      )}

      {/* Events Grid for all screen sizes */}
      <Row>
        {!loading && filteredEvents.map(event => (
          <Col key={event.id} lg={4} md={6} xs={12} className="mb-4">
            <Card className="event-item h-100">
              <Card.Body>
                <div className="calendar-badge">
                  <span className="month-label">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="day-number">{new Date(event.event_date).getDate()}</span>
                </div>
                <Card.Title className="event-heading">{event.title}</Card.Title>
                <Card.Text className="event-text">{event.description}</Card.Text>
                <div className="event-info">
                  <div className="info-point">
                    <FaClock className="icon-wrapper" />
                    <span>{event.event_time}</span>
                  </div>
                  <div className="info-point">
                    <FaMapMarkerAlt className="icon-wrapper" />
                    <span>{event.location}</span>
                  </div>
                  <div className="info-point">
                    <FaUsers className="icon-wrapper" />
                    <span>Max: {event.max_participants} participants</span>
                  </div>
                  <div className="info-point">
                    <FaCalendarAlt className="icon-wrapper" />
                    <span>Deadline: {new Date(event.registration_deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    className="action-edit"
                    onClick={() => handleEdit(event)}
                  >
                    <FaEdit className="me-1" /> <span className="d-none d-sm-inline">Edit</span>
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    className="action-delete"
                    onClick={() => handleDelete(event.id)}
                  >
                    <FaTrash className="me-1" /> <span className="d-none d-sm-inline">Delete</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal 
        show={showModal} 
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        size="lg"
        className="event-dialog"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent ? 'Ubah Event' : 'Tambah Event Baru'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                disabled={formLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                disabled={formLoading}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    required
                    disabled={formLoading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                    required
                    disabled={formLoading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                disabled={formLoading}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Participants</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                    required
                    disabled={formLoading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Registration Deadline</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData({...formData, registration_deadline: e.target.value})}
                    required
                    disabled={formLoading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                disabled={formLoading}
                className="btn-cancel"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={formLoading}
                className="btn-submit"
              >
                {formLoading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2 loading-indicator" />
                    <span>{selectedEvent ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <span>{selectedEvent ? 'Update' : 'Create'} Event</span>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
