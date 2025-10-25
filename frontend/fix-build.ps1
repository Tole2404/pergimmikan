# Fix Build Script
Write-Host "🔧 Fixing jQuery dependency issue..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Install jQuery
Write-Host "📦 Installing jQuery..." -ForegroundColor Yellow
npm install jquery@^3.7.1

Write-Host ""
Write-Host "🧹 Cleaning build cache..." -ForegroundColor Yellow
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ BUILD SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Build output:" -ForegroundColor Yellow
    Get-ChildItem -Path "dist" -Recurse | Select-Object Name, Length | Format-Table -AutoSize
} else {
    Write-Host ""
    Write-Host "❌ BUILD FAILED!" -ForegroundColor Red
}
