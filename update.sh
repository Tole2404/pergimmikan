#!/bin/bash

# 🔄 SERVER UPDATE SCRIPT
# Run this on cPanel server after git pull
# Usage: ./update.sh

echo "🔄 Starting update process..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Code updated${NC}"
echo ""

# Update server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Server npm install failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Server dependencies installed${NC}"
echo ""

# Check for migrations
if [ -d "database/migrations" ]; then
    echo "🔍 Checking for new migrations..."
    # List migration files
    ls database/migrations/*.js 2>/dev/null
    if [ $? -eq 0 ]; then
        echo ""
        read -p "Run migrations? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            for migration in database/migrations/*.js; do
                if [[ $migration != *"rollback"* ]]; then
                    echo "Running: $migration"
                    node "$migration"
                fi
            done
        fi
    fi
fi

echo ""

# Update frontend
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend npm install failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
echo ""

# Build frontend
echo "🏗️  Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Restart server with PM2
echo "🔄 Restarting server..."
cd ..

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    pm2 restart pergimmikan-server
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Server restarted${NC}"
        echo ""
        echo "📊 Server status:"
        pm2 status
    else
        echo -e "${YELLOW}⚠️  PM2 restart failed, trying to start...${NC}"
        pm2 start server/src/app.js --name pergimmikan-server
    fi
else
    echo -e "${YELLOW}⚠️  PM2 not installed. Please restart server manually.${NC}"
    echo "Install PM2: npm install -g pm2"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Update completed successfully!${NC}"
echo ""
echo "📋 Summary:"
echo "  ✅ Code pulled from GitHub"
echo "  ✅ Dependencies installed"
echo "  ✅ Frontend built"
echo "  ✅ Server restarted"
echo ""
echo "🌐 Check your website:"
echo "  https://pergimmikan.site"
echo ""
echo "📊 Check logs:"
echo "  pm2 logs pergimmikan-server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
