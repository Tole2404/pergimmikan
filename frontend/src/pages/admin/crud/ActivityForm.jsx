import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Image, Spinner, ProgressBar } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUpload, FaTimes, FaArrowLeft, FaImage, FaSave, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag, FaListAlt } from 'react-icons/fa';
import { showLoading, closePopup, showSuccess, showError } from '../../../utils/sweetalert';
import imageCompression from 'browser-image-compression';
import '../styles/ActivityForm.css';

const API_URL = import.meta.env.VITE_API_URL;

const ActivityForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isExtraSmall, setIsExtraSmall] = useState(window.innerWidth <= 576);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category_id: '',
    status: 'upcoming',
    mainImage: null,
    existingImageUrl: ''
  });
  const [photos, setPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle window resize more efficiently with useCallback
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
    setIsExtraSmall(window.innerWidth <= 576);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchActivity();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/activities/categories/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Error', 'Failed to load categories');
    }
  };

  const fetchActivity = async () => {
    try {
      setLoading(true);
      showLoading('LOADING...', 'Fetching activity details');
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/activities/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch activity');

      const activity = await response.json();
      
      // Store the current image URL
      setCurrentImage(activity.image_url);
      
      // Set form data
      setFormData({
        title: activity.title,
        date: activity.date.split('T')[0],
        time: activity.time,
        location: activity.location,
        description: activity.description,
        category_id: activity.category.id,
        status: activity.status,
        mainImage: null, // Clear image field as we'll only update it if a new image is selected
        existingImageUrl: activity.image_url
      });

      if (activity.photos && activity.photos.length > 0) {
        const existingPhotos = activity.photos.map(photo => ({
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
      
      closePopup();
    } catch (error) {
      console.error('Error fetching activity:', error);
      closePopup();
      showError('Error', 'Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // Tampilkan loading saat kompresi
    showLoading('Memproses Gambar', 'Mohon tunggu saat kami mengoptimalkan gambar Anda...');
    
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
            // Kompresi hanya jika file lebih dari 1MB
            if (file.size <= 1 * 1024 * 1024) {
              console.log(`Tidak perlu kompresi: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
              return file;
            }
            
            // Kompresi gambar
            let compressedFile = await imageCompression(file, options);
            console.log(`Kompresi: ${file.name} dari ${(file.size / 1024 / 1024).toFixed(2)}MB menjadi ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            
            // Jika masih lebih dari 4.5MB, kompresi lagi dengan kualitas lebih rendah
            if (compressedFile.size > 4.5 * 1024 * 1024) {
              const tougherOptions = {
                ...options,
                maxSizeMB: 0.8,
                initialQuality: 0.5,
              };
              compressedFile = await imageCompression(compressedFile, tougherOptions);
              console.log(`Kompresi kedua: ${file.name} menjadi ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            }
            
            return compressedFile;
          } catch (error) {
            console.error('Error saat mengompres file:', error);
            return file; // Kembalikan file asli jika terjadi error
          }
        })
      );
      
      // Tutup loading dialog
      closePopup();
      
      // Buat struktur data untuk tampilan preview
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
      showError('Error', 'Gagal memproses gambar. Silakan coba lagi.');
      console.error('Error in image compression:', error);
    }
  };

  const handleCaptionChange = (index, caption) => {
    setPhotos(prev => prev.map((photo, i) => 
      i === index ? { ...photo, caption } : photo
    ));
  };

  const removePhoto = (index) => {
    if (photos[index].previewUrl && photos[index].previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photos[index].previewUrl);
    }
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveMainImage = () => {
    if (formData.mainImage) {
      URL.revokeObjectURL(URL.createObjectURL(formData.mainImage));
      setFormData(prev => ({
        ...prev,
        mainImage: null
      }));
    }
  };

  // Fungsi untuk mengirim data aktivitas tanpa foto gallery
  const createActivityInfo = async () => {
    const token = localStorage.getItem('adminToken');
    
    // Create form data object
    const form = new FormData();

    // Append all text fields
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('date', formData.date);
    form.append('time', formData.time);
    form.append('location', formData.location);
    form.append('category_id', formData.category_id);
    form.append('status', formData.status);

    // Only append image if a new one is selected
    if (formData.mainImage) {
      form.append('image', formData.mainImage);
    } else if (isEditing) {
      // If editing and no new image, send the current image URL
      form.append('image_url', currentImage);
    }

    const url = isEditing 
      ? `${API_URL}/api/admin/activities/${id}`
      : `${API_URL}/api/admin/activities`;

    const response = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save activity');
    }

    return await response.json();
  };

  // Fungsi untuk upload satu foto gallery
  const uploadSinglePhoto = async (photo, index, activityId) => {
    const token = localStorage.getItem('adminToken');
    const formDataToSend = new FormData();
    
    // Periksa ukuran file sebelum upload
    if (photo.file && photo.file.size > 5 * 1024 * 1024) {
      throw new Error(`Foto ${index + 1} melebihi batas ukuran 5MB. Ukuran: ${(photo.file.size / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Pastikan file memiliki ekstensi yang benar dengan menambahkan nama file asli
    formDataToSend.append('images', photo.file, photo.file.name || `image-${index}.jpg`);
    formDataToSend.append('caption', photo.caption || '');
    
    try {
      const response = await fetch(`${API_URL}/api/admin/activities/${activityId}/gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Gagal mengupload foto ${index + 1}: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error uploading photo ${index + 1}:`, error);
      throw new Error(`Gagal mengupload foto ${index + 1}: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowProgress(true);
    setUploadProgress(0);
    setUploadStatus('Menyimpan informasi aktivitas...');
    
    try {
      // Langkah 1: Simpan data aktivitas tanpa foto gallery
      const activityResponse = await createActivityInfo();
      const activityId = activityResponse.id || id;
      
      // Langkah 2: Upload foto gallery satu per satu
      const newPhotos = photos.filter(p => !p.isExisting);
      
      if (newPhotos.length > 0) {
        setUploadStatus('Mengupload foto gallery...');
        let successCount = 0;
        let errorMessages = [];
        
        for (let i = 0; i < newPhotos.length; i++) {
          try {
            setUploadStatus(`Mengupload foto ${i + 1} dari ${newPhotos.length}...`);
            await uploadSinglePhoto(newPhotos[i], i, activityId);
            successCount++;
            
            // Update progress
            const progress = Math.round(((i + 1) / newPhotos.length) * 100);
            setUploadProgress(progress);
          } catch (error) {
            console.error(`Error uploading photo ${i + 1}:`, error);
            errorMessages.push(error.message);
            
            // Update progress even on error
            const progress = Math.round(((i + 1) / newPhotos.length) * 100);
            setUploadProgress(progress);
          }
        }
        
        // Tampilkan hasil upload
        if (successCount === newPhotos.length) {
          setUploadStatus('Semua foto berhasil diupload!');
        } else if (successCount > 0) {
          setUploadStatus(`${successCount} dari ${newPhotos.length} foto berhasil diupload.`);
          showError('Peringatan', `Beberapa foto gagal diupload: ${errorMessages.join('\n')}`);
        } else {
          setUploadStatus('Gagal mengupload semua foto.');
          showError('Error', `Gagal mengupload foto: ${errorMessages.join('\n')}`);
        }
      }

      // Bersihkan URL objek
      previewImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      showSuccess('BERHASIL!', `Aktivitas berhasil ${isEditing ? 'diperbarui' : 'dibuat'}`);
      navigate('/dashboard/activities');
    } catch (error) {
      console.error('Error saving activity:', error);
      showError('Error', error.message || 'Gagal menyimpan aktivitas');
    } finally {
      setLoading(false);
      setShowProgress(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'mainImage') {
      handleMainImageUpload(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Fungsi untuk menangani kompresi gambar utama
  const handleMainImageUpload = async (file) => {
    if (!file) return;
    
    // Tampilkan loading jika file besar
    if (file.size > 1 * 1024 * 1024) {
      showLoading('Memproses Gambar', 'Mohon tunggu saat kami mengoptimalkan gambar Anda...');
    }
    
    try {
      let processedFile = file;
      
      // Kompresi gambar jika ukurannya lebih dari 1MB
      if (file.size > 1 * 1024 * 1024) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.7,
        };
        
        processedFile = await imageCompression(file, options);
        console.log(`Kompresi main image: ${file.name} dari ${(file.size / 1024 / 1024).toFixed(2)}MB menjadi ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
        
        // Jika masih lebih dari 4.5MB, kompresi lagi dengan kualitas lebih rendah
        if (processedFile.size > 4.5 * 1024 * 1024) {
          const tougherOptions = {
            ...options,
            maxSizeMB: 0.8,
            initialQuality: 0.5,
          };
          processedFile = await imageCompression(processedFile, tougherOptions);
          console.log(`Kompresi kedua main image: menjadi ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
        }
        
        closePopup();
      }
      
      setFormData(prev => ({
        ...prev,
        mainImage: processedFile
      }));
    } catch (error) {
      closePopup();
      showError('Error', 'Gagal memproses gambar. Silakan coba lagi.');
      console.error('Error in main image compression:', error);
    }
  };

  // Get file size in KB with 1 decimal place
  const formatFileSize = (size) => {
    return (size / 1024).toFixed(1);
  };

  if (loading && !formData.title) {
    return (
      <Container className="activity-form-container py-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading activity data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="activity-form-container py-4">
      <div className="activity-form-header mb-4">
        <h5 className="activity-form-title mt-3">
          {isEditing ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
        </h5>
      </div>
      
      <Card className="activity-form-card">
        <Card.Body className="p-0">
          {showProgress && (
            <div className="p-3 mb-0">
              <h6>{uploadStatus}</h6>
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                variant="info" 
                animated={uploadProgress < 100}
              />
            </div>
          )}
          
          <Form onSubmit={handleSubmit} className="activity-form">
            <div className="form-section">
              <Row>
                <Col lg={12}>
                  <Form.Group className="mb-4">
                    <Form.Label>Judul Aktivitas</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      name="title"
                      required
                      className="activity-form-input"
                      placeholder="Enter activity title"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={4} sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaCalendarAlt className="me-2 text-muted" />
                      Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      name="date"
                      required
                      className="activity-form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaClock className="me-2 text-muted" />
                      Time
                    </Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      name="time"
                      required
                      className="activity-form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaListAlt className="me-2 text-muted" />
                      Status
                    </Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={handleChange}
                      name="status"
                      required
                      className="activity-form-input"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaMapMarkerAlt className="me-2 text-muted" />
                      Location
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      name="location"
                      required
                      className="activity-form-input"
                      placeholder="Enter activity location"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaTag className="me-2 text-muted" />
                      Category
                    </Form.Label>
                    <Form.Select
                      value={formData.category_id}
                      onChange={handleChange}
                      name="category_id"
                      required
                      className="activity-form-input"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={isExtraSmall ? 3 : 4}
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                  required
                  className="activity-form-input"
                  placeholder="Provide detailed description of the activity"
                />
              </Form.Group>
            </div>

            <div className="form-section">
              <h5 className="section-title-landing">
                <FaImage className="section-icon" />
                Main Image
              </h5>

              <div className="main-image-container">
                {(currentImage || formData.mainImage) ? (
                  <div className="current-image-preview">
                    <div className="image-preview-container">
                      {formData.mainImage ? (
                        <Image 
                          src={URL.createObjectURL(formData.mainImage)}
                          alt="Main activity image"
                          className="preview-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x250?text=Preview';
                          }}
                        />
                      ) : (
                        <Image 
                          src={`${API_URL}${currentImage}`}
                          alt="Current activity image"
                          className="preview-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x250?text=Error+Loading+Image';
                          }}
                        />
                      )}
                    </div>

                    <div className="image-controls">
                      <input
                        type="file"
                        id="main-image-upload"
                        accept="image/*"
                        onChange={handleChange}
                        name="mainImage"
                        style={{ display: 'none' }}
                      />
                      <Button 
                        variant="outline-primary" 
                        size={isExtraSmall ? "sm" : undefined}
                        onClick={() => document.getElementById('main-image-upload').click()}
                        className="image-control-btn"
                      >
                        <FaUpload className="me-2" />
                        Change Image
                      </Button>
                      
                      {formData.mainImage && (
                        <>
                          <Button 
                            variant="outline-danger" 
                            size={isExtraSmall ? "sm" : undefined}
                            onClick={handleRemoveMainImage}
                            className="image-control-btn"
                          >
                            <FaTimes className="me-2" />
                            Remove
                          </Button>
                          
                          <div className="selected-image-info">
                            <div className="file-name">{formData.mainImage.name}</div>
                            <div className="file-size">
                              {formatFileSize(formData.mainImage.size)} KB
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="upload-image-container">
                    <div 
                      className="upload-placeholder"
                      onClick={() => document.getElementById('main-image-upload').click()}
                    >
                      <FaImage className="upload-icon" />
                      <div className="upload-text">
                        <div>{isExtraSmall ? "Tap to add image" : "Click to select main image"}</div>
                        <div className="text-muted small">Recommended size: 1200x800 pixels</div>
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      id="main-image-upload"
                      accept="image/*"
                      onChange={handleChange}
                      name="mainImage"
                      style={{ display: 'none' }}
                      required={!id} // required only for new activities
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section gallery-section">
              <h5 className="section-title-landing">
                <FaImage className="section-icon" />
                Gallery Photos
              </h5>

              <div className="gallery-controls mb-4">
                <p className="gallery-description text-muted">
                  {isExtraSmall 
                    ? "Add photos to gallery" 
                    : "Add multiple photos to create a gallery for this activity"
                  }
                </p>
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <Button 
                  variant="outline-primary" 
                  size={isExtraSmall ? "sm" : undefined}
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="gallery-upload-btn"
                >
                  <FaUpload className="me-2" />
                  Add Photos
                </Button>
              </div>

              {photos.length > 0 ? (
                <Row className="gallery-grid">
                  {photos.map((photo, index) => (
                    <Col key={index} lg={4} md={6} xs={6} className="gallery-item-col mb-3">
                      <div className={`gallery-item ${photo.isExisting ? 'existing-photo' : 'new-photo'}`}>
                        <div className="gallery-item-header">
                          <div className="photo-number">
                            #{index + 1}
                            {photo.isExisting ? (
                              <span className="badge bg-info ms-2">Existing</span>
                            ) : (
                              <span className="badge bg-success ms-2">New</span>
                            )}
                          </div>
                          <Button 
                            variant="danger"
                            size="sm"
                            onClick={() => removePhoto(index)}
                            className="remove-photo-btn"
                            aria-label="Remove photo"
                          >
                            <FaTimes />
                          </Button>
                        </div>

                        <div className="gallery-image-wrapper">
                          <Image 
                            src={photo.previewUrl}
                            alt={`Gallery photo ${index + 1}`}
                            className="gallery-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Error';
                            }}
                          />
                        </div>

                        <div className="gallery-item-footer">
                          <Form.Control
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => handleCaptionChange(index, e.target.value)}
                            placeholder="Add caption"
                            className="caption-input"
                          />
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="no-photos-message">
                  <div className="text-center py-4 text-muted">
                    <FaImage className="empty-gallery-icon" />
                    <p>No gallery photos added yet</p>
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/dashboard/activities')}
                disabled={loading}
                size={isExtraSmall ? "sm" : undefined}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                size={isExtraSmall ? "sm" : undefined}
              >
                <FaSave className="me-2" />
                {loading ? 'Saving...' : isEditing ? 'Update Activity' : 'Create Activity'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ActivityForm;
