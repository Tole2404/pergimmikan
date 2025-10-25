import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaToolbox, FaMountain } from 'react-icons/fa';
import '../styles/MountainsManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState([]);
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMountain, setFilterMountain] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState({
    mountain_id: '',
    equipment_name: '',
    category: 'Carrier',
    price_per_day: 0,
    stock_quantity: 0,
    description: '',
    is_available: true
  });

  useEffect(() => {
    fetchEquipment();
    fetchMountains();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/equipment`);
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      Swal.fire('Error', 'Gagal memuat data equipment', 'error');
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
        await axios.put(`${API_URL}/api/admin/equipment/${currentEquipment.id}`, currentEquipment, config);
        Swal.fire('Success', 'Equipment berhasil diupdate', 'success');
      } else {
        await axios.post(`${API_URL}/api/admin/equipment`, currentEquipment, config);
        Swal.fire('Success', 'Equipment berhasil ditambahkan', 'success');
      }

      fetchEquipment();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving equipment:', error);
      Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data', 'error');
    }
  };

  const handleEdit = (item) => {
    setCurrentEquipment(item);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Equipment?',
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
        await axios.delete(`${API_URL}/api/admin/equipment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Equipment berhasil dihapus', 'success');
        fetchEquipment();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentEquipment({
      mountain_id: '',
      equipment_name: '',
      category: 'Carrier',
      price_per_day: 0,
      stock_quantity: 0,
      description: '',
      is_available: true
    });
  };

  // Filter & Pagination
  const filteredEquipment = equipment.filter(e => {
    const matchSearch = e.equipment_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMountain = !filterMountain || e.mountain_id == filterMountain;
    const matchCategory = !filterCategory || e.category === filterCategory;
    
    return matchSearch && matchMountain && matchCategory;
  });

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEquipmentList = filteredEquipment.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterMountain, filterCategory]);

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
            <FaToolbox size={40} />
          </div>
          <div className="header-text">
            <h1>Equipment Management</h1>
            <p>Kelola rental equipment pendakian</p>
          </div>
        </div>
        <button className="btn-add-modern" onClick={() => setShowModal(true)}>
          <FaPlus /> Tambah Equipment Baru
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cari equipment..."
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            <option value="Carrier">Carrier</option>
            <option value="Tenda">Tenda</option>
            <option value="Sleeping Bag">Sleeping Bag</option>
            <option value="Kompor">Kompor</option>
            <option value="Tracking Pole">Tracking Pole</option>
            <option value="Headlamp">Headlamp</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <button 
            className="btn-reset-filter"
            onClick={() => {
              setSearchQuery('');
              setFilterMountain('');
              setFilterCategory('');
            }}
          >
            Reset Filter
          </button>
        </div>

        <div className="results-info">
          Menampilkan {currentEquipmentList.length} dari {filteredEquipment.length} data
        </div>
      </div>

      <div className="content-card">
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Nama Equipment</th>
                <th>Gunung</th>
                <th>Kategori</th>
                <th>Harga/Hari</th>
                <th>Stok</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEquipmentList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <FaToolbox size={48} color="#ccc" />
                    <p>Belum ada data equipment</p>
                    <button className="btn-add-small" onClick={() => setShowModal(true)}>
                      <FaPlus /> Tambah Equipment
                    </button>
                  </td>
                </tr>
              ) : (
                currentEquipmentList.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.equipment_name || '-'}</strong></td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <FaMountain color="#2d7a4f" />
                        {getMountainName(item.mountain_id)}
                      </div>
                    </td>
                    <td>
                      <span className="badge-modern badge-transport">
                        {item.category || 'Lainnya'}
                      </span>
                    </td>
                    <td className="price-cell">Rp {(item.price_per_day || 0).toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`stock-badge ${item.stock_quantity > 0 ? 'stock-available' : 'stock-empty'}`}>
                        {item.stock_quantity || 0} unit
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${item.is_available ? 'status-active' : 'status-inactive'}`}>
                        {item.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-modern">
                        <button className="btn-icon btn-edit" onClick={() => handleEdit(item)} title="Edit">
                          <FaEdit />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(item.id)} title="Hapus">
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
                <FaToolbox size={24} color="#2d7a4f" />
                <h2>{editMode ? 'Edit Equipment' : 'Tambah Equipment Baru'}</h2>
              </div>
              <button className="modal-close-modern" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form-modern">
              <div className="form-section">
                <h3 className="section-title">Informasi Equipment</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Gunung *</label>
                    <select
                      required
                      value={currentEquipment.mountain_id}
                      onChange={(e) => setCurrentEquipment({...currentEquipment, mountain_id: e.target.value})}
                    >
                      <option value="">Pilih Gunung</option>
                      {mountains.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nama Equipment *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Carrier 60L"
                      value={currentEquipment.equipment_name}
                      onChange={(e) => setCurrentEquipment({...currentEquipment, equipment_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Kategori *</label>
                    <select
                      value={currentEquipment.category}
                      onChange={(e) => setCurrentEquipment({...currentEquipment, category: e.target.value})}
                    >
                      <option value="Carrier">Carrier</option>
                      <option value="Tenda">Tenda</option>
                      <option value="Sleeping Bag">Sleeping Bag</option>
                      <option value="Kompor">Kompor</option>
                      <option value="Tracking Pole">Tracking Pole</option>
                      <option value="Headlamp">Headlamp</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Harga/Hari (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={currentEquipment.price_per_day}
                      onChange={(e) => setCurrentEquipment({...currentEquipment, price_per_day: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stok Tersedia *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={currentEquipment.stock_quantity}
                      onChange={(e) => setCurrentEquipment({...currentEquipment, stock_quantity: e.target.value})}
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
                      placeholder="Deskripsi equipment..."
                      value={currentEquipment.description}
                      onChange={(e) => setCurrentEquipment({...currentEquipment, description: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={currentEquipment.is_available}
                        onChange={(e) => setCurrentEquipment({...currentEquipment, is_available: e.target.checked})}
                      />
                      <span className="checkbox-label">Equipment tersedia untuk disewa</span>
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
