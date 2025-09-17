# 🚀 Deployment Guide

Panduan lengkap untuk deploy CV Portfolio Website ke berbagai platform.

## 📋 Prerequisites

- Node.js 16.20.2 atau lebih baru
- Git
- Akun platform deployment (Vercel, Railway, Heroku, dll)
- Domain (opsional)

## 🌐 Platform Deployment

### 1. Vercel (Recommended)

Vercel adalah platform terbaik untuk deploy Node.js applications dengan performa tinggi.

#### **Setup Vercel**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Project**
   ```bash
   vercel
   ```

4. **Follow Prompts:**
   - Set up and deploy? **Y**
   - Which scope? **Pilih akun Anda**
   - Link to existing project? **N**
   - What's your project's name? **cv-portfolio-website**
   - In which directory is your code located? **./**

#### **Environment Variables**
Set di Vercel Dashboard:
```
NODE_ENV=production
PORT=3000
```

#### **Custom Domain (Opsional)**
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records sesuai instruksi

#### **Auto-Deploy**
- Connect GitHub repository
- Set up automatic deployment on push to main branch

---

### 2. Railway

Railway menyediakan deployment yang mudah dengan database dan storage terintegrasi.

#### **Setup Railway**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Deploy**
   ```bash
   railway init
   railway up
   ```

#### **Environment Variables**
Set di Railway Dashboard:
```
NODE_ENV=production
PORT=3000
```

#### **Database (Opsional)**
- Add PostgreSQL database
- Update connection string di environment variables

---

### 3. Heroku

Heroku adalah platform cloud yang populer untuk deploy applications.

#### **Setup Heroku**

1. **Install Heroku CLI**
   ```bash
   # Windows
   https://devcenter.heroku.com/articles/heroku-cli
   
   # Linux/Mac
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create cv-portfolio-website
   ```

4. **Set Buildpack**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

#### **Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

#### **Procfile**
Create `Procfile` in root directory:
```
web: npm start
```

---

### 4. DigitalOcean App Platform

DigitalOcean App Platform menyediakan managed hosting dengan scaling otomatis.

#### **Setup DigitalOcean**

1. **Connect GitHub Repository**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect GitHub account
   - Select repository

2. **Configure App**
   - **Source:** GitHub
   - **Repository:** refanvanh/CV-web
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=8080
   ```

---

### 5. AWS EC2

Deploy ke Amazon EC2 untuk kontrol penuh atas server.

#### **Setup EC2**

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Select t2.micro (free tier)
   - Configure security group (port 22, 80, 443, 3000)

2. **Connect via SSH**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm git nginx
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/refanvanh/CV-web.git
   cd CV-web
   npm install
   ```

5. **Setup PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name cv-website
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/cv-website
   ```

   Nginx config:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/cv-website /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### 6. Docker Deployment

Deploy menggunakan Docker untuk konsistensi environment.

#### **Create Dockerfile**
```dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  cv-website:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
      - ./public/uploads:/app/public/uploads
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

#### **Deploy with Docker**
```bash
# Build image
docker build -t cv-portfolio-website .

# Run container
docker run -d -p 3000:3000 --name cv-website cv-portfolio-website

# Or use docker-compose
docker-compose up -d
```

---

## 🔧 Production Configuration

### **Environment Variables**
```bash
NODE_ENV=production
PORT=3000
```

### **Security Checklist**
- [ ] Ganti password default admin
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable logging
- [ ] Set up monitoring

### **Performance Optimization**
- [ ] Enable gzip compression
- [ ] Set up CDN (CloudFlare)
- [ ] Optimize images
- [ ] Enable caching
- [ ] Use PM2 cluster mode

### **Monitoring & Logging**
- [ ] Set up error tracking (Sentry)
- [ ] Configure log rotation
- [ ] Set up uptime monitoring
- [ ] Configure alerts

---

## 🌍 Custom Domain Setup

### **DNS Configuration**
1. **A Record:** Point domain to server IP
2. **CNAME:** Point www to main domain
3. **TXT Record:** Verify domain ownership

### **SSL Certificate**
```bash
# Using Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 Monitoring & Maintenance

### **Health Checks**
```bash
# Check server status
curl http://your-domain.com/api/health

# Check logs
pm2 logs cv-website
```

### **Backup Strategy**
```bash
# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Automated backup script
#!/bin/bash
cd /path/to/cv-website
tar -czf /backups/cv-backup-$(date +%Y%m%d).tar.gz data/
find /backups -name "cv-backup-*.tar.gz" -mtime +7 -delete
```

### **Updates**
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Restart application
pm2 restart cv-website
```

---

## 🚨 Troubleshooting

### **Common Issues**

**1. Port Already in Use**
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 PID
```

**2. Permission Denied**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /path/to/cv-website
chmod +x start.sh
```

**3. Database Connection Error**
```bash
# Check file permissions
ls -la data/
# Fix permissions
chmod 644 data/*.json
```

**4. Memory Issues**
```bash
# Check memory usage
free -h
# Restart with more memory
pm2 restart cv-website --max-memory-restart 500M
```

---

## 📈 Scaling

### **Horizontal Scaling**
- Load balancer (Nginx)
- Multiple app instances
- Database clustering
- CDN for static files

### **Vertical Scaling**
- Upgrade server specs
- Optimize code
- Use caching
- Database optimization

---

## 🔒 Security Hardening

### **Server Security**
```bash
# Update system
sudo apt update && sudo apt upgrade

# Configure firewall
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set PermitRootLogin no
```

### **Application Security**
- Use environment variables for secrets
- Enable HTTPS only
- Set secure headers
- Regular security updates
- Monitor logs for suspicious activity

---

**🎉 Selamat! CV Portfolio Website Anda sudah siap untuk production!**

**📞 Support:** Jika ada masalah deployment, silakan buat issue di GitHub repository.
