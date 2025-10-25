# 📊 GOOGLE ANALYTICS SETUP GUIDE

## 🎯 CARA SETUP GOOGLE ANALYTICS:

### **Step 1: Buat Google Analytics Account**

1. **Buka Google Analytics:**
   ```
   https://analytics.google.com/
   ```

2. **Sign in** dengan Google Account

3. **Klik "Start measuring"**

4. **Isi Account Details:**
   - Account name: `PERGIMMIKAN`
   - Check semua boxes (recommended)
   - Click "Next"

---

### **Step 2: Setup Property**

1. **Property Details:**
   - Property name: `PERGIMMIKAN Website`
   - Reporting time zone: `(GMT+07:00) Jakarta`
   - Currency: `Indonesian Rupiah (IDR)`
   - Click "Next"

2. **Business Information:**
   - Industry: `Travel & Tourism` atau `Community & Social`
   - Business size: `Small (1-10 employees)`
   - How you plan to use: Check `Examine user behavior`
   - Click "Create"

3. **Accept Terms of Service**
   - Check boxes
   - Click "I Accept"

---

### **Step 3: Setup Data Stream**

1. **Choose Platform:**
   - Click **"Web"**

2. **Setup Web Stream:**
   - Website URL: `https://pergimmikan.site`
   - Stream name: `PERGIMMIKAN Main Site`
   - Click "Create stream"

3. **Copy Measurement ID:**
   ```
   G-XXXXXXXXXX
   ```
   ⚠️ **PENTING:** Save ID ini!

---

### **Step 4: Install Tracking Code**

1. **Ganti di `index.html`:**
   ```html
   <!-- Ganti G-XXXXXXXXXX dengan ID Anda -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX', {
       'send_page_view': true,
       'anonymize_ip': true
     });
   </script>
   ```

2. **Example dengan ID asli:**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-ABC123DEF4', {
       'send_page_view': true,
       'anonymize_ip': true
     });
   </script>
   ```

---

## 📊 DATA YANG BISA DILACAK:

### **1. Real-time Data:**
- ✅ Jumlah visitor saat ini
- ✅ Halaman yang sedang dibuka
- ✅ Lokasi visitor (negara/kota)
- ✅ Device yang digunakan (mobile/desktop)

### **2. Audience Data:**
- ✅ Total users (unique visitors)
- ✅ New vs Returning users
- ✅ Sessions (kunjungan)
- ✅ Pageviews
- ✅ Bounce rate
- ✅ Average session duration

### **3. Demographics:**
- ✅ Age range
- ✅ Gender
- ✅ Interests
- ✅ Location (country, city)
- ✅ Language

### **4. Technology:**
- ✅ Browser (Chrome, Firefox, Safari)
- ✅ Operating System (Windows, Mac, Android, iOS)
- ✅ Device (Desktop, Mobile, Tablet)
- ✅ Screen resolution

### **5. Behavior:**
- ✅ Most visited pages
- ✅ Landing pages
- ✅ Exit pages
- ✅ User flow
- ✅ Time on page

### **6. Acquisition:**
- ✅ Traffic sources (Direct, Social, Referral)
- ✅ Social media traffic
- ✅ Search engines
- ✅ Campaigns

---

## 🎨 CUSTOM EVENTS (Optional):

### **Track Button Clicks:**
```javascript
// Example: Track "Share Journey" button
gtag('event', 'share_journey', {
  'event_category': 'engagement',
  'event_label': 'Journey ID: 1',
  'value': 1
});
```

### **Track Page Views:**
```javascript
// Automatic with SPA (React Router)
gtag('event', 'page_view', {
  page_title: 'Journey Detail',
  page_location: window.location.href,
  page_path: window.location.pathname
});
```

### **Track Downloads:**
```javascript
// Example: Track image download
gtag('event', 'download', {
  'event_category': 'engagement',
  'event_label': 'Image: journey-1.jpg',
  'value': 1
});
```

### **Track Form Submissions:**
```javascript
// Example: Track comment submission
gtag('event', 'submit_comment', {
  'event_category': 'engagement',
  'event_label': 'Journey ID: 1',
  'value': 1
});
```

---

## 🔧 IMPLEMENTASI CUSTOM EVENTS:

### **1. Buat Analytics Helper:**

**File: `src/utils/analytics.js`**
```javascript
// Google Analytics Helper
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackPageView = (path, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: window.location.href,
      page_path: path
    });
  }
};

export const trackShare = (platform, content) => {
  trackEvent('share', {
    method: platform,
    content_type: 'journey',
    item_id: content
  });
};

export const trackDownload = (fileName) => {
  trackEvent('download', {
    file_name: fileName
  });
};

export const trackComment = (journeyId) => {
  trackEvent('submit_comment', {
    journey_id: journeyId
  });
};
```

---

### **2. Track di ShareButton Component:**

```javascript
import { trackShare } from '../../utils/analytics';

