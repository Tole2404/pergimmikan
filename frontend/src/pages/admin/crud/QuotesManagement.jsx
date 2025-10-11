import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { showSuccess, showError, showConfirm, showLoading, closePopup } from '../../../utils/sweetalert';
import Loading from '../../../components/common/Loading';
import '../styles/QuotesManagement.css';

const API_URL = import.meta.env.VITE_API_URL;

const QuotesManagement = () => {
  const [quotes, setQuotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    text: '',
    author_name: '',
    author_title: '',
    is_featured: false
  });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/quotes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch quotes');

      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      await showError('Error', 'Failed to load quotes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (quote = null) => {
    if (quote) {
      setEditingQuote(quote);
      setFormData({
        text: quote.text,
        author_name: quote.author_name,
        author_title: quote.author_title,
        is_featured: quote.is_featured
      });
    } else {
      setEditingQuote(null);
      setFormData({
        text: '',
        author_name: '',
        author_title: '',
        is_featured: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingQuote(null);
    setFormData({
      text: '',
      author_name: '',
      author_title: '',
      is_featured: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const loadingAlert = showLoading(editingQuote ? 'Updating Quote' : 'Creating Quote', 'Please wait...');
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingQuote 
        ? `${API_URL}/api/admin/quotes/${editingQuote.id}`
        : `${API_URL}/api/admin/quotes`;
      
      const response = await fetch(url, {
        method: editingQuote ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save quote');

      closePopup();
      await showSuccess(
        editingQuote ? 'Quote Updated!' : 'Quote Created!',
        editingQuote ? 'The quote has been successfully updated.' : 'The quote has been successfully created.'
      );
      handleCloseModal();
      fetchQuotes();
    } catch (error) {
      closePopup();
      console.error('Error saving quote:', error);
      await showError('Error', 'Failed to save quote. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm(
      'Delete Quote?',
      'Are you sure you want to delete this quote? This action cannot be undone.',
      'Yes, Delete It!',
      'Cancel'
    );

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/api/admin/quotes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete quote');

        await showSuccess('Quote Deleted!', 'The quote has been successfully deleted.');
        fetchQuotes();
      } catch (error) {
        console.error('Error deleting quote:', error);
        await showError('Error', 'Failed to delete quote. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.text.toLowerCase().includes(searchLower) ||
      quote.author_name.toLowerCase().includes(searchLower) ||
      quote.author_title.toLowerCase().includes(searchLower)
    );
  });

  if (loading && quotes.length === 0) {
    return <Loading text="Loading quotes..." overlay={true} />;
  }

  return (
    <Container fluid className="quotes-management-container py-4">
      <Card className="quotes-card shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <h5 className="mb-0">Quotes Management</h5>
            </div>
            <p className="text-muted small mb-0 d-none d-md-block">
            Kelola semua quotes di satu tempat
          </p>
          </Col>
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              className="btn-add-quote"
              onClick={() => handleShowModal()}
            >
              <FaPlus className="me-2" /> 
              <span className="d-none d-md-inline">Tambah Quote</span>
            </Button>
          </div>
        </Card.Header>

        <div className="p-3 search-container bg-light">
          <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
            <div className="search-box position-relative flex-grow-1 w-100">
              <Form.Control
                type="text"
                placeholder="Cari quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-4 search-input__quotes"
              />
            </div>
            <div className="d-flex align-items-center">
              <small className="text-muted me-2">
                <strong>{filteredQuotes.length}</strong> {filteredQuotes.length === 1 ? 'quote' : 'quotes'} ditemukan
              </small>
            </div>
          </div>
        </div>

        <Card.Body className="p-0">
          {loading && quotes.length > 0 && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {!loading && filteredQuotes.length === 0 && (
            <div className="text-center py-5 empty-state">
              <h3>Tidak ada Quotes ditemukan</h3>
              <p className="text-muted">Tidak ada quotes matching your search criteria.</p>
            </div>
          )}

          {!loading && filteredQuotes.length > 0 && (
            <div className="table-responsive">
              <Table responsive striped bordered hover className="quotes-table mb-0">
                <thead className="quotes-table-header">
                  <tr>
                    <th>Quote</th>
                    <th>Author</th>
                    <th className="d-none d-md-table-cell">Title</th>
                    <th className="text-center">Featured</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map(quote => (
                    <tr key={quote.id} className="quote-row">
                      <td className="quote-text-cell">{quote.text}</td>
                      <td>{quote.author_name}</td>
                      <td className="d-none d-md-table-cell">{quote.author_title}</td>
                      <td className="text-center">
                        <span className={`badge ${quote.is_featured ? 'bg-success' : 'bg-secondary'}`}>
                          {quote.is_featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="text-center action-cell">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            className="btn-edit"
                            onClick={() => handleShowModal(quote)}
                          >
                            <FaEdit className="d-block d-md-none" />
                            <span className="d-none d-md-block">Edit</span>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="btn-delete"
                            onClick={() => handleDelete(quote.id)}
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
        className="retro-modal quotes-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuote ? 'Ubah Quote' : 'Tambah Quote baru'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Quote Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter quote text"
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                required
                disabled={formLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author name"
                value={formData.author_name}
                onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                required
                disabled={formLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author title"
                value={formData.author_title}
                onChange={(e) => setFormData({...formData, author_title: e.target.value})}
                disabled={formLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Set as Featured Quote"
                checked={formData.is_featured}
                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
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
                  <span>{editingQuote ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{editingQuote ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default QuotesManagement;
