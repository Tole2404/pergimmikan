import { useState, useEffect, useRef } from 'react';
import './Savings.css';
import { BounceLoader } from 'react-spinners';
import { showSuccess, showError, showLoading, closePopup } from '../utils/sweetalert';
import Loading from '../components/common/Loading';
import PageTitle from '../components/common/PageTitle';

const API_URL = import.meta.env.VITE_API_URL;

export default function Savings() {
  const [userData, setUserData] = useState(null);
  const [savings, setSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [pendingSavings, setPendingSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('setoran'); 
  const [jumlahPenarikan, setJumlahPenarikan] = useState(''); 
  const [keteranganPenarikan, setKeteranganPenarikan] = useState(''); 
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('adminToken');
      
      if (!userStr || !token) {
        setError('User not logged in');
        setLoading(false);
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
        
        // Fetch savings data from API
        const response = await fetch(`${API_URL}/api/tabungan`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          
          // Handle token expiration
          if (errorData.message && errorData.message.includes('expired')) {
            console.log('Token expired, redirecting to login page...');
            // Clear localStorage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.href = '/login?session=expired';
            return;
          }
          
          throw new Error(errorData.message || 'Failed to fetch savings data');
        }
        
        const data = await response.json();
        
        // Debug: Log data structure
        console.log('API Response Data:', data);
        
        // Periksa format data yang diterima dari API
        if (data && data.summary && data.data) {
          // Format data dari endpoint getUserSavings
          console.log('Format data: getUserSavings dengan summary dan data');
          
          // Format data jika diperlukan
          const savingsData = data.data.map(item => ({
            id: item.id,
            date: item.created_at || item.transaction_date || new Date().toISOString(),
            amount: parseFloat(item.amount),
            description: item.description,
            status: item.status,
            jenis_transaksi: item.jenis_transaksi || (parseFloat(item.amount) < 0 ? 'penarikan' : 'setoran'),
            receiptUrl: item.receipt_url ? 
              (item.receipt_url.startsWith('http') ? item.receipt_url : `${API_URL}${item.receipt_url}`) : 
              ''
          }));
          
          console.log('Formatted Savings Data:', savingsData[0] || 'No data');
          
          setSavings(savingsData);
          setTotalSavings(parseFloat(data.summary.total_approved || 0));
          setPendingSavings(parseFloat(data.summary.total_pending || 0));
        } else if (data && data.data && Array.isArray(data.data)) {
          // Format data dari endpoint getSavingsHistory
          console.log('Format data: getSavingsHistory dengan array di data');
          
          const savingsData = data.data.map(item => ({
            id: item.id,
            date: item.created_at || item.transaction_date || new Date().toISOString(),
            amount: parseFloat(item.amount),
            description: item.description,
            status: item.status,
            jenis_transaksi: item.jenis_transaksi || (parseFloat(item.amount) < 0 ? 'penarikan' : 'setoran'),
            receiptUrl: item.receipt_url ? 
              (item.receipt_url.startsWith('http') ? item.receipt_url : `${API_URL}${item.receipt_url}`) : 
              ''
          }));
          
          setSavings(savingsData);
          
          // Hitung total dari data yang tersedia
          const approvedTotal = savingsData
            .filter(item => item.status === 'approved')
            .reduce((sum, item) => sum + parseFloat(item.amount), 0);
            
          const pendingTotal = savingsData
            .filter(item => item.status === 'pending')
            .reduce((sum, item) => sum + parseFloat(item.amount), 0);
          
          setTotalSavings(approvedTotal);
          setPendingSavings(pendingTotal);
        } else if (Array.isArray(data)) {
          // Format data langsung sebagai array
          console.log('Format data: array langsung');
          
          const savingsData = data.map(item => ({
            id: item.id,
            date: item.created_at || item.transaction_date || new Date().toISOString(),
            amount: parseFloat(item.amount),
            description: item.description,
            status: item.status,
            jenis_transaksi: item.jenis_transaksi || (parseFloat(item.amount) < 0 ? 'penarikan' : 'setoran'),
            receiptUrl: item.receipt_url ? 
              (item.receipt_url.startsWith('http') ? item.receipt_url : `${API_URL}${item.receipt_url}`) : 
              ''
          }));
          
          setSavings(savingsData);
          
          // Hitung total dari data yang tersedia
          const approvedTotal = savingsData
            .filter(item => item.status === 'approved')
            .reduce((sum, item) => sum + parseFloat(item.amount), 0);
            
          const pendingTotal = savingsData
            .filter(item => item.status === 'pending')
            .reduce((sum, item) => sum + parseFloat(item.amount), 0);
          
          setTotalSavings(approvedTotal);
          setPendingSavings(pendingTotal);
        } else {
          // Format data tidak dikenali
          console.error('Format data tidak dikenali:', data);
          setSavings([]);
          setTotalSavings(0);
          setPendingSavings(0);
          setError('Tidak dapat memuat data tabungan. Silakan coba lagi nanti.');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load savings data');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Format currency to Indonesian Rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date to more readable format
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    
    try {
      // Debug: Log input date string
      console.log('Format Date Input:', {
        originalDate: dateStr,
        type: typeof dateStr
      });
      
      // Handle ISO string format
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
        dateStr = dateStr.split('T')[0];
      }
      
      const date = new Date(dateStr);
      
      // Debug: Log created date object
      console.log('Date Object:', {
        dateObj: date,
        isoString: date.toISOString(),
        localString: date.toString()
      });
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateStr);
        return 'N/A';
      }
      
      // Debug: Log formatted date with different time zones
      const formattedJakarta = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
      }).format(date);
      
      const formattedUTC = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }).format(date);
      
      console.log('Formatted Dates:', {
        jakarta: formattedJakarta,
        utc: formattedUTC,
        original: dateStr
      });
      
      // Gunakan zona waktu Jakarta (Asia/Jakarta - WIB/UTC+7) untuk format tanggal
      return formattedJakarta;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('');
        showError('FILE TOO LARGE!', 'File terlalu besar. Maksimal 5MB.');
        setReceipt(null);
        setPreviewUrl('');
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setFormError('');
        showError('WRONG FILE TYPE!', 'Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
        setReceipt(null);
        setPreviewUrl('');
        return;
      }

      setFormError('');
      setReceipt(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validasi input
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showError('INVALID AMOUNT!', 'Silakan masukkan jumlah setoran yang valid');
      return;
    }
    
    if (!description.trim()) {
      showError('DESCRIPTION NEEDED!', 'Silakan masukkan keterangan setoran');
      return;
    }
    
    if (!receipt) {
      showError('RECEIPT REQUIRED!', 'Silakan upload bukti pembayaran');
      return;
    }
    
    // Kirim data ke server
    setSubmitting(true);
    showLoading('SAVING DEPOSIT...', 'Mengirim data tabungan Anda. Mohon tunggu sebentar.');
    
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Anda perlu login terlebih dahulu');
      }
      
      // Siapkan form data
      const formData = new FormData();
      formData.append('receipt', receipt);
      formData.append('amount', amount);
      formData.append('description', description);
      
      // Gunakan tanggal dengan zona waktu Jakarta (WIB/UTC+7)
      const jakartaDate = new Date();
      const jakartaDateString = jakartaDate.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).split('/').reverse().join('-'); // Format YYYY-MM-DD
      
      formData.append('transaction_date', jakartaDateString);
      
      // Kirim ke API
      const response = await fetch(`${API_URL}/api/tabungan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (errorData.message && errorData.message.includes('expired')) {
          console.log('Token expired, redirecting to login page...');
          // Clear localStorage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/login?session=expired';
          return;
        }
        
        throw new Error(errorData.message || 'Gagal menambahkan tabungan');
      }
      
      const newDeposit = await response.json();
      
      // Update state
      setSavings(prev => [newDeposit, ...prev]);
      setPendingSavings(prev => prev + parseFloat(amount));
      
      // Reset form
      setAmount('');
      setDescription('');
      setReceipt(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      closePopup();
      showSuccess('DEPOSIT BERHASIL!', 'Setoran berhasil ditambahkan dan menunggu persetujuan admin');
      setSuccessMessage('');
    } catch (error) {
      console.error('Error submitting deposit:', error);
      closePopup();
      showError('DEPOSIT GAGAL!', error.message || 'Gagal menambahkan tabungan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePenarikanSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validasi input
    if (!jumlahPenarikan || isNaN(jumlahPenarikan) || parseFloat(jumlahPenarikan) <= 0) {
      showError('JUMLAH TIDAK VALID!', 'Silakan masukkan jumlah penarikan yang valid');
      return;
    }
    
    if (parseFloat(jumlahPenarikan) > totalSavings) {
      showError('SALDO TIDAK CUKUP!', `Saldo Anda saat ini adalah ${formatCurrency(totalSavings)}. Anda tidak dapat menarik lebih dari saldo yang tersedia.`);
      return;
    }
    
    if (!keteranganPenarikan.trim()) {
      showError('KETERANGAN DIPERLUKAN!', 'Silakan masukkan keterangan penarikan');
      return;
    }
    
    // Kirim data ke server
    setSubmitting(true);
    showLoading('MEMPROSES PENARIKAN...', 'Mengirim permintaan penarikan dana Anda. Mohon tunggu sebentar.');
    
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Anda perlu login terlebih dahulu');
      }
      
      // Siapkan data penarikan
      const penarikanData = {
        jumlah: jumlahPenarikan,
        keterangan: keteranganPenarikan,
      };
      
      // Gunakan tanggal dengan zona waktu Jakarta (WIB/UTC+7)
      const jakartaDate = new Date();
      const jakartaDateString = jakartaDate.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).split('/').reverse().join('-'); // Format YYYY-MM-DD
      
      penarikanData.tanggal_transaksi = jakartaDateString;
      
      // Kirim ke API
      const response = await fetch(`${API_URL}/api/tabungan/penarikan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(penarikanData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (errorData.message && errorData.message.includes('expired')) {
          console.log('Token expired, redirecting to login page...');
          // Clear localStorage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/login?session=expired';
          return;
        }
        
        throw new Error(errorData.message || 'Gagal memproses penarikan dana');
      }
      
      const newWithdrawal = await response.json();
      
      // Update state
      setSavings(prev => [newWithdrawal, ...prev]);
      setPendingSavings(prev => prev - parseFloat(jumlahPenarikan));
      
      // Reset form
      setJumlahPenarikan('');
      setKeteranganPenarikan('');
      
      // Show success message
      closePopup();
      showSuccess(
        'PENARIKAN BERHASIL DIAJUKAN', 
        'Permintaan penarikan dana Anda telah berhasil diajukan dan sedang menunggu persetujuan admin. Anda akan menerima notifikasi setelah disetujui.'
      );
      
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      closePopup();
      showError('GAGAL!', error.message || 'Gagal memproses penarikan dana. Silakan coba lagi nanti.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="savings-loading">
        <Loading size="large" overlay={true} text="Loading your savings data..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="savings-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/'}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="savings-container">
      <PageTitle title="Tabungan Pribadi" />
      
      <div className="savings-dashboard">
        <div className="savings-balance">
          <div className="balance-title">Saldo Terverifikasi</div>
          <div className="balance-amount">{formatCurrency(totalSavings)}</div>
        </div>
        
        <div className="savings-balance">
          <div className="balance-title">Saldo Pending</div>
          <div className="balance-amount">{formatCurrency(pendingSavings)}</div>
        </div>
      </div>
      
      {/* Tab untuk memilih antara setoran dan penarikan */}
      <div className="savings-tabs">
        <button 
          className={`tab-button ${activeTab === 'setoran' ? 'active' : ''}`}
          onClick={() => setActiveTab('setoran')}
        >
          Setoran
        </button>
        <button 
          className={`tab-button ${activeTab === 'penarikan' ? 'active' : ''}`}
          onClick={() => setActiveTab('penarikan')}
        >
          Penarikan
        </button>
      </div>
      
      {/* Form setor tabungan */}
      {activeTab === 'setoran' && (
        <div className="savings-form">
          <h2>Setor Tabungan</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="amount">Jumlah Setoran (Rp)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Masukkan jumlah setoran"
                min="1000"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Keterangan</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Misalnya: Setoran Bulanan Mei 2025"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="receipt">Bukti Pembayaran</label>
              <input
                type="file"
                id="receipt"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg"
                required
              />
              <p className="file-info">Ukuran file maks. 5MB (Format: JPG, JPEG, PNG)</p>
              
              {previewUrl && (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="receipt-preview" />
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? <BounceLoader size={20} color="#ffffff" /> : 'Setor Tabungan'}
            </button>
          </form>
        </div>
      )}
      
      {/* Form penarikan tabungan */}
      {activeTab === 'penarikan' && (
        <div className="savings-form">
          <h2>Penarikan Dana</h2>
          <form onSubmit={handlePenarikanSubmit}>
            <div className="form-group">
              <label htmlFor="jumlahPenarikan">Jumlah Penarikan (Rp)</label>
              <input
                type="number"
                id="jumlahPenarikan"
                value={jumlahPenarikan}
                onChange={(e) => setJumlahPenarikan(e.target.value)}
                placeholder="Masukkan jumlah penarikan"
                min="1000"
                max={totalSavings}
                required
              />
              <p className="balance-info">Saldo tersedia: {formatCurrency(totalSavings)}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="keteranganPenarikan">Keterangan</label>
              <input
                type="text"
                id="keteranganPenarikan"
                value={keteranganPenarikan}
                onChange={(e) => setKeteranganPenarikan(e.target.value)}
                placeholder="Misalnya: Penarikan untuk Kegiatan Kelompok"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button withdraw-button"
              disabled={submitting || totalSavings <= 0}
            >
              {submitting ? <BounceLoader size={20} color="#ffffff" /> : 'Ajukan Penarikan'}
            </button>
            
            {totalSavings <= 0 && (
              <p className="error-info">Anda tidak memiliki saldo yang cukup untuk melakukan penarikan.</p>
            )}
          </form>
        </div>
      )}
      
      {/* Riwayat Setoran */}
      <div className="savings-history">
        <div className="section-header">
          <h2>Riwayat Setoran</h2>
          <div className="section-icon">📋</div>
        </div>
        
        <div className="savings-table-container">
          <table className="savings-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Bukti</th>
              </tr>
            </thead>
            <tbody>
              {savings.length > 0 ? (
                savings.map(item => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.description}</td>
                    <td className="amount-cell">{formatCurrency(item.amount)}</td>
                    <td className={`status-cell status-${item.status}`}>
                      {item.status === 'approved' ? 'Disetujui' : 'Menunggu'}
                    </td>
                    <td className="receipt-cell">
                      <button className="view-receipt-btn" onClick={() => window.open(
                        item.receiptUrl.startsWith('http') 
                          ? item.receiptUrl 
                          : `${API_URL}${item.receiptUrl}`, 
                        '_blank'
                      )}>
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">Belum ada data setoran</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Informasi Kontak */}
      <div className="savings-footer">
        <div className="contact-info">
          <div className="contact-icon">📞</div>
          <div>
            <p>Pertanyaan mengenai tabungan Anda?</p>
            <p>Hubungi bendahara: <a href="mailto:treasurer@pergimmikan.org">treasurer@pergimmikan.org</a></p>
          </div>
        </div>
        
        <div className="savings-note-footer">
          <p><strong>Catatan:</strong> Setoran akan diverifikasi oleh admin dalam 1x24 jam kerja</p>
        </div>
      </div>
    </div>
  );
}
