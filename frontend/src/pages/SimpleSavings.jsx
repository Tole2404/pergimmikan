import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SimpleSavings.css';
import Loading from '../components/common/Loading';
import { showSuccess, showError, showLoading, closePopup } from '../utils/sweetalert';

const API_URL = import.meta.env.VITE_API_URL;

export default function SimpleSavings() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [savings, setSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [pendingSavings, setPendingSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  // State untuk penarikan dana
  const [activeTab, setActiveTab] = useState('setoran'); // 'setoran' atau 'penarikan'
  const [jumlahPenarikan, setJumlahPenarikan] = useState('');
  const [keteranganPenarikan, setKeteranganPenarikan] = useState('');
  
  // State untuk Telegram
  const [telegramId, setTelegramId] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [savingTelegram, setSavingTelegram] = useState(false);
  const [showTelegramForm, setShowTelegramForm] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('adminToken'); // Menggunakan adminToken sesuai standar aplikasi
      
      if (!userStr || !token) {
        setError('Anda perlu login untuk melihat tabungan');
        setLoading(false);
        
        // Redirect ke halaman login langsung
        setTimeout(() => {
          navigate('/login-tabungan?session=expired');
        }, 2000);
        return;
      }
      
      try {
        // Fetch user profile from API to get latest data
        const profileResponse = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let user;
        if (profileResponse.ok) {
          user = await profileResponse.json();
          // Update localStorage with latest data
          localStorage.setItem('user', JSON.stringify(user));
          console.log('User profile loaded from API:', user);
        } else {
          // Fallback to localStorage
          user = JSON.parse(userStr);
          console.log('Using user from localStorage:', user);
        }
        
        setUserData(user);
        
        // Set Telegram data if exists
        console.log('Telegram ID from user:', user.telegram_id);
        if (user.telegram_id) {
          setTelegramId(user.telegram_id);
          setTelegramUsername(user.telegram_username || '');
        }
        
        // Fetch savings data from API
        const response = await fetch(`${API_URL}/api/tabungan`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Handle token expiration
          if (errorData.message && errorData.message.includes('expired')) {
            // Redirect ke halaman login langsung
            navigate('/login-tabungan?session=expired');
            return;
          }
          
          throw new Error(errorData.message || 'Gagal memuat data tabungan');
        }
        
        const data = await response.json();
        
        // Log data untuk debugging
        console.log('Data dari API:', data);
        
        // Proses data dari API
        if (data.summary && data.history) {
          // Format data tabungan
          const savingsData = data.history.map(item => ({
            id: item.id,
            date: item.created_at || item.transaction_date || new Date().toISOString(),
            amount: parseFloat(item.amount || 0),
            description: item.description || '',
            status: item.status || 'pending',
            receiptUrl: item.receipt_url 
              ? (item.receipt_url.startsWith('http') 
                  ? item.receipt_url 
                  : `${API_URL}${item.receipt_url}`)
              : null,
            jenis_transaksi: item.jenis_transaksi || 'setoran'
          }));
          
          setSavings(savingsData);
          setTotalSavings(parseFloat(data.summary.total_approved || data.summary.saldo_tersedia || 0));
          setPendingSavings(parseFloat(data.summary.total_pending || 0));
        } else if (data.summary && data.data) {
          // Alternative format
          const savingsData = data.data.map(item => ({
            id: item.id,
            date: item.created_at || item.transaction_date || new Date().toISOString(),
            amount: parseFloat(item.amount || 0),
            description: item.description || '',
            status: item.status || 'pending',
            receiptUrl: item.receipt_url 
              ? (item.receipt_url.startsWith('http') 
                  ? item.receipt_url 
                  : `${API_URL}${item.receipt_url}`)
              : null,
            jenis_transaksi: item.jenis_transaksi || 'setoran'
          }));
          
          setSavings(savingsData);
          setTotalSavings(parseFloat(data.summary.total_approved || data.summary.saldo_tersedia || 0));
          setPendingSavings(parseFloat(data.summary.total_pending || 0));
        } else {
          // Alternatif jika format data berbeda
          console.log('Format data alternatif:', data);
          
          // Jika data adalah objek dengan properti data yang berisi array
          if (data && data.data && Array.isArray(data.data)) {
            setSavings(data.data);
            
            const approvedTotal = data.data
              .filter(item => item.status === 'approved')
              .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
              
            const pendingTotal = data.data
              .filter(item => item.status === 'pending')
              .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            
            setTotalSavings(approvedTotal);
            setPendingSavings(pendingTotal);
          } else {
            // Fallback jika data bukan array
            const dataArray = Array.isArray(data) ? data : [];
            setSavings(dataArray);
            
            const approvedTotal = dataArray
              .filter(item => item.status === 'approved')
              .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
              
            const pendingTotal = dataArray
              .filter(item => item.status === 'pending')
              .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            
            setTotalSavings(approvedTotal);
            setPendingSavings(pendingTotal);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Gagal memuat data tabungan');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
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
        showError('File Terlalu Besar', 'Maksimum ukuran file 5MB');
        setReceipt(null);
        setPreviewUrl('');
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        showError('Format File Salah', 'Gunakan JPG, JPEG, atau PNG');
        setReceipt(null);
        setPreviewUrl('');
        return;
      }

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
    
    // Validasi input
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showError('Jumlah Tidak Valid', 'Masukkan jumlah setoran yang valid');
      return;
    }
    
    if (!description.trim()) {
      showError('Keterangan Diperlukan', 'Masukkan keterangan setoran');
      return;
    }
    
    if (!receipt) {
      showError('Bukti Diperlukan', 'Upload bukti pembayaran');
      return;
    }
    
    // Kirim data ke server
    setSubmitting(true);
    showLoading('Proses Setoran', 'Mengirim data tabungan Anda');
    
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
      
      // Tanggal transaksi dengan zona waktu Jakarta
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
          navigate('/login-tabungan?session=expired');
          return;
        }
        
        throw new Error(errorData.message || 'Gagal menambahkan tabungan');
      }
      
      const newSaving = await response.json();
      
      // Update state
      setSavings(prev => [newSaving, ...prev]);
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
      showSuccess('Setoran Berhasil', 'Setoran berhasil ditambahkan dan menunggu persetujuan admin');
    } catch (error) {
      console.error('Error submitting deposit:', error);
      closePopup();
      showError('Setoran Gagal', error.message || 'Gagal menambahkan tabungan');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler untuk penarikan dana
  const handlePenarikanSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!jumlahPenarikan || isNaN(jumlahPenarikan) || parseFloat(jumlahPenarikan) <= 0) {
      showError('Jumlah Tidak Valid', 'Masukkan jumlah penarikan yang valid');
      return;
    }
    
    if (parseFloat(jumlahPenarikan) > totalSavings) {
      showError('Saldo Tidak Cukup', `Saldo Anda saat ini adalah ${formatCurrency(totalSavings)}. Anda tidak dapat menarik lebih dari saldo yang tersedia.`);
      return;
    }
    
    if (!keteranganPenarikan.trim()) {
      showError('Keterangan Diperlukan', 'Masukkan keterangan penarikan');
      return;
    }
    
    // Kirim data ke server
    setSubmitting(true);
    showLoading('Proses Penarikan', 'Mengirim permintaan penarikan dana Anda');
    
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
      
      // Tanggal transaksi dengan zona waktu Jakarta
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
          navigate('/login-tabungan?session=expired');
          return;
        }
        
        throw new Error(errorData.message || 'Gagal memproses penarikan dana');
      }
      
      const newWithdrawal = await response.json();
      
      // Update state
      setSavings(prev => [newWithdrawal, ...prev]);
      setPendingSavings(prev => prev + parseFloat(jumlahPenarikan));
      
      // Reset form
      setJumlahPenarikan('');
      setKeteranganPenarikan('');
      
      closePopup();
      showSuccess('Penarikan Berhasil Diajukan', 'Permintaan penarikan dana Anda telah berhasil diajukan dan sedang menunggu persetujuan admin');
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      closePopup();
      showError('Penarikan Gagal', error.message || 'Gagal memproses penarikan dana');
    } finally {
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    navigate('/login-tabungan');
  };

  const handleSaveTelegram = async (e) => {
    e.preventDefault();
    
    if (!telegramId.trim()) {
      showError('Telegram ID Diperlukan', 'Masukan Telegram ID Anda');
      return;
    }
    
    setSavingTelegram(true);
    showLoading('Menyimpan', 'Menghubungkan Telegram Anda...');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/auth/update-telegram`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          telegram_id: telegramId.trim(),
          telegram_username: telegramUsername.trim()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan Telegram ID');
      }
      
      const data = await response.json();
      
      // Update with data from API response
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUserData(data.user);
        setTelegramId(data.user.telegram_id || '');
        setTelegramUsername(data.user.telegram_username || '');
        console.log('Telegram linked successfully:', data.user);
      }
      
      closePopup();
      showSuccess('Berhasil!', 'Telegram Anda berhasil dihubungkan. Sekarang Anda bisa submit tabungan via Telegram dengan /tabung');
      setShowTelegramForm(false);
      
    } catch (error) {
      console.error('Error saving telegram:', error);
      closePopup();
      showError('Gagal Menyimpan', error.message || 'Gagal menghubungkan Telegram');
    } finally {
      setSavingTelegram(false);
    }
  };

  if (loading) {
    return (
      <div className="simple-savings-page">
        <div className="simple-savings-loading">
          <Loading size="large" text="Memuat data tabungan..." />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="simple-savings-page">
        <div className="simple-savings-error">
          <h2>Terjadi Kesalahan</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/savings-direct')}>
            Login Kembali
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="simple-savings-page">
      <div className="simple-savings-container">
        <div className="simple-savings-header">
          <h1>Tabungan PERGIMMIKAN</h1>
          <div className="user-info">
            <span>Halo, {userData?.name || userData?.username || 'Anggota'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        
        {/* Telegram Link Section */}
        <div className="telegram-link-section" style={{
          background: userData?.telegram_id ? '#e8f5e9' : '#fff3e0',
          border: `2px solid ${userData?.telegram_id ? '#4caf50' : '#ff9800'}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          {userData?.telegram_id ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#2e7d32', fontSize: '18px' }}>
                  ✅ Telegram Terhubung
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  📱 ID: <code style={{ background: '#fff', padding: '2px 8px', borderRadius: '4px' }}>{userData.telegram_id}</code>
                  {userData.telegram_username && ` • ${userData.telegram_username}`}
                </p>
                <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '13px' }}>
                  💡 Kirim <strong>/tabung</strong> ke bot untuk submit tabungan via Telegram
                </p>
              </div>
              <button 
                onClick={() => setShowTelegramForm(!showTelegramForm)}
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showTelegramForm ? 'Tutup' : 'Edit'}
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#f57c00', fontSize: '18px' }}>
                📱 Hubungkan Telegram
              </h3>
              <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>
                Hubungkan Telegram Anda untuk submit tabungan langsung dari Telegram!
              </p>
              <button 
                onClick={() => setShowTelegramForm(!showTelegramForm)}
                style={{
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {showTelegramForm ? 'Tutup' : 'Hubungkan Sekarang'}
              </button>
            </div>
          )}
          
          {/* Telegram Form */}
          {showTelegramForm && (
            <form onSubmit={handleSaveTelegram} style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #ddd'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Telegram ID <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="Contoh: 1340614803"
                  disabled={savingTelegram}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  💡 Kirim <strong>/link</strong> ke bot <strong>@pergimmikan_savings_bot</strong> untuk mendapatkan ID Anda
                </small>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Username Telegram (Opsional)
                </label>
                <input 
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="Contoh: @username"
                  disabled={savingTelegram}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <button 
                type="submit"
                disabled={savingTelegram}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  cursor: savingTelegram ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: savingTelegram ? 0.6 : 1
                }}
              >
                {savingTelegram ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          )}
        </div>
        
        <div className="simple-savings-cards">
          <div className="savings-card">
            <div className="card-title__saving">Total Tabungan</div>
            <div className="card-amount_saving">{formatCurrency(totalSavings)}</div>
            <div className="card-status">Sudah diverifikasi</div>
          </div>
          
          <div className="savings-card">
            <div className="card-title__saving">Menunggu Verifikasi</div>
            <div className="card-amount_saving">{formatCurrency(pendingSavings)}</div>
            <div className="card-status">Belum diverifikasi</div>
          </div>
        </div>
        
        <div className="simple-savings-form-section">
          <h2>Transaksi Tabungan</h2>
          
          {/* Tab untuk memilih antara setoran dan penarikan */}
          <div className="simple-savings-tabs">
            <button 
              className={`tab-button ${activeTab === 'setoran' ? 'active' : ''}`}
              onClick={() => setActiveTab('setoran')}
              type="button"
            >
              Setoran
            </button>
            <button 
              className={`tab-button ${activeTab === 'penarikan' ? 'active' : ''}`}
              onClick={() => setActiveTab('penarikan')}
              type="button"
            >
              Penarikan
            </button>
          </div>
          
          {/* Form Setoran */}
          {activeTab === 'setoran' && (
            <form onSubmit={handleSubmit} className="simple-deposit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Jumlah Setoran (Rp)</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="100000"
                    disabled={submitting}
                  />
                </div>
                
                <div className="form-group">
                  <label>Keterangan</label>
                  <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Tabungan bulanan, dll."
                    disabled={submitting}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Bukti Pembayaran</label>
                <div className="file-input-container">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/jpeg,image/png,image/jpg"
                    ref={fileInputRef}
                    disabled={submitting}
                  />
                  <div className="file-help">Format: JPG, JPEG, PNG. Maks: 5MB</div>
                </div>
                
                {previewUrl && (
                  <div className="receipt-preview">
                    <img src={previewUrl} alt="Preview bukti pembayaran" />
                    <button 
                      type="button" 
                      className="remove-preview-btn" 
                      onClick={() => {
                        setPreviewUrl('');
                        setReceipt(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      disabled={submitting}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={submitting}
                >
                  {submitting ? 'Mengirim...' : 'Kirim Setoran'}
                </button>
              </div>
            </form>
          )}
          
          {/* Form Penarikan */}
          {activeTab === 'penarikan' && (
            <form onSubmit={handlePenarikanSubmit} className="simple-deposit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Jumlah Penarikan (Rp)</label>
                  <input 
                    type="number" 
                    value={jumlahPenarikan} 
                    onChange={(e) => setJumlahPenarikan(e.target.value)} 
                    placeholder="100000"
                    disabled={submitting}
                    max={totalSavings}
                  />
                  <div className="balance-info">Saldo tersedia: {formatCurrency(totalSavings)}</div>
                </div>
                
                <div className="form-group">
                  <label>Keterangan</label>
                  <input 
                    type="text" 
                    value={keteranganPenarikan} 
                    onChange={(e) => setKeteranganPenarikan(e.target.value)} 
                    placeholder="Tujuan penarikan dana"
                    disabled={submitting}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn withdraw-btn" 
                  disabled={submitting || totalSavings <= 0}
                >
                  {submitting ? 'Mengirim...' : 'Ajukan Penarikan'}
                </button>
                
                {totalSavings <= 0 && (
                  <div className="form-error">Anda tidak memiliki saldo yang cukup untuk melakukan penarikan.</div>
                )}
              </div>
            </form>
          )}
        </div>
        
        <div className="simple-savings-history">
          <h2>Riwayat Transaksi</h2>
          
          <div className="table-container">
            <table className="simple-savings-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Jumlah</th>
                  <th>Jenis</th>
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
                      <td>{item.jenis_transaksi === 'penarikan' ? 'Penarikan' : 'Setoran'}</td>
                      <td className={`status-cell status-${item.status}`}>
                        {item.status === 'approved' ? 'Disetujui' : 'Menunggu'}
                      </td>
                      <td>
                        <button className="view-receipt-btn" onClick={() => window.open(item.receiptUrl, '_blank')}>
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">Belum ada data transaksi</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="simple-copyright">
          &copy; {new Date().getFullYear()} PERGIMMIKAN
        </div>
      </div>
    </div>
  );
}
