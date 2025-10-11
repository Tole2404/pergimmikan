import { useState, useEffect } from 'react';
import { Form, Button, Card, Image, Container, Row, Col, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUpload, FaTimes, FaImage, FaSave, FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import '../styles/ManagementComponents.css';
import Loading from '../../../components/common/Loading';
import { showSuccess, showError, showLoading, closePopup } from '../../../utils/sweetalert';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

export default function EditJourney() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    destination_type: '',
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [findingCoordinates, setFindingCoordinates] = useState(false);

  useEffect(() => {
    fetchJourney();
  }, [id]);

  const fetchJourney = async () => {
    setFetchingData(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/journeys/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch journey data');
      }

      const data = await response.json();

      setFormData({
        year: data.year || '',
        title: data.title || '',
        description: data.description || '',
        location: data.location || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        destination_type: data.destination_type || '',
      });

      if (data.photos && data.photos.length > 0) {
        const existingPhotos = data.photos.map(photo => ({
          file: null,
          caption: photo.caption || '',
          previewUrl: `${API_URL}${photo.src}`,
          isExisting: true,
          id: photo.id,
          src: photo.src
        }));
        setPhotos(existingPhotos);
        setPreviewImages(existingPhotos.map(p => p.previewUrl));
      }
    } catch (error) {
      setError('Failed to fetch journey data. Please try again.');
      showError('Error', 'Failed to load journey data. Please try again.');
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

  // Array untuk menyimpan foto yang dihapus (dengan info lengkap)
  const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);

  const removePhoto = (index) => {
    const photoToRemove = photos[index];
    
    // Jika foto yang dihapus adalah foto yang sudah ada (dari database)
    if (photoToRemove.isExisting && photoToRemove.id) {
      // Tambahkan foto lengkap ke array deletedPhotos untuk menyimpan info tambahan seperti src
      setDeletedPhotoIds(prev => [...prev, photoToRemove]);
      console.log(`Menandai foto ID ${photoToRemove.id} untuk dihapus, src: ${photoToRemove.src}`);
    }
    
    // Bersihkan URL objek jika ada
    if (photoToRemove.previewUrl && photoToRemove.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.previewUrl);
    }
    
    // Hapus dari state
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Fungsi untuk menandai foto untuk dihapus (tanpa mengirim request DELETE)
  const deletePhoto = async (photoToRemove) => {
    if (!photoToRemove || !photoToRemove.id) {
      throw new Error('Invalid photo data for deletion');
    }
    
    const photoId = photoToRemove.id;
    console.log(`Menandai foto ID: ${photoId} untuk dihapus dalam updateJourneyInfo`);
    
    // Kita hanya menandai foto untuk dihapus, tanpa mengirim request DELETE
    // Penghapusan akan ditangani oleh server saat menerima array photosToDelete
    return { success: true, id: photoId };
  };

  // Fungsi untuk mengirim data journey tanpa foto
  const updateJourneyInfo = async () => {
    const token = localStorage.getItem('adminToken');
    const journeyData = {
      year: formData.year,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      latitude: formData.latitude,
      longitude: formData.longitude,
      destination_type: formData.destination_type,
      journeyId: id // Pastikan ID journey dikirim
    };

    // Jika ada foto yang sudah ada sebelumnya, tambahkan ke data
    const existingPhotos = photos.filter(p => p.isExisting);
    if (existingPhotos.length > 0) {
      journeyData.existingPhotos = existingPhotos.map(p => ({
        id: p.id,
        src: p.src,
        caption: p.caption
      }));
    }
    
    // Tambahkan ID foto yang akan dihapus
    if (deletedPhotoIds.length > 0) {
      journeyData.photosToDelete = deletedPhotoIds.map(p => p.id);
      console.log('Foto yang akan dihapus:', journeyData.photosToDelete);
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
      throw new Error('Failed to update journey info');
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
      throw new Error(`Gagal mengunggah foto ${index + 1}`);
    }
    
    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowProgress(true);
    setUploadProgress(0);
    setUploadStatus('Updating journey information...');

    try {
      console.log('Memulai proses update journey...');
      console.log('Data journey yang dikirim:', {
        ...formData,
        existingPhotos: photos.filter(p => p.isExisting).length,
        newPhotos: photos.filter(p => !p.isExisting).length,
        deletedPhotoIds: deletedPhotoIds.length
      });
      
      // Langkah 0: Persiapan untuk menghapus foto (tanpa mengirim request DELETE)
      if (deletedPhotoIds.length > 0) {
        setUploadStatus(`Menyiapkan ${deletedPhotoIds.length} foto untuk dihapus...`);
        console.log('Foto yang akan dihapus:', deletedPhotoIds.map(p => p.id));
        
        // Tidak perlu mengirim request DELETE untuk setiap foto
        // Cukup update progress bar untuk UX yang lebih baik
        setUploadProgress(10);
      }
      
      // Langkah 1: Update journey info tanpa foto
      setUploadStatus('Updating journey information...');
      setUploadProgress(30); // Mulai dari 30% setelah penghapusan
      const journeyResponse = await updateJourneyInfo();
      console.log('Respons update journey info:', journeyResponse);
      const journeyId = journeyResponse.id || id;
      
      // Langkah 2: Upload foto baru satu per satu
      const newPhotos = photos.filter(p => !p.isExisting);
      
      if (newPhotos.length > 0) {
        setUploadStatus('Uploading new photos...');
        
        for (let i = 0; i < newPhotos.length; i++) {
          setUploadStatus(`Uploading photo ${i + 1} of ${newPhotos.length}...`);
          await uploadSinglePhoto(newPhotos[i], i, journeyId);
          
          // Update progress (dari 40% hingga 100%)
          const baseProgress = 40; // Mulai dari 40% setelah update info
          const progressPerPhoto = (100 - baseProgress) / newPhotos.length;
          const progress = Math.round(baseProgress + ((i + 1) * progressPerPhoto));
          setUploadProgress(progress);
        }
      } else {
        // Jika tidak ada foto baru, langsung selesai
        setUploadProgress(100);
      }

      // Bersihkan URL objek
      previewImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      setUploadStatus('Journey updated successfully!');
      await showSuccess('SUCCESS!', 'Journey has been updated successfully');
      navigate('/dashboard/journey');
    } catch (error) {
      console.error('Error updating journey:', error);
      showError('ERROR', `Failed to update journey: ${error.message}`);
    } finally {
      setLoading(false);
      setShowProgress(false);
    }
  };

  if (fetchingData) {
    return (
      <Container fluid className="journey-edit-container_management">
        <Loading size="medium" overlay={false} text="Loading journey data..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="journey-edit-container_management">
        <div className="journey-error_management">
          <div className="journey-error-icon_management">⚠️</div>
          <h3>Error Loading Journey</h3>
          <p>{error}</p>
          <Button 
            variant="primary" 
            onClick={fetchJourney}
            className="journey-retry-button_management"
          >
            Try Again
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/dashboard/journey')}
            className="mt-2"
          >
            Kembali ke List
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="journey-edit-container_management">
      <div className="journey-edit-header_management">
        <div className="journey-edit-title_management">
          <h5>Ubah Journey</h5>
          <p className="journey-edit-subtitle_management">Ubah informasi journey dan kelola foto</p>
        </div>
        <Button 
          variant="outline-secondary" 
          className="journey-back-button_management"
          onClick={() => {
            previewImages.forEach(url => {
              if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
              }
            });
            navigate('/dashboard/journey');
          }}
          disabled={loading}
        >
          <FaArrowLeft /> Kembali ke List
        </Button>
      </div>

      <Card className="journey-edit-card_management">
        <Card.Header className="journey-edit-card-header_management">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Informasi Journey</h5>
            </Col>
            <Col xs="auto">
              <Badge bg="info" className="journey-photo-count-badge_management">
                <FaImage className="me-1" /> {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="journey-edit-card-body_management">
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
          
          <Form onSubmit={handleSubmit} className="journey-edit-form_management">
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="journey-form-label_management">
                    <FaCalendarAlt className="me-2" />Year
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="journey-form-control_management"
                    min="1900"
                    max="2100"
                    placeholder="Enter year"
                    disabled={loading}
                  />
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
                    Unggah Foto
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
                      Unggah Foto
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
                    Menyimpan Perubahan...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                className="journey-cancel-button_management"
                onClick={() => {
                  previewImages.forEach(url => {
                    if (url.startsWith('blob:')) {
                      URL.revokeObjectURL(url);
                    }
                  });
                  navigate('/dashboard/journey');
                }}
                disabled={loading}
              >
                Batal
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
