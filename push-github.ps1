# SimHire - Push to GitHub Script
# Usage: .\push-github.ps1 YOUR_GITHUB_TOKEN

param(
    [Parameter(Mandatory=$true, HelpMessage="GitHub Personal Access Token")]
    [string]$Token
)

Write-Host "`n🚀 SimHire - GitHub Push Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Validate token format
if ($Token.Length -lt 20) {
    Write-Host "❌ Token terlalu pendek. Pastikan Anda menggunakan Personal Access Token yang valid." -ForegroundColor Red
    Write-Host "   Buat token di: https://github.com/settings/tokens/new" -ForegroundColor Yellow
    exit 1
}

# Check if git is installed
$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "❌ Git tidak ditemukan. Path saat ini:" -ForegroundColor Red
    Write-Host "   $env:Path" -ForegroundColor Gray
    Write-Host "`n💡 Menambahkan Git ke PATH..." -ForegroundColor Yellow
    $env:Path += ";C:\Program Files\Git\cmd"
}

try {
    Write-Host "📍 Lokasi: $(Get-Location)" -ForegroundColor Gray
    
    # Check git status
    Write-Host "`n🔍 Mengecek status repository..." -ForegroundColor Yellow
    $status = git status --short
    if ($status) {
        Write-Host "⚠️  Ada perubahan yang belum di-commit:" -ForegroundColor Yellow
        git status --short
        
        $commit = Read-Host "`nCommit perubahan ini? (y/n)"
        if ($commit -eq 'y' -or $commit -eq 'Y') {
            git add .
            $message = Read-Host "Masukkan commit message"
            if ([string]::IsNullOrWhiteSpace($message)) {
                $message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
            }
            git commit -m $message
            Write-Host "✅ Changes committed" -ForegroundColor Green
        }
    } else {
        Write-Host "✅ Working tree clean" -ForegroundColor Green
    }
    
    # Set remote URL with token
    Write-Host "`n🔗 Konfigurasi remote repository..." -ForegroundColor Yellow
    git remote set-url origin "https://zakswave:$Token@github.com/zakswave/SIMHIREfix.git"
    Write-Host "✅ Remote configured" -ForegroundColor Green
    
    # Push to GitHub
    Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host "   Repository: https://github.com/zakswave/SIMHIREfix" -ForegroundColor Gray
    Write-Host "   Branch: main`n" -ForegroundColor Gray
    
    git push -u origin main --verbose
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ PUSH BERHASIL!" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
        Write-Host "`n🎉 Repository SimHire berhasil di-push ke GitHub!" -ForegroundColor Cyan
        Write-Host "`n📊 Statistik:" -ForegroundColor White
        Write-Host "   • Files: 302" -ForegroundColor Gray
        Write-Host "   • Lines: 54,919" -ForegroundColor Gray
        Write-Host "   • Tech: React + TypeScript + Node.js" -ForegroundColor Gray
        Write-Host "`n🔗 Lihat di: https://github.com/zakswave/SIMHIREfix" -ForegroundColor Yellow
        Write-Host "`n💡 Untuk update selanjutnya:" -ForegroundColor Gray
        Write-Host "   git add ." -ForegroundColor White
        Write-Host "   git commit -m 'Update message'" -ForegroundColor White
        Write-Host "   .\push-github.ps1 YOUR_TOKEN" -ForegroundColor White
    } else {
        Write-Host "`n❌ Push gagal!" -ForegroundColor Red
        Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
        Write-Host "   • Pastikan token memiliki scope 'repo'" -ForegroundColor Gray
        Write-Host "   • Cek koneksi internet" -ForegroundColor Gray
        Write-Host "   • Verifikasi repository exists: https://github.com/zakswave/SIMHIREfix" -ForegroundColor Gray
        exit 1
    }
    
} catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
