import { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Table, 
  Badge, 
  Button, 
  InputGroup,
  Row,
  Col,
  Form 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa';
import './styles/UserManagement.css'; 

const API_URL = import.meta.env.VITE_API_URL;

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/api/admin/team`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch team members');
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.description && user.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, filterStatus, users]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/api/admin/team/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to delete team member');
        }

        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting team member:', error);
        alert('Failed to delete team member. Please try again.');
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    return status === 'active' ? 'success' : 'danger';
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/')) {
      return `${API_URL}${imageUrl}`;
    }
    
    return `${API_URL}/${imageUrl}`;
  };

  if (loading) {
    return (
      <Container fluid className="user-management-container py-4">
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading team members...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="user-management-container py-4">
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="alert alert-danger">
              <h5>Error</h5>
              <p>{error}</p>
            </div>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
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
                Team Management
              </h5>
              <p className="text-muted small mb-0 d-none d-md-block">
              Kelola semua anggota tim di satu tempat
              </p>
            </Col>
            <Col xs={12} md={6}>
              <div className="d-flex justify-content-md-end">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/dashboard/team/add')}
                  className="action-button d-flex align-items-center gap-2"
                >
                  <FaUserPlus />
                  <span>Tambah Anggota Baru</span>
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0 p-md-3">
          <div className="filter-section p-3 bg-light rounded mb-4">
            <Row className="g-3">
              <Col xs={12} md={7}>
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Cari anggota tim berdasarkan nama, peran atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input__user"
                  />
                </InputGroup>
              </Col>
              <Col xs={12} md={5}>
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <FaFilter />
                  </InputGroup.Text>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </div>

          <div className="table-responsive">
            <Table hover className="align-middle user-table">
              <thead className="bg-light table-header">
                <tr>
                  <th>Name</th>
                  <th className="d-none d-md-table-cell">Role</th>
                  <th className="d-none d-lg-table-cell">Description</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="user-row">
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="user-avatar rounded-circle overflow-hidden me-2" 
                          style={{ width: '45px', height: '45px', flexShrink: 0 }}
                        >
                          {user.image_url ? (
                            <img 
                              src={getImageUrl(user.image_url)} 
                              alt={user.name} 
                              className="w-100 h-100 object-fit-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder-user.png';
                                if (!e.target.complete) {
                                  e.target.style.display = 'none';
                                  e.target.parentNode.innerHTML = '<div class="d-flex justify-content-center align-items-center bg-light w-100 h-100"><FaUserCircle class="text-secondary" size={30} /></div>';
                                }
                              }}
                            />
                          ) : (
                            <div className="d-flex justify-content-center align-items-center bg-light w-100 h-100">
                              <FaUserCircle className="text-secondary" size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="fw-medium">{user.name}</div>
                          <div className="small text-muted d-md-none">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">{user.role}</td>
                    <td className="d-none d-lg-table-cell">
                      <div className="description-cell">{user.description || '-'}</div>
                    </td>
                    <td>
                      <Badge 
                        bg={getStatusBadgeVariant(user.status)} 
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
                          onClick={() => navigate(`/dashboard/team/edit/${user.id}`)}
                          title="Edit team member"
                        >
                          <FaEdit />
                          <span className="d-none d-md-inline ms-1">Edit</span>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(user.id)}
                          title="Delete team member"
                        >
                          <FaTrash />
                          <span className="d-none d-md-inline ms-1">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="empty-state">
                        <FaUserCircle size={40} className="text-muted mb-3" />
                        <h5>Tidak ada anggota tim yang ditemukan</h5>
                        <p className="text-muted">Coba perbarui pencarian atau kriteria filter Anda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          
          <div className="d-flex justify-content-between align-items-center p-3">
            <div className="small text-muted">
              Showing {filteredUsers.length} of {users.length} team members
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
