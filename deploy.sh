#!/bin/bash

# 🚀 PERGIMMIKAN DEPLOYMENT SCRIPT
# Usage: ./deploy.sh

echo "🚀 Starting deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is clean
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes!${NC}"
    echo ""
    git status -s
    echo ""
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_message
        git add .
        git commit -m "$commit_message"
        echo -e "${GREEN}✅ Changes committed${NC}"
    else
        echo -e "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
fi

# Get current branch
current_branch=$(git branch --show-current)
echo -e "${YELLOW}📍 Current branch: $current_branch${NC}"
echo ""

# Push to remote
echo "📤 Pushing to remote..."
git push origin $current_branch

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Pushed to GitHub successfully${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Code pushed to GitHub!${NC}"
echo ""
echo "📋 Next steps on cPanel:"
echo "1. Open Git Version Control"
echo "2. Click 'Manage' on your repository"
echo "3. Click 'Update from Remote'"
echo "4. Run: cd server && npm install"
echo "5. Run: cd frontend && npm install && npm run build"
echo "6. Run: pm2 restart pergimmikan-server"
echo ""
echo "Or use SSH and run:"
echo "  ssh username@pergimmikan.site"
echo "  cd public_html/pergimmikan"
echo "  ./update.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
