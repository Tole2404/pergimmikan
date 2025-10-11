import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import './styles/Dashboard.css';

import { 
  FaUsers, 
  FaUserCheck, 
  FaUserTimes, 
  FaRoute, 
  FaImages, 
  FaQuoteRight,
  FaPiggyBank,
  FaCalendarAlt
} from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL;

// Helper Component: StatCard
const StatCard = ({ title, value, icon: IconComponent, color, className }) => (
  <Card className={`shadow-sm h-100 ${className || ''}`}>
    <Card.Body className="d-flex align-items-center p-3">
      <div className={`rounded-circle p-3 bg-${color} bg-opacity-10 me-3`}>
        <IconComponent className={`text-${color}`} size={24} />
      </div>
      <div>
        <h6 className="text-muted mb-0">{title}</h6>
        <h3 className="fw-bold mb-0">{value}</h3>
      </div>
    </Card.Body>
  </Card>
);

// Helper Component: UserStatusChartDisplay
const UserStatusChartDisplay = ({ stats, chartData, chartOptions }) => (
  <Card className="shadow-sm h-100">
    <Card.Header className="bg-white py-3 border-bottom-0">
      <h5 className="mb-0 fw-bold">Status Pengguna</h5>
    </Card.Header>
    <Card.Body className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div style={{ width: '250px', height: '250px', position: 'relative' }}>
        <Doughnut data={chartData} options={chartOptions} />
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <h3 className="mb-0 fw-bold">{stats.totalUsers}</h3>
          <p className="text-muted small mb-0">Total</p>
        </div>
      </div>
    </Card.Body>
  </Card>
);

// Helper Component: ContentStatsDisplay
const ContentStatsDisplay = ({ stats }) => (
  <Card className="shadow-sm h-100">
    <Card.Header className="bg-white py-3 border-bottom-0">
      <h5 className="mb-0 fw-bold">Highlight Konten</h5>
    </Card.Header>
    <Card.Body className="d-flex flex-column justify-content-around align-items-center text-center p-3" style={{ minHeight: '260px' }}>
      <div>
        <FaImages className="text-warning mb-2" size={40} />
        <h3 className="fw-bold mb-1">{stats.totalGalleries !== undefined ? stats.totalGalleries : '-'}</h3>
        <p className="text-muted mb-0 small">Total Galeri</p>
      </div>
      <hr className="my-3 w-75" />
      <div>
        <FaPiggyBank className="text-success mb-2" size={40} />
        <h3 className="fw-bold mb-1">
          {stats.totalSavings !== undefined 
            ? `Rp${Number(stats.totalSavings).toLocaleString('id-ID')}` 
            : '-'}
        </h3>
        <p className="text-muted mb-0 small">Total Tabungan</p>
      </div>
    </Card.Body>
  </Card>
);

// Helper Component: RecentActivityDisplay
const RecentActivityDisplay = () => (
  <Card className="shadow-sm">
    <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-bottom-0">
      <h5 className="mb-0 fw-bold">Aktivitas Terbaru</h5>
      <FaCalendarAlt className="text-muted" />
    </Card.Header>
    <Card.Body className="p-0">
      <div className="p-4 text-center">
        <p className="text-muted mb-0">Data aktivitas terbaru akan ditampilkan di sini.</p>
        {/* Placeholder for actual activity list */}
      </div>
    </Card.Body>
  </Card>
);

// Main Dashboard Component
export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalJourneys: 0,
    totalGalleries: 0,
    // totalQuotes: 0, // Removed
    totalSavings: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      }
      
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Sesi Anda telah berakhir atau tidak memiliki hak akses. Silakan login kembali.');
        }
        throw new Error(`Gagal mengambil data pengguna: ${response.status}`);
      }
      
      const data = await response.json();
      const users = Array.isArray(data) ? data : (data.users || []);
      
      const activeUsers = users.filter(user => user.status === 'active').length;
      const inactiveUsers = users.filter(user => user.status === 'inactive').length;
      
      // TODO: Replace with actual data fetching for other stats
      setStats({
        totalUsers: users.length,
        activeUsers,
        inactiveUsers,
        totalJourneys: 12, // Placeholder
        totalGalleries: 48, // Placeholder
        // totalQuotes: 24, // Removed
        totalSavings: 3600000 // Placeholder, formatted as number
      });
    } catch (error) {
      console.error('Error mengambil data dashboard:', error);
      setError(error.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const chartData = {
    labels: ['Pengguna Aktif', 'Pengguna Tidak Aktif'],
    datasets: [
      {
        data: [stats.activeUsers, stats.inactiveUsers],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#45a049', '#e53935'],
        borderWidth: 0,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 15, font: { size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };
  
  if (isLoading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 fs-5">Memuat data dashboard...</p>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
        <Alert variant="danger" className="w-75 text-center shadow-sm">
          <Alert.Heading>Terjadi Kesalahan</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-center">
            <button className="btn btn-danger" onClick={fetchDashboardData}>
              Coba Lagi
            </button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container fluid className="p-lg-4 p-3 bg-light">
      <Row className="mb-4">
        <Col>
          <h2 className="__text-dashboard fw-bold mb-1">Dashboard</h2>
          <p className="text-muted">Ringkasan statistik platform PERGIMMIKAN</p>
        </Col>
      </Row>
      
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <StatCard title="Total Pengguna" value={stats.totalUsers} icon={FaUsers} color="primary" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Pengguna Aktif" value={stats.activeUsers} icon={FaUserCheck} color="success" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Pengguna Tidak Aktif" value={stats.inactiveUsers} icon={FaUserTimes} color="danger" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Total Perjalanan" value={stats.totalJourneys} icon={FaRoute} color="info" />
        </Col>
      </Row>
      
      <Row className="g-4 mb-4">
        <Col lg={4} md={12} className="mb-4 mb-lg-0">
          <UserStatusChartDisplay stats={stats} chartData={chartData} chartOptions={chartOptions} />
        </Col>
        <Col lg={8} md={12}>
          <ContentStatsDisplay stats={stats} />
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col>
          <RecentActivityDisplay />
        </Col>
      </Row>
    </Container>
  );
}