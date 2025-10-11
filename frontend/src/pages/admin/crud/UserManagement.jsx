import { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Card, 
  Table, 
  Badge, 
  Button, 
  InputGroup,
  Row,
  Col,
  Form,
  Tabs,
  Tab,
  Modal,
  Pagination
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaEdit, 
  FaTrash, 
  FaUserPlus, 
  FaCheck, 
  FaTimes, 
  FaUserTag,
  FaSearch,
  FaFilter,
  FaUserCircle,
  FaFileImport,
  FaFileExport,
  FaDownload,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import '../styles/UserManagement.css';
import { showSuccess, showError, showConfirm, showLoading, closePopup } from '../../../utils/sweetalert';

const API_URL = import.meta.env.VITE_API_URL;

// Loading component for use in the UserManagement component
const Loading = ({ text = 'Memuat...', overlay = false }) => {
  return (
    <div className={`loading-container ${overlay ? 'with-overlay' : ''}`}>
      <div className="loading-spinner">
        <FaUserCircle className="loading-icon pulse" />
        <span className="loading-text">{text}</span>
      </div>
    </div>
  );
};

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role_id: '',
    password: '',
    status: 'active',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch users and roles
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Filter users based on search term and status
  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (roles.find(r => r.id === user.role_id)?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    // Urutkan pengguna berdasarkan nama (abjad)
    const sortedUsers = [...filtered].sort((a, b) => {
      return a.full_name.localeCompare(b.full_name);
    });
    
    setFilteredUsers(sortedUsers);
    setCurrentPage(1); // Reset ke halaman pertama setiap kali filter berubah
  }, [searchTerm, filterStatus, users, roles]);

  // Paginasi untuk users
  useEffect(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    setPaginatedUsers(filteredUsers.slice(indexOfFirstUser, indexOfLastUser));
  }, [filteredUsers, currentPage, usersPerPage]);

  // Fungsi untuk navigasi halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      // Ensure data is an array
      setUsers(Array.isArray(data) ? data : data.users || []);
      setFilteredUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      showError('Error', error.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      
      const data = await response.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      showError('Error', error.message || 'Failed to fetch roles');
    }
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role_id: user.role_id,
        status: user.status,
        password: '', // Don't set password when editing
        image: null
      });
      
      // Set image preview if user has image_url
      if (user.image_url) {
        setImagePreview(`${API_URL}${user.image_url}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        full_name: '',
        role_id: '',
        password: '',
        status: 'active',
        image: null
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showLoading('SAVING...', 'Please wait while we process your request');
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingUser 
        ? `${API_URL}/api/admin/users/${editingUser.id}`
        : `${API_URL}/api/admin/users`;
      
      const method = editingUser ? 'PUT' : 'POST';
      
      // Jika ada file gambar, gunakan FormData untuk mengirim data
      if (formData.image) {
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('full_name', formData.full_name);
        formDataToSend.append('role_id', formData.role_id);
        formDataToSend.append('status', formData.status);
        if (formData.password) {
          formDataToSend.append('password', formData.password);
        }
        // Pastikan nama field sesuai dengan yang diharapkan oleh server
        formDataToSend.append('profile_image', formData.image);
        
        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });
        
        closePopup();
        
        if (response.ok) {
          showSuccess(
            editingUser ? 'USER UPDATED!' : 'USER CREATED!',
            editingUser 
              ? `The user ${formData.username} has been successfully updated.` 
              : `The user ${formData.username} has been successfully created.`
          );
          setShowModal(false);
          fetchUsers();
        } else {
          const error = await response.json();
          showError('Error', error.message || 'Failed to save user');
        }
      } else {
        // Jika tidak ada file gambar, gunakan JSON seperti biasa
        const dataToSend = { ...formData };
        delete dataToSend.image; // Hapus properti image karena null
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dataToSend)
        });

        // Close loading dialog
        closePopup();

        if (response.ok) {
          showSuccess(
            editingUser ? 'USER UPDATED!' : 'USER CREATED!',
            editingUser 
              ? `The user ${formData.username} has been successfully updated.` 
              : `The user ${formData.username} has been successfully created.`
          );
          setShowModal(false);
          fetchUsers();
        } else {
          const error = await response.json();
          showError('Error', error.message || 'Failed to save user');
        }
      }
    } catch (error) {
      closePopup();
      showError('Error', error.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId, username) => {
    const result = await showConfirm(
      'DELETE USER?',
      `Are you sure you want to delete the user ${username}? This action cannot be undone.`,
      'YES, DELETE',
      'CANCEL'
    );
    
    if (result.isConfirmed) {
      showLoading('DELETING...', 'Please wait while we delete the user');
      
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        closePopup();

        if (response.ok) {
          showSuccess('USER DELETED!', 'The user has been successfully deleted.');
          fetchUsers();
        } else {
          const error = await response.json();
          showError('Error', error.message || 'Failed to delete user');
        }
      } catch (error) {
        closePopup();
        showError('Error', error.message || 'Failed to delete user');
      }
    }
  };

  const handleShowRoleModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setRoleFormData({
        name: role.name,
        description: role.description || ''
      });
    } else {
      setEditingRole(null);
      setRoleFormData({
        name: '',
        description: ''
      });
    }
    setShowRoleModal(true);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showLoading('SAVING...', 'Please wait while we process your request');
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingRole 
        ? `${API_URL}/api/admin/roles/${editingRole.id}`
        : `${API_URL}/api/admin/roles`;
      
      const method = editingRole ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roleFormData)
      });

      closePopup();

      if (response.ok) {
        showSuccess(
          editingRole ? 'ROLE UPDATED!' : 'ROLE CREATED!',
          editingRole 
            ? `The role ${roleFormData.name} has been successfully updated.` 
            : `The role ${roleFormData.name} has been successfully created.`
        );
        setShowRoleModal(false);
        fetchRoles();
      } else {
        const error = await response.json();
        showError('Error', error.message || 'Failed to save role');
      }
    } catch (error) {
      closePopup();
      showError('Error', error.message || 'Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    const result = await showConfirm(
      'DELETE ROLE?',
      `Are you sure you want to delete the role ${roleName}? This may affect users with this role.`,
      'YES, DELETE',
      'CANCEL'
    );
    
    if (result.isConfirmed) {
      showLoading('DELETING...', 'Please wait while we delete the role');
      
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/api/admin/roles/${roleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        closePopup();

        if (response.ok) {
          showSuccess('ROLE DELETED!', 'The role has been successfully deleted.');
          fetchRoles();
        } else {
          const error = await response.json();
          showError('Error', error.message || 'Failed to delete role');
        }
      } catch (error) {
        closePopup();
        showError('Error', error.message || 'Failed to delete role');
      }
    }
  };

  // Function to generate a template CSV file for user import
  const generateCSVTemplate = () => {
    const header = "username,email,full_name\n";
    const example = "johndoe,john.doe@example.com,John Doe";
    const csvContent = header + example;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'user_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to parse CSV content with better error handling
  const parseCSV = (csvText) => {
    try {
      const lines = csvText.split('\n');
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      if (!headers.includes('full_name')) {
        throw new Error('CSV file must have a full_name column');
      }
      
      const result = [];
      for(let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const currentLine = lines[i].split(',');
        if (currentLine.length !== headers.length) {
          console.warn(`Line ${i+1} has incorrect number of fields. Expected ${headers.length}, got ${currentLine.length}`);
          continue; // Skip malformed lines
        }
        
        const obj = {};
        for(let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentLine[j].trim();
        }
        
        // Validate required fields
        if (!obj.full_name) {
          console.warn(`Line ${i+1} is missing full_name, skipping`);
          continue;
        }
        
        result.push(obj);
      }
      
      console.log('Parsed CSV data:', result);
      return result;
    } catch (error) {
      console.error('Error parsing CSV:', error);
      throw error;
    }
  };

  // Function to handle the import process
  const handleImportUsers = async () => {
    if (!importFile || importPreview.length === 0) {
      showError('Error', 'Please select a valid CSV file');
      return;
    }

    showLoading('IMPORTING...', 'Please wait while we import your users');
    
    try {
      const memberRole = roles.find(role => role.name.toLowerCase() === 'member');
      if (!memberRole) {
        throw new Error('Member role not found. Please create a member role first.');
      }

      // Process the imported data
      const processedUsers = importPreview.map(user => {
        const firstName = user.full_name.split(' ')[0];
        return {
          username: user.username || firstName.toLowerCase(),
          email: user.email || `${firstName.toLowerCase()}@pergimmikan.org`,
          full_name: user.full_name,
          role_id: memberRole.id,
          password: `${firstName.toLowerCase()}2404`,
          status: 'active'
        };
      });
      
      console.log('Processed users for import:', processedUsers);
      
      // Send the data to the backend
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Not authenticated. Please log in again.');
      }
      
      // For testing, first try to create a single user to ensure the API works
      const testUser = processedUsers[0];
      const testResponse = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testUser)
      });
      
      if (!testResponse.ok) {
        const error = await testResponse.json();
        throw new Error(`API test failed: ${error.message || 'Could not create user'}`);
      }
      
      // Process all users one by one
      let successCount = 0;
      let errorCount = 0;
      
      for (const user of processedUsers) {
        try {
          const response = await fetch(`${API_URL}nts.headers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
          });
          
          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            console.error(`Failed to create user ${user.username}:`, await response.json());
          }
        } catch (err) {
          errorCount++;
          console.error(`Error creating user ${user.username}:`, err);
        }
      }

      closePopup();

      if (successCount > 0) {
        let message = `Successfully imported ${successCount} users.`;
        if (errorCount > 0) {
          message += ` Failed to import ${errorCount} users. Check console for details.`;
        }
        showSuccess('IMPORT COMPLETED', message);
        setImportFile(null);
        setImportPreview([]);
        fetchUsers();
        setShowImportModal(false);
      } else {
        throw new Error('Failed to import any users. Check the console for details.');
      }
    } catch (error) {
      closePopup();
      showError('Import Error', error.message);
    }
  };

  if (isLoading) {
    return <Loading text="Memuat pengguna dan peran..." overlay={true} />;
  }

  return (
    <Container fluid className="user-management-container py-4">
      <Card className="shadow-sm user-management-card">
        <Card.Header className="bg-white py-3 card-header-custom">
          <Row className="align-items-center">
            <Col xs={12} md={6} className="mb-3 mb-md-0">
              <h5 className="mb-0 fw-bold">
                <span className="header-icon-container">
                  <FaUserPlus className="me-2" />
                </span>
                Manajemen Pengguna & Peran
              </h5>
              <p className="text-muted small mb-0 d-none d-md-block">
                Kelola semua pengguna dan peran dalam satu tempat
              </p>
            </Col>
            <Col xs={12} md={6}>
              <div className="d-flex flex-wrap justify-content-md-end gap-2">
                <Button 
                  variant="warning" 
                  onClick={() => setShowImportModal(true)}
                  className="action-button d-flex align-items-center gap-2"
                >
                  <FaFileImport />
                  <span className="d-none d-sm-inline">Import Pengguna</span>
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => handleShowRoleModal()}
                  className="action-button d-flex align-items-center gap-2"
                >
                  <FaUserTag />
                  <span className="d-none d-sm-inline">Tambah Peran Baru</span>
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => handleShowModal()}
                  className="action-button d-flex align-items-center gap-2"
                >
                  <FaUserPlus />
                  <span className="d-none d-sm-inline">Tambah Pengguna Baru</span>
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0 p-md-3">
          <div className="filter-section p-3 bg-light rounded mb-4 shadow-sm">
            <Row className="g-3">
              <Col xs={12} md={7}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-primary-subtle">
                    <FaSearch className="text-primary" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Cari pengguna berdasarkan nama, email, atau peran..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input__user border-primary-subtle"
                  />
                </InputGroup>
              </Col>
              <Col xs={12} md={5}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-primary-subtle">
                    <FaFilter className="text-primary" />
                  </InputGroup.Text>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select border-primary-subtle"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </div>

          <Tabs defaultActiveKey="users" className="mb-3 mx-3 custom-tabs">
            <Tab eventKey="users" title="Pengguna">
              <div className="table-responsive shadow-sm rounded">
                <Table hover className="align-middle user-table mb-0">
                  <thead className="bg-light table-header">
                    <tr>
                      <th className="ps-3" style={{ width: '40px' }}>No</th>
                      <th>Username</th>
                      <th className="d-none d-md-table-cell">Fullname</th>
                      <th className="d-none d-lg-table-cell">Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-end pe-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user, index) => (
                        <tr key={user.id} className="user-row">
                          <td className="ps-3">{(currentPage - 1) * usersPerPage + index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="d-none d-sm-block user-avatar rounded-circle overflow-hidden me-2" style={{ width: '35px', height: '35px' }}>
                                {user.image_url ? (
                                  <img 
                                    src={`${API_URL}${user.image_url}`} 
                                    alt={user.username} 
                                    className="img-fluid" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      // Mencegah loop error dengan menghapus handler error
                                      e.target.onerror = null;
                                      // Ganti dengan ikon default sebagai fallback
                                      e.target.style.display = 'none';
                                      e.target.parentNode.innerHTML = '<div style="width:35px;height:35px;display:flex;align-items:center;justify-content:center;color:#6c757d"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="35" width="35" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg></div>';
                                    }}
                                  />
                                ) : (
                                  <FaUserCircle className="text-secondary" size={35} />
                                )}
                              </div>
                              <div>
                                <div className="fw-medium">{user.username}</div>
                                <div className="small text-muted d-md-none">{user.full_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="d-none d-md-table-cell">{user.full_name}</td>
                          <td className="d-none d-lg-table-cell">
                            <div className="description-cell">{user.email}</div>
                          </td>
                          <td>{roles.find(r => r.id === user.role_id)?.name || 'Unknown'}</td>
                          <td>
                            <Badge 
                              bg={user.status === 'active' ? 'success' : 'danger'} 
                              className="status-badge text-uppercase"
                            >
                              {user.status === 'active' ? 
                                <FaCheck className="me-1" size={10} /> : 
                                <FaTimes className="me-1" size={10} />
                              }
                              {user.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-end">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="action-btn edit-btn"
                                onClick={() => handleShowModal(user)}
                                title="Edit pengguna"
                              >
                                <FaEdit />
                                <span className="d-none d-md-inline ms-1">Edit</span>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(user.id, user.username)}
                                title="Hapus pengguna"
                              >
                                <FaTrash />
                                <span className="d-none d-md-inline ms-1">Hapus</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div className="empty-state">
                            <FaUserCircle size={40} className="text-muted mb-3" />
                            <h5>Tidak ada pengguna ditemukan</h5>
                            <p className="text-muted">Coba sesuaikan pencarian atau filter kriteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="small text-muted me-auto">
                  Menampilkan {paginatedUsers.length} dari {filteredUsers.length} pengguna
                </div>
                <Pagination className="mb-0">
                  <Pagination.Prev onClick={prevPage} disabled={currentPage === 1}>
                    <FaChevronLeft size={12} />
                  </Pagination.Prev>
                  
                  {/* Tampilkan maksimal 5 nomor halaman dengan ellipsis */}
                  {(() => {
                    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
                    let pages = [];
                    
                    if (totalPages <= 5) {
                      // Jika total halaman <= 5, tampilkan semua
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(
                          <Pagination.Item 
                            key={i} 
                            active={i === currentPage} 
                            onClick={() => paginate(i)}
                          >
                            {i}
                          </Pagination.Item>
                        );
                      }
                    } else {
                      // Jika halaman aktif <= 3, tampilkan 1-5 + ellipsis
                      if (currentPage <= 3) {
                        for (let i = 1; i <= 5; i++) {
                          pages.push(
                            <Pagination.Item 
                              key={i} 
                              active={i === currentPage} 
                              onClick={() => paginate(i)}
                            >
                              {i}
                            </Pagination.Item>
                          );
                        }
                        pages.push(<Pagination.Ellipsis key="ellipsis1" />);
                        pages.push(
                          <Pagination.Item 
                            key={totalPages} 
                            onClick={() => paginate(totalPages)}
                          >
                            {totalPages}
                          </Pagination.Item>
                        );
                      } 
                      // Jika halaman aktif >= totalPages-2, tampilkan 1 + ellipsis + (totalPages-4)-totalPages
                      else if (currentPage >= totalPages - 2) {
                        pages.push(
                          <Pagination.Item 
                            key={1} 
                            onClick={() => paginate(1)}
                          >
                            {1}
                          </Pagination.Item>
                        );
                        pages.push(<Pagination.Ellipsis key="ellipsis2" />);
                        
                        for (let i = totalPages - 4; i <= totalPages; i++) {
                          pages.push(
                            <Pagination.Item 
                              key={i} 
                              active={i === currentPage} 
                              onClick={() => paginate(i)}
                            >
                              {i}
                            </Pagination.Item>
                          );
                        }
                      } 
                      // Jika di tengah, tampilkan 1 + ellipsis + (currentPage-1)-(currentPage+1) + ellipsis + totalPages
                      else {
                        pages.push(
                          <Pagination.Item 
                            key={1} 
                            onClick={() => paginate(1)}
                          >
                            {1}
                          </Pagination.Item>
                        );
                        pages.push(<Pagination.Ellipsis key="ellipsis3" />);
                        
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                          pages.push(
                            <Pagination.Item 
                              key={i} 
                              active={i === currentPage} 
                              onClick={() => paginate(i)}
                            >
                              {i}
                            </Pagination.Item>
                          );
                        }
                        
                        pages.push(<Pagination.Ellipsis key="ellipsis4" />);
                        pages.push(
                          <Pagination.Item 
                            key={totalPages} 
                            onClick={() => paginate(totalPages)}
                          >
                            {totalPages}
                          </Pagination.Item>
                        );
                      }
                    }
                    
                    return pages;
                  })()} 
                  
                  <Pagination.Next onClick={nextPage} disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}>
                    <FaChevronRight size={12} />
                  </Pagination.Next>
                </Pagination>
              </div>
            </Tab>
            
            <Tab eventKey="roles" title="Peran">
              <div className="table-responsive shadow-sm rounded">
                <Table hover className="align-middle user-table mb-0">
                  <thead className="bg-light table-header">
                    <tr>
                      <th>Role Name</th>
                      <th>Description</th>
                      <th className="text-end pe-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.length > 0 ? (
                      roles.map(role => (
                        <tr key={role.id} className="user-row">
                          <td>{role.name}</td>
                          <td>
                            <div className="description-cell">{role.description || '-'}</div>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-end">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="action-btn edit-btn"
                                onClick={() => handleShowRoleModal(role)}
                                title="Edit peran"
                              >
                                <FaEdit />
                                <span className="d-none d-md-inline ms-1">Edit</span>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                className="action-btn delete-btn"
                                onClick={() => handleDeleteRole(role.id, role.name)}
                                title="Hapus peran"
                              >
                                <FaTrash />
                                <span className="d-none d-md-inline ms-1">Hapus</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-5">
                          <div className="empty-state">
                            <FaUserTag size={40} className="text-muted mb-3" />
                            <h5>Tidak ada peran ditemukan</h5>
                            <p className="text-muted">Buat peran baru untuk memulai</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* User Modal */}
      <Modal
        show={showModal}
        onHide={() => !isSubmitting && setShowModal(false)}
        backdrop="static"
        keyboard={!isSubmitting}
        centered
        className="retro-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role_id}
                onChange={(e) => setFormData({...formData, role_id: e.target.value})}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                  disabled={isSubmitting}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                disabled={isSubmitting}
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Photo</Form.Label>
              <div className="d-flex flex-column gap-2">
                {imagePreview && (
                  <div className="image-preview mb-2" style={{ maxWidth: '150px' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="img-fluid rounded" 
                      style={{ width: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        // Mencegah loop error dengan menghapus handler error
                        e.target.onerror = null;
                        // Ganti dengan ikon default sebagai fallback
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = '<div style="width:35px;height:35px;display:flex;align-items:center;justify-content:center;color:#6c757d"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="35" width="35" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg></div>';
                      }}
                    />
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({...formData, image: file});
                      // Create preview URL
                      const previewUrl = URL.createObjectURL(file);
                      setImagePreview(previewUrl);
                    }
                  }}
                  disabled={isSubmitting}
                />
                <small className="text-muted d-block mt-1">
                  Unggah foto profil (opsional)
                </small>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                className="me-2" 
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {editingUser ? 'Perbarui' : 'Buat'} Pengguna
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Role Modal */}
      <Modal 
        show={showRoleModal} 
        onHide={() => !isSubmitting && setShowRoleModal(false)}
        backdrop="static"
        keyboard={!isSubmitting}
        centered
        className="retro-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRole ? 'Edit Peran' : 'Tambah Peran Baru'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRoleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Peran</Form.Label>
              <Form.Control
                type="text"
                value={roleFormData.name}
                onChange={(e) => setRoleFormData({...roleFormData, name: e.target.value})}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={roleFormData.description}
                onChange={(e) => setRoleFormData({...roleFormData, description: e.target.value})}
                disabled={isSubmitting}
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                className="me-2" 
                onClick={() => setShowRoleModal(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {editingRole ? 'Perbarui' : 'Buat'} Peran
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Import Modal */}
      <Modal 
        show={showImportModal} 
        onHide={() => setShowImportModal(false)}
        backdrop="static"
        keyboard={true}
        centered
        className="retro-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Impor Pengguna
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>File Impor</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImportFile(file);
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const csvContent = event.target.result;
                          console.log('CSV content:', csvContent);
                          const data = parseCSV(csvContent);
                          console.log('Parsed data:', data);
                          setImportPreview(data);
                        } catch (error) {
                          console.error('CSV parse error:', error);
                          showError('File Error', 'Could not parse CSV file. Please check the format.');
                          setImportFile(null);
                          setImportPreview([]);
                          fileInputRef.current.value = null;
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={generateCSVTemplate}
                  title="Unduh template"
                >
                  <FaDownload /> Template
                </Button>
              </div>
              <small className="text-muted d-block mt-1">
                Unggah file CSV dengan kolom: username, email, dan full_name
              </small>
            </Form.Group>

            {importPreview.length > 0 && (
              <div className="table-responsive">
                <Table hover className="align-middle user-table">
                  <thead className="bg-light table-header">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Fullname</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.map((user, index) => (
                      <tr key={index}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.full_name}</td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="small text-muted me-auto">
            <strong>Catatan:</strong> Kata sandi akan diatur menjadi nama depan + 2404
          </div>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowImportModal(false);
              setImportFile(null);
              setImportPreview([]);
              if (fileInputRef.current) fileInputRef.current.value = null;
            }}
          >
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleImportUsers}
            disabled={!importFile || importPreview.length === 0}
          >
            Impor Pengguna
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
