import { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import { showSuccess, showError, showLoading, closePopup } from '../../../utils/sweetalert';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

export default function AddTeam() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: null,
    description: '',
    social: {
      linkedin: '',
      github: '',
      instagram: ''
    },
    status: 'active'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kompresi jika file lebih dari 5MB
    if (file.size > 5 * 1024 * 1024) {
      showLoading('Compressing Image', 'Please wait while we optimize your image...');
      
      try {
        const options = {
          maxSizeMB: 1,             // Maksimum 1MB
          maxWidthOrHeight: 1920,   // Maksimum lebar/tinggi 1920px
          useWebWorker: true,       // Gunakan web worker untuk proses di background
          initialQuality: 0.7,      // Kualitas awal 70%
        };
        
        const compressedFile = await imageCompression(file, options);
        console.log(`Kompresi: ${file.name} dari ${(file.size / 1024 / 1024).toFixed(2)}MB menjadi ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        
        setFormData({ ...formData, image: compressedFile });
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
        
        closePopup();
      } catch (error) {
        closePopup();
        showError('Error', 'Failed to compress image. Please try again.');
        console.error('Error during image compression:', error);
      }
    } else {
      // Tidak perlu kompresi
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('social', JSON.stringify(formData.social));
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/team`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add team member');
      }

      navigate('/dashboard/team');
    } catch (error) {
      setError(error.message);
      console.error('Error adding team member:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Add New Team Member</h5>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/dashboard/users')}
                className="me-2"
                disabled={loading}
              >
                <FaArrowLeft className="me-2" />
                Back
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                type="submit"
                form="teamForm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Save
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <Form id="teamForm" onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Card className="mb-4">
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <h6 className="mb-3">Social Media Links</h6>
                    <Form.Group className="mb-3">
                      <Form.Label>LinkedIn</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="Enter LinkedIn URL"
                        value={formData.social.linkedin}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social: { ...formData.social, linkedin: e.target.value } 
                        })}
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>GitHub</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="Enter GitHub URL"
                        value={formData.social.github}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social: { ...formData.social, github: e.target.value } 
                        })}
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Instagram</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="Enter Instagram URL"
                        value={formData.social.instagram}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social: { ...formData.social, instagram: e.target.value } 
                        })}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Image</Form.Label>
                      <div className="d-grid">
                        <Button
                          variant="outline-secondary"
                          onClick={() => document.getElementById('imageInput').click()}
                          className="mb-2"
                          disabled={loading}
                        >
                          <FaUpload className="me-2" />
                          Choose Image
                        </Button>
                        <Form.Control
                          id="imageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="d-none"
                          required
                        />
                        <small className="text-muted d-block text-center">
                          Maximum file size: 5MB
                        </small>
                      </div>
                      {imagePreview && (
                        <div className="mt-2 position-relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded"
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-2"
                            onClick={() => {
                              setFormData({ ...formData, image: null });
                              setImagePreview(null);
                            }}
                            disabled={loading}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        disabled={loading}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
