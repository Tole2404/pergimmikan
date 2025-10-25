import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import { showSuccess, showError, showLoading, closePopup } from '../../../utils/sweetalert';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

export default function EditTeam() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageSize, setImageSize] = useState(null);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/api/admin/team/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch team member');
        }

        const data = await response.json();
        
        // Debug the response to understand the data structure
        console.log('API Response:', data);
        
        // Initialize social media links based on the available data
        // Handle different possible structures of social media data
        const linkedinValue = data.social?.linkedin || data.linkedin || '';
        const githubValue = data.social?.github || data.github || '';
        const instagramValue = data.social?.instagram || data.instagram || '';
        
        setFormData({
          ...data,
          short_name: data.short_name || '',
          image: null, // Reset image since we don't want to send it back unless changed
          social: {
            linkedin: linkedinValue,
            github: githubValue,
            instagram: instagramValue
          }
        });
        
        setImagePreview(`${API_URL}${data.image_url}`);
        
        // Fetch image size for existing image
        if (data.image_url) {
          try {
            const imgResponse = await fetch(`${API_URL}${data.image_url}`);
            if (imgResponse.ok) {
              const blob = await imgResponse.blob();
              setImageSize(formatFileSize(blob.size));
            }
          } catch (error) {
            console.error('Error fetching image size:', error);
          }
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [id]);

  // Function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to create a File from Blob with proper name and type
  const convertBlobToFile = (blob, fileName) => {
    // Create a new File object from the Blob
    return new File([blob], fileName, { 
      type: blob.type,
      lastModified: new Date().getTime()
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set initial image size
    setImageSize(formatFileSize(file.size));
    
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
        
        const compressedBlob = await imageCompression(file, options);
        
        // Convert blob to File to ensure it's properly sent to server
        const compressedFile = convertBlobToFile(
          compressedBlob, 
          `compressed_${file.name}`
        );
        
        console.log(`Kompresi: ${file.name} dari ${(file.size / 1024 / 1024).toFixed(2)}MB menjadi ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        console.log('Compressed file type:', compressedFile.type);
        console.log('Compressed file is File object:', compressedFile instanceof File);
        
        setFormData({ ...formData, image: compressedFile });
        
        // Update image size after compression
        setImageSize(formatFileSize(compressedFile.size));
        
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
    setSaving(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.short_name) {
        formDataToSend.append('short_name', formData.short_name);
      }
      formDataToSend.append('role', formData.role);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      
      // Send each social link individually instead of as a JSON string
      formDataToSend.append('linkedin', formData.social.linkedin || '');
      formDataToSend.append('github', formData.social.github || '');
      formDataToSend.append('instagram', formData.social.instagram || '');
      
      if (formData.image) {
        // Log image details for debugging
        console.log('Image being sent:', formData.image);
        console.log('Image type:', formData.image instanceof File ? 'File' : typeof formData.image);
        console.log('Image size:', formData.image.size);
        
        formDataToSend.append('image', formData.image);
      }

      const token = localStorage.getItem('adminToken');
      
      // Debug: Log what we're sending
      console.log('Sending update for team ID:', id);
      console.log('FormData contents:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }
      
      const response = await fetch(`${API_URL}/api/admin/team/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Failed to update team member');
      }

      showSuccess('Success', 'Team member updated successfully!');
      navigate('/dashboard/team');
    } catch (error) {
      setError(error.message);
      console.error('Error updating team member:', error);
      showError('Error', error.message || 'Failed to update team member');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container fluid>
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Edit Team Member</h5>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/dashboard/team')}
                className="me-2"
                disabled={saving}
              >
                <FaArrowLeft className="me-2" />
                Back
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                type="submit"
                form="teamForm"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Save Changes
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
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter full name (e.g., Muhammad Rizki Pratama)"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={saving}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Short Name <span className="text-muted">(Optional)</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter short name (e.g., Rizki)"
                        value={formData.short_name}
                        onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                        disabled={saving}
                      />
                      <Form.Text className="text-muted">
                        Nama singkat untuk ditampilkan di beberapa tempat. Jika kosong, akan menggunakan nama lengkap.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                          disabled={saving}
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
                              setImageSize(null);
                            }}
                            disabled={saving}
                          >
                            ×
                          </Button>
                          {imageSize && (
                            <div className="mt-2 text-center">
                              <small className="text-muted">
                                Ukuran file: {imageSize}
                              </small>
                            </div>
                          )}
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        disabled={saving}
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
