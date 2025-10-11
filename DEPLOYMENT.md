# 🚀 DEPLOYMENT GUIDE - CPANEL GIT

## 📋 PREREQUISITES

- ✅ Repository GitHub/GitLab
- ✅ cPanel account dengan Git Version Control
- ✅ SSH access (optional tapi recommended)

---

## 🎯 OPTION 1: GIT VERSION CONTROL (CPANEL)

### **STEP 1: Setup Repository di GitHub**

```bash
# Di local project
cd PERGIMMIKAN

# Initialize git (jika belum)
git init

# Add remote
git remote add origin https://github.com/username/pergimmikan.git

# Commit semua changes
git add .
git commit -m "Initial commit"

# Push ke GitHub
git push -u origin main
```

### **STEP 2: Setup di cPanel**

1. **Login ke cPanel**
2. **Cari "Git Version Control"** di search bar
3. **Click "Create"**

**Form Settings:**
```
Clone URL: https://github.com/username/pergimmikan.git
Repository Path: /home/username/repositories/pergimmikan
Repository Name: pergimmikan
```

4. **Click "Create"**
5. **Wait for clone to complete**

### **STEP 3: Setup Deployment Path**

**Di Git Version Control:**
1. Click **"Manage"** pada repository
2. Scroll ke **"Pull or Deploy"** section
3. Set **Deployment Path:**
   ```
   /home/username/public_html/pergimmikan
   ```
4. Click **"Update"**

### **STEP 4: Deploy**

**Setiap kali ada update:**

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Update telegram feature"
   git push
   ```

2. **Di cPanel Git Version Control:**
   - Click **"Manage"** pada repo
   - Click **"Pull or Deploy"** tab
   - Click **"Update from Remote"**
   - ✅ Done! Auto deploy!

---

## 🎯 OPTION 2: SSH + GIT (ADVANCED)

### **STEP 1: Enable SSH di cPanel**

1. cPanel → **SSH Access**
2. **Generate SSH Key** (jika belum ada)
3. Copy **Public Key**

### **STEP 2: Add SSH Key ke GitHub**

1. GitHub → **Settings** → **SSH and GPG keys**
2. **New SSH key**
3. Paste public key dari cPanel
4. Save

### **STEP 3: Clone via SSH**

```bash
# SSH ke server
ssh username@pergimmikan.site

# Navigate to directory
cd public_html

# Clone repository
git clone git@github.com:username/pergimmikan.git

# Install dependencies
cd pergimmikan/server
npm install

cd ../frontend
npm install
npm run build
```

### **STEP 4: Update Script**

**Create update script: `update.sh`**

```bash
#!/bin/bash

echo "🔄 Pulling latest changes..."
git pull origin main

echo "📦 Installing server dependencies..."
cd server
npm install

echo "🔄 Restarting server..."
pm2 restart pergimmikan-server

echo "📦 Building frontend..."
cd ../frontend
npm install
npm run build

echo "✅ Deployment complete!"
```

**Make executable:**
```bash
chmod +x update.sh
```

**Update command:**
```bash
./update.sh
```

---

## 🎯 OPTION 3: GITHUB ACTIONS (AUTO DEPLOY)

### **Setup GitHub Actions**

**Create: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to cPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 🚀 Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.0
      with:
        server: ftp.pergimmikan.site
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        server-dir: /public_html/pergimmikan/
        exclude: |
          **/.git*
          **/.git*/**
          **/node_modules/**
          **/.env
```

**Setup Secrets:**
1. GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `FTP_USERNAME`: Your cPanel username
   - `FTP_PASSWORD`: Your cPanel password

**Now every push auto-deploys!** 🎉

---

## 🎯 OPTION 4: WEBHOOK AUTO DEPLOY

### **Create Webhook Script**

**File: `public_html/deploy.php`**

