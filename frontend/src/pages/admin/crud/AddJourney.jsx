import { useState, useEffect } from 'react';
import { Form, Button, Card, Image, Container, Row, Col, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTimes, FaImage, FaSave, FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import '../styles/ManagementComponents.css';
import Loading from '../../../components/common/Loading';
import { showSuccess, showError, showLoading, closePopup } from '../../../utils/sweetalert';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

export default function AddJourney() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    destination_type: '',
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [years, setYears] = useState([]);
  const [existingJourney, setExistingJourney] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [findingCoordinates, setFindingCoordinates] = useState(false);

  // Generate array of years (last 10 years)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = Array.from({length: 10}, (_, i) => currentYear - i);
    setYears(yearArray);
  }, []);

  // Fetch existing journey when year changes
  useEffect(() => {
    if (formData.year) {
      fetchJourneyByYear(formData.year);
    }
  }, [formData.year]);

  const fetchJourneyByYear = async (year) => {
    setFetchingData(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/journeys/year/${year}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data) {
        setExistingJourney(data);
        setFormData(prev => ({
          ...prev,
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          destination_type: data.destination_type || '',
        }));

        if (data.photos && data.photos.length > 0) {
          const existingPhotos = data.photos.map(photo => ({
            file: null,
            caption: photo.caption || '',
            previewUrl: `${API_URL}${photo.src}`,
            isExisting: true,
            src: photo.src
          }));
          setPhotos(existingPhotos);
          setPreviewImages(existingPhotos.map(p => p.previewUrl));
        }
      } else {
        setExistingJourney(null);
        setFormData(prev => ({
          ...prev,
          title: '',
          description: ''
        }));
        setPhotos([]);
        setPreviewImages([]);
      }
    } catch (error) {
      showError('Error', 'Failed to fetch journey data. Please try again.');
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Auto-find coordinates based on location
  const handleFindCoordinates = async () => {
    if (!formData.location) {
      showError('Error', 'Please enter a location first');
      return;
    }

    setFindingCoordinates(true);
    try {
      // Use Nominatim (OpenStreetMap) API for geocoding
      const query = encodeURIComponent(`${formData.location}, Indonesia`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(lat).toFixed(8),
          longitude: parseFloat(lon).toFixed(8)
        }));
        showSuccess('Success!', `Found coordinates for ${formData.location}`);
      } else {
        showError('Not Found', 'Could not find coordinates for this location. Please enter manually.');
      }
    } catch (error) {
      console.error('Error finding coordinates:', error);
      showError('Error', 'Failed to find coordinates. Please try again or enter manually.');
    } finally {
      setFindingCoordinates(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    
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
      
      // Buat struktur data yang sama seperti sebelumnya
      const newPhotos = compressedFiles.map(file => ({
        file,
        caption: '',
        previewUrl: URL.createObjectURL(file),
        isExisting: false
      }));
  
      setPhotos(prev => [...prev, ...newPhotos]);
      setPreviewImages(prev => [...prev, ...newPhotos.map(p => p.previewUrl)]);
    } catch (error) {
      closePopup();
      showError('Error', 'Failed to process images. Please try again.');
      console.error('Error in image compression:', error);
    }
  };

  const handleCaptionChange = (index, caption) => {
    setPhotos(prev => prev.map((photo, i) => 
      i === index ? { ...photo, caption } : photo
    ));
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(previewImages[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Fungsi untuk mengirim data journey tanpa foto
  const createOrUpdateJourney = async () => {
    const token = localStorage.getItem('adminToken');
    const journeyData = {
      year: formData.year,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      latitude: formData.latitude,
      longitude: formData.longitude,
      destination_type: formData.destination_type
    };

    // Jika ada foto yang sudah ada sebelumnya, tambahkan ke data
    const existingPhotos = photos.filter(p => p.isExisting);
    if (existingPhotos.length > 0) {
      journeyData.existingPhotos = existingPhotos.map(p => ({
        src: p.src,
        caption: p.caption
      }));
    }

    const response = await fetch(`${API_URL}/api/admin/journeys/info`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(journeyData)
    });

    if (!response.ok) {
      throw new Error('Failed to create journey');
    }

    return await response.json();
  };

  // Fungsi untuk upload satu foto
  const uploadSinglePhoto = async (photo, index, journeyId) => {
    const token = localStorage.getItem('adminToken');
    const formDataToSend = new FormData();
    
    formDataToSend.append('journeyId', journeyId);
    formDataToSend.append('year', formData.year);
    formDataToSend.append('photo', photo.file);
    formDataToSend.append('caption', photo.caption || '');
    
    const response = await fetch(`${API_URL}/api/admin/journeys/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload photo ${index + 1}`);
    }
    
    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowProgress(true);
    setUploadProgress(0);
    setUploadStatus('Creating journey...');

    try {
      // Langkah 1: Buat atau update journey tanpa foto
      const journeyResponse = await createOrUpdateJourney();
      const journeyId = journeyResponse.id;
      
      // Langkah 2: Upload foto satu per satu
      const newPhotos = photos.filter(p => !p.isExisting);
      
      if (newPhotos.length > 0) {
        setUploadStatus('Uploading photos...');
        
        for (let i = 0; i < newPhotos.length; i++) {
          setUploadStatus(`Uploading photo ${i + 1} of ${newPhotos.length}...`);
          await uploadSinglePhoto(newPhotos[i], i, journeyId);
          
          // Update progress
          const progress = Math.round(((i + 1) / newPhotos.length) * 100);
          setUploadProgress(progress);
        }
      }

      // Bersihkan URL objek
      previewImages.forEach(url => URL.revokeObjectURL(url));
      
      setUploadStatus('Journey saved successfully!');
      await showSuccess('SUCCESS!', 'Journey has been added successfully');
      navigate('/dashboard/journey');
    } catch (error) {
      console.error('Error saving journey:', error);
      showError('ERROR', `Failed to add journey: ${error.message}`);
    } finally {
      setLoading(false);
      setShowProgress(false);
    }
  };

  if (fetchingData) {
    return (
      <Container fluid className="journey-add-container_management">
        <Loading size="medium" overlay={false} text="Loading journey data..." />
      </Container>
    );
  }

  return (
    <Container fluid className="journey-add-container_management">
      <div className="journey-add-header_management">
        <div className="journey-add-title_management">
          <h2>Add New Journey</h2>
          <p className="journey-add-subtitle_management">Create a new journey with photos</p>
        </div>
        <Button 
          variant="outline-secondary" 
          className="journey-back-button_management"
          onClick={() => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
            navigate('/dashboard/journey');
          }}
          disabled={loading}
        >
          <FaArrowLeft /> Back to List
        </Button>
      </div>

      <Card className="journey-add-card_management">
        <Card.Header className="journey-add-card-header_management">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Journey Information</h5>
            </Col>
            <Col xs="auto">
              <Badge bg="info" className="journey-photo-count-badge_management">
                <FaImage className="me-1" /> {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="journey-add-card-body_management">
          {showProgress && (
            <div className="mb-4">
              <h6>{uploadStatus}</h6>
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                variant="info" 
                animated={uploadProgress < 100}
              />
            </div>
          )}
          
          <Form onSubmit={handleSubmit} className="journey-add-form_management">
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="journey-form-label_management">
                    <FaCalendarAlt className="me-2" />Year
                  </Form.Label>
                  <Form.Select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="journey-form-control_management"
                    disabled={loading}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                  {existingJourney && (
                    <Alert variant="warning" className="journey-year-alert_management mt-2">
                      <strong>Note:</strong> Journey for this year already exists. Adding new photos will be appended to existing ones.
                    </Alert>
                  )}
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="journey-form-label_management">Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="journey-form-control_management"
                    placeholder="Enter journey title"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="journey-form-label_management">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="journey-form-control_management"
                placeholder="Enter journey description"
                disabled={loading}
              />
            </Form.Group>

            {/* Map Location Fields */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="journey-form-label_management">📍 Location</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="journey-form-control_management"
                      placeholder="e.g., Gunung Semeru, Jawa Timur"
                      disabled={loading}
                    />
                    <Button
                      variant="primary"
                      onClick={handleFindCoordinates}
                      disabled={loading || findingCoordinates || !formData.location}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {findingCoordinates ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Finding...
                        </>
                      ) : (
                        <>
                          <FaSearch className="me-2" />
                          Find
                        </>
                      )}
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Enter location then click "Find" to auto-fill coordinates
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="journey-form-label_management">🗺️ Destination Type</Form.Label>
                  <Form.Select
                    name="destination_type"
                    value={formData.destination_type}
                    onChange={handleChange}
                    className="journey-form-control_management"
                    disabled={loading}
                  >
                    <option value="">Select type...</option>
                    <option value="gunung">🏔️ Gunung (Mountain)</option>
                    <option value="pantai">🏖️ Pantai (Beach)</option>
                    <option value="hutan">🌲 Hutan (Forest)</option>
                    <option value="air_terjun">💧 Air Terjun (Waterfall)</option>
                    <option value="gua">🕳️ Gua (Cave)</option>
                    <option value="danau">🏞️ Danau (Lake)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="journey-form-label_management">🌐 Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="journey-form-control_management"
                    placeholder="e.g., -8.1077"
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Decimal format (e.g., -8.1077 for Semeru)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="journey-form-label_management">🌐 Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="journey-form-control_management"
                    placeholder="e.g., 112.9225"
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Decimal format (e.g., 112.9225 for Semeru)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="info" className="mb-4">
              <small>
                💡 <strong>Tip:</strong> Find coordinates on Google Maps → Right-click location → Copy coordinates
              </small>
            </Alert>

            <div className="journey-photos-section_management">
              <div className="journey-photos-header_management">
                <h5>Photos</h5>
                <div>
                  <input
                    type="file"
                    id="photo-upload"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <Button 
                    variant="outline-primary" 
                    className="journey-upload-button_management"
                    onClick={() => document.getElementById('photo-upload').click()}
                    disabled={loading}
                  >
                    <FaUpload className="me-2" />
                    Upload Photos
                  </Button>
                </div>
              </div>

              <div className="journey-photo-grid_management">
                {photos.length === 0 ? (
                  <div className="journey-no-photos_management">
                    <div className="journey-no-photos-icon_management">
                      <FaImage />
                    </div>
                    <p>No photos added yet. Upload some photos to get started.</p>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => document.getElementById('photo-upload').click()}
                      disabled={loading}
                    >
                      <FaUpload className="me-2" />
                      Upload Photos
                    </Button>
                  </div>
                ) : (
                  photos.map((photo, index) => (
                    <div key={index} className="journey-photo-item_management">
                      <div className="journey-photo-item-header_management">
                        <Badge bg="secondary" className="journey-photo-number_management">
                          Photo #{index + 1}
                        </Badge>
                        <Button 
                          variant="danger" 
                          size="sm"
                          className="journey-remove-photo_management"
                          onClick={() => removePhoto(index)}
                          disabled={loading}
                        >
                          <FaTimes />
                        </Button>
                      </div>

                      <div className="journey-photo-preview_management">
                        <Image 
                          src={photo.previewUrl}
                          alt={`Preview ${index + 1}`}
                          thumbnail
                          className="journey-photo-image_management"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Error+Loading+Image';
                          }}
                        />
                      </div>

                      <Form.Group className="journey-caption-group_management">
                        <Form.Label className="journey-caption-label_management">Caption</Form.Label>
                        <Form.Control
                          type="text"
                          value={photo.caption || ''}
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                          placeholder="Add a caption for this photo"
                          className="journey-caption-input_management"
                          disabled={loading}
                        />
                        {photo.isExisting && (
                          <div className="journey-existing-badge_management">
                            <Badge bg="info">Existing</Badge>
                          </div>
                        )}
                      </Form.Group>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="journey-form-actions_management">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading || photos.length === 0}
                className="journey-save-button_management"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding Journey...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Add Journey
                  </>
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                className="journey-cancel-button_management"
                onClick={() => {
                  previewImages.forEach(url => URL.revokeObjectURL(url));
                  navigate('/dashboard/journey');
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
