# 🚀 Cara Push SimHire ke GitHub

## ✅ Status Saat Ini
- Repository lokal: **SIAP**
- Files committed: **302 files (54,919 lines)**
- Branch: `main`
- Remote: `https://github.com/zakswave/SIMHIREfix.git`

---

## 📝 Langkah Push ke GitHub

### **Opsi 1: Menggunakan GitHub Personal Access Token (Termudah)**

#### 1️⃣ Buat Personal Access Token
1. Login ke GitHub
2. Buka: **https://github.com/settings/tokens/new**
3. Setting token:
   - **Note**: `SimHire Deploy Token`
   - **Expiration**: 90 days (atau sesuai kebutuhan)
   - **Scope**: Centang `repo` (full control of private repositories)
4. Klik **Generate token**
5. **COPY TOKEN** yang muncul (hanya muncul sekali!)

#### 2️⃣ Push ke GitHub
Buka PowerShell di folder projek, lalu jalankan:

```powershell
# Ganti YOUR_TOKEN_HERE dengan token yang sudah di-copy
git remote set-url origin https://zakswave:YOUR_TOKEN_HERE@github.com/zakswave/SIMHIREfix.git

# Push ke GitHub
git push -u origin main
```

#### 3️⃣ Verifikasi
Buka browser dan cek: **https://github.com/zakswave/SIMHIREfix**

---

### **Opsi 2: Menggunakan GitHub CLI (Lebih Aman)**

#### 1️⃣ Install GitHub CLI
```powershell
# Download dari https://cli.github.com/
# Atau gunakan winget
winget install --id GitHub.cli
```

#### 2️⃣ Login dan Push
```powershell
# Login ke GitHub
gh auth login
# Pilih: GitHub.com → HTTPS → Login with a web browser

# Push ke GitHub
git push -u origin main
```

---

### **Opsi 3: Menggunakan SSH Key (Paling Aman)**

#### 1️⃣ Generate SSH Key
```powershell
ssh-keygen -t ed25519 -C "your-email@example.com"
# Tekan Enter untuk lokasi default
# Buat password atau kosongkan
```

#### 2️⃣ Copy Public Key
```powershell
Get-Content ~/.ssh/id_ed25519.pub | clip
```

#### 3️⃣ Tambahkan ke GitHub
1. Buka: **https://github.com/settings/keys**
2. Klik **New SSH key**
3. Paste public key yang sudah di-copy
4. Save

#### 4️⃣ Update Remote dan Push
```powershell
git remote set-url origin git@github.com:zakswave/SIMHIREfix.git
git push -u origin main
```

---

## 🎯 Setelah Push Berhasil

Repository akan berisi:
- ✅ **Frontend**: React 18 + TypeScript + Vite
- ✅ **Backend**: Node.js + Express + LowDB
- ✅ **UI Components**: shadcn/ui + Tailwind CSS
- ✅ **Features**: Job Finder, Simulasi Kerja, Portfolio, Auto-CV
- ✅ **Documentation**: README.md, CHANGELOG.md

---

## 🔧 Update Selanjutnya

Untuk push update berikutnya:

```powershell
git add .
git commit -m "Deskripsi perubahan"
git push origin main
```

---

## ❓ Troubleshooting

### "Authentication failed"
→ Cek apakah token sudah benar dan memiliki scope `repo`

### "Permission denied"
→ Pastikan Anda owner atau collaborator di repository

### "Repository not found"
→ Cek apakah repository `zakswave/SIMHIREfix` sudah dibuat di GitHub

---

**📌 Repository URL**: https://github.com/zakswave/SIMHIREfix
