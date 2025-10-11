import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaTags, FaImage } from 'react-icons/fa';
import Loading from '../../../components/common/Loading';
import { showSuccess, showError, showConfirm } from '../../../utils/sweetalert';
import '../styles/ManagementComponents.css';
import '../styles/GalleryManagement.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function GalleryManagement() {
  const [galleries, setGalleries] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [formData, setFormData] = useState({
    caption: '',
    date: '',
    author: '',
    tags: [],
    images: []
  });

  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    fetchGalleries();
    fetchTags();
  }, []);

  const fetchGalleries = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Tambahkan timestamp untuk menghindari cache
      const timestampedUrl = `${API_URL}/api/admin/galleries?_t=${new Date().getTime()}`;
      
      const response = await fetch(timestampedUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        // Pastikan tidak menggunakan cache
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.error(`Gallery fetch failed with status: ${response.status}`);
        throw new Error(`Failed to fetch galleries: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Fetched ${data.length} galleries successfully`);
      setGalleries(data);
      return data; // Return data untuk chaining
    } catch (err) {
      console.error('Error fetching galleries:', err);
      // Jangan tampilkan error ke user jika ini adalah retry setelah submit
      if (loading) {
        showError('Error', 'Failed to load galleries');
        setError('Failed to load galleries');
      }
      throw err; // Re-throw untuk penanganan di tempat pemanggilan
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/galleries/tags/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch tags');
      
      const data = await response.json();
      setTags(data);
    } catch (err) {
      showError('Error', 'Failed to load tags');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent double submission
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      // Tambahkan data dasar
      formDataToSend.append('caption', formData.caption);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('author', formData.author);
      
      // Kirim tags sesuai format yang diharapkan server
      formData.tags.forEach(tag => {
        formDataToSend.append('tags[]', tag);
      });
      
      // Periksa apakah ini adalah operasi update dan tidak ada gambar baru
      if (selectedGallery && (!formData.images || formData.images.length === 0)) {
        // Tambahkan flag untuk memberi tahu server agar mempertahankan gambar yang ada
        formDataToSend.append('keepExistingImages', 'true');
      } else {
        // Jika gambar baru dipilih, tambahkan ke formData dengan nama field yang sama
        // sesuai dengan konfigurasi multer di server
        Array.from(formData.images).forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      const url = selectedGallery 
        ? `${API_URL}/api/admin/galleries/${selectedGallery.id}`
        : `${API_URL}/api/admin/galleries`;

      const method = selectedGallery ? 'PUT' : 'POST';

      // Tambahkan timestamp untuk menghindari cache
      const timestampedUrl = `${url}?_t=${new Date().getTime()}`;
      
      const response = await fetch(timestampedUrl, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Jangan tambahkan Content-Type saat menggunakan FormData
          // Browser akan otomatis menambahkan boundary yang tepat
        },
        body: formDataToSend,
        // Pastikan tidak menggunakan cache
        cache: 'no-store'
      });

      if (!response.ok) throw new Error('Failed to save gallery');

      showSuccess('Success', `Gallery successfully ${selectedGallery ? 'updated' : 'created'}`);
      setShowModal(false);
      
      // Tunggu lebih lama sebelum fetch data baru untuk memastikan server selesai memproses
      // dan database telah diupdate
      setTimeout(() => {
        fetchGalleries().catch(err => {
          // Jika gagal fetch, coba lagi setelah delay tambahan
          console.log('Retrying gallery fetch after initial delay...');
          setTimeout(fetchGalleries, 1000);
        });
      }, 1500);
      resetForm();
    } catch (err) {
      console.error('Error saving gallery:', err);
      showError('Error', 'Failed to save gallery');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete Gallery', 'Are you sure you want to delete this gallery?');
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/galleries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete gallery');

      showSuccess('Success', 'Gallery successfully deleted');
      fetchGalleries();
    } catch (err) {
      showError('Error', 'Failed to delete gallery');
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      showError('Error', 'Tag name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/galleries/tags`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newTagName })
      });

      if (!response.ok) throw new Error('Failed to create tag');

      showSuccess('Success', 'Tag created successfully');
      await fetchTags();
      setNewTagName('');
    } catch (err) {
      showError('Error', 'Failed to create tag');
    }
  };

  const handleDeleteTag = async (tagId) => {
    const result = await showConfirm('Delete Tag', 'Are you sure you want to delete this tag?');
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/galleries/tags/${tagId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete tag');

      showSuccess('Success', 'Tag deleted successfully');
      await fetchTags();
    } catch (err) {
      showError('Error', 'Failed to delete tag');
    }
  };
  
  const handleEdit = (gallery) => {
    setSelectedGallery(gallery);
    setFormData({
      caption: gallery.caption,
      date: gallery.date.split('T')[0],
      author: gallery.author,
      tags: gallery.tags.map(tag => tag.id.toString()),
      images: []
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      caption: '',
      date: '',
      author: '',
      tags: [],
      images: []
    });
    setSelectedGallery(null);
  };

  if (loading) return <Loading text="Loading galleries..." overlay={true} />;
  if (error) return <div className="error">{error}</div>;

  // Limit to exactly 9 items for a 3x3 grid layout
  const displayGalleries = galleries.slice(0, 9);

  return (
    <Container fluid className="management-container">
      <div className="management-header d-flex justify-content-between align-items-center">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <h5 className="mb-0 fw-bold">Photo Gallery</h5>
          <p className="text-muted small mb-0 d-none d-md-block">
            Kelola semua galeri foto di satu tempat
          </p>
        </Col>
        <div>
          <Button 
            variant="info" 
            className="me-2"
            onClick={() => setShowTagModal(true)}
          >
            <FaTags className="me-2" />
            Kelola Tag
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" />
            Tambahkan Gallery
          </Button>
        </div>
      </div>

      <div className="gallery-grid-container">
        {displayGalleries.map(gallery => (
          <Card key={gallery.id} className="gallery-card">
            <div className="card-img-container">
              <Card.Img 
                variant="top" 
                src={`${API_URL}${gallery.images[0]?.image_url}`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
            <Card.Body>
              <Card.Title>{gallery.caption}</Card.Title>
              <Card.Text>
                <small className="text-muted">
                  By {gallery.author} on {new Date(gallery.date).toLocaleDateString()}
                </small>
              </Card.Text>
              <div className="gallery-tags">
                {gallery.tags.map(tag => (
                  <span key={tag.id} className="tag-badge">
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="gallery-card-actions">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleEdit(gallery)}
                  className="me-2"
                >
                  <FaEdit className="me-1" /> Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(gallery.id)}
                >
                  <FaTrash className="me-1" /> Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
        
        {/* Fill empty slots with placeholder cards to maintain 3x3 layout */}
        {Array.from({ length: Math.max(0, 9 - displayGalleries.length) }).map((_, index) => (
          <Card key={`placeholder-${index}`} className="gallery-card gallery-card-placeholder">
            <div className="card-img-container placeholder-img">
              <FaImage className="placeholder-icon" />
            </div>
            <Card.Body>
              <Card.Title className="text-muted">Empty Slot</Card.Title>
              <Card.Text>
                <small className="text-muted">
                  Tambahkan galeri baru
                </small>
              </Card.Text>
              <div className="gallery-card-actions">
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="w-100"
                >
                  <FaPlus className="me-1" /> Tambahkan Baru
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Gallery Form Modal */}
      <Modal 
        show={showModal} 
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        size="lg"
        className="management-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGallery ? 'Ubah Gallery' : 'Tambahkan Gallery Baru'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                type="text"
                value={formData.caption}
                onChange={(e) => setFormData({...formData, caption: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Tags</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Form.Check
                    key={tag.id}
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    label={tag.name}
                    checked={formData.tags.includes(tag.id.toString())}
                    onChange={(e) => {
                      const tagId = tag.id.toString();
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, tagId]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          tags: formData.tags.filter(id => id !== tagId)
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setFormData({...formData, images: e.target.files})}
                accept="image/*"
                className="form-control-file"
              />
              {selectedGallery && (
                <Form.Text className="text-muted mt-2">
                  Upload new images to replace existing ones. Leave empty to keep current images.
                </Form.Text>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (selectedGallery ? 'Update' : 'Save')} Gallery
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Tag Management Modal */}
      <Modal 
        show={showTagModal} 
        onHide={() => setShowTagModal(false)}
        className="management-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Kelola Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tag-management-container">
            <Form.Group className="mb-4">
              <Form.Label>Tambahkan Tag Baru</Form.Label>
              <div className="tag-management-form">
                <Form.Control
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Masukkan nama tag"
                />
                <Button 
                  variant="primary" 
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim()}
                >
                  <FaPlus />
                </Button>
              </div>
            </Form.Group>
            
            <div className="tag-list-section">
              <h6 className="mb-3">Existing Tags</h6>
              <div className="tag-list-container">
                {tags.length === 0 ? (
                  <p className="text-muted">No tags created yet.</p>
                ) : (
                  tags.map(tag => (
                    <div key={tag.id} className="tag-item">
                      <span>{tag.name}</span>
                      <button
                        className="tag-delete-btn"
                        onClick={() => handleDeleteTag(tag.id)}
                        type="button"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
