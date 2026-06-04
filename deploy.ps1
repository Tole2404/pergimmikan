# Deploy Script for PERGIMMIKAN
# Run this from root project folder

Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
Set-Location frontend
npm run build
Set-Location ..

Write-Host "📦 Copying dist to fe-deploy..." -ForegroundColor Cyan
Copy-Item -Path "frontend\dist\*" -Destination "fe-deploy\" -Recurse -Force

Write-Host "✅ Build complete! Files ready in fe-deploy folder." -ForegroundColor Green
Write-Host ""
Write-Host "📤 To upload, open fe-deploy in VS Code and sync:" -ForegroundColor Yellow
Write-Host "   code fe-deploy" -ForegroundColor White
Write-Host "   Then: Ctrl+Shift+P -> SFTP: Sync Local -> Remote" -ForegroundColor White
