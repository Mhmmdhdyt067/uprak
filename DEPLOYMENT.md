# PANDUAN LENGKAP DEPLOYMENT SISTEM UJIAN CODING C++
## Practical Coding Examination System

Aplikasi ini dapat dideploy menggunakan 4 metode utama sesuai tipe hosting yang Anda miliki:
1. **VPS (Ubuntu/Debian) menggunakan Node.js, PM2, dan Nginx Reverse Proxy** *(Paling Direkomendasikan untuk Server Kampus)*
2. **Container Docker & Docker Compose** *(1 Langkah Otomatis)*
3. **Cloud PaaS (Vercel / Netlify / Render / Railway)** *(Gratis & Otomatis via GitHub)*
4. **Shared Hosting (cPanel / DirectAdmin)** *(Upload folder `dist`)*

---

### METODE 1: DEPLOYMENT KE VPS (UBUNTU / DEBIAN) DENGAN NGINX & PM2

Metode ini ideal jika Anda menyewa VPS (DigitalOcean, Linode, AWS EC2, GCP, Niagahoster, IDCloudHost, atau server on-premise lab kampus).

#### Langkah 1: Persiapan Server VPS
Login ke server VPS via SSH:
```bash
ssh root@IP_SERVER_ANDA
```

Perbarui paket sistem dan pasang Node.js 20 LTS & Git:
```bash
# Update repository
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential nginx

# Verifikasi versi Node.js & NPM
node -v   # v20.x.x
npm -v    # v10.x.x
```

Pasang Process Manager (PM2) dan TypeScript runner:
```bash
sudo npm install -g pm2 tsx
```

#### Langkah 2: Unduh Source Code ke VPS
```bash
# Masuk ke direktori web
cd /var/www

# Clone repository atau upload file source code
git clone https://github.com/USERNAME/REPO_ANDA.git practical-exam
cd practical-exam

# Install seluruh dependency
npm install
```

#### Langkah 3: Build Asset Produksi
```bash
# Kompilasi aplikasi Vite & Tailwind ke folder dist/
npm run build
```

#### Langkah 4: Jalankan Aplikasi Menggunakan PM2
Aplikasi akan dijalankan di latar belakang (*daemon*) menggunakan `server.ts`:
```bash
# Jalankan dengan PM2
pm2 start "tsx server.ts" --name "exam-system"

# Simpan agar otomatis hidup saat VPS reboot
pm2 save
pm2 startup
```

Untuk melihat status atau log sistem:
```bash
pm2 status
pm2 logs exam-system
```

#### Langkah 5: Konfigurasi Nginx Reverse Proxy & Domain
Buat konfigurasi virtual host Nginx:
```bash
sudo nano /etc/nginx/sites-available/exam-system
```

Isi dengan konfigurasi berikut (ganti `ujian.kampus.ac.id` dengan domain/IP Anda):
```nginx
server {
    listen 80;
    server_name ujian.kampus.ac.id; # atau ganti dengan IP_SERVER jika tanpa domain

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/exam-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

*(Opsional)* Pasang SSL HTTPS Gratis (Certbot):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ujian.kampus.ac.id
```

Aplikasi sekarang sudah online di `http://ujian.kampus.ac.id`!

---

### METODE 2: DEPLOYMENT MENGGUNAKAN DOCKER & DOCKER COMPOSE

Jika VPS Anda sudah terpasang Docker:
```bash
# 1. Masuk ke direktori proyek
cd practical-exam

# 2. Jalankan container secara otomatis
docker compose up -d --build
```
Aplikasi langsung berjalan di port `3000`.

---

### METODE 3: DEPLOYMENT KE VERCEL / NETLIFY (GRATIS & TERCEPAT)

Jika Anda ingin hosting tanpa mengelola server Linux:

#### Cara Deploy ke Vercel:
1. Push source code proyek ini ke GitHub / GitLab Anda.
2. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub.
3. Klik **"Add New Project"** dan pilih repository aplikasi ini.
4. Pada **Build and Output Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Klik **"Deploy"**.
6. Dalam 1-2 menit, URL produksi otomatis aktif (misal `https://practical-exam.vercel.app`).

---

### METODE 4: DEPLOYMENT KE SHARED HOSTING (cPANEL)

Jika Anda memiliki hosting cPanel standar (Apache / LiteSpeed):

1. **Jalankan Build di Komputer Lokal:**
   ```bash
   npm install
   npm run build
   ```
2. Setelah proses build selesai, buka folder hasil kompilasi: **`dist/`**.
3. Di dalam folder `dist/`, pastikan terdapat:
   - `index.html`
   - Folder `assets/`
   - File `.htaccess` (sudah disertakan di folder `public/`)
4. Kompres seluruh isi folder `dist/` menjadi file `dist.zip`.
5. Login ke **cPanel** hosting Anda.
6. Masuk ke **File Manager** -> buka direktori `public_html` (atau subdomain Anda).
7. Klik **Upload** dan unggah `dist.zip`.
8. Ekstrak file tersebut di dalam `public_html`.
9. Buka domain Anda di browser. Sistem langsung aktif!

---

### KREDENSIAL DEFAULT ADMINISTRATOR SETELAH DEPLOY
- **Portal Mahasiswa:** Langsung buka halaman utama (`/`)
- **Portal Administrator:** Klik tombol **"Portal Administrator"** di pojok kanan atas atau buka form login admin.
  - **Super Admin:** NIM `ADMIN01` / Password `AdminRahasia2026!`
  - **Asisten Dosen:** NIM `ASLAB01` / Password `AslabPass2026!`
- **Token Ujian Default:** `ALGO26` (Dapat diubah atau ditambah sesi baru pada menu Sesi Ujian).
