import { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaCalendarAlt, FaImage, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './styles/ManagementComponents.css';
import Loading from '../../components/common/Loading';
import { showSuccess, showError, showConfirm, showLoading, closePopup } from '../../utils/sweetalert';

const API_URL = import.meta.env.VITE_API_URL;

export default function JourneyManagement() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetching journeys from:', `${API_URL}/api/admin/journeys`);
      
      const response = await fetch(`${API_URL}/api/admin/journeys`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch journeys');
      }
      
      const data = await response.json();
      console.log('Received journeys data:', data);
      setJourneys(data);
    } catch (error) {
      console.error('Error fetching journeys:', error);
      setError(error.message || 'Failed to load journeys');
      showError('Error', 'Failed to load journeys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Dapatkan informasi journey yang akan dihapus untuk menampilkan pesan yang lebih informatif
    const journeyToDelete = journeys.find(journey => journey.id === id);
    const photoCount = journeyToDelete?.photos?.length || 0;
    
    let confirmMessage = 'Are you sure you want to delete this journey? This action cannot be undone.';
    if (photoCount > 0) {
      confirmMessage += `\n\nThis journey contains ${photoCount} photos that will also be deleted.`;
      if (photoCount > 10) {
        confirmMessage += '\n\nNote: Due to the large number of photos, this process may take some time to complete.';
      }
    }
    
    const result = await showConfirm(
      'Delete Journey?', 
      confirmMessage,
      'YES, DELETE',
      'CANCEL'
    );

    if (!result.isConfirmed) return;

    showLoading('DELETING...', 'Please wait while we process your request');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/journeys/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Untuk respons non-ok, coba parse error message jika ada
        const errorText = await response.text();
        let errorMessage = 'Failed to delete journey';
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          // Jika tidak bisa parse JSON, gunakan text mentah jika ada
          if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
      
      closePopup();
      // Hapus journey dari state lokal
      setJourneys(journeys.filter(journey => journey.id !== id));
      
      // Tampilkan pesan sukses yang sesuai dengan jumlah foto
      if (photoCount > 10) {
        showSuccess(
          'SUCCESS!', 
          'The journey has been deleted successfully. The system may take a few moments to complete processing all photos.'
        );
      } else {
        showSuccess('SUCCESS!', 'The journey has been deleted successfully');
      }
    } catch (error) {
      closePopup();
      console.error('Error deleting journey:', error);
      showError('Error', 'Failed to delete journey. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container fluid className="journey-container_management">
        <Loading size="medium" overlay={false} text="Loading journeys..." />
      </Container>
    );
  }

  return (
    <Container fluid className="journey-container_management">
      <Card className="journey-card_management">
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
              <h5 className="mb-0">Journey Management</h5>
              <p className="text-muted small mb-0 d-none d-md-block">
            Kelola semua journey di satu tempat
          </p>
          </Col>
              <div className="d-flex gap-2">
                {error && (
                  <Button 
                    variant="outline-primary" 
                    className="me-2 journey-refresh-button_management" 
                    onClick={fetchJourneys}
                  >
                    <FaSync /> Retry
                  </Button>
                )}
                <Link to="/dashboard/journey/add">
                  <Button variant="primary" className="journey-add-button_management">
                    <FaPlus /> Tambah Journey Baru
                  </Button>
                </Link>
              </div>
        </Card.Header>
        <Card.Body className="journey-card-body_management">
          {error && (
            <div className="journey-error-alert_management">
              <strong>Error loading journeys:</strong> {error}
              <Button variant="link" onClick={fetchJourneys} className="p-0 ms-2">
                Try Again
              </Button>
            </div>
          )}
          
          {!error && journeys.length === 0 ? (
            <div className="journey-empty_management">
              <div className="journey-empty-icon_management">📚</div>
              <h4>Tidak Ada Journey</h4>
              <p>Mulai dengan menambahkan record journey pertama Anda</p>
              <Link to="/dashboard/journey/add">
                <Button variant="outline-primary">
                  <FaPlus /> Tambah Journey Baru
                </Button>
              </Link>
            </div>
          ) : (
            <div className="journey-table-container_management">
              <Table responsive hover className="journey-table_management">
                <thead className="journey-table-header_management">
                  <tr>
                    <th>Year</th>
                    <th>Title</th>
                    <th className="d-none d-md-table-cell">Description</th>
                    <th>Photos</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {journeys.map((journey) => (
                    <tr key={journey.id} className="journey-table-row_management">
                      <td>
                        <div className="journey-year_management">
                          <FaCalendarAlt className="journey-icon_management" />
                          <span>{journey.year}</span>
                        </div>
                      </td>
                      <td>
                        <div className="journey-title-cell_management">
                          <span className="journey-row-title_management">{journey.title}</span>
                        </div>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <div className="journey-description_management">
                          {journey.description ? (
                            journey.description.length > 80 
                              ? `${journey.description.substring(0, 80)}...` 
                              : journey.description
                          ) : 'No description'}
                        </div>
                      </td>
                      <td>
                        <Badge bg={journey.photos?.length ? "success" : "secondary"} className="journey-photos-badge_management">
                          <FaImage className="me-1" />
                          {journey.photos?.length || 0}
                        </Badge>
                      </td>
                      <td>
                        <div className="journey-actions_management">
                          <Link to={`/dashboard/journey/edit/${journey.id}`}>
                            <Button variant="warning" size="sm" className="journey-edit-btn_management">
                              <FaEdit />
                            </Button>
                          </Link>
                          <Button 
                            variant="danger" 
                            size="sm"
                            className="journey-delete-btn_management"
                            onClick={() => handleDelete(journey.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
