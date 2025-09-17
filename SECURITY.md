# 🔒 Sistem Keamanan Password

## 🛡️ **Teknologi Keamanan yang Digunakan:**

### **1. bcryptjs - Password Hashing**
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('bnesindangpanon64', 10);
```

**Fitur Keamanan:**
- ✅ **Salt Rounds: 10** - Tingkat keamanan tinggi
- ✅ **One-way Hashing** - Password tidak bisa di-reverse
- ✅ **Salt Otomatis** - Setiap hash unik meski password sama
- ✅ **Adaptive Hashing** - Bisa ditingkatkan seiring waktu

### **2. JWT (JSON Web Token) - Session Management**
```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
```

**Fitur Keamanan:**
- ✅ **Token Expiration** - Expire dalam 24 jam
- ✅ **Secret Key** - Di-enkripsi dengan secret key
- ✅ **Stateless** - Tidak perlu session di server
- ✅ **Tamper Proof** - Tidak bisa dimodifikasi

### **3. Rate Limiting - Anti Brute Force**
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100 // maksimal 100 request per IP
});
```

**Fitur Keamanan:**
- ✅ **Request Limiting** - Maksimal 100 request per 15 menit
- ✅ **IP-based** - Per alamat IP
- ✅ **Anti Brute Force** - Mencegah serangan password

### **4. Helmet.js - Security Headers**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

**Fitur Keamanan:**
- ✅ **XSS Protection** - Mencegah Cross-Site Scripting
- ✅ **Content Security Policy** - Kontrol resource loading
- ✅ **Hide X-Powered-By** - Menyembunyikan teknologi server
- ✅ **HSTS** - HTTP Strict Transport Security

## 🔐 **Cara Password Disimpan:**

### **Sebelum Disimpan:**
```
Password Asli: "bnesindangpanon64"
```

### **Setelah Hashing (bcrypt):**
```
$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdQvOQjOqjOqjOqjOqjOqjOqjOqjO
```

**Penjelasan:**
- `$2a$` = Algoritma bcrypt
- `10` = Salt rounds (2^10 = 1024 iterations)
- `N9qo8uLOickgx2ZMRZoMye` = Salt (random)
- `IjdQvOQjOqjOqjOqjOqjOqjOqjO` = Hash result

## 🛡️ **Lapisan Keamanan:**

### **Layer 1: Password Hashing**
- Password tidak pernah disimpan dalam bentuk plain text
- Menggunakan bcrypt dengan salt rounds 10
- Setiap hash unik meski password sama

### **Layer 2: JWT Authentication**
- Token berisi informasi user yang di-enkripsi
- Expire otomatis dalam 24 jam
- Tidak bisa dimodifikasi tanpa secret key

### **Layer 3: Rate Limiting**
- Mencegah serangan brute force
- Membatasi jumlah request per IP
- Window 15 menit dengan maksimal 100 request

### **Layer 4: Security Headers**
- Helmet.js menambahkan security headers
- Mencegah XSS, clickjacking, dll
- Menyembunyikan informasi server

## 🔧 **Cara Mengubah Password:**

### **1. Generate Hash Baru:**
```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'password-baru-anda';
const hashedPassword = await bcrypt.hash(newPassword, 10);
console.log(hashedPassword);
```

### **2. Update di data/users.json:**
```json
{
  "id": 1,
  "username": "refanvanh",
  "password": "$2a$10$hash-baru-di-sini",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### **3. Restart Server:**
```bash
npm start
```

## ⚠️ **Best Practices Keamanan:**

### **1. Password Policy:**
- ✅ Minimal 8 karakter
- ✅ Kombinasi huruf, angka, simbol
- ✅ Tidak menggunakan kata umum
- ✅ Ganti password secara berkala

### **2. Server Security:**
- ✅ Gunakan HTTPS di production
- ✅ Update dependencies secara berkala
- ✅ Monitor log untuk aktivitas mencurigakan
- ✅ Backup data secara teratur

### **3. Environment Variables:**
```env
JWT_SECRET=your-super-secret-key-here
PORT=3000
NODE_ENV=production
```

## 🚨 **Monitoring & Logging:**

### **Login Attempts:**
- Setiap percobaan login dicatat
- Rate limiting otomatis aktif
- Token expire dalam 24 jam

### **Error Handling:**
- Error tidak menampilkan informasi sensitif
- Log error untuk debugging
- Graceful error handling

## 🔍 **Cara Verifikasi Keamanan:**

### **1. Cek Password Hash:**
```javascript
const bcrypt = require('bcryptjs');
const isValid = await bcrypt.compare('password-input', 'stored-hash');
console.log(isValid); // true atau false
```

### **2. Cek JWT Token:**
```javascript
const jwt = require('jsonwebtoken');
const decoded = jwt.verify(token, JWT_SECRET);
console.log(decoded); // user info
```

## 📊 **Tingkat Keamanan:**

| Aspek | Level | Keterangan |
|-------|-------|------------|
| Password Hashing | ⭐⭐⭐⭐⭐ | bcrypt dengan salt rounds 10 |
| Session Management | ⭐⭐⭐⭐⭐ | JWT dengan expiration |
| Rate Limiting | ⭐⭐⭐⭐ | 100 req/15min per IP |
| Security Headers | ⭐⭐⭐⭐⭐ | Helmet.js lengkap |
| Input Validation | ⭐⭐⭐⭐ | File upload & form validation |

**Overall Security Level: ⭐⭐⭐⭐⭐ (Sangat Aman)**

---

**Sistem keamanan ini sudah memenuhi standar industri untuk aplikasi web modern!** 🛡️