```php
<?php
// Security: Check secret token
$secret = 'YOUR_SECRET_TOKEN_HERE';
$headers = getallheaders();
$signature = isset($headers['X-Hub-Signature']) ? $headers['X-Hub-Signature'] : '';

// Verify GitHub signature
$payload = file_get_contents('php://input');
$hash = 'sha1=' . hash_hmac('sha1', $payload, $secret);

if (hash_equals($hash, $signature)) {
    // Execute git pull
    $output = shell_exec('cd /home/username/public_html/pergimmikan && git pull origin main 2>&1');
    
    // Log
    file_put_contents('deploy.log', date('Y-m-d H:i:s') . " - Deploy triggered\n" . $output . "\n\n", FILE_APPEND);
    
    echo "Deployment successful!";
} else {
    http_response_code(403);
    echo "Invalid signature";
}
?>
```

### **Setup GitHub Webhook**

1. GitHub → **Settings** → **Webhooks** → **Add webhook**
2. **Payload URL:** `https://pergimmikan.site/deploy.php`
3. **Content type:** `application/json`
4. **Secret:** `YOUR_SECRET_TOKEN_HERE`
5. **Events:** Just the push event
6. **Active:** ✅
7. Save

**Now every push auto-deploys!** 🚀

---

## 📋 RECOMMENDED WORKFLOW

### **Development:**
```bash
# Local development
git checkout develop
# Make changes
git add .
git commit -m "Add feature"
git push origin develop
```

### **Production:**
```bash
# Merge to main
git checkout main
git merge develop
git push origin main

# Auto deploy via:
# - cPanel Git (manual pull)
# - GitHub Actions (auto)
# - Webhook (auto)
```

---

## 🔧 POST-DEPLOYMENT TASKS

### **After Each Deploy:**

```bash
# SSH to server
ssh username@pergimmikan.site

# Navigate to project
cd public_html/pergimmikan

# Install dependencies (if package.json changed)
cd server && npm install
cd ../frontend && npm install

# Build frontend
cd frontend
npm run build

# Restart server
pm2 restart pergimmikan-server

# Check status
pm2 status
```

---

## 🎯 BEST PRACTICES

### **1. Use .gitignore**

```
# .gitignore
node_modules/
.env
dist/
build/
*.log
.DS_Store
```

### **2. Environment Variables**

**Never commit `.env` file!**

```bash
# On server, create .env manually
nano server/.env

# Or use cPanel File Manager
```

### **3. Database Migrations**

```bash
# After deploy, run migrations
cd server
node database/migrations/add-telegram-id.js
```

### **4. Build Frontend**

```bash
# Always build after deploy
cd frontend
npm run build
```

---

## 🚀 QUICK DEPLOYMENT CHECKLIST

- [ ] Push code to GitHub
- [ ] Pull in cPanel (or auto-deploy)
- [ ] Install dependencies (`npm install`)
- [ ] Run migrations (if any)
- [ ] Build frontend (`npm run build`)
- [ ] Restart server (`pm2 restart`)
- [ ] Check logs (`pm2 logs`)
- [ ] Test website

---

## 💡 TIPS

### **Speed Up Deployment:**

1. **Use PM2 ecosystem file:**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'pergimmikan-server',
       script: './server/src/app.js',
       watch: false,
       env: {
         NODE_ENV: 'production'
       }
     }]
   }
   ```

2. **Create deploy script:**
   ```bash
   # deploy.sh
   git pull
   cd server && npm install
   cd ../frontend && npm install && npm run build
   pm2 restart pergimmikan-server
   ```

3. **One command deploy:**
   ```bash
   ./deploy.sh
   ```

---

## 🎉 RESULT

**Before:** Manual upload every time 😫
**After:** Just `git push` → Auto deploy! 🚀

Choose the option that fits your needs:
- **Beginner:** Option 1 (cPanel Git)
- **Intermediate:** Option 2 (SSH + Git)
- **Advanced:** Option 3 or 4 (Auto deploy)
