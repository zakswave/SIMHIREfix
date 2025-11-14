# ========================================
# SIMHIRE VPS Deployment Script for Windows
# ========================================

Write-Host "🚀 Starting SIMHIRE Deployment..." -ForegroundColor Cyan
Write-Host ""

$VPS_IP = "103.30.246.36"
$VPS_USER = "root"
$VPS_PATH = "/var/www/simhire"

Write-Host "📡 Connecting to VPS: $VPS_USER@$VPS_IP" -ForegroundColor Yellow
Write-Host ""

# Deployment command
$deployCommand = @"
cd $VPS_PATH && \
git pull origin main && \
echo '📦 Installing dependencies...' && \
npm install && \
echo '🔨 Building project...' && \
npm run build && \
echo '🔄 Restarting Nginx...' && \
sudo systemctl restart nginx && \
echo '✅ Deployment completed successfully!' && \
echo '' && \
echo '🌐 Visit: https://simhire.flx.web.id'
"@

# Try to execute via SSH
Write-Host "Executing deployment commands..." -ForegroundColor Green
ssh "$VPS_USER@$VPS_IP" $deployCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Website: https://simhire.flx.web.id" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check SSH connection: ssh $VPS_USER@$VPS_IP" -ForegroundColor White
    Write-Host "2. Use PuTTY or other SSH client" -ForegroundColor White
    Write-Host "3. Or deploy manually via SSH terminal" -ForegroundColor White
    Write-Host ""
}
