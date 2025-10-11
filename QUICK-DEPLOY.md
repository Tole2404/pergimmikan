# ⚡ QUICK DEPLOYMENT GUIDE

## 🎯 PILIH METHOD YANG COCOK:

### **METHOD 1: cPanel Git (Paling Mudah)** ⭐ RECOMMENDED

**Setup (Sekali aja):**
1. Push code ke GitHub
2. cPanel → Git Version Control → Create
3. Clone repository
4. Set deployment path

**Update (Setiap ada perubahan):**
```bash
# Di local
git add .
git commit -m "Update feature"
git push

# Di cPanel
# Git Version Control → Manage → Update from Remote
# Done! ✅
```

---

### **METHOD 2: SSH + Script (Paling Cepat)**

**Setup (Sekali aja):**
```bash
# SSH ke server
ssh username@pergimmikan.site

# Clone repository
cd public_html
git clone https://github.com/username/pergimmikan.git

# Make update script executable
cd pergimmikan
chmod +x update.sh
```

**Update (Setiap ada perubahan):**
```bash
# Di local
./deploy.sh

# Di server (via SSH)
ssh username@pergimmikan.site
cd public_html/pergimmikan
./update.sh
```

---

### **METHOD 3: GitHub Actions (Full Auto)** 🤖

**Setup (Sekali aja):**
1. Create `.github/workflows/deploy.yml`
2. Add FTP secrets di GitHub
3. Done!

**Update (Setiap ada perubahan):**
```bash
git add .
git commit -m "Update feature"
git push

# Auto deploy! 🎉
# No need to do anything else!
```

---

## 🚀 STEP-BY-STEP: METHOD 1 (CPANEL GIT)

### **INITIAL SETUP:**

#### 1. Push ke GitHub
```bash
# Di local project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/pergimmikan.git
git push -u origin main
```

#### 2. Setup di cPanel
1. Login cPanel
2. Search "Git Version Control"
3. Click "Create"
4. Fill form:
   - **Clone URL:** `https://github.com/username/pergimmikan.git`
   - **Repository Path:** `/home/username/repositories/pergimmikan`
   - **Repository Name:** `pergimmikan`
5. Click "Create"

#### 3. Setup Deployment
1. Click "Manage" pada repository
2. Tab "Pull or Deploy"
3. **Deployment Path:** `/home/username/public_html/pergimmikan`
4. Click "Update"

#### 4. Initial Deploy
1. Click "Update from Remote"
2. Wait for completion
3. SSH to server:
   ```bash
   ssh username@pergimmikan.site
   cd public_html/pergimmikan
   
   # Install dependencies
   cd server && npm install
   cd ../frontend && npm install && npm run build
   
   # Start server
   pm2 start server/src/app.js --name pergimmikan-server
   ```

### **DAILY WORKFLOW:**

```bash
# 1. Make changes locally
# Edit files...

# 2. Commit & push
git add .
git commit -m "Add telegram feature"
git push

# 3. Deploy di cPanel
# Git Version Control → Manage → Update from Remote

# 4. SSH to server (if needed)
ssh username@pergimmikan.site
cd public_html/pergimmikan

# Run update script
./update.sh

# Or manual:
cd server && npm install
cd ../frontend && npm install && npm run build
pm2 restart pergimmikan-server
```

---

## 🚀 STEP-BY-STEP: METHOD 2 (SSH + SCRIPT)

### **INITIAL SETUP:**

```bash
# 1. SSH to server
ssh username@pergimmikan.site

# 2. Clone repository
cd public_html
git clone https://github.com/username/pergimmikan.git
cd pergimmikan

# 3. Make scripts executable
chmod +x update.sh
chmod +x deploy.sh

# 4. Install dependencies
cd server && npm install
cd ../frontend && npm install && npm run build

# 5. Start server
pm2 start server/src/app.js --name pergimmikan-server
pm2 save
pm2 startup
```

### **DAILY WORKFLOW:**

```bash
# 1. Local: Make changes & push
git add .
git commit -m "Update feature"
git push

# 2. Server: Update
ssh username@pergimmikan.site
cd public_html/pergimmikan
./update.sh

# Done! ✅
```

---

## 🚀 STEP-BY-STEP: METHOD 3 (GITHUB ACTIONS)

### **INITIAL SETUP:**

#### 1. Create Workflow File

**File: `.github/workflows/deploy.yml`**
```yaml
name: Deploy to cPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.0
      with:
        server: ftp.pergimmikan.site
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        server-dir: /public_html/pergimmikan/
```

#### 2. Add Secrets
1. GitHub → Settings → Secrets → Actions
2. Add:
   - `FTP_USERNAME`: Your cPanel username
   - `FTP_PASSWORD`: Your cPanel password

#### 3. Push
```bash
git add .github/workflows/deploy.yml
git commit -m "Add auto deploy"
git push
```

### **DAILY WORKFLOW:**

```bash
# Just push!
git add .
git commit -m "Update feature"
git push

# GitHub Actions will auto deploy! 🎉
# Check: GitHub → Actions tab
```

---

## 📋 COMPARISON

| Method | Setup | Update | Speed | Auto |
|--------|-------|--------|-------|------|
| cPanel Git | Easy | Manual | Medium | ❌ |
| SSH + Script | Medium | Manual | Fast | ❌ |
| GitHub Actions | Hard | Auto | Medium | ✅ |

**Recommendation:**
- **Pemula:** Method 1 (cPanel Git)
- **Experienced:** Method 2 (SSH + Script)
- **Pro:** Method 3 (GitHub Actions)

---

## 💡 TIPS

### **Faster Updates:**
```bash
# Create alias di local
alias deploy="git add . && git commit -m 'Update' && git push"

# Usage
deploy
```

### **Auto Restart:**
```bash
# PM2 watch mode (auto restart on file change)
pm2 start server/src/app.js --name pergimmikan-server --watch

# Or use ecosystem file
pm2 start ecosystem.config.js
```

### **Check Deployment:**
```bash
# Check server status
pm2 status

# Check logs
pm2 logs pergimmikan-server

# Check website
curl https://pergimmikan.site
```

---

## 🎉 RESULT

**Before:**
- Manual upload via FileZilla
- Upload 1000+ files
- Takes 10-30 minutes
- Error prone

**After:**
- `git push` → Done!
- Only changed files
- Takes 10-30 seconds
- Reliable

---

## 🆘 TROUBLESHOOTING

### **Git pull failed:**
```bash
# Reset local changes on server
git reset --hard origin/main
git pull
```

### **npm install failed:**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install
```

### **Build failed:**
```bash
# Check Node version
node --version  # Should be 16+

# Update Node (if needed)
nvm install 18
nvm use 18
```

### **PM2 not found:**
```bash
# Install PM2 globally
npm install -g pm2
```

---

## ✅ CHECKLIST

**After each deployment:**
- [ ] Code pushed to GitHub
- [ ] Pulled on server
- [ ] Dependencies installed
- [ ] Migrations run (if any)
- [ ] Frontend built
- [ ] Server restarted
- [ ] Website tested
- [ ] Logs checked

---

**Choose your method and start deploying! 🚀**
