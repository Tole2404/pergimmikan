import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './styles/Admin.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function NextAdmin() {
  const [destinations, setDestinations] = useState([]);
  const [transportRates, setTransportRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('destinations');

  // Destination form state
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [destinationForm, setDestinationForm] = useState({
    name: '',
    image: null,
    description: '',
    highlights: '',
    accommodation_budget: 0,
    accommodation_standard: 0,
    accommodation_luxury: 0,
    transportation_public: 0,
    transportation_private: 0,
    transportation_luxury: 0,
    food_budget: 0,
    food_standard: 0,
    food_luxury: 0
  });

  // Transport rates form state
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [editingTransport, setEditingTransport] = useState(null);
  const [transportForm, setTransportForm] = useState({
    destination_name: '',
    flight_economy: 0,
    flight_business: 0,
    flight_first: 0
  });

  // Activities state
  const [activities, setActivities] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityForm, setActivityForm] = useState({
    destination_id: '',
    name: '',
    cost: 0,
    type: 'basic'
  });

  // Seasons state
  const [seasons, setSeasons] = useState([]);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [editingSeason, setEditingSeason] = useState(null);
  const [seasonForm, setSeasonForm] = useState({
    destination_id: '',
    season_type: 'LOW',
    months: ''
  });

  useEffect(() => {
    fetchDestinations();
    fetchTransportRates();
    fetchActivities();
    fetchSeasons();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/next/destinations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }

      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransportRates = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/next/transport`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transport rates');
      }

      const data = await response.json();
      setTransportRates(data);
    } catch (error) {
      console.error('Error fetching transport rates:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/next/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchSeasons = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/next/seasons`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch seasons');
      }

      const data = await response.json();
      setSeasons(data);
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  };

  // Destination form handlers
  const handleDestinationChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setDestinationForm({ ...destinationForm, image: files[0] });
    } else {
      setDestinationForm({ ...destinationForm, [name]: value });
    }
  };

  const openDestinationModal = (destination = null) => {
    if (destination) {
      setEditingDestination(destination);
      setDestinationForm({
        name: destination.name,
        description: destination.description,
        highlights: destination.highlights.join(', '),
        accommodation_budget: destination.costs.accommodation.BUDGET,
        accommodation_standard: destination.costs.accommodation.STANDARD,
        accommodation_luxury: destination.costs.accommodation.LUXURY,
        transportation_public: destination.costs.transportation.PUBLIC,
        transportation_private: destination.costs.transportation.PRIVATE,
        transportation_luxury: destination.costs.transportation.LUXURY,
        food_budget: destination.costs.food.budget,
        food_standard: destination.costs.food.standard,
        food_luxury: destination.costs.food.luxury,
        image: null
      });
    } else {
      setEditingDestination(null);
      setDestinationForm({
        name: '',
        image: null,
        description: '',
        highlights: '',
        accommodation_budget: 0,
        accommodation_standard: 0,
        accommodation_luxury: 0,
        transportation_public: 0,
        transportation_private: 0,
        transportation_luxury: 0,
        food_budget: 0,
        food_standard: 0,
        food_luxury: 0
      });
    }
    setShowDestinationModal(true);
  };

  const saveDestination = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(destinationForm).forEach(key => {
        if (key === 'highlights') {
          formData.append(key, JSON.stringify(destinationForm[key].split(',').map(h => h.trim())));
        } else if (key === 'image' && destinationForm[key]) {
          formData.append(key, destinationForm[key]);
        } else {
          formData.append(key, destinationForm[key]);
        }
      });

      const url = editingDestination 
        ? `${API_URL}/api/admin/next/destinations/${editingDestination.id}` 
        : `${API_URL}/api/admin/next/destinations`;
      
      const method = editingDestination ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save destination');
      }

      setShowDestinationModal(false);
      fetchDestinations();
    } catch (error) {
      console.error('Error saving destination:', error);
      setError(error.message);
    }
  };

  const deleteDestination = async (id) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/next/destinations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete destination');
      }

      fetchDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
      setError(error.message);
    }
  };

  // Transport form handlers
  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setTransportForm({ ...transportForm, [name]: value });
  };

  const openTransportModal = (transport = null) => {
    if (transport) {
      setEditingTransport(transport);
      setTransportForm({
        destination_name: transport.destination_name,
        flight_economy: transport.flight_economy,
        flight_business: transport.flight_business,
        flight_first: transport.flight_first
      });
    } else {
      setEditingTransport(null);
      setTransportForm({
        destination_name: '',
        flight_economy: 0,
        flight_business: 0,
        flight_first: 0
      });
    }
    setShowTransportModal(true);
  };

  const saveTransport = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingTransport 
        ? `${API_URL}/api/admin/next/transport/${editingTransport.id}` 
        : `${API_URL}/api/admin/next/transport`;
      
      const method = editingTransport ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transportForm)
      });

      if (!response.ok) {
        throw new Error('Failed to save transport rate');
      }

      setShowTransportModal(false);
      fetchTransportRates();
    } catch (error) {
      console.error('Error saving transport rate:', error);
      setError(error.message);
    }
  };

  const deleteTransport = async (id) => {
    if (!confirm('Are you sure you want to delete this transport rate?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/next/transport/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete transport rate');
      }

      fetchTransportRates();
    } catch (error) {
      console.error('Error deleting transport rate:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Card className="admin-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h2>Next Adventure Management</h2>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="destinations" title="Destinations">
                  <div className="d-flex justify-content-end mb-3">
                    <Button variant="primary" onClick={() => openDestinationModal()}>
                      <FaPlus /> Add Destination
                    </Button>
                  </div>
                  
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Highlights</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.map(destination => (
                        <tr key={destination.id}>
                          <td>{destination.id}</td>
                          <td>{destination.name}</td>
                          <td>{destination.description.substring(0, 50)}...</td>
                          <td>{destination.highlights.join(', ')}</td>
                          <td>
                            <Button 
                              variant="warning" 
                              size="sm" 
                              className="me-2"
                              onClick={() => openDestinationModal(destination)}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => deleteDestination(destination.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>
                
                <Tab eventKey="transport" title="Transport Rates">
                  <div className="d-flex justify-content-end mb-3">
                    <Button variant="primary" onClick={() => openTransportModal()}>
                      <FaPlus /> Add Transport Rate
                    </Button>
                  </div>
                  
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Destination</th>
                        <th>Economy</th>
                        <th>Business</th>
                        <th>First Class</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transportRates.map(transport => (
                        <tr key={transport.id}>
                          <td>{transport.id}</td>
                          <td>{transport.destination_name}</td>
                          <td>{transport.flight_economy.toLocaleString('id-ID')}</td>
                          <td>{transport.flight_business.toLocaleString('id-ID')}</td>
                          <td>{transport.flight_first.toLocaleString('id-ID')}</td>
                          <td>
                            <Button 
                              variant="warning" 
                              size="sm" 
                              className="me-2"
                              onClick={() => openTransportModal(transport)}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => deleteTransport(transport.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Destination Modal */}
      <Modal 
        show={showDestinationModal} 
        onHide={() => setShowDestinationModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDestination ? 'Edit Destination' : 'Add New Destination'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveDestination}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={destinationForm.name}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control 
                    type="file" 
                    name="image" 
                    onChange={handleDestinationChange}
                    accept="image/*"
                    required={!editingDestination}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="description" 
                value={destinationForm.description}
                onChange={handleDestinationChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Highlights (comma separated)</Form.Label>
              <Form.Control 
                type="text" 
                name="highlights" 
                value={destinationForm.highlights}
                onChange={handleDestinationChange}
                required
              />
            </Form.Group>

            <h5 className="mt-4">Accommodation Costs</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Budget</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="accommodation_budget" 
                    value={destinationForm.accommodation_budget}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Standard</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="accommodation_standard" 
                    value={destinationForm.accommodation_standard}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Luxury</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="accommodation_luxury" 
                    value={destinationForm.accommodation_luxury}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-4">Transportation Costs</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Public</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="transportation_public" 
                    value={destinationForm.transportation_public}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Private</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="transportation_private" 
                    value={destinationForm.transportation_private}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Luxury</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="transportation_luxury" 
                    value={destinationForm.transportation_luxury}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-4">Food Costs</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Budget</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="food_budget" 
                    value={destinationForm.food_budget}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Standard</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="food_standard" 
                    value={destinationForm.food_standard}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Luxury</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="food_luxury" 
                    value={destinationForm.food_luxury}
                    onChange={handleDestinationChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDestinationModal(false)}>
              <FaTimes /> Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FaSave /> Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Transport Modal */}
      <Modal 
        show={showTransportModal} 
        onHide={() => setShowTransportModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTransport ? 'Edit Transport Rate' : 'Add New Transport Rate'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveTransport}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Destination Name</Form.Label>
              <Form.Control 
                type="text" 
                name="destination_name" 
                value={transportForm.destination_name}
                onChange={handleTransportChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Economy Class Price</Form.Label>
              <Form.Control 
                type="number" 
                name="flight_economy" 
                value={transportForm.flight_economy}
                onChange={handleTransportChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Business Class Price</Form.Label>
              <Form.Control 
                type="number" 
                name="flight_business" 
                value={transportForm.flight_business}
                onChange={handleTransportChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>First Class Price</Form.Label>
              <Form.Control 
                type="number" 
                name="flight_first" 
                value={transportForm.flight_first}
                onChange={handleTransportChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransportModal(false)}>
              <FaTimes /> Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FaSave /> Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
