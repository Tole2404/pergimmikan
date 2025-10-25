# 🚀 SETUP TRIP CALCULATOR - QUICK START

## ✅ WHAT'S DONE:

1. ✅ **Backend API** - Complete with 12 endpoints
2. ✅ **Frontend Component** - Mountain Trip Calculator
3. ✅ **Database Schema** - 9 tables
4. ✅ **Sample Data** - 10 mountains, routes, equipment

---

## 📋 INSTALLATION STEPS:

### **Step 1: Create Database Tables (5 minutes)**

```bash
# Open phpMyAdmin or MySQL command line
# Run these SQL files:

# 1. Create tables
mysql -u root -p pergimmikan < database/trip-calculator-schema.sql

# 2. Insert sample data
mysql -u root -p pergimmikan < database/trip-calculator-sample-data.sql
```

**Or via phpMyAdmin:**
```
1. Open phpMyAdmin
2. Select database 'pergimmikan'
3. Go to SQL tab
4. Copy & paste content from trip-calculator-schema.sql
5. Click "Go"
6. Repeat for trip-calculator-sample-data.sql
```

---

### **Step 2: Restart Server**

```bash
cd server
# Stop server (Ctrl+C if running)
npm start
```

---

### **Step 3: Test API**

```bash
# Test mountains endpoint
curl http://localhost:5000/api/trip-calculator/mountains

# Should return JSON with 10 mountains
```

---

### **Step 4: Test Frontend**

```
1. Open browser: http://localhost:5173/next
2. Should see: "🏔️ Mountain Trip Calculator"
3. Select mountain (e.g., Rinjani)
4. Select city (e.g., Jakarta)
5. Click "Hitung Total Biaya"
6. See cost breakdown!
```

---

## 🎯 FEATURES:

### **User Flow:**

```
1. Filter mountains by province/difficulty
2. Select mountain → Auto-fill duration
3. Select departure city
4. Set group size & duration
5. Select transportation (Pesawat, Kereta, Bus)
6. Choose services (Guide, Porter, Equipment, Accommodation)
7. Calculate → See detailed breakdown
8. Share via WhatsApp
```

### **Cost Breakdown Includes:**

- ✈️ **Transportasi Utama** (Jakarta → Lombok)
- 🚗 **Transportasi Lokal** (Airport → Basecamp)
- 🎫 **Tiket & Permit** (Entrance, SIMAKSI, Parking)
- 👨‍🏫 **Guide** (Optional)
- 🎒 **Porter** (Optional)
- 🏕️ **Sewa Peralatan** (Carrier, Tenda, Sleeping Bag)
- 🍜 **Makanan & Konsumsi** (Per person per day)
- 🏠 **Penginapan** (Homestay/Hotel)
- 💼 **Lain-lain** (10% buffer)

---

## 📊 SAMPLE DATA INCLUDED:

### **10 Mountains:**
1. Gunung Rinjani (3726m) - Sulit
2. Gunung Semeru (3676m) - Sangat Sulit
3. Gunung Merapi (2930m) - Sedang
4. Gunung Bromo (2329m) - Mudah
5. Gunung Merbabu (3145m) - Sedang
6. Gunung Lawu (3265m) - Sedang
7. Gunung Sindoro (3153m) - Sulit
8. Gunung Sumbing (3371m) - Sulit
9. Gunung Prau (2565m) - Mudah
10. Gunung Gede Pangrango (2958m) - Sedang

### **Transportation Routes:**
- Jakarta → Rinjani (Pesawat, Bus+Ferry)
- Jakarta → Semeru (Kereta, Bus)
- Jakarta → Merapi (Kereta, Pesawat)
- Surabaya → Rinjani (Pesawat)
- Surabaya → Semeru (Bus)
- Bandung → Merapi (Kereta)

### **Equipment Rental:**
- Carrier 60L: Rp 50,000/hari
- Tenda 2-3 orang: Rp 50,000/hari
- Sleeping Bag: Rp 30,000/hari
- Matras: Rp 15,000/hari
- Kompor + Gas: Rp 30,000/hari
- Headlamp: Rp 15,000/hari

