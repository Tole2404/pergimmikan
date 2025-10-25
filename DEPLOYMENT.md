# 🚀 Deployment Guide - PERGIMMIKAN

Panduan lengkap untuk deploy PERGIMMIKAN ke berbagai platform.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deploy to cPanel](#deploy-to-cpanel)
- [Deploy to VPS](#deploy-to-vps)
- [Deploy to Cloud](#deploy-to-cloud)
- [Docker Deployment](#docker-deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required

- Node.js >= 16.x
- MySQL >= 8.0
- Domain name (optional tapi recommended)
- SSL Certificate (Let's Encrypt atau commercial)

### Recommended

- Git untuk version control
- PM2 untuk process management
- Nginx sebagai reverse proxy
- Backup strategy

---

## 🔧 Environment Setup

### 1. Prepare Production Build

#### Backend

```bash
cd server

# Install production dependencies only
npm install --production

# Test production build
NODE_ENV=production npm start
```

#### Frontend

```bash
cd frontend

# Build untuk production
npm run build

# Output akan ada di folder dist/
# Folder ini yang akan di-deploy
```

### 2. Environment Variables

#### Backend `.env`

```env
# Production settings
NODE_ENV=production
PORT=5000

# Database (gunakan production credentials)
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASS=your_strong_password
DB_NAME=pergimmikan_prod

# JWT (generate strong secret)
JWT_SECRET=your_super_secret_production_key_here
JWT_EXPIRES_IN=7d

# CORS (gunakan production domain)
CORS_ORIGIN=https://yourdomain.com

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

#### Frontend `.env`

```env
# Production API URL
VITE_API_URL=https://api.yourdomain.com/api

# App name
VITE_APP_NAME=PERGIMMIKAN
```

---

## 🌐 Deploy to cPanel

### Step 1: Upload Files

```bash
# Compress project
tar -czf pergimmikan.tar.gz .

# Upload via FTP/SFTP atau cPanel File Manager
# Extract di home directory
```

### Step 2: Setup Node.js App

1. **Login ke cPanel**
2. **Buka "Setup Node.js App"**
3. **Create Application**:
   - Node.js version: 16.x atau lebih tinggi
   - Application mode: Production
   - Application root: `server`
   - Application URL: `api.yourdomain.com`
   - Application startup file: `src/app.js`

### Step 3: Setup Database

```bash
# Via cPanel MySQL Database Wizard
1. Create database: pergimmikan_prod
2. Create user dengan strong password
3. Grant all privileges

# Import database
mysql -u username -p pergimmikan_prod < database/MOUNTAIN-TRACKS-SCHEMA.sql
mysql -u username -p pergimmikan_prod < database/trip-calculator-schema.sql
```

### Step 4: Configure Environment

```bash
# Via cPanel Terminal atau SSH
cd server
nano .env
# Paste production environment variables
```

### Step 5: Install Dependencies

```bash
cd server
npm install --production

# Run migrations
node run-notification-migration.js
node run-comment-migration.js
```

### Step 6: Deploy Frontend

```bash
# Upload dist/ folder ke public_html
# Atau subdomain folder

# Via cPanel File Manager:
1. Navigate ke public_html
2. Upload semua file dari dist/
3. Extract jika dalam zip
```

### Step 7: Setup .htaccess

Create `.htaccess` di public_html:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Redirect HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# React Router - redirect all to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Step 8: Start Application

```bash
# Via cPanel Node.js App interface
# Click "Start" button

# Atau via terminal
cd server
npm start
```

**Lihat panduan lengkap**: [CPANEL-QUICK-GUIDE.md](CPANEL-QUICK-GUIDE.md)

---

## 🖥️ Deploy to VPS

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### Step 2: Clone Repository

```bash
# Create app directory
sudo mkdir -p /var/www/pergimmikan
sudo chown $USER:$USER /var/www/pergimmikan

# Clone repository
cd /var/www/pergimmikan
git clone https://github.com/Tole2404/pergimmikan.git .
```

### Step 3: Setup Database

```bash
# Login ke MySQL
sudo mysql -u root -p

# Create database dan user
CREATE DATABASE pergimmikan_prod;
CREATE USER 'pergimmikan_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON pergimmikan_prod.* TO 'pergimmikan_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u pergimmikan_user -p pergimmikan_prod < database/MOUNTAIN-TRACKS-SCHEMA.sql
mysql -u pergimmikan_user -p pergimmikan_prod < database/trip-calculator-schema.sql
```

### Step 4: Setup Backend

```bash
cd /var/www/pergimmikan/server

# Install dependencies
npm install --production

# Create .env
nano .env
# Paste production environment variables

# Run migrations
node run-notification-migration.js
node run-comment-migration.js

# Test
npm start
# Ctrl+C to stop
```

### Step 5: Setup PM2

```bash
# Start with PM2
pm2 start src/app.js --name pergimmikan-api

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
# Copy and run the command shown

# Monitor
pm2 status
pm2 logs pergimmikan-api
```

### Step 6: Setup Frontend

```bash
cd /var/www/pergimmikan/frontend

# Install dependencies
npm install

# Build
npm run build

# Copy build to nginx directory
sudo cp -r dist/* /var/www/html/
```

### Step 7: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/pergimmikan
```

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/html;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pergimmikan /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### Step 9: Setup Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

---

## ☁️ Deploy to Cloud

### AWS EC2

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance type: t2.micro (free tier) atau t2.small
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Follow VPS deployment steps above**

3. **Setup RDS for MySQL** (optional)
   - Create RDS MySQL instance
   - Update DB_HOST di .env

### Google Cloud Platform

1. **Create Compute Engine VM**
   - Machine type: e2-micro atau e2-small
   - Boot disk: Ubuntu 22.04 LTS
   - Firewall: Allow HTTP and HTTPS

2. **Follow VPS deployment steps above**

3. **Setup Cloud SQL** (optional)
   - Create MySQL instance
   - Update DB_HOST di .env

### DigitalOcean

1. **Create Droplet**
   - Image: Ubuntu 22.04 LTS
   - Plan: Basic $6/month
   - Add SSH key

2. **Follow VPS deployment steps above**

3. **Setup Managed Database** (optional)
   - Create MySQL cluster
   - Update DB_HOST di .env

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create pergimmikan-api

# Add MySQL addon
heroku addons:create cleardb:ignite

# Get database URL
heroku config:get CLEARDB_DATABASE_URL

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Open app
heroku open
```

---

## 🐳 Docker Deployment

### Step 1: Create Dockerfile

#### Backend Dockerfile

```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  # MySQL Database
  db:
    image: mysql:8.0
    container_name: pergimmikan-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: pergimmikan
      MYSQL_USER: pergimmikan_user
      MYSQL_PASSWORD: user_password
    volumes:
      - db_data:/var/lib/mysql
      - ./database:/docker-entrypoint-initdb.d
    ports:
      - "3306:3306"
    networks:
      - pergimmikan-network

  # Backend API
  api:
    build: ./server
    container_name: pergimmikan-api
    restart: always
    environment:
      NODE_ENV: production
      DB_HOST: db
      DB_USER: pergimmikan_user
      DB_PASS: user_password
      DB_NAME: pergimmikan
      JWT_SECRET: your_jwt_secret
    ports:
      - "5000:5000"
    depends_on:
      - db
    networks:
      - pergimmikan-network

  # Frontend
  frontend:
    build: ./frontend
    container_name: pergimmikan-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - pergimmikan-network

volumes:
  db_data:

networks:
  pergimmikan-network:
    driver: bridge
```

### Step 3: Deploy with Docker

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## ✅ Post-Deployment

### 1. Verify Deployment

```bash
# Check backend
curl https://api.yourdomain.com/api/health

# Check frontend
curl https://yourdomain.com

# Check database connection
mysql -h your_db_host -u your_user -p
```

### 2. Setup Monitoring

```bash
# Install monitoring tools
npm install -g pm2

# Monitor with PM2
pm2 monit

# Setup alerts
pm2 install pm2-logrotate
```

### 3. Setup Backups

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
mkdir -p $BACKUP_DIR

mysqldump -u user -p password pergimmikan_prod > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

# Add to crontab
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### 4. Setup Analytics

- Google Analytics
- Google Search Console
- Error tracking (Sentry)
- Performance monitoring (New Relic)

### 5. Security Checklist

- [ ] HTTPS enabled
- [ ] Firewall configured
- [ ] Strong passwords
- [ ] Regular backups
- [ ] Monitoring enabled
- [ ] Error logging
- [ ] Rate limiting
- [ ] CORS configured

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

#### 2. Permission Denied

```bash
# Fix file permissions
sudo chown -R $USER:$USER /var/www/pergimmikan
chmod -R 755 /var/www/pergimmikan
```

#### 3. Database Connection Failed

```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check credentials in .env
```

#### 4. Nginx 502 Bad Gateway

```bash
# Check backend is running
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart all
sudo systemctl restart nginx
```

#### 5. SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal
```

---

## 📚 Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)

---

## 🆘 Need Help?

- 📧 Email: your.email@example.com
- 💬 Telegram: @yourusername
- 📖 Documentation: [GitHub Wiki](https://github.com/Tole2404/pergimmikan/wiki)

---

**Happy Deploying! 🚀**
