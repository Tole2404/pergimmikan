# 🗺️ FIX LEAFLET INSTALLATION

## ❌ Problem:
```
react-leaflet@5.0.0 requires react@^19.0.0
Your project has react@18.3.1
```

## ✅ Solution:

### **Option 1: Install Compatible Version** (RECOMMENDED)
```bash
cd frontend
npm install leaflet react-leaflet@4.2.1 --legacy-peer-deps
```

### **Option 2: Force Install Latest**
```bash
cd frontend
npm install leaflet react-leaflet --force
```

### **Option 3: Use Legacy Peer Deps**
```bash
cd frontend
npm install leaflet react-leaflet --legacy-peer-deps
```

---

## 🎯 RECOMMENDED COMMAND:

```bash
npm install leaflet react-leaflet@4.2.1 --legacy-peer-deps
```

This will install:
- `leaflet` (latest)
- `react-leaflet@4.2.1` (compatible with React 18)

---

## 📦 After Installation:

Migration is also fixed! Run:
```bash
cd server
node run-map-migration.js
```

Then we can continue with the map component! 🗺️
