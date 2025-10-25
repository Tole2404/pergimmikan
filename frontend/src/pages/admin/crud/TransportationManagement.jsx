import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBus, FaMountain } from 'react-icons/fa';
import '../styles/MountainsManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TransportationManagement() {
  const [routes, setRoutes] = useState([]);
  const [mountains, setMountains] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMountain, setFilterMountain] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoute, setCurrentRoute] = useState({
    mountain_id: '',
    from_city: '',
    to_location: '',
    transport_type: 'Bus',
    distance_km: 0,
    estimated_hours: 0,
    base_price: 0,
    is_roundtrip_available: true,
    description: ''
  });

  useEffect(() => {
    fetchRoutes();
    fetchMountains();
    fetchCities();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/transportation`);
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      Swal.fire('Error', 'Gagal memuat data transportasi', 'error');
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

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/cities`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editMode) {
        await axios.put(`${API_URL}/api/admin/transportation/${currentRoute.id}`, currentRoute, config);
        Swal.fire('Success', 'Rute berhasil diupdate', 'success');
      } else {
        await axios.post(`${API_URL}/api/admin/transportation`, currentRoute, config);
        Swal.fire('Success', 'Rute berhasil ditambahkan', 'success');
      }

      fetchRoutes();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving route:', error);
      Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data', 'error');
    }
  };

  const handleEdit = (route) => {
    setCurrentRoute(route);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Rute?',
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
        await axios.delete(`${API_URL}/api/admin/transportation/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Rute berhasil dihapus', 'success');
        fetchRoutes();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentRoute({
      mountain_id: '',
      from_city: '',
      to_location: '',
      transport_type: 'Bus',
      distance_km: 0,
      estimated_hours: 0,
      base_price: 0,
      is_roundtrip_available: true,
      description: ''
    });
  };

  // Filter & Pagination
  const filteredRoutes = routes.filter(r => {
    const matchSearch = r.from_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       r.to_location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMountain = !filterMountain || r.mountain_id == filterMountain;
    const matchType = !filterType || r.transport_type === filterType;
    
    return matchSearch && matchMountain && matchType;
  });

  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterMountain, filterType]);

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
            <FaBus size={40} />
          </div>
          <div className="header-text">
            <h1>Transportation Management</h1>
            <p>Kelola rute transportasi menuju gunung</p>
          </div>
        </div>
        <button className="btn-add-modern" onClick={() => setShowModal(true)}>
          <FaPlus /> Tambah Rute Baru
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cari kota atau lokasi..."
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Semua Jenis</option>
            <option value="Bus">Bus</option>
            <option value="Travel">Travel</option>
            <option value="Kereta">Kereta</option>
            <option value="Pesawat">Pesawat</option>
          </select>

          <button 
            className="btn-reset-filter"
            onClick={() => {
              setSearchQuery('');
              setFilterMountain('');
              setFilterType('');
            }}
          >
            Reset Filter
          </button>
        </div>

        <div className="results-info">
          Menampilkan {currentRoutes.length} dari {filteredRoutes.length} data
        </div>
      </div>

      <div className="content-card">
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Gunung</th>
                <th>Dari</th>
                <th>Ke</th>
                <th>Jenis</th>
                <th>Jarak</th>
                <th>Waktu</th>
                <th>Harga</th>
                <th>PP</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRoutes.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <FaBus size={48} color="#ccc" />
                    <p>Belum ada data rute</p>
                    <button className="btn-add-small" onClick={() => setShowModal(true)}>
                      <FaPlus /> Tambah Rute
                    </button>
                  </td>
                </tr>
              ) : (
                currentRoutes.map(route => (
                  <tr key={route.id}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <FaMountain color="#2d7a4f" />
                        {getMountainName(route.mountain_id)}
                      </div>
                    </td>
                    <td><strong>{route.from_city || '-'}</strong></td>
                    <td>{route.to_location || '-'}</td>
                    <td>
                      <span className="badge-modern badge-transport">
                        {route.transport_type || 'Bus'}
                      </span>
                    </td>
                    <td>{route.distance_km || 0} km</td>
                    <td>{route.estimated_hours || 0} jam</td>
                    <td className="price-cell">Rp {(route.base_price || 0).toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`status-badge ${route.is_roundtrip_available ? 'status-active' : 'status-inactive'}`}>
                        {route.is_roundtrip_available ? 'Ya' : 'Tidak'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-modern">
                        <button className="btn-icon btn-edit" onClick={() => handleEdit(route)} title="Edit">
                          <FaEdit />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(route.id)} title="Hapus">
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
                <FaBus size={24} color="#2d7a4f" />
                <h2>{editMode ? 'Edit Rute Transportasi' : 'Tambah Rute Baru'}</h2>
              </div>
              <button className="modal-close-modern" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form-modern">
              <div className="form-section">
                <h3 className="section-title">Informasi Rute</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Gunung Tujuan *</label>
                    <select
                      required
                      value={currentRoute.mountain_id}
                      onChange={(e) => setCurrentRoute({...currentRoute, mountain_id: e.target.value})}
                    >
                      <option value="">Pilih Gunung</option>
                      {mountains.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Jenis Transportasi *</label>
                    <select
                      value={currentRoute.transport_type}
                      onChange={(e) => setCurrentRoute({...currentRoute, transport_type: e.target.value})}
                    >
                      <option value="Bus">Bus</option>
                      <option value="Travel">Travel</option>
                      <option value="Kereta">Kereta</option>
                      <option value="Pesawat">Pesawat</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Dari Kota *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jakarta"
                      list="cities-list"
                      value={currentRoute.from_city}
                      onChange={(e) => setCurrentRoute({...currentRoute, from_city: e.target.value})}
                    />
                    <datalist id="cities-list">
                      {cities.map((city, idx) => (
                        <option key={idx} value={city.city_name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="form-group">
                    <label>Ke Lokasi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Terminal Arjosari"
                      value={currentRoute.to_location}
                      onChange={(e) => setCurrentRoute({...currentRoute, to_location: e.target.value})}
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
                      value={currentRoute.distance_km}
                      onChange={(e) => setCurrentRoute({...currentRoute, distance_km: e.target.value})}
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
                      value={currentRoute.estimated_hours}
                      onChange={(e) => setCurrentRoute({...currentRoute, estimated_hours: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Harga (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={currentRoute.base_price}
                      onChange={(e) => setCurrentRoute({...currentRoute, base_price: e.target.value})}
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
                      rows="3"
                      placeholder="Informasi tambahan tentang rute..."
                      value={currentRoute.description}
                      onChange={(e) => setCurrentRoute({...currentRoute, description: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={currentRoute.is_roundtrip_available}
                        onChange={(e) => setCurrentRoute({...currentRoute, is_roundtrip_available: e.target.checked})}
                      />
                      <span className="checkbox-label">Tersedia perjalanan pulang-pergi (PP)</span>
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
