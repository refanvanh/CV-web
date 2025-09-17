# 🚀 CV Portfolio Website

Modern, responsive CV portfolio website dengan admin panel untuk mengedit konten secara real-time. Dibangun dengan Node.js, Express.js, dan vanilla JavaScript.

## ✨ Fitur Utama

### 🎨 **Frontend**
- **Responsive Design** - Tampilan optimal di desktop, tablet, dan mobile
- **Modern UI/UX** - Desain clean dan professional dengan animasi smooth
- **Real-time Clock** - Jam digital yang update otomatis
- **Interactive Elements** - Hover effects dan smooth transitions
- **Font Awesome Icons** - Icon library lengkap untuk UI

### 🔧 **Admin Panel**
- **Secure Login** - Autentikasi dengan bcrypt dan JWT
- **Real-time Editing** - Edit CV content tanpa reload halaman
- **Dynamic Sections** - Tambah/edit/hapus experience, skills, dan projects
- **File Upload** - Upload foto profil dan gambar project
- **Data Validation** - Validasi input form yang robust

### 📊 **Sections yang Dapat Diedit**
- **Personal Info** - Nama, title, deskripsi, kontak, lokasi
- **About Me** - Dua paragraf deskripsi + 3 statistik
- **Social Media** - LinkedIn, GitHub, Facebook, Instagram
- **Experience** - Daftar pengalaman kerja dengan reorder functionality
- **Skills** - Kategori keahlian dengan level proficiency
- **Projects** - Portfolio project dengan link live dan GitHub

### 🔒 **Security Features**
- **Helmet.js** - Security headers dan CSP
- **Rate Limiting** - Anti brute force protection
- **Input Sanitization** - Mencegah XSS attacks
- **Secure File Upload** - Validasi file type dan size
- **Environment Variables** - Konfigurasi aman

## 🛠️ Teknologi yang Digunakan

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **helmet** - Security middleware
- **express-rate-limit** - Rate limiting

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, animations
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icon library
- **Google Fonts** - Typography

### **Data Storage**
- **JSON Files** - File-based data persistence
- **File System** - Local file storage
- **Image Uploads** - Static file serving

## 📦 Instalasi

### **Prerequisites**
- Node.js (v16.20.2 atau lebih baru)
- npm atau yarn
- Git

### **Quick Start**

1. **Clone Repository**
   ```bash
   git clone https://github.com/refanvanh/CV-web.git
   cd CV-web
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Server**
   ```bash
   # Windows
   npm start
   
   # Linux/Mac
   ./start.sh
   ```

4. **Access Website**
   - **Main Site:** http://localhost:3001
   - **Admin Panel:** Login dengan kredensial di `data/users.json`

### **Default Credentials**
- **Username:** `refanvanh`
- **Password:** `bnesindangpanon64`

## 🚀 Deployment

### **Vercel (Recommended)**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts untuk konfigurasi
4. Deploy: `vercel --prod`

### **Railway**
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### **Heroku**
1. Create Heroku app
2. Set buildpacks: `heroku/nodejs`
3. Deploy: `git push heroku main`

### **Docker**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📁 Struktur Project

```
CV-web/
├── 📁 data/                 # Data storage
│   ├── cv-data.json        # CV content data
│   └── users.json          # Admin credentials
├── 📁 public/              # Static files
│   ├── index.html          # Main website
│   ├── styles.css          # CSS styles
│   ├── script.js           # Frontend JavaScript
│   ├── 📁 uploads/         # Uploaded images
│   └── favicon.ico         # Website icon
├── 📁 node_modules/        # Dependencies
├── server.js               # Backend server
├── package.json            # Project configuration
├── .gitignore             # Git ignore rules
├── README.md              # Documentation
└── SECURITY.md            # Security guidelines
```

## 🔧 Konfigurasi

### **Environment Variables**
```bash
PORT=3001                  # Server port
NODE_ENV=production        # Environment mode
```

### **Data Structure**
```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "description": "Your description",
    "email": "your@email.com",
    "phone": "+62 xxx-xxxx-xxxx",
    "location": "Your Location"
  },
  "about": {
    "text1": "First paragraph",
    "text2": "Second paragraph",
    "stats": [
      {"number": "7+", "label": "Years Experience"},
      {"number": "50+", "label": "Projects Completed"},
      {"number": "100%", "label": "Client Satisfaction"}
    ]
  },
  "social": {
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "facebook": "https://facebook.com/username",
    "instagram": "https://instagram.com/username"
  }
}
```

## 🎯 API Endpoints

### **Authentication**
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout

### **CV Data**
- `GET /api/cv` - Get CV data
- `PUT /api/cv` - Update CV data
- `POST /api/upload` - Upload images

### **Health Check**
- `GET /api/health` - Server status

## 🔒 Security

### **Implemented Security Measures**
- ✅ **Password Hashing** - bcrypt dengan salt rounds
- ✅ **Rate Limiting** - 100 requests per 15 minutes
- ✅ **CSP Headers** - Content Security Policy
- ✅ **XSS Protection** - Input sanitization
- ✅ **File Upload Validation** - Type dan size checking
- ✅ **Environment Variables** - Sensitive data protection

### **Security Best Practices**
- Ganti password default setelah deployment
- Gunakan HTTPS di production
- Regular security updates
- Monitor server logs
- Backup data secara berkala

## 🐛 Troubleshooting

### **Common Issues**

**1. Port Already in Use**
```bash
# Kill process on port 3001
npx kill-port 3001
# atau
taskkill /f /im node.exe
```

**2. Permission Denied (Linux/Mac)**
```bash
chmod +x start.sh
```

**3. Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**4. Database Connection Error**
- Pastikan file `data/cv-data.json` dan `data/users.json` ada
- Check file permissions

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 Changelog

### **v1.0.0** (2025-09-17)
- ✅ Initial release
- ✅ Complete CV portfolio website
- ✅ Admin panel functionality
- ✅ Dynamic content editing
- ✅ Social media integration
- ✅ File upload system
- ✅ Security features
- ✅ Responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Reza Fadjar Nawawi**
- GitHub: [@refanvanh](https://github.com/refanvanh)
- LinkedIn: [Reza Fadjar Nawawi](https://linkedin.com/in/reza-fadjar-nawawi)
- Email: refanvanh@gmail.com

## 🙏 Acknowledgments

- Font Awesome untuk icon library
- Google Fonts untuk typography
- Express.js community
- Node.js community

---

**⭐ Jika project ini membantu Anda, jangan lupa berikan star di GitHub!**