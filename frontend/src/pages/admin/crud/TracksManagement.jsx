import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMapMarkedAlt, FaMountain } from 'react-icons/fa';
import '../styles/MountainsManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TracksManagement() {
  const [tracks, setTracks] = useState([]);
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMountain, setFilterMountain] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    mountain_id: '',
    track_name: '',
    basecamp_name: '',
    basecamp_accommodation_fee: 10000,
    difficulty: 'Sedang',
    distance_km: 0,
    estimated_hours: 0,
    entrance_fee: 0,
    guide_fee_per_day: 0,
    porter_fee_per_day: 0,
    description: '',
    is_open: true,
    popularity_rank: 1
  });

  useEffect(() => {
    fetchTracks();
    fetchMountains();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/tracks`);
      setTracks(response.data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      Swal.fire('Error', 'Gagal memuat data jalur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMountains = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/mountains`);
      setMountains(response.data);
    } catch (error) {
      console.error('Error fetching mountains:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editMode) {
        await axios.put(`${API_URL}/api/admin/tracks/${currentTrack.id}`, currentTrack, config);
        Swal.fire('Success', 'Jalur berhasil diupdate', 'success');
      } else {
        await axios.post(`${API_URL}/api/admin/tracks`, currentTrack, config);
        Swal.fire('Success', 'Jalur berhasil ditambahkan', 'success');
      }

      fetchTracks();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving track:', error);
      Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data', 'error');
    }
  };

  const handleEdit = (track) => {
    setCurrentTrack(track);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Jalur?',
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
        await axios.delete(`${API_URL}/api/admin/tracks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Jalur berhasil dihapus', 'success');
        fetchTracks();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentTrack({
      mountain_id: '',
      track_name: '',
      basecamp_name: '',
      basecamp_accommodation_fee: 10000,
      difficulty: 'Sedang',
      distance_km: 0,
      estimated_hours: 0,
      entrance_fee: 0,
      guide_fee_per_day: 0,
      porter_fee_per_day: 0,
      description: '',
      is_open: true,
      popularity_rank: 1
    });
  };

  // Filter & Pagination
  const filteredTracks = tracks.filter(t => {
    const matchSearch = t.track_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMountain = !filterMountain || t.mountain_id == filterMountain;
    const matchStatus = filterStatus === '' || 
                       (filterStatus === 'open' ? t.is_open : !t.is_open);
    
    return matchSearch && matchMountain && matchStatus;
  });

  const totalPages = Math.ceil(filteredTracks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTracks = filteredTracks.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterMountain, filterStatus]);

  const getMountainName = (mountainId) => {
    const mountain = mountains.find(m => m.id === mountainId);
    return mountain ? mountain.name : 'Unknown';
  };

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
            <FaMapMarkedAlt size={40} />
          </div>
          <div className="header-text">
            <h1>Tracks Management</h1>
            <p>Kelola jalur pendakian untuk setiap gunung</p>
          </div>
        </div>
        <button className="btn-add-modern" onClick={() => setShowModal(true)}>
          <FaPlus /> Tambah Jalur Baru
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cari jalur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-group">
          <select 
            className="filter-select"
            value={filterMountain}
            onChange={(e) => setFilterMountain(e.target.value)}
          >
            <option value="">Semua Gunung</option>
            {mountains.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>

          <button 
            className="btn-reset-filter"
            onClick={() => {
              setSearchQuery('');
              setFilterMountain('');
              setFilterStatus('');
            }}
          >
            Reset Filter
          </button>
        </div>

        <div className="results-info">
          Menampilkan {currentTracks.length} dari {filteredTracks.length} data
        </div>
      </div>

      <div className="content-card">
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Nama Jalur</th>
                <th>Gunung</th>
                <th>Jarak</th>
                <th>Estimasi Waktu</th>
                <th>Kesulitan</th>
                <th>Tiket Masuk</th>
                <th>Popularitas</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTracks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <FaMapMarkedAlt size={48} color="#ccc" />
                    <p>Belum ada data jalur</p>
                    <button className="btn-add-small" onClick={() => setShowModal(true)}>
                      <FaPlus /> Tambah Jalur
                    </button>
                  </td>
                </tr>
              ) : (
                currentTracks.map(track => (
                  <tr key={track.id}>
                    <td><strong>{track.track_name}</strong></td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <FaMountain color="#2d7a4f" />
                        {getMountainName(track.mountain_id)}
                      </div>
                    </td>
                    <td>{track.distance_km} km</td>
                    <td>{track.estimated_hours} jam</td>
                    <td>
                      <span className={`badge-modern badge-${track.difficulty.toLowerCase().replace(' ', '-')}`}>
                        {track.difficulty}
                      </span>
                    </td>
                    <td className="price-cell">Rp {track.entrance_fee.toLocaleString('id-ID')}</td>
                    <td>
                      <span className="popularity-badge">
                        ⭐ #{track.popularity_rank}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${track.is_open ? 'status-active' : 'status-inactive'}`}>
                        {track.is_open ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-modern">
                        <button className="btn-icon btn-edit" onClick={() => handleEdit(track)} title="Edit">
                          <FaEdit />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(track.id)} title="Hapus">
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

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay-modern" onClick={handleCloseModal}>
          <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <div className="modal-title-section">
                <FaMapMarkedAlt size={24} color="#2d7a4f" />
                <h2>{editMode ? 'Edit Jalur Pendakian' : 'Tambah Jalur Baru'}</h2>
              </div>
              <button className="modal-close-modern" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form-modern">
              <div className="form-section">
                <h3 className="section-title">Informasi Jalur</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Gunung *</label>
                    <select
                      required
                      value={currentTrack.mountain_id}
                      onChange={(e) => setCurrentTrack({...currentTrack, mountain_id: e.target.value})}
                    >
                      <option value="">Pilih Gunung</option>
                      {mountains.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nama Jalur *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Via Ranu Pani"
                      value={currentTrack.track_name}
                      onChange={(e) => setCurrentTrack({...currentTrack, track_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Jarak (km) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={currentTrack.distance_km}
                      onChange={(e) => setCurrentTrack({...currentTrack, distance_km: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estimasi Waktu (jam) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={currentTrack.estimated_hours}
                      onChange={(e) => setCurrentTrack({...currentTrack, estimated_hours: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tingkat Kesulitan *</label>
                    <select
                      value={currentTrack.difficulty}
                      onChange={(e) => setCurrentTrack({...currentTrack, difficulty: e.target.value})}
                    >
                      <option value="Mudah">Mudah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Sulit">Sulit</option>
                      <option value="Sangat Sulit">Sangat Sulit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ranking Popularitas *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="1"
                      value={currentTrack.popularity_rank}
                      onChange={(e) => setCurrentTrack({...currentTrack, popularity_rank: e.target.value})}
                    />
                    <small className="form-hint">1 = paling populer</small>
                  </div>
                  <div className="form-group">
                    <label>Nama Basecamp *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ranu Pani"
                      value={currentTrack.basecamp_name}
                      onChange={(e) => setCurrentTrack({...currentTrack, basecamp_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Harga Nginep (Rp/malam)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="10000"
                      value={currentTrack.basecamp_accommodation_fee}
                      onChange={(e) => setCurrentTrack({...currentTrack, basecamp_accommodation_fee: e.target.value})}
                    />
                    <small className="form-hint">Per orang per malam</small>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Biaya Jalur Ini</h3>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Tiket Masuk (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={currentTrack.entrance_fee}
                      onChange={(e) => setCurrentTrack({...currentTrack, entrance_fee: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Biaya Guide/Hari (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentTrack.guide_fee_per_day}
                      onChange={(e) => setCurrentTrack({...currentTrack, guide_fee_per_day: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Biaya Porter/Hari (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentTrack.porter_fee_per_day}
                      onChange={(e) => setCurrentTrack({...currentTrack, porter_fee_per_day: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Informasi Tambahan</h3>
                <div className="form-grid-1">
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea
                      rows="4"
                      placeholder="Deskripsi jalur pendakian..."
                      value={currentTrack.description}
                      onChange={(e) => setCurrentTrack({...currentTrack, description: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={currentTrack.is_open}
                        onChange={(e) => setCurrentTrack({...currentTrack, is_open: e.target.checked})}
                      />
                      <span className="checkbox-label">Jalur ini terbuka untuk pendakian</span>
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
