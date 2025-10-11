# 🗺️ INTERACTIVE JOURNEY MAP - SETUP GUIDE

## ✅ YANG SUDAH DIBUAT:

### **Backend:**
- ✅ Database migration (latitude, longitude, destination_type)
- ✅ Journey model methods (findAllWithCoordinates, getMapStatistics)
- ✅ API endpoints (/api/journeys/map/data, /api/journeys/map/statistics)

### **Frontend:** (Next step)
- 🔄 Install Leaflet.js
- 🔄 Create InteractiveMap component
- 🔄 Add markers & popups
- 🔄 Add filters

---

## 🚀 SETUP INSTRUCTIONS:

### **Step 1: Run Database Migration**
```bash
cd server
node run-map-migration.js
```

### **Step 2: Install Leaflet (Frontend)**
```bash
cd frontend
npm install leaflet react-leaflet
```

### **Step 3: Update Journey Data (Manual)**
Setelah migration, update journey dengan coordinates:

```sql
-- Example: Gunung Semeru
UPDATE journey_years 
SET latitude = -8.1077, 
    longitude = 112.9225, 
    destination_type = 'gunung' 
WHERE location LIKE '%Semeru%';

-- Example: Pantai Kuta Bali
UPDATE journey_years 
SET latitude = -8.7184, 
    longitude = 115.1686, 
    destination_type = 'pantai' 
WHERE location LIKE '%Kuta%';
```

---

## 📍 DESTINATION TYPES:

```
gunung      - 🏔️ Gunung/Mountain
pantai      - 🏖️ Pantai/Beach
hutan       - 🌲 Hutan/Forest
air_terjun  - 💧 Air Terjun/Waterfall
gua         - 🕳️ Gua/Cave
danau       - 🏞️ Danau/Lake
```

---

## 🗺️ POPULAR INDONESIA COORDINATES:

### **Gunung (Mountains):**
```
Semeru:    -8.1077, 112.9225
Rinjani:   -8.4114, 116.4571
Bromo:     -7.9425, 112.9533
Merapi:    -7.5407, 110.4456
Kerinci:   -1.6969, 101.2644
```

### **Pantai (Beaches):**
```
Kuta Bali:       -8.7184, 115.1686
Nusa Dua:        -8.8008, 115.2304
Senggigi:        -8.4906, 116.0422
Raja Ampat:      -0.2340, 130.5160
Derawan:         2.2833, 118.2500
```

### **Air Terjun (Waterfalls):**
```
Tumpak Sewu:     -8.2333, 112.9167
Madakaripura:    -7.8833, 112.9667
Coban Rondo:     -7.8833, 112.5333
```

---

## 🎯 API ENDPOINTS:

### **Get Map Data:**
```
GET /api/journeys/map/data

Response:
[
  {
    id: 1,
    year: 2023,
    title: "Pendakian Semeru",
    location: "Gunung Semeru",
    latitude: -8.1077,
    longitude: 112.9225,
    destination_type: "gunung",
    photos_count: 15,
    sample_photos: [...]
  }
]
```

### **Get Map Statistics:**
```
GET /api/journeys/map/statistics

Response:
{
  summary: {
    total_destinations: 15,
    total_mountains: 8,
    total_beaches: 5,
    total_forests: 2
  },
  type_distribution: [...],
  top_locations: [...]
}
```

---

## 📦 NEXT STEPS:

1. ✅ Run migration: `node run-map-migration.js`
2. ✅ Install Leaflet: `npm install leaflet react-leaflet`
3. ✅ Update journey data with coordinates
4. 🔄 Create InteractiveMap component (I'll do this)
5. 🔄 Add to navigation menu
6. 🔄 Test & enjoy!

---

**Ready to continue? Let me know when migration is done!** 🚀
