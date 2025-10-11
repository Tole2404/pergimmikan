import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, Tabs, Tab, Dropdown } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaSearch, FaEye, FaFileDownload, FaFilter, FaSort, FaTimes, FaFilePdf, FaUser, FaUsers, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { formatCurrency } from '../../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import Loading from '../../../components/common/Loading';
import { showSuccess, showError, showWarning, showConfirm, showLoading } from '../../../utils/sweetalert';
import '../styles/SavingsManagement.css';

const API_URL = import.meta.env.VITE_API_URL;

const SavingsManagement = () => {
  const navigate = useNavigate();
  
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [savingsData, setSavingsData] = useState([]);
  const [pendingSavings, setPendingSavings] = useState([]);
  const [savingsSummary, setSavingsSummary] = useState({
    totalApproved: 0,
    totalPending: 0,
    totalRejected: 0,
    memberCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modal states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [verificationAction, setVerificationAction] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');

  // Fetch data
  useEffect(() => {
    // Check for admin token first
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      showWarning('Authentication Required', 'Admin authentication required. Please log in again.');
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
      return;
    }
    
    fetchSavingsData();
    fetchSavingsSummary();
  }, [navigate]);

  const fetchSavingsData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/api/admin/tabungan`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch savings data');
      }

      const data = await response.json();
      setSavingsData(data);
      
      // Filter pending savings for quick access
      const pending = data.filter(item => item.status === 'pending');
      setPendingSavings(pending);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching savings data:', error);
      showError('Error', error.message || 'Failed to load savings data. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchSavingsSummary = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/api/admin/tabungan/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch savings summary');
      }

      const data = await response.json();
      console.log('Summary data from API:', data); // Tambahkan logging untuk debugging
      
      // Jika data tidak memiliki properti yang diharapkan, coba format ulang
      // Format data bisa berbeda-beda tergantung implementasi backend
      const formattedData = {
        totalApproved: data.totalApproved || data.total_approved || 0,
        totalPending: data.totalPending || data.total_pending || 0,
        totalRejected: data.totalRejected || data.total_rejected || 0,
        memberCount: data.memberCount || data.member_count || data.users || 0
      };
      
      console.log('Formatted summary data:', formattedData);
      setSavingsSummary(formattedData);
    } catch (error) {
      console.error('Error fetching savings summary:', error);
      // Show error message for summary failures to help debugging
      showWarning('Warning', `Gagal memuat data ringkasan: ${error.message}`);
    }
  };

  // Handle verification
  const openVerificationModal = (saving, action) => {
    setSelectedSaving(saving);
    setVerificationAction(action);
    setAdminNotes('');
    setReceiptFile(null);
    setReceiptPreview('');
    setShowVerificationModal(true);
  };
  
  // Handle deletion
  const openDeleteModal = (saving) => {
    setSelectedSaving(saving);
    setShowDeleteModal(true);
  };

  const handleVerification = async () => {
    // Tutup modal verifikasi terlebih dahulu
    setShowVerificationModal(false);
    
    // Tampilkan konfirmasi sebelum melanjutkan
    const confirmResult = await showConfirm(
      `${verificationAction === 'approved' ? 'Setujui' : 'Tolak'} Tabungan?`,
      `Anda yakin ingin ${verificationAction === 'approved' ? 'menyetujui' : 'menolak'} tabungan dari ${selectedSaving.user_name}?`,
      verificationAction === 'approved' ? 'YA, SETUJUI!' : 'YA, TOLAK!',
      'BATALKAN'
    );
    
    // Jika user membatalkan, keluar dari fungsi
    if (!confirmResult.isConfirmed) {
      return;
    }
    
    // Show loading indicator
    const loadingAlert = showLoading('Processing', 'Verifying transaction...');
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Jika ini adalah penarikan dan disetujui, dan ada bukti pembayaran
      const isPenarikan = selectedSaving.jenis_transaksi === 'penarikan' || parseFloat(selectedSaving.amount) < 0;
      
      // Gunakan FormData jika ada file bukti pembayaran
      let requestBody;
      let headers = {
        'Authorization': `Bearer ${token}`
      };
      
      if (isPenarikan && verificationAction === 'approved' && receiptFile) {
        // Gunakan FormData untuk mengirim file
        const formData = new FormData();
        formData.append('status', verificationAction);
        formData.append('adminNotes', adminNotes);
        formData.append('receiptFile', receiptFile);
        
        requestBody = formData;
        // Jangan set Content-Type, biarkan browser mengaturnya dengan boundary yang benar
      } else {
        // Gunakan JSON untuk request biasa
        requestBody = JSON.stringify({
          status: verificationAction,
          adminNotes: adminNotes
        });
        
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(`${API_URL}/api/admin/tabungan/${selectedSaving.id}/verify`, {
        method: 'PUT',
        headers: headers,
        body: requestBody
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      // Close loading indicator
      loadingAlert.close();
      
      showSuccess(
        'Success', 
        `Savings has been ${verificationAction === 'approved' ? 'approved' : 'rejected'} successfully.`
      );
      
      // Refresh data
      fetchSavingsData();
      fetchSavingsSummary();
      
    } catch (error) {
      // Close loading indicator
      loadingAlert.close();
      
      console.error('Error during verification:', error);
      showError('Error', 'Failed to process verification. Please try again.');
    }
  };
  
  // Handle file change for receipt upload
  const handleReceiptFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (maksimal 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File Terlalu Besar', 'Maksimum ukuran file 5MB');
        setReceiptFile(null);
        setReceiptPreview('');
        return;
      }

      // Validasi tipe file (hanya gambar)
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        showError('Format File Salah', 'Gunakan JPG, JPEG, atau PNG');
        setReceiptFile(null);
        setReceiptPreview('');
        return;
      }

      setReceiptFile(file);
      
      // Buat preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // View details
  const openDetailModal = (saving) => {
    setSelectedSaving(saving);
    setShowDetailModal(true);
  };

  // Filtering and sorting
  const getFilteredData = () => {
    let filtered = [...savingsData];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.transaction_date) - new Date(b.transaction_date);
        case 'date_desc':
          return new Date(b.transaction_date) - new Date(a.transaction_date);
        case 'amount_asc':
          return a.amount - b.amount;
        case 'amount_desc':
          return b.amount - a.amount;
        default:
          return new Date(b.transaction_date) - new Date(a.transaction_date);
      }
    });
    
    return filtered;
  };

  // Pagination
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? 'primary' : 'outline-secondary'}
          onClick={() => setCurrentPage(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  // Status badge renderer
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Render jenis transaksi badge
  const renderJenisTransaksiBadge = (jenis, amount) => {
    // Jika amount negatif, otomatis dianggap penarikan
    const isPenarikan = jenis === 'penarikan' || parseFloat(amount) < 0;
    
    if (isPenarikan) {
      return <Badge bg="danger"><FaArrowUp className="me-1" /> Penarikan</Badge>;
    } else {
      return <Badge bg="success"><FaArrowDown className="me-1" /> Setoran</Badge>;
    }
  };

  // Format summary values with fallbacks for NaN
  const formatSummaryValue = (value, isCurrency = true) => {
    if (value === undefined || value === null || isNaN(value)) {
      return isCurrency ? formatCurrency(0) : '0';
    }
    return isCurrency ? formatCurrency(value) : value.toString();
  };

  // Format date with fallback for invalid dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date) ? date.toLocaleDateString() : 'Invalid Date';
  };

  // Export to CSV
  const exportToCSV = async () => {
    // Tampilkan konfirmasi terlebih dahulu
    const confirmResult = await showConfirm(
      'Export CSV',
      'Anda akan mengekspor data tabungan ke format CSV. Lanjutkan?',
      'YA, EXPORT!',
      'BATALKAN'
    );
    
    // Jika user membatalkan, keluar dari fungsi
    if (!confirmResult.isConfirmed) {
      return;
    }
    
    // Tampilkan loading selama pemrosesan
    const loadingAlert = showLoading('Generating CSV', 'Please wait while we generate your CSV report...');
    
    try {
      const headers = ['ID', 'User', 'Amount', 'Description', 'Status', 'Date', 'Admin Notes'];
      const csvData = filteredData.map(item => [
        item.id,
        item.user_name,
        item.amount,
        item.description,
        item.status,
        formatDate(item.transaction_date),
        item.admin_notes || ''
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `savings_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Tutup loading setelah proses selesai
      loadingAlert.close();
      
      showSuccess('Success', 'CSV berhasil diunduh');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      showError('Error', `Gagal mengekspor CSV: ${error.message}`);
    }
  };

  // Export to PDF (per user) - 100% Client Side seperti CSV
  const exportToPDF = async (userId, userName) => {
    try {
      // Tampilkan konfirmasi terlebih dahulu
      const confirmResult = await showConfirm(
        'Export PDF',
        `Anda akan mengekspor data tabungan ${userId === 'all' ? 'semua pengguna' : `untuk ${userName}`}. Lanjutkan?`,
        'YA, EXPORT!',
        'BATALKAN'
      );
      
      // Jika user membatalkan, keluar dari fungsi
      if (!confirmResult.isConfirmed) {
        return;
      }
      
      // Show loading indicator
      const loadingAlert = showLoading('Generating PDF', 'Please wait while we generate your PDF report...');
      
      setIsLoading(true);
      
      // Jika userId adalah 'all', maka ekspor untuk semua pengguna
      const isAllUsers = userId === 'all';
      
      // Filter data for the specific user jika bukan 'all'
      const userSavings = isAllUsers ? savingsData : savingsData.filter(item => item.user_id === userId);
      
      if (userSavings.length === 0) {
        throw new Error('Tidak ada data tabungan untuk diekspor');
      }
      
      // MEMBUAT PDF DI CLIENT, SAMA SEPERTI CSV - TANPA API
      const doc = new jsPDF();
      
      // Header dokumen
      doc.setFontSize(18);
      doc.text('Laporan Tabungan', 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(isAllUsers ? 'Semua Pengguna' : `Pengguna: ${userName}`, 105, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 195, 35, { align: 'right' });
      
      // Hitung total jumlah
      let totalAmount = 0;
      let verifiedAmount = 0;
      let pendingAmount = 0;
      
      // Menyiapkan data untuk tabel
      const tableData = userSavings.map(saving => {
        const amount = parseFloat(saving.amount || 0);
        const status = saving.status || 'pending';
        
        // Update total
        totalAmount += amount;
        if (status === 'verified' || status === 'approved') {
          verifiedAmount += amount;
        } else {
          pendingAmount += amount;
        }
        
        // Format date safely
        const createdAt = new Date(saving.createdAt || saving.created_at);
        const dateFormatted = !isNaN(createdAt) 
          ? createdAt.toLocaleDateString('id-ID') 
          : 'Invalid Date';
        
        // Return row data
        return [
          dateFormatted,
          saving.user_name || (saving.user ? saving.user.name : `User ${saving.user_id}`),
          `Rp ${amount.toLocaleString('id-ID')}`,
          status,
          saving.payment_method || 'Unknown'
        ];
      });
      
      // Cara yang benar menggunakan autoTable
      autoTable(doc, {
        head: [['Tanggal', 'Pengguna', 'Jumlah', 'Status', 'Metode']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: { 
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
      
      // Tambahkan ringkasan di bawah tabel
      let finalY = 40; // Default Y position jika tidak ada tabel
      
      // Cek apakah tabel berhasil dibuat dan punya posisi Y
      if (doc.lastAutoTable && typeof doc.lastAutoTable.finalY !== 'undefined') {
        finalY = doc.lastAutoTable.finalY + 10;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('Ringkasan:', 14, finalY);
      
      doc.setFont('helvetica', 'normal');
      
      doc.text(`Total Tabungan: Rp ${totalAmount.toLocaleString('id-ID')}`, 14, finalY + 8);
      doc.text(`Tabungan Terverifikasi: Rp ${verifiedAmount.toLocaleString('id-ID')}`, 14, finalY + 16);
      doc.text(`Tabungan Pending: Rp ${pendingAmount.toLocaleString('id-ID')}`, 14, finalY + 24);
      
      // Nama file PDF
      const filename = isAllUsers 
        ? `semua_pengguna_tabungan_${new Date().toISOString().slice(0,10)}.pdf` 
        : `${userName.replace(/\s+/g, '_')}_tabungan_${new Date().toISOString().slice(0,10)}.pdf`;
      
      // Simpan PDF
      doc.save(filename);
      
      // Close loading indicator
      loadingAlert.close();
      
      showSuccess('Success', `PDF untuk ${isAllUsers ? 'semua pengguna' : userName} telah diunduh`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showError('Error', `Gagal mengekspor PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Group savings by user
  const getUsersWithSavings = () => {
    const users = {};
    
    savingsData.forEach(item => {
      if (!users[item.user_id]) {
        users[item.user_id] = {
          id: item.user_id,
          name: item.user_name,
          savings: []
        };
      }
      
      users[item.user_id].savings.push(item);
    });
    
    return Object.values(users);
  };

  // Filter controls section
  const renderFilterControls = () => (
    <div className="p-3 bg-light rounded mb-3 shadow-sm filter-controls">
      <Row className="g-3">
        <Col xs={12} md={4}>
          <Form.Group className="mb-0">
            <div className="input-group">
              <Form.Control
                type="text"
                placeholder="Cari berdasarkan nama atau deskripsi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search"
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </Button>
              )}
              <Button variant="primary">
                <FaSearch />
              </Button>
            </div>
          </Form.Group>
        </Col>
        <Col xs={6} md={2}>
          <Form.Group className="mb-0">
            <div className="input-group">
              <div className="input-group-text"><FaFilter /></div>
              <Form.Select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </Form.Select>
            </div>
          </Form.Group>
        </Col>
        <Col xs={6} md={2}>
          <Form.Group className="mb-0">
            <div className="input-group">
              <div className="input-group-text"><FaSort /></div>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort by"
              >
                <option value="date_desc">Terbaru</option>
                <option value="date_asc">Terlama</option>
                <option value="amount_desc">Nominal Tertinggi</option>
                <option value="amount_asc">Nominal Terendah</option>
              </Form.Select>
            </div>
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <div className="d-flex gap-2">
            <Button 
              variant="success" 
              onClick={exportToCSV}
              className="flex-grow-1"
            >
              <FaFileDownload className="me-2" /> Export CSV
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-pdf">
                <FaFilePdf className="me-2" /> PDF
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end">
                <Dropdown.Header>Export PDF</Dropdown.Header>
                
                {/* Export untuk semua pengguna */}
                <Dropdown.Item 
                  key="all-users" 
                  onClick={() => exportToPDF('all', 'Semua Pengguna')}
                >
                  <FaUsers className="me-2" /> Semua Pengguna
                </Dropdown.Item>
                
                {getUsersWithSavings().length > 0 ? (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Header>Per Pengguna</Dropdown.Header>
                    {getUsersWithSavings().map(user => (
                      <Dropdown.Item 
                        key={user.id} 
                        onClick={() => exportToPDF(user.id, user.name)}
                      >
                        <FaUser className="me-2" /> {user.name}
                      </Dropdown.Item>
                    ))}
                  </>
                ) : (
                  <Dropdown.Item disabled>Tidak ada data pengguna</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </div>
  );

  // Handle delete confirmation
  const handleDelete = async () => {
    // Close the delete modal first
    setShowDeleteModal(false);
    
    // Show confirmation dialog
    const confirmResult = await showConfirm(
      'Hapus Tabungan?',
      `Anda yakin ingin menghapus tabungan dari ${selectedSaving.user_name}? Tindakan ini tidak dapat dibatalkan.`,
      'YA, HAPUS!',
      'BATALKAN'
    );
    
    // If user cancels, exit the function
    if (!confirmResult.isConfirmed) {
      return;
    }
    
    // Show loading indicator
    const loadingAlert = showLoading('Processing', 'Deleting transaction...');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/tabungan/${selectedSaving.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Delete operation failed');
      }

      // Close loading indicator
      loadingAlert.close();
      
      showSuccess('Success', 'Savings has been deleted successfully.');
      
      // Refresh data
      fetchSavingsData();
      fetchSavingsSummary();
      
    } catch (error) {
      // Close loading indicator
      loadingAlert.close();
      
      console.error('Error during deletion:', error);
      showError('Error', 'Failed to delete the record. Please try again.');
    }
  };

  return (
    <Container fluid className="pb-4 px-0 px-md-3 admin-container">
      <h2 className="mb-4 mx-3 mx-md-0">Manajemen Tabungan</h2>
      
      {/* Replace Alert components with Loading overlay when isLoading is true */}
      {isLoading && <Loading overlay={true} text="Loading data..." />}
      
      {/* Summary Cards - Debug info for troubleshooting */}
      
      {/* Summary Cards - Responsive for mobile (2x2 grid) */}
      <Row className="mb-4 g-3 mx-0 mx-md-n3">
        <Col xs={6} md={3}>
          <Card className="text-center h-100 bg-primary text-white shadow-sm">
            <Card.Body className="py-3">
              <h3 className="mb-1 fs-4 fs-md-3">{formatSummaryValue(savingsSummary.totalApproved)}</h3>
              <Card.Title className="fs-6">Total Approved</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center h-100 bg-warning text-dark shadow-sm">
            <Card.Body className="py-3">
              <h3 className="mb-1 fs-4 fs-md-3">{formatSummaryValue(savingsSummary.totalPending)}</h3>
              <Card.Title className="fs-6">Total Pending</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center h-100 bg-danger text-white shadow-sm">
            <Card.Body className="py-3">
              <h3 className="mb-1 fs-4 fs-md-3">{formatSummaryValue(savingsSummary.totalRejected)}</h3>
              <Card.Title className="fs-6">Total Rejected</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center h-100 bg-info text-white shadow-sm">
            <Card.Body className="py-3">
              <h3 className="mb-1 fs-4 fs-md-3">{formatSummaryValue(savingsSummary.memberCount, false)}</h3>
              <Card.Title className="fs-6">Active Members</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="all" className="mb-4 nav-fill mx-0 mx-md-n3">
        <Tab eventKey="all" title="Semua Tabungan">
          {/* Filters and Controls */}
          {renderFilterControls()}
          
          {/* Main Data Table */}
          {isLoading ? (
            <div className="text-center my-5">
              <Loading size="medium" text="Loading savings data..." />
            </div>
          ) : (
            <>
              <div className="table-responsive rounded shadow-sm mx-0">
                <Table striped bordered hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="d-none d-md-table-cell">ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th className="d-none d-md-table-cell">Description</th>
                      <th>Status</th>
                      <th className="d-none d-md-table-cell">Date</th>
                      <th className="d-none d-md-table-cell">Jenis</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map(item => (
                        <tr key={item.id}>
                          <td className="d-none d-md-table-cell">{item.id}</td>
                          <td>
                            <div className="fw-medium">{item.user_name}</div>
                            <div className="small text-muted d-md-none">
                              {formatDate(item.transaction_date)}
                            </div>
                            <div className="small text-muted d-md-none text-truncate" style={{maxWidth: "150px"}}>
                              {item.description}
                            </div>
                          </td>
                          <td>{formatCurrency(Math.abs(parseFloat(item.amount)))}</td>
                          <td className="d-none d-md-table-cell">{item.description}</td>
                          <td>{renderStatusBadge(item.status)}</td>
                          <td className="d-none d-md-table-cell">{formatDate(item.transaction_date)}</td>
                          <td className="d-none d-md-table-cell">{renderJenisTransaksiBadge(item.jenis_transaksi, item.amount)}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                              <Button 
                                variant="info" 
                                size="sm" 
                                onClick={() => openDetailModal(item)}
                                className="d-flex align-items-center"
                                style={{ minWidth: '38px' }}
                              >
                                <FaEye className="me-1" /> <span className="d-none d-sm-inline">Lihat</span>
                              </Button>
                              
                              {item.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="success" 
                                    size="sm" 
                                    onClick={() => openVerificationModal(item, 'approved')}
                                    className="d-flex align-items-center"
                                    style={{ minWidth: '38px' }}
                                  >
                                    <FaCheckCircle className="me-1" /> <span className="d-none d-sm-inline">Setuju</span>
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => openVerificationModal(item, 'rejected')}
                                    className="d-flex align-items-center"
                                    style={{ minWidth: '38px' }}
                                  >
                                    <FaTimesCircle className="me-1" /> <span className="d-none d-sm-inline">Tolak</span>
                                  </Button>
                                </>
                              )}
                              
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={() => openDeleteModal(item)}
                                className="d-flex align-items-center"
                                style={{ minWidth: '38px' }}
                              >
                                <FaTimes className="me-1" /> <span className="d-none d-sm-inline">Hapus</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <div className="my-3">
                            <p className="mb-0">No data found</p>
                            <small className="text-muted">Try adjusting your search filters</small>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav aria-label="Pagination">
                    <ul className="pagination flex-wrap justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <Button 
                          className="page-link" 
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          aria-label="Previous page"
                        >
                          Sebelumnya
                        </Button>
                      </li>
                      
                      {/* Show limited page numbers on mobile */}
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNum = index + 1;
                        
                        // On mobile: show current, first, last, and one before/after current
                        const isVisible = 
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          pageNum === currentPage || 
                          pageNum === currentPage - 1 || 
                          pageNum === currentPage + 1;
                          
                        // Show ellipsis
                        if (!isVisible) {
                          // Only show one ellipsis between groups
                          if ((pageNum === currentPage - 2 && currentPage > 3) || 
                              (pageNum === currentPage + 2 && currentPage < totalPages - 2)) {
                            return (
                              <li key={pageNum} className="page-item d-none d-md-block">
                                <span className="page-link">...</span>
                              </li>
                            );
                          }
                          return null;
                        }
                        
                        return (
                          <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                            <Button
                              className="page-link"
                              onClick={() => setCurrentPage(pageNum)}
                              aria-label={`Page ${pageNum}`}
                              aria-current={currentPage === pageNum ? 'page' : undefined}
                            >
                              {pageNum}
                            </Button>
                          </li>
                        );
                      })}
                      
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <Button 
                          className="page-link" 
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          aria-label="Next page"
                        >
                          Selanjutnya
                        </Button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </Tab>
        
        <Tab eventKey="pending" title={`Pending (${pendingSavings.length})`}>
          {/* Filters and Controls */}
          {renderFilterControls()}
          
          {/* Main Data Table */}
          {isLoading ? (
            <div className="text-center my-5">
              <Loading size="medium" text="Loading data..." />
            </div>
          ) : (
            <div className="table-responsive rounded shadow-sm mx-0">
              <Table striped bordered hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="d-none d-md-table-cell">ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th className="d-none d-md-table-cell">Description</th>
                    <th className="d-none d-md-table-cell">Date</th>
                    <th className="d-none d-md-table-cell">Jenis</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSavings.length > 0 ? (
                    pendingSavings.map(item => (
                      <tr key={item.id}>
                        <td className="d-none d-md-table-cell">{item.id}</td>
                        <td>
                          <div className="fw-medium">{item.user_name}</div>
                          <div className="small text-muted d-md-none">
                            {formatDate(item.transaction_date)}
                          </div>
                          <div className="small text-muted d-md-none text-truncate" style={{maxWidth: "150px"}}>
                            {item.description}
                          </div>
                        </td>
                        <td>{formatCurrency(Math.abs(parseFloat(item.amount)))}</td>
                        <td className="d-none d-md-table-cell">{item.description}</td>
                        <td className="d-none d-md-table-cell">{formatDate(item.transaction_date)}</td>
                        <td className="d-none d-md-table-cell">{renderJenisTransaksiBadge(item.jenis_transaksi, item.amount)}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-2 justify-content-center">
                            <Button 
                              variant="info" 
                              size="sm" 
                              onClick={() => openDetailModal(item)}
                              className="d-flex align-items-center"
                              style={{ minWidth: '38px' }}
                            >
                              <FaEye className="me-1" /> <span className="d-none d-sm-inline">Lihat</span>
                            </Button>
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => openVerificationModal(item, 'approved')}
                              className="d-flex align-items-center"
                              style={{ minWidth: '38px' }}
                            >
                              <FaCheckCircle className="me-1" /> <span className="d-none d-sm-inline">Setuju</span>
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => openVerificationModal(item, 'rejected')}
                              className="d-flex align-items-center"
                              style={{ minWidth: '38px' }}
                            >
                              <FaTimesCircle className="me-1" /> <span className="d-none d-sm-inline">Tolak</span>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => openDeleteModal(item)}
                              className="d-flex align-items-center"
                              style={{ minWidth: '38px' }}
                            >
                              <FaTimes className="me-1" /> <span className="d-none d-sm-inline">Hapus</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <div className="my-3">
                          <p className="mb-1">No pending savings found</p>
                          <small className="text-muted">All savings have been verified</small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Tab>
      </Tabs>
      
      {/* Verification Modal */}
      <Modal 
        show={showVerificationModal} 
        onHide={() => setShowVerificationModal(false)} 
        centered
        fullscreen="sm-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {verificationAction === 'approved' ? 'Setujui Tabungan' : 'Tolak Tabungan'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedSaving && (
            <div>
              <p><strong>User:</strong> {selectedSaving.user_name}</p>
              <p><strong>Amount:</strong> {formatCurrency(Math.abs(parseFloat(selectedSaving.amount)))}</p>
              <p><strong>Description:</strong> {selectedSaving.description}</p>
              <p><strong>Transaction Date:</strong> {formatDate(selectedSaving.transaction_date)}</p>
              <p><strong>Jenis Transaksi:</strong> {selectedSaving.jenis_transaksi === 'penarikan' || parseFloat(selectedSaving.amount) < 0 ? 'Penarikan' : 'Setoran'}</p>
              
              {/* Tampilkan bukti transaksi hanya untuk setoran */}
              {(selectedSaving.jenis_transaksi !== 'penarikan' && parseFloat(selectedSaving.amount) >= 0) && (
                <div className="mb-3 text-center">
                  {selectedSaving.receipt_url && (
                    <img 
                      src={selectedSaving.receipt_url.startsWith('http') ? selectedSaving.receipt_url : `${API_URL}${selectedSaving.receipt_url}`} 
                      alt="Receipt" 
                      className="img-fluid border rounded"
                      style={{ maxHeight: '200px' }}
                    />
                  )}
                  {!selectedSaving.receipt_url && (
                    <div className="border rounded p-3 bg-light text-center">
                      <p className="mb-0">Tidak ada bukti transaksi</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Upload bukti pembayaran untuk penarikan yang disetujui */}
              {verificationAction === 'approved' && 
               (selectedSaving.jenis_transaksi === 'penarikan' || parseFloat(selectedSaving.amount) < 0) && (
                <Form.Group className="mb-3">
                  <Form.Label><strong>Upload Bukti Pembayaran</strong></Form.Label>
                  <div className="input-group mb-2">
                    <input 
                      type="file" 
                      className="form-control" 
                      onChange={handleReceiptFileChange} 
                      accept="image/jpeg,image/png,image/jpg"
                    />
                  </div>
                  <div className="form-text text-muted">
                    Upload bukti transfer untuk penarikan dana. Format: JPG, JPEG, PNG. Maks: 5MB
                  </div>
                  
                  {receiptPreview && (
                    <div className="mt-2 text-center border rounded p-2">
                      <img 
                        src={receiptPreview} 
                        alt="Receipt Preview" 
                        className="img-fluid" 
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                </Form.Group>
              )}
              
              <Form.Group>
                <Form.Label>Admin Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={`Notes regarding this ${verificationAction === 'approved' ? 'approval' : 'rejection'}...`}
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-end">
          <Button 
            variant="secondary" 
            onClick={() => setShowVerificationModal(false)}
            className="w-100 w-md-auto order-2 order-md-1"
          >
            Cancel
          </Button>
          <Button 
            variant={verificationAction === 'approved' ? 'success' : 'danger'}
            onClick={handleVerification}
            className="w-100 w-md-auto order-1 order-md-2"
          >
            {verificationAction === 'approved' ? 'Setujui' : 'Tolak'} Tabungan
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)} 
        size="lg" 
        centered
        fullscreen="md-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail Tabungan</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 p-md-3">
          {selectedSaving && (
            <Row className="g-0 g-md-4">
              <Col xs={12} md={6} className="p-3 p-md-0">
                <h5 className="border-bottom pb-2 mb-3">Savings Information</h5>
                <div className="table-responsive">
                  <Table bordered className="mb-0">
                    <tbody>
                      <tr>
                        <td className="w-40"><strong>ID</strong></td>
                        <td>{selectedSaving.id}</td>
                      </tr>
                      <tr>
                        <td><strong>User</strong></td>
                        <td>{selectedSaving.user_name}</td>
                      </tr>
                      <tr>
                        <td><strong>Amount</strong></td>
                        <td>{formatCurrency(Math.abs(parseFloat(selectedSaving.amount)))}</td>
                      </tr>
                      <tr>
                        <td><strong>Jenis Transaksi</strong></td>
                        <td>{renderJenisTransaksiBadge(selectedSaving.jenis_transaksi, selectedSaving.amount)}</td>
                      </tr>
                      <tr>
                        <td><strong>Description</strong></td>
                        <td>{selectedSaving.description}</td>
                      </tr>
                      <tr>
                        <td><strong>Status</strong></td>
                        <td>{renderStatusBadge(selectedSaving.status)}</td>
                      </tr>
                      <tr>
                        <td><strong>Transaction Date</strong></td>
                        <td>{formatDate(selectedSaving.transaction_date)}</td>
                      </tr>
                      <tr>
                        <td><strong>Created At</strong></td>
                        <td>{new Date(selectedSaving.created_at).toLocaleString()}</td>
                      </tr>
                      {selectedSaving.status !== 'pending' && (
                        <>
                          <tr>
                            <td><strong>Verified By</strong></td>
                            <td>{selectedSaving.admin_name || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td><strong>Admin Notes</strong></td>
                            <td>{selectedSaving.admin_notes || 'No notes'}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col xs={12} md={6} className="p-3 p-md-0">
                <h5 className="border-bottom pb-2 mb-3">Receipt</h5>
                <div className="text-center border rounded p-3 bg-light">
                  {selectedSaving.receipt_url ? (
                    <>
                      <img 
                        src={selectedSaving.receipt_url.startsWith('http') ? selectedSaving.receipt_url : `${API_URL}${selectedSaving.receipt_url}`} 
                        alt="Receipt" 
                        className="img-fluid" 
                        style={{ maxHeight: '400px', maxWidth: '100%' }}
                      />
                      <div className="mt-3">
                        <a 
                          href={selectedSaving.receipt_url.startsWith('http') ? selectedSaving.receipt_url : `${API_URL}${selectedSaving.receipt_url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Full Size
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="p-5 text-center">
                      <p className="mb-0">Tidak ada bukti transaksi</p>
                      <small className="text-muted">{selectedSaving.jenis_transaksi === 'penarikan' || parseFloat(selectedSaving.amount) < 0 ? 'Transaksi penarikan tidak memerlukan bukti' : ''}</small>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-end">
          <Button 
            variant="secondary" 
            onClick={() => setShowDetailModal(false)}
            className="w-100 w-md-auto"
            size={window.innerWidth < 768 ? "lg" : "md"}
          >
            Close
          </Button>
          {selectedSaving && selectedSaving.status === 'pending' && (
            <>
              <Button 
                variant="success" 
                onClick={() => {
                  setShowDetailModal(false);
                  openVerificationModal(selectedSaving, 'approved');
                }}
                className="w-100 w-md-auto"
                size={window.innerWidth < 768 ? "lg" : "md"}
              >
                <FaCheckCircle className="me-2" /> Setuju
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  setShowDetailModal(false);
                  openVerificationModal(selectedSaving, 'rejected');
                }}
                className="w-100 w-md-auto"
                size={window.innerWidth < 768 ? "lg" : "md"}
              >
                <FaTimesCircle className="me-2" /> Tolak
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        size="sm"
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Hapus Tabungan</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedSaving && (
            <div>
              <p className="mb-4">Anda yakin ingin menghapus data tabungan ini?</p>
              
              <div className="mb-3 p-3 border rounded bg-light">
                <p className="mb-1"><strong>User:</strong> {selectedSaving.user_name}</p>
                <p className="mb-1"><strong>Amount:</strong> {formatCurrency(Math.abs(parseFloat(selectedSaving.amount)))}</p>
                <p className="mb-0"><strong>Date:</strong> {formatDate(selectedSaving.transaction_date)}</p>
              </div>
              
              <p className="text-danger mb-0"><small><strong>Perhatian:</strong> Tindakan ini tidak dapat dibatalkan!</small></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex flex-wrap gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            className="w-100 w-md-auto"
          >
            Batal
          </Button>
          <Button 
            variant="danger"
            onClick={handleDelete}
            className="w-100 w-md-auto"
          >
            Hapus Tabungan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SavingsManagement;
