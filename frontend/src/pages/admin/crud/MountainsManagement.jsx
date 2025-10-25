import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMountain } from 'react-icons/fa';
import '../styles/MountainsManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MountainsManagement() {
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvince, setFilterProvince] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'
  const [currentMountain, setCurrentMountain] = useState({
    name: '',
    province: '',
    elevation: '',
    difficulty: 'Mudah',
    typical_duration_days: 2,
    description: '',
    best_months: '[]',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchMountains();
  }, []);

  const fetchMountains = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/mountains`);
      setMountains(response.data);
    } catch (error) {
      console.error('Error fetching mountains:', error);
      Swal.fire('Error', 'Gagal memuat data gunung', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Swal.fire('Error', 'Ukuran file maksimal 5MB', 'error');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      let imageUrl = currentMountain.image_url;

      // Upload image if file is selected
      if (imageFile && uploadMethod === 'file') {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        };

        const uploadResponse = await axios.post(`${API_URL}/api/admin/upload/mountain`, formData, uploadConfig);
        imageUrl = uploadResponse.data.imageUrl;
      }

      const mountainData = {
        ...currentMountain,
        image_url: imageUrl
      };

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editMode) {
        await axios.put(`${API_URL}/api/admin/mountains/${currentMountain.id}`, mountainData, config);
        Swal.fire('Success', 'Gunung berhasil diupdate', 'success');
      } else {
        await axios.post(`${API_URL}/api/admin/mountains`, mountainData, config);
        Swal.fire('Success', 'Gunung berhasil ditambahkan', 'success');
      }

      fetchMountains();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving mountain:', error);
      Swal.fire('Error', error.response?.data?.error || 'Gagal menyimpan data', 'error');
    }
  };

  const handleEdit = (mountain) => {
    setCurrentMountain(mountain);
    setEditMode(true);
    setImagePreview(mountain.image_url || null);
    setImageFile(null);
    setUploadMethod(mountain.image_url ? 'url' : 'file');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Gunung?',
      text: 'Data ini akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${API_URL}/api/admin/mountains/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Gunung berhasil dihapus', 'success');
        fetchMountains();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setImageFile(null);
    setImagePreview(null);
    setUploadMethod('file');
    setCurrentMountain({
      name: '',
      province: '',
      elevation: '',
      difficulty: 'Mudah',
      typical_duration_days: 2,
      description: '',
      best_months: '[]',
      image_url: '',
      is_active: true
    });
  };

  // Filter & Pagination Logic
  const filteredMountains = mountains.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.province.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProvince = !filterProvince || m.province === filterProvince;
    const matchDifficulty = !filterDifficulty || m.difficulty === filterDifficulty;
    const matchStatus = filterStatus === '' || 
                       (filterStatus === 'active' ? m.is_active : !m.is_active);
    
    return matchSearch && matchProvince && matchDifficulty && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMountains.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMountains = filteredMountains.slice(indexOfFirstItem, indexOfLastItem);

  // Get unique provinces for filter
  const provinces = [...new Set(mountains.map(m => m.province))].sort();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterProvince, filterDifficulty, filterStatus]);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Memuat data...</p>
    </div>
  );

  return (
    <div className="management-container">
      <div className="page-header-modern">
        <div className="header-content">
          <div className="header-icon">
            <FaMountain size={40} />
          </div>
          <div className="header-text">
            <h1>Mountains Management</h1>
            <p>Kelola data gunung untuk trip calculator</p>
          </div>
        </div>
        <button className="btn-add-modern" onClick={() => setShowModal(true)}>
          <FaPlus /> Tambah Gunung Baru
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cari gunung atau provinsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-group">
          <select 
            className="filter-select"
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
          >
            <option value="">Semua Provinsi</option>
            {provinces.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="">Semua Kesulitan</option>
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="Sulit">Sulit</option>
            <option value="Sangat Sulit">Sangat Sulit</option>
          </select>

          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button 
            className="btn-reset-filter"
            onClick={() => {
              setSearchQuery('');
              setFilterProvince('');
              setFilterDifficulty('');
              setFilterStatus('');
            }}
          >
            Reset Filter
          </button>
        </div>

        <div className="results-info">
          Menampilkan {currentMountains.length} dari {filteredMountains.length} data
        </div>
      </div>

      <div className="content-card">
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Nama Gunung</th>
                <th>Provinsi</th>
                <th>Elevasi</th>
                <th>Kesulitan</th>
                <th>Durasi</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMountains.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <FaMountain size={48} color="#ccc" />
                    <p>Belum ada data gunung</p>
                    <button className="btn-add-small" onClick={() => setShowModal(true)}>
                      <FaPlus /> Tambah Gunung
                    </button>
                  </td>
                </tr>
              ) : (
                currentMountains.map(mountain => (
                  <tr key={mountain.id}>
                    <td>
                      <strong>{mountain.name}</strong>
                    </td>
                    <td>{mountain.province}</td>
                    <td><strong>{mountain.elevation.toLocaleString('id-ID')}</strong> mdpl</td>
                    <td>
                      <span className={`badge-modern badge-${mountain.difficulty.toLowerCase().replace(' ', '-')}`}>
                        {mountain.difficulty}
                      </span>
                    </td>
                    <td>{mountain.typical_duration_days} hari</td>
                    <td>
                      <span className={`status-badge ${mountain.is_active ? 'status-active' : 'status-inactive'}`}>
                        {mountain.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-modern">
                        <button className="btn-icon btn-edit" onClick={() => handleEdit(mountain)} title="Edit">
                          <FaEdit />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(mountain.id)} title="Hapus">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                // Show first, last, current, and adjacent pages
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="pagination-dots">...</span>;
                }
                return null;
              })}
            </div>

            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Modal Form - Professional */}
      {showModal && (
        <div className="modal-overlay-modern" onClick={handleCloseModal}>
          <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <div className="modal-title-section">
                <FaMountain size={24} color="#2d7a4f" />
                <h2>{editMode ? 'Edit Data Gunung' : 'Tambah Gunung Baru'}</h2>
              </div>
              <button className="modal-close-modern" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form-modern">
              <div className="form-section">
                <h3 className="section-title">Informasi Dasar</h3>
                <div className="form-grid-2">
                <div className="form-group">
                  <label>Nama Gunung *</label>
                  <input
                    type="text"
                    required
                    value={currentMountain.name}
                    onChange={(e) => setCurrentMountain({...currentMountain, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Provinsi *</label>
                  <input
                    type="text"
                    required
                    value={currentMountain.province}
                    onChange={(e) => setCurrentMountain({...currentMountain, province: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Elevasi (mdpl) *</label>
                  <input
                    type="number"
                    required
                    value={currentMountain.elevation}
                    onChange={(e) => setCurrentMountain({...currentMountain, elevation: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tingkat Kesulitan *</label>
                  <select
                    value={currentMountain.difficulty}
                    onChange={(e) => setCurrentMountain({...currentMountain, difficulty: e.target.value})}
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                    <option value="Sangat Sulit">Sangat Sulit</option>
                  </select>
                </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Informasi Tambahan</h3>
                <div className="form-grid-1">
                  <div className="form-group">
                    <label>Gambar Gunung</label>
                    
                    {/* Upload Method Toggle */}
                    <div className="upload-method-toggle">
                      <button
                        type="button"
                        className={`toggle-btn ${uploadMethod === 'file' ? 'active' : ''}`}
                        onClick={() => setUploadMethod('file')}
                      >
                        📁 Upload File
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn ${uploadMethod === 'url' ? 'active' : ''}`}
                        onClick={() => setUploadMethod('url')}
                      >
                        🔗 URL
                      </button>
                    </div>

                    {uploadMethod === 'file' ? (
                      <div className="image-upload-area">
                        <input
                          type="file"
                          id="mountain-image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file-input-hidden"
                        />
                        <label htmlFor="mountain-image" className="file-upload-label">
                          {imagePreview ? (
                            <div className="image-preview-container">
                              <img src={imagePreview} alt="Preview" className="image-preview" />
                              <div className="image-overlay">
                                <span>Click to change image</span>
                              </div>
                            </div>
                          ) : (
                            <div className="upload-placeholder">
                              <div className="upload-icon">📷</div>
                              <p><strong>Click to choose image</strong></p>
                              <p className="upload-hint">or drag and drop</p>
                              <p className="upload-limit">PNG, JPG up to 5MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={currentMountain.image_url}
                          onChange={(e) => setCurrentMountain({...currentMountain, image_url: e.target.value})}
                        />
                        {currentMountain.image_url && (
                          <div className="url-preview">
                            <img src={currentMountain.image_url} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea
                      rows="4"
                      placeholder="Deskripsi singkat tentang gunung..."
                      value={currentMountain.description}
                      onChange={(e) => setCurrentMountain({...currentMountain, description: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={currentMountain.is_active}
                        onChange={(e) => setCurrentMountain({...currentMountain, is_active: e.target.checked})}
                      />
                      <span className="checkbox-label">Aktifkan gunung ini</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer-modern">
                <button type="button" className="btn-cancel-modern" onClick={handleCloseModal}>
                  Batal
                </button>
                <button type="submit" className="btn-submit-modern">
                  {editMode ? '✓ Update Data' : '✓ Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
