# Build Debug Script
Write-Host "🔨 Starting Vite Build..." -ForegroundColor Cyan
Write-Host ""

try {
    npm run build 2>&1 | Tee-Object -FilePath "build-log.txt"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ BUILD SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📦 Build output:" -ForegroundColor Yellow
        Get-ChildItem -Path "dist" -Recurse | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
    } else {
        Write-Host ""
        Write-Host "❌ BUILD FAILED!" -ForegroundColor Red
        Write-Host ""
        Write-Host "📋 Check build-log.txt for full error details" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Last 20 lines of error:" -ForegroundColor Yellow
        Get-Content "build-log.txt" -Tail 20
    }
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}
