# CV Portfolio Website

Website CV/Portfolio modern dengan fitur edit untuk administrator. Dibangun dengan Node.js, Express, dan vanilla JavaScript.

## 🚀 Fitur Utama

- **Portfolio Modern**: Desain responsif dan menarik
- **Sistem Login**: Autentikasi administrator dengan JWT
- **Edit CV Real-time**: Update data CV langsung dari browser
- **Upload Gambar**: Upload foto profil dan gambar proyek
- **API Backend**: RESTful API untuk manajemen data
- **Penyimpanan File**: Data tersimpan di file JSON
- **Contact Form**: Form kontak yang fungsional

## 📁 Struktur Proyek

```
CV-web/
├── public/                 # Frontend files
│   ├── index.html         # Halaman utama
│   ├── styles.css         # Styling
│   └── script.js          # JavaScript frontend
├── data/                  # Data storage
│   ├── cv-data.json       # Data CV
│   └── users.json         # Data user
├── public/uploads/        # Uploaded images
├── server.js              # Backend server
├── package.json           # Dependencies
└── README.md             # Dokumentasi
```

## 🛠️ Instalasi & Setup

### Prerequisites
- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd CV-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment (Opsional)
Buat file `.env` untuk konfigurasi:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
```

### 4. Jalankan Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Akses Website
Buka browser dan kunjungi: `http://localhost:3000`

## 🔐 Login Administrator

**Admin Credentials:**
- Username: `[HIDDEN]`
- Password: `[HIDDEN]`

⚠️ **PENTING**: Kredensial admin tersimpan di file `data/users.json`

## 📝 Cara Menggunakan

### 1. Melihat CV
- Buka website di browser
- Scroll untuk melihat semua section CV

### 2. Edit CV (Admin)
- Klik tombol "Edit" di navbar
- Login dengan kredensial admin
- Edit data di 4 tab: Personal, Pengalaman, Keahlian, Proyek
- Klik "Simpan Perubahan"

### 3. Upload Gambar
- Di halaman edit, gunakan form upload untuk foto profil
- Gambar akan tersimpan di folder `public/uploads/`

## 🔧 Konfigurasi

### Mengubah Password Admin
Edit file `data/users.json` dan gunakan bcrypt untuk hash password baru.

**Contoh:**
```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'password-baru-anda';
const hashedPassword = await bcrypt.hash(newPassword, 10);
```

### Mengubah Data Default CV
Edit file `data/cv-data.json` untuk mengubah data default.

## 🚀 Deployment ke Production

### 1. VPS/Server
```bash
# Upload files ke server
scp -r . user@your-server:/path/to/app

# Install dependencies
npm install --production

# Install PM2 untuk process management
npm install -g pm2

# Jalankan dengan PM2
pm2 start server.js --name "cv-portfolio"
pm2 save
pm2 startup
```

### 2. Heroku
```bash
# Install Heroku CLI
# Login ke Heroku
heroku login

# Buat app
heroku create your-cv-portfolio

# Deploy
git push heroku main
```

### 3. Vercel/Netlify
- Upload folder `public/` untuk static hosting
- Untuk backend, gunakan Vercel Functions atau Netlify Functions

### 4. Docker (Opsional)
Buat file `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 API Endpoints

### Authentication
- `POST /api/login` - Login admin
- `GET /api/cv` - Get CV data
- `PUT /api/cv` - Update CV data (requires auth)

### File Upload
- `POST /api/upload/profile` - Upload profile image (requires auth)
- `POST /api/upload/project` - Upload project image (requires auth)

### Contact
- `POST /api/contact` - Submit contact form

## 🔒 Security Features

- JWT Authentication
- Password hashing dengan bcrypt
- Rate limiting
- File upload validation
- CORS protection
- Helmet.js security headers

## 🎨 Customization

### Mengubah Tema
Edit file `public/styles.css` untuk mengubah:
- Warna utama
- Font
- Layout
- Animasi

### Menambah Section Baru
1. Tambah HTML di `public/index.html`
2. Tambah styling di `public/styles.css`
3. Update JavaScript di `public/script.js`
4. Update API di `server.js`

## 🐛 Troubleshooting

### Server tidak start
- Pastikan port 3000 tidak digunakan
- Cek Node.js version: `node --version`
- Install ulang dependencies: `rm -rf node_modules && npm install`

### Upload gambar gagal
- Pastikan folder `public/uploads/` ada
- Cek permission folder
- Pastikan ukuran file < 5MB

### Login gagal
- Cek file `data/users.json` ada
- Reset password dengan hash baru
- Cek JWT secret key

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek log server di terminal
2. Cek browser console untuk error
3. Pastikan semua dependencies terinstall

## 📄 License

MIT License - bebas digunakan untuk personal atau commercial.

## 🔄 Update Log

### v1.0.0
- Initial release
- Basic CV display
- Admin edit functionality
- File upload system
- API backend

---

**Selamat menggunakan CV Portfolio Website! 🎉**
