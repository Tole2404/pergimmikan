# 🏔️ TRIP CALCULATOR - INDONESIA MOUNTAIN EDITION

## 📋 OVERVIEW

**Trip Calculator** adalah sistem comprehensive untuk planning trip pendakian gunung di Indonesia. Sistem ini menghitung **total biaya** dari titik keberangkatan hingga kembali, termasuk:

✅ **Transportasi** (pesawat, kereta, bus, travel, lokal)  
✅ **Permit & Fees** (tiket masuk, SIMAKSI, parkir)  
✅ **Guide & Porter**  
✅ **Rental Equipment** (carrier, tenda, sleeping bag, dll)  
✅ **Food & Consumption**  
✅ **Accommodation** (homestay, hotel)  
✅ **Miscellaneous** (10% buffer)

---

## 🗄️ DATABASE STRUCTURE

### **1. Mountains Master**
```sql
- id, name, province, city, elevation
- difficulty (Mudah, Sedang, Sulit, Sangat Sulit)
- location (lat, long, basecamp)
- typical_duration_days
- best_months
- fees (entrance, simaksi, parking, porter, guide)
```

### **2. Transportation Routes**
```sql
- from_city → mountain
- transport_type (Pesawat, Kereta, Bus, Travel, Mobil)
- duration, distance, cost_min, cost_max
- schedule, booking info
```

### **3. Local Transportation**
```sql
- Airport/Station → Basecamp
- Ojek, Angkot, Travel, Sewa Mobil
- cost_per_person
```

### **4. Equipment Rental**
```sql
- Rental location near mountain
- Items (carrier, tenda, sleeping bag, etc)
- price_per_day, deposit
```

### **5. Food Estimates**
```sql
- Per person per day
- breakfast, lunch, dinner, snack, water
- food_availability notes
```

### **6. Accommodations**
```sql
- Hotels, Homestays near basecamp
- price_per_night, facilities
- contact, rating
```

### **7. Equipment Checklist**
```sql
- Category (Pakaian, Tidur, Masak, dll)
- Priority (Wajib, Penting, Opsional)
- can_be_rented, typical prices
```

### **8. Trip Calculations (User History)**
```sql
- Save user calculations
- cost_breakdown (JSON)
- total_cost, cost_per_person
```

---

## 🚀 API ENDPOINTS

### **Master Data:**

```
GET /api/trip-calculator/mountains
GET /api/trip-calculator/mountains/:id
GET /api/trip-calculator/cities
GET /api/trip-calculator/provinces
```

### **Trip Planning Data:**

```
GET /api/trip-calculator/transportation/:mountainId?fromCity=Jakarta
GET /api/trip-calculator/local-transport/:mountainId
GET /api/trip-calculator/equipment/:mountainId
GET /api/trip-calculator/food/:mountainId/:days
GET /api/trip-calculator/accommodations/:mountainId
GET /api/trip-calculator/checklist?difficulty=Sedang
```

### **Calculate:**

```
POST /api/trip-calculator/calculate
Body: {
  mountainId: 1,
  fromCity: "Jakarta",
  numPeople: 4,
  durationDays: 3,
  transportType: "Pesawat",
  needGuide: true,
  needPorter: true,
  needEquipmentRental: true,
  equipmentItems: ["Carrier 60L", "Tenda 2-3 orang", "Sleeping Bag"],
  needAccommodation: true,
  accommodationNights: 1
}

Response: {
  calculationId: 123,
  mountain: { id: 1, name: "Gunung Rinjani", province: "NTB" },
  tripDetails: { ... },
  breakdown: {
    transportation: { main: 1000000, local: 600000 },
    permits: 600000,
    guide: 1200000,
    porter: 2100000,
    equipment: 1200000,
    food: 840000,
    accommodation: 200000,
    miscellaneous: 774000
  },
  totalCost: 8514000,
  costPerPerson: 2128500,
  currency: "IDR"
}
```

---

## 📊 SAMPLE DATA INCLUDED

### **10 Popular Mountains:**

1. **Gunung Rinjani** (NTB) - 3726 mdpl - Sulit
2. **Gunung Semeru** (Jawa Timur) - 3676 mdpl - Sangat Sulit
3. **Gunung Merapi** (Yogyakarta) - 2930 mdpl - Sedang
4. **Gunung Bromo** (Jawa Timur) - 2329 mdpl - Mudah
5. **Gunung Merbabu** (Jawa Tengah) - 3145 mdpl - Sedang
6. **Gunung Lawu** (Jawa Tengah) - 3265 mdpl - Sedang
7. **Gunung Sindoro** (Jawa Tengah) - 3153 mdpl - Sulit
8. **Gunung Sumbing** (Jawa Tengah) - 3371 mdpl - Sulit
9. **Gunung Prau** (Jawa Tengah) - 2565 mdpl - Mudah
10. **Gunung Gede Pangrango** (Jawa Barat) - 2958 mdpl - Sedang

### **Transportation from Major Cities:**
- Jakarta, Bandung, Surabaya, Yogyakarta, Malang

### **Complete Equipment Checklist:**
- 20+ items with rental prices

---

## 🎯 INSTALLATION

### **1. Create Database Tables:**

```bash
# Run schema
mysql -u root -p pergimmikan < database/trip-calculator-schema.sql

# Insert sample data
mysql -u root -p pergimmikan < database/trip-calculator-sample-data.sql
```

### **2. Restart Server:**

```bash
cd server
npm start
```

### **3. Test API:**

