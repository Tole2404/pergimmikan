# 🚀 CPANEL NODEJS - QUICK GUIDE

## ❌ JANGAN PAKAI SSH!

```bash
# ❌ SALAH - Jangan ini!
ssh dinq6531@pergimmikan.site
npm install  # ← ERROR!
```

**Error:**
```
CloudLinux NodeJS Selector demands to store node modules 
in separate folder (virtual environment)
```

---

## ✅ PAKAI CPANEL!

### **5 LANGKAH MUDAH:**

```
1. Login cPanel
   → https://pergimmikan.site:2083
   → Username: dinq6531
   → Password: [your password]

2. Buka NodeJS Selector
   → Scroll ke "SOFTWARE"
   → Click "Setup Node.js App"

3. Pilih App
   → Click "apipergimmikan"

4. Install Dependencies
   → Click "Run NPM Install"
   → Tunggu 1-2 menit

5. Restart App
   → Click "Restart"
   → Done! ✅
```

---

## 📸 VISUAL GUIDE:

### **Step 1: cPanel Login**
```
┌──────────────────────────────────┐
│  cPanel Login                    │
├──────────────────────────────────┤
│  Username: [dinq6531        ]    │
│  Password: [**********      ]    │
│                                  │
│  [Log in]                        │
└──────────────────────────────────┘
```

---

### **Step 2: Find NodeJS Selector**
```
cPanel Dashboard
├── FILES
├── DATABASES
├── SOFTWARE
│   ├── Select PHP Version
│   ├── Setup Python App
│   ├── Setup Ruby App
│   └── Setup Node.js App  ← CLICK HERE!
└── ADVANCED
```

---

### **Step 3: Your App**
```
┌────────────────────────────────────┐
│ Setup Node.js App                  │
├────────────────────────────────────┤
│                                    │
│ ┌────────────────────────────────┐ │
│ │ apipergimmikan              ●  │ │ ← CLICK!
│ │ Node.js: 22.18.0               │ │
│ │ https://apiv1.pergimmikan.site │ │
│ └────────────────────────────────┘ │
│                                    │
└────────────────────────────────────┘
```

---

### **Step 4: Run NPM Install**
```
┌────────────────────────────────────┐
│ Application: apipergimmikan        │
├────────────────────────────────────┤
│ Node.js version: 22.18.0           │
│ Status: Running ●                  │
│                                    │
│ Detected configuration files:      │
│ ✓ package.json                     │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ [Run NPM Install]              │ │ ← CLICK!
│ │ [Run NPM Update]               │ │
│ └────────────────────────────────┘ │
│                                    │
│ Installing... ████████░░ 80%       │
└────────────────────────────────────┘
```

---

### **Step 5: Restart**
```
┌────────────────────────────────────┐
│ Installation complete! ✓           │
│                                    │
│ [Restart App]  ← CLICK!            │
└────────────────────────────────────┘

↓

┌────────────────────────────────────┐
│ Status: Running ●                  │
│ ✅ App restarted successfully!     │
└────────────────────────────────────┘
```

---

## 🧪 TEST:

```
Open browser:
https://apiv1.pergimmikan.site/api/journeys

Should see:
{
  "journeys": [...],
  "total": 10
}

✅ SUCCESS!
```

---

## 🔄 DEPLOYMENT WORKFLOW:

### **Every time you update code:**

```
1. Local
   ├── Make changes
   ├── Git commit
   └── Git push

2. Server (via cPanel File Manager or SSH)
   ├── Navigate to /home/dinq6531/apipergimmikan
   └── Git pull origin main

3. cPanel NodeJS Selector
   ├── Open Setup Node.js App
   ├── Click apipergimmikan
   ├── Click "Run NPM Install" (if package.json changed)
   └── Click "Restart"

4. Test
   └── https://apiv1.pergimmikan.site/api/journeys
```

---

## ⚡ QUICK TIPS:

### **When to Run NPM Install:**
✅ After adding new dependencies
✅ After updating package.json
✅ After first deployment
✅ When getting "Cannot find module" error

### **When to Restart:**
✅ After npm install
✅ After code changes
✅ After .env changes
✅ When app crashes

---

## 🔍 TROUBLESHOOTING:

### **Problem: Button not working**
```
Solution:
1. Refresh cPanel page
2. Try again
3. Or use Terminal method (see full guide)
```

### **Problem: Installation stuck**
```
Solution:
1. Wait 5 minutes
2. If still stuck, click "Stop App"
3. Wait 10 seconds
4. Click "Start App"
5. Try "Run NPM Install" again
```

### **Problem: App won't start**
```
Solution:
1. Click "View Logs" in NodeJS Selector
2. Check error message
3. Fix error in code
4. Git push
5. Git pull on server
6. Restart app
```

---

## 📋 CHECKLIST:

Before deploying:
- [ ] Code tested locally
- [ ] Git committed and pushed
- [ ] .env variables set in cPanel

Deployment:
- [ ] Git pull on server
- [ ] Run NPM Install (if needed)
- [ ] Restart app
- [ ] Test API endpoints

After deployment:
- [ ] Check app status (Running ●)
- [ ] Test main endpoints
- [ ] Check logs for errors

---

## 🎯 REMEMBER:

```
❌ DON'T: npm install via SSH
✅ DO:    npm install via cPanel NodeJS Selector

❌ DON'T: Create node_modules folder
✅ DO:    Let NodeJS Selector create symlink

❌ DON'T: Delete node_modules symlink
✅ DO:    Use "Run NPM Install" button
```

---

## 📞 NEED HELP?

### **Check Logs:**
```
cPanel → Setup Node.js App 
→ Click app 
→ Scroll down 
→ "View Logs"
```

### **Contact Support:**
```
cPanel → Support
→ Open ticket
→ "Need help with NodeJS app dependencies"
```

---

**🚀 THAT'S IT!**

**5 Steps:**
1. Login cPanel
2. Open NodeJS Selector
3. Click app
4. Run NPM Install
5. Restart

**Easy!** 🎉

---

## 📁 FULL DOCUMENTATION:

See: `CPANEL-NODEJS-INSTALL.md` for detailed guide

---

**✅ NOW GO TO CPANEL AND CLICK "RUN NPM INSTALL"!**