---

## 🧪 TEST CALCULATION EXAMPLE:

**Trip: Jakarta → Rinjani (4 orang, 3 hari)**

**Input:**
- Mountain: Gunung Rinjani
- From: Jakarta
- People: 4
- Duration: 3 days
- Transport: Pesawat
- Guide: Yes
- Porter: Yes
- Equipment: Carrier, Tenda, Sleeping Bag
- Accommodation: 1 night

**Expected Output:**
```json
{
  "totalCost": 8514000,
  "costPerPerson": 2128500,
  "breakdown": {
    "transportation": {
      "main": 4000000,
      "local": 600000
    },
    "permits": 1200000,
    "guide": 1200000,
    "porter": 2100000,
    "equipment": 1260000,
    "food": 840000,
    "accommodation": 200000,
    "miscellaneous": 774000
  }
}
```

---

## 🐛 TROUBLESHOOTING:

### **Problem 1: Mountains not showing**

**Check:**
```bash
# Test API
curl http://localhost:5000/api/trip-calculator/mountains

# If error, check:
1. Database tables created?
2. Sample data inserted?
3. Server running?
```

**Fix:**
```bash
# Re-run SQL files
mysql -u root -p pergimmikan < database/trip-calculator-schema.sql
mysql -u root -p pergimmikan < database/trip-calculator-sample-data.sql
```

---

### **Problem 2: CORS Error**

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Fix:** Check `server/src/app.js`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',  // ← Make sure this exists
  'http://localhost:3000'
];
```

---

### **Problem 3: Calculate button disabled**

**Reason:** Mountain or city not selected

**Fix:**
1. Select a mountain first
2. Select departure city
3. Button will enable

---

### **Problem 4: No transportation routes**

**Reason:** No routes for selected city

**Fix:** Add more routes in database or select different city (Jakarta, Surabaya, Bandung)

---

## 🎨 STYLING:

Current styling uses existing `Next.css`. For better styling, add:

```css
/* Add to Next.css */

.mountain-trip-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.mountains-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.mountain-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mountain-card:hover {
  border-color: #2c5f2d;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(44, 95, 45, 0.2);
}

.mountain-card.selected {
  border-color: #2c5f2d;
  background: #f0f7f0;
}

.difficulty-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.difficulty-badge.mudah {
  background: #4caf50;
  color: white;
}

.difficulty-badge.sedang {
  background: #ff9800;
  color: white;
}

.difficulty-badge.sulit {
  background: #f44336;
  color: white;
}

.difficulty-badge.sangat-sulit {
  background: #9c27b0;
  color: white;
}

.calculate-btn {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(135deg, #2c5f2d 0%, #4a8f4d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calculate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(44, 95, 45, 0.4);
}

.calculate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.result-card {
  background: linear-gradient(135deg, #2c5f2d 0%, #4a8f4d 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.result-card .amount {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.share-btn.whatsapp {
  width: 100%;
  padding: 1rem 2rem;
  background: #25D366;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-btn.whatsapp:hover {
  background: #128C7E;
  transform: translateY(-2px);
}
```

---

## 🚀 NEXT ENHANCEMENTS:

1. **Add Photos** - Mountain images
2. **Weather Integration** - Real-time weather
3. **Map Integration** - Show route on map
4. **Save Calculations** - User history
5. **Comparison Tool** - Compare 2-3 mountains
6. **Equipment Checklist** - Interactive checklist
7. **Booking Integration** - Direct booking
8. **Reviews & Ratings** - User reviews

---

## 📞 SUPPORT:

**Issues?**
- Check console for errors (F12)
- Check server logs
- Verify database tables exist
- Test API endpoints directly

**Need Help?**
- Read TRIP-CALCULATOR-README.md
- Check API documentation
- Test with curl/Postman

---

**🎉 READY TO USE! Visit: http://localhost:5173/next** 🚀