```bash
# Get all mountains
curl http://localhost:5000/api/trip-calculator/mountains

# Get Rinjani detail
curl http://localhost:5000/api/trip-calculator/mountains/1

# Calculate trip
curl -X POST http://localhost:5000/api/trip-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "mountainId": 1,
    "fromCity": "Jakarta",
    "numPeople": 4,
    "durationDays": 3,
    "transportType": "Pesawat",
    "needGuide": true,
    "needPorter": true
  }'
```

---

## 💡 FRONTEND FEATURES TO BUILD

### **1. Mountain Selection Page**
```
- Grid/List of mountains
- Filter by province, difficulty
- Search by name
- Show: photo, name, elevation, difficulty, typical cost
```

### **2. Trip Planning Form**
```
Step 1: Select Mountain
Step 2: Departure City & Transportation
Step 3: Group Size & Duration
Step 4: Services (Guide, Porter, Equipment)
Step 5: Accommodation
Step 6: Calculate & Review
```

### **3. Cost Breakdown Display**
```
- Visual breakdown (pie chart / bar chart)
- Itemized list
- Cost per person
- Total cost
- Download PDF / Share WhatsApp
```

### **4. Equipment Checklist**
```
- Interactive checklist
- Mark owned items
- Calculate rental cost for missing items
- Print/Download checklist
```

### **5. Itinerary Planner**
```
- Day-by-day schedule
- Estimated time per checkpoint
- Map with route
- Weather forecast
```

### **6. Comparison Tool**
```
- Compare 2-3 mountains
- Side-by-side cost comparison
- Difficulty, duration, highlights
- Recommendation based on budget/fitness
```

---

## 🎨 UI/UX RECOMMENDATIONS

### **Design:**
- Modern, clean, mobile-first
- Use mountain imagery
- Color scheme: Green (#2c5f2d), Blue, White
- Icons for each category

### **Components:**
- **MountainCard** - Display mountain info
- **CostBreakdown** - Pie chart + itemized list
- **TransportSelector** - Radio buttons with details
- **EquipmentSelector** - Checkbox list with images
- **CostSummary** - Sticky bottom bar with total

### **User Flow:**
```
1. Browse Mountains → 2. Select Mountain → 3. Plan Trip → 
4. Calculate Cost → 5. Review Breakdown → 6. Book/Contact
```

---

## 📱 MOBILE FEATURES

### **Progressive Web App (PWA):**
- Offline mode (save calculations)
- Add to home screen
- Push notifications (weather alerts)

### **WhatsApp Integration:**
```javascript
// Share calculation via WhatsApp
const shareViaWhatsApp = (calculation) => {
  const message = `
🏔️ Trip ke ${calculation.mountain.name}
👥 ${calculation.tripDetails.numPeople} orang
📅 ${calculation.tripDetails.durationDays} hari
💰 Total: Rp ${calculation.totalCost.toLocaleString()}
💵 Per orang: Rp ${calculation.costPerPerson.toLocaleString()}

Booking: wa.me/6281234567890
  `;
  
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
};
```

---

## 🔥 VIRAL FEATURES

### **1. Trip Cost Comparison**
"Rinjani vs Semeru - Mana yang Lebih Murah?"

### **2. Budget Calculator**
"Budget 2 Juta, Bisa Naik Gunung Apa?"

### **3. Group Discount**
"Makin Banyak Makin Hemat! Lihat Selisihnya"

### **4. Seasonal Pricing**
"Best Time to Climb - Save up to 30%!"

### **5. Social Proof**
"1,234 orang sudah pakai calculator ini bulan ini"

---

## 📊 ANALYTICS TO TRACK

```javascript
// Track popular mountains
- Most calculated mountains
- Average group size
- Popular departure cities
- Peak booking months

// User behavior
- Completion rate (start → calculate)
- Average time on calculator
- Most selected services (guide/porter/equipment)
- Conversion to booking
```

---

## 🚀 NEXT STEPS

### **Phase 1: MVP (1 week)**
1. ✅ Database schema
2. ✅ API endpoints
3. ⏳ Basic frontend (mountain list + calculator)
4. ⏳ Cost breakdown display

### **Phase 2: Enhanced (2 weeks)**
5. ⏳ Equipment checklist
6. ⏳ Comparison tool
7. ⏳ WhatsApp integration
8. ⏳ Save & share calculations

### **Phase 3: Advanced (1 month)**
9. ⏳ Itinerary planner with map
10. ⏳ Weather integration
11. ⏳ Booking system
12. ⏳ User reviews & ratings

---

## 💰 MONETIZATION

### **Revenue Streams:**
1. **Booking Commission** - 10-15% from trips
2. **Equipment Rental** - Partner commission
3. **Premium Features** - Advanced planning tools
4. **Ads** - Outdoor gear brands
5. **Affiliate** - Hotel, transportation bookings

---

## 🎯 SUCCESS METRICS

**Target Month 1:**
- 1,000 calculations
- 50 bookings
- 100,000 page views

**Target Month 3:**
- 5,000 calculations/month
- 250 bookings/month
- 500,000 page views/month

**Target Month 6:**
- 10,000 calculations/month
- 500 bookings/month
- 1,000,000 page views/month

---

## 📞 SUPPORT

For questions or issues:
- Email: support@pergimmikan.site
- WhatsApp: +62 812-3456-7890
- GitHub: [Issues](https://github.com/pergimmikan/issues)

---

**🎊 READY TO DOMINATE MOUNTAIN TRIP PLANNING IN INDONESIA!** 🚀