const handleShare = (platform) => {
  // Share logic...
  
  // Track event
  trackShare(platform, journeyId);
};
```

---

### **3. Track di React Router:**

```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);
  
  return <Routes>...</Routes>;
}
```

---

## 📱 CARA LIHAT DATA DI GOOGLE ANALYTICS:

### **1. Real-time Report:**
```
Analytics → Reports → Realtime
```

**Lihat:**
- Visitor saat ini
- Halaman yang dibuka
- Lokasi visitor
- Device yang digunakan

---

### **2. Audience Report:**
```
Analytics → Reports → Life cycle → Acquisition → User acquisition
```

**Lihat:**
- Total users
- New vs returning
- Sessions
- Engagement rate

---

### **3. Pages Report:**
```
Analytics → Reports → Engagement → Pages and screens
```

**Lihat:**
- Most visited pages
- Pageviews per page
- Average time on page
- Bounce rate per page

---

### **4. Traffic Sources:**
```
Analytics → Reports → Life cycle → Acquisition → Traffic acquisition
```

**Lihat:**
- Direct traffic
- Social media traffic
- Referral traffic
- Search engine traffic

---

### **5. Demographics:**
```
Analytics → Reports → User → Demographics
```

**Lihat:**
- Age distribution
- Gender distribution
- Location (country/city)

---

## 🎯 METRICS YANG PENTING:

### **1. Users:**
- **Total Users:** Jumlah unique visitors
- **New Users:** First-time visitors
- **Returning Users:** Repeat visitors

### **2. Engagement:**
- **Sessions:** Total kunjungan
- **Pageviews:** Total halaman dibuka
- **Pages per Session:** Rata-rata halaman per kunjungan
- **Average Session Duration:** Durasi rata-rata kunjungan

### **3. Behavior:**
- **Bounce Rate:** % visitor yang langsung keluar
- **Exit Rate:** % visitor yang keluar dari halaman tertentu

### **4. Conversion:**
- **Goal Completions:** Target tercapai (e.g., submit comment)
- **Conversion Rate:** % visitor yang complete goal

---

## 🔍 CARA ANALISIS DATA:

### **Pertanyaan yang Bisa Dijawab:**

1. **Berapa banyak visitor hari ini?**
   - Realtime → Overview

2. **Halaman mana yang paling populer?**
   - Engagement → Pages and screens

3. **Dari mana visitor datang?**
   - Acquisition → Traffic acquisition

4. **Device apa yang paling banyak digunakan?**
   - Tech → Tech details

5. **Berapa lama visitor stay di website?**
   - Engagement → Overview

6. **Journey mana yang paling banyak dibaca?**
   - Engagement → Pages and screens
   - Filter: `/journey/`

7. **Apakah visitor share journey?**
   - Events → Custom events
   - Event name: `share`

---

## 📊 DASHBOARD EXAMPLE:

### **Daily Report:**
```
📊 PERGIMMIKAN Analytics - Today

👥 Visitors: 150 users
📄 Pageviews: 450 pages
⏱️ Avg. Session: 3m 45s
📱 Mobile: 65% | Desktop: 35%

🔥 Top Pages:
1. /journey/1 - 50 views
2. / (Home) - 45 views
3. /gallery - 30 views
4. /team - 25 views

🌍 Top Countries:
1. Indonesia - 140 users
2. Malaysia - 5 users
3. Singapore - 3 users

📱 Top Devices:
1. Mobile - 98 users
2. Desktop - 52 users
```

---

## ⚙️ ADVANCED SETUP (Optional):

### **1. Enhanced Measurement:**
Enable di GA4 settings:
- ✅ Page views
- ✅ Scrolls
- ✅ Outbound clicks
- ✅ Site search
- ✅ Video engagement
- ✅ File downloads

### **2. Custom Dimensions:**
Track custom data:
- User role (admin/member)
- Journey category
- Event type

### **3. Goals/Conversions:**
Set conversion events:
- Submit comment
- Share journey
- Download image
- View journey detail

---

## 🔒 PRIVACY & GDPR:

### **Anonymize IP:**
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true
});
```

### **Cookie Consent (Optional):**
```javascript
// Only load GA after user consent
if (userConsent) {
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
}
```

---

## 🧪 TEST TRACKING:

### **1. Test di Browser:**
1. Buka website
2. Open DevTools (F12)
3. Console tab
4. Check for GA messages

### **2. Test di GA Real-time:**
1. Buka GA dashboard
2. Go to Realtime report
3. Visit your website
4. Should see yourself in real-time!

### **3. Test Custom Events:**
```javascript
// Console
gtag('event', 'test_event', {
  'event_category': 'test',
  'event_label': 'testing'
});
```

Check in GA → Events → test_event

---

## ✅ SETUP CHECKLIST:

- [ ] Create Google Analytics account
- [ ] Create property for website
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add gtag code to index.html
- [ ] Replace placeholder ID with real ID
- [ ] Deploy to production
- [ ] Test in real-time report
- [ ] Verify tracking works
- [ ] Setup custom events (optional)
- [ ] Create custom dashboard (optional)

---

## 🎉 HASIL AKHIR:

Setelah setup, Anda bisa:

✅ **Lihat visitor real-time**
✅ **Track halaman populer**
✅ **Analisis traffic sources**
✅ **Monitor engagement**
✅ **Understand user behavior**
✅ **Make data-driven decisions**

---

## 📝 NEXT STEPS:

1. **Get Measurement ID dari Google Analytics**
2. **Replace `G-XXXXXXXXXX` di index.html**
3. **Deploy ke production**
4. **Test tracking**
5. **Monitor data daily**

---

**🎯 TRACKING SUDAH SIAP!**

**Get your GA ID:**
https://analytics.google.com/

**Replace in:** `frontend/index.html` line 62 & 67
