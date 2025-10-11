import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { showSuccess, showError, showConfirm, showLoading, closePopup } from '../../utils/sweetalert';
import Loading from '../../components/common/Loading';
import './styles/LegacyManagement.css';

const API_URL = import.meta.env.VITE_API_URL;

const LegacyManagement = () => {
  const [legacies, setLegacies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLegacy, setEditingLegacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchLegacies();
  }, []);

  const fetchLegacies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/legacies`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch legacies');

      const data = await response.json();
      setLegacies(data);
    } catch (error) {
      console.error('Error fetching legacies:', error);
      await showError('Error', 'Failed to load legacies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (legacy = null) => {
    if (legacy) {
      setEditingLegacy(legacy);
      setFormData({
        year: legacy.year,
        title: legacy.title,
        description: legacy.description
      });
    } else {
      setEditingLegacy(null);
      setFormData({
        year: '',
        title: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLegacy(null);
    setFormData({
      year: '',
      title: '',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const loadingAlert = showLoading(editingLegacy ? 'Updating Legacy' : 'Creating Legacy', 'Please wait...');
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingLegacy 
        ? `${API_URL}/api/admin/legacies/${editingLegacy.id}`
        : `${API_URL}/api/admin/legacies`;
      
      const response = await fetch(url, {
        method: editingLegacy ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save legacy');

      closePopup();
      await showSuccess(
        editingLegacy ? 'Legacy Updated!' : 'Legacy Created!',
        editingLegacy ? 'The legacy has been successfully updated.' : 'The legacy has been successfully created.'
      );
      handleCloseModal();
      fetchLegacies();
    } catch (error) {
      closePopup();
      console.error('Error saving legacy:', error);
      await showError('Error', 'Failed to save legacy. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm(
      'Delete Legacy?',
      'Are you sure you want to delete this legacy? This action cannot be undone.',
      'Yes, Delete It!',
      'Cancel'
    );

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/api/admin/legacies/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete legacy');

        await showSuccess('Legacy Deleted!', 'The legacy has been successfully deleted.');
        fetchLegacies();
      } catch (error) {
        console.error('Error deleting legacy:', error);
        await showError('Error', 'Failed to delete legacy. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter legacies based on search term
  const filteredLegacies = legacies.filter(legacy => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(legacy.year).includes(searchLower) ||
      legacy.title.toLowerCase().includes(searchLower) ||
      legacy.description.toLowerCase().includes(searchLower)
    );
  });

  if (loading && legacies.length === 0) {
    return <Loading text="Loading legacies..." overlay={true} />;
  }

  return (
    <Container fluid className="legacy-management-container py-4">
      <Card className="legacy-card shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <h5 className="mb-0">Legacy Management</h5>
            </div>
            <p className="text-muted small mb-0 d-none d-md-block">
            Kelola semua legacy  di satu tempat
          </p>
          </Col>
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              className="btn-add-legacy"
              onClick={() => handleShowModal()}
            >
              <FaPlus className="me-2" /> 
              <span className="d-none d-md-inline">Tambah Legacy</span>
            </Button>
          </div>
        </Card.Header>

        <div className="p-3 search-container bg-light">
          <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
            <div className="search-box position-relative flex-grow-1 w-100">
              <Form.Control
                type="text"
                placeholder="Cari legacies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-4 search-input__legacy"
              />
            </div>
            <div className="d-flex align-items-center">
              <small className="text-muted me-2">
                <strong>{filteredLegacies.length}</strong> {filteredLegacies.length === 1 ? 'legacy' : 'legacies'} ditemukan  
              </small>
            </div>
          </div>
        </div>

        <Card.Body className="p-0">
          {loading && legacies.length > 0 && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {!loading && filteredLegacies.length === 0 && (
            <div className="text-center py-5 empty-state">
              <h3>Tidak Ditemukan</h3>
              <p className="text-muted">Tidak ada legacies yang ditemukan.</p>
            </div>
          )}

          {!loading && filteredLegacies.length > 0 && (
            <div className="table-responsive">
              <Table responsive striped bordered hover className="legacy-table mb-0">
                <thead className="legacy-table-header">
                  <tr>
                    <th className="text-center">Year</th>
                    <th>Title</th>
                    <th className="d-none d-md-table-cell">Description</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLegacies.map(legacy => (
                    <tr key={legacy.id} className="legacy-row">
                      <td className="text-center">{legacy.year}</td>
                      <td>{legacy.title}</td>
                      <td className="d-none d-md-table-cell description-cell">{legacy.description}</td>
                      <td className="text-center action-cell">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            className="btn-edit"
                            onClick={() => handleShowModal(legacy)}
                          >
                            <FaEdit className="d-block d-md-none" />
                            <span className="d-none d-md-block">Edit</span>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="btn-delete"
                            onClick={() => handleDelete(legacy.id)}
                          >
                            <FaTrash className="d-block d-md-none" />
                            <span className="d-none d-md-block">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        className="retro-modal legacy-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingLegacy ? 'Ubah Legacy' : 'Tambah Legacy baru'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter year"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                required
                disabled={formLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
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
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                disabled={formLoading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={formLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formLoading}>
              {formLoading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  <span>{editingLegacy ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{editingLegacy ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default LegacyManagement;
