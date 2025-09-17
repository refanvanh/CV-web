# 🔒 Security Policy

Dokumen ini menjelaskan kebijakan keamanan untuk CV Portfolio Website dan cara melaporkan kerentanan keamanan.

## 🛡️ Security Overview

CV Portfolio Website dibangun dengan prinsip keamanan yang ketat untuk melindungi data admin dan pengguna. Kami menggunakan berbagai lapisan keamanan untuk memastikan aplikasi tetap aman.

## 🔐 Security Features

### **Authentication & Authorization**
- ✅ **Password Hashing**: bcrypt dengan salt rounds 10
- ✅ **Session Management**: JWT-based authentication
- ✅ **Rate Limiting**: 100 requests per 15 menit per IP
- ✅ **Input Validation**: Sanitasi semua input pengguna
- ✅ **CORS Protection**: Konfigurasi CORS yang aman

### **Data Protection**
- ✅ **File Upload Security**: Validasi tipe dan ukuran file
- ✅ **Input Sanitization**: Mencegah XSS attacks
- ✅ **SQL Injection Prevention**: Parameterized queries
- ✅ **Data Encryption**: Sensitive data di-hash
- ✅ **File System Security**: Restricted file access

### **Network Security**
- ✅ **Helmet.js**: Security headers lengkap
- ✅ **HTTPS Enforcement**: Redirect HTTP ke HTTPS
- ✅ **Content Security Policy**: Restrict resource loading
- ✅ **X-Frame-Options**: Prevent clickjacking
- ✅ **X-Content-Type-Options**: Prevent MIME sniffing

## 🚨 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## 🔍 Security Audit

### **Regular Security Checks**
- [ ] **Dependency Audit**: `npm audit` setiap minggu
- [ ] **Code Review**: Review kode untuk kerentanan
- [ ] **Penetration Testing**: Test keamanan berkala
- [ ] **Security Headers**: Validasi security headers
- [ ] **Input Validation**: Test semua input fields

### **Security Tools Used**
- **npm audit**: Dependency vulnerability scanning
- **helmet**: Security headers middleware
- **bcryptjs**: Password hashing
- **express-rate-limit**: Rate limiting
- **multer**: Secure file upload

## 🐛 Reporting a Vulnerability

### **How to Report**
Jika Anda menemukan kerentanan keamanan, silakan:

1. **JANGAN** buat issue publik di GitHub
2. **Email** ke: refanvanh@gmail.com
3. **Subject**: [SECURITY] CV Portfolio Website Vulnerability
4. **Include**:
   - Deskripsi kerentanan
   - Steps to reproduce
   - Potential impact
   - Suggested fix (jika ada)

### **Response Timeline**
- **Acknowledgment**: 24 jam
- **Initial Assessment**: 3 hari
- **Fix Development**: 7-14 hari
- **Public Disclosure**: Setelah fix tersedia

### **What to Include**
```
Subject: [SECURITY] CV Portfolio Website Vulnerability

Description:
[Detail kerentanan yang ditemukan]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Behavior:
[Yang seharusnya terjadi]

Actual Behavior:
[Yang benar-benar terjadi]

Environment:
- OS: [Windows/Linux/Mac]
- Browser: [Chrome/Firefox/Safari]
- Node.js Version: [Version]
- Application Version: [Version]

Impact:
[Potensi dampak kerentanan]

Suggested Fix:
[Solusi yang disarankan, jika ada]
```

## 🔧 Security Best Practices

### **For Developers**
- **Never commit** credentials atau API keys
- **Use environment variables** untuk sensitive data
- **Validate all inputs** dari user
- **Keep dependencies updated** secara berkala
- **Use HTTPS** di production
- **Implement proper logging** untuk monitoring

### **For Administrators**
- **Change default passwords** setelah deployment
- **Use strong passwords** (min 12 karakter)
- **Enable 2FA** jika tersedia
- **Regular backups** data penting
- **Monitor logs** untuk aktivitas mencurigakan
- **Keep server updated** dengan security patches

### **For Users**
- **Use strong passwords** untuk admin account
- **Don't share credentials** dengan orang lain
- **Logout** setelah selesai editing
- **Report suspicious activity** segera
- **Keep browser updated** untuk security patches

## 🛠️ Security Configuration

### **Environment Variables**
```bash
# Production
NODE_ENV=production
PORT=3000

# Security
BCRYPT_ROUNDS=10
JWT_SECRET=your-secret-key
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif
```

### **Security Headers**
```javascript
// Helmet configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));
```

### **Rate Limiting**
```javascript
// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
```

## 🔍 Security Checklist

### **Pre-Deployment**
- [ ] **Dependencies Updated**: `npm audit` clean
- [ ] **Environment Variables**: All secrets in env vars
- [ ] **Default Passwords**: Changed from defaults
- [ ] **HTTPS Enabled**: SSL certificate configured
- [ ] **Security Headers**: Helmet.js configured
- [ ] **Rate Limiting**: Enabled and configured
- [ ] **File Upload**: Validation enabled
- [ ] **CORS**: Properly configured
- [ ] **Logging**: Security events logged
- [ ] **Backup**: Data backup strategy

### **Post-Deployment**
- [ ] **Monitoring**: Security monitoring enabled
- [ ] **Logs**: Regular log review
- [ ] **Updates**: Regular security updates
- [ ] **Testing**: Penetration testing
- [ ] **Incident Response**: Plan in place
- [ ] **Documentation**: Security docs updated
- [ ] **Training**: Team security training
- [ ] **Compliance**: Security compliance checked

## 🚨 Incident Response

### **Security Incident Process**
1. **Detection**: Identify security incident
2. **Assessment**: Evaluate impact and severity
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove threat
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Document and improve

### **Contact Information**
- **Security Team**: refanvanh@gmail.com
- **Emergency**: [Your emergency contact]
- **GitHub Issues**: [Repository issues page]

## 📚 Security Resources

### **Documentation**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)

### **Tools**
- **npm audit**: `npm audit`
- **Snyk**: Vulnerability scanning
- **OWASP ZAP**: Web application security testing
- **Burp Suite**: Web vulnerability scanner

### **Training**
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [Node.js Security Course](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 🔄 Security Updates

### **Regular Updates**
- **Dependencies**: Weekly security updates
- **Node.js**: Monthly updates
- **Security Patches**: As needed
- **Documentation**: Quarterly review

### **Emergency Updates**
- **Critical Vulnerabilities**: Within 24 hours
- **High Severity**: Within 72 hours
- **Medium Severity**: Within 1 week
- **Low Severity**: Within 1 month

## 📞 Security Contact

**Email**: refanvanh@gmail.com
**Subject**: [SECURITY] CV Portfolio Website

**Response Time**: 24 hours
**Severity Levels**: Critical, High, Medium, Low

---

**⚠️ Important**: Jangan pernah share credentials atau sensitive information melalui channel publik. Selalu gunakan email untuk laporan keamanan.

**🔒 Remember**: Keamanan adalah tanggung jawab bersama. Mari kita jaga aplikasi ini tetap aman!