# 📚 API Documentation

Dokumentasi lengkap untuk API endpoints CV Portfolio Website.

## 🔗 Base URL
```
http://localhost:3001/api
```

## 🔐 Authentication

### Login
**POST** `/api/login`

Mengautentikasi admin untuk akses ke panel edit.

**Request Body:**
```json
{
  "username": "refanvanh",
  "password": "bnesindangpanon64"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "jwt_token_here"
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

### Logout
**POST** `/api/logout`

Logout admin dan invalidate session.

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

## 📄 CV Data Management

### Get CV Data
**GET** `/api/cv`

Mengambil data CV lengkap.

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "personal": {
      "name": "Reza Fadjar Nawawi",
      "title": "IT Engineer",
      "description": "Engineer berpengalaman...",
      "email": "rezafnaw@gmail.com",
      "phone": "+62 838-9048-5939",
      "location": "Jakarta, Indonesia"
    },
    "about": {
      "text1": "Saya seorang IT Engineer...",
      "text2": "Passion saya adalah...",
      "stats": [
        {"number": "7+", "label": "Tahun Pengalaman"},
        {"number": "50+", "label": "Proyek Selesai"},
        {"number": "100%", "label": "Kepuasan Klien"}
      ]
    },
    "social": {
      "linkedin": "www.linkedin.com/in/reza-fadjar-nawawi",
      "github": "https://github.com/refanvanh/",
      "facebook": "https://www.facebook.com/rezafadjarnawawi",
      "instagram": "https://www.instagram.com/navaviinside/"
    },
    "experience": [...],
    "skills": {...},
    "projects": [...]
  }
}
```

### Update CV Data
**PUT** `/api/cv`

Update data CV dengan data baru.

**Request Body:**
```json
{
  "personal": {
    "name": "Updated Name",
    "title": "Updated Title",
    "description": "Updated description",
    "email": "updated@email.com",
    "phone": "+62 xxx-xxxx-xxxx",
    "location": "Updated Location"
  },
  "about": {
    "text1": "Updated text 1",
    "text2": "Updated text 2",
    "stats": [
      {"number": "10+", "label": "Years Experience"},
      {"number": "100+", "label": "Projects Completed"},
      {"number": "100%", "label": "Client Satisfaction"}
    ]
  },
  "social": {
    "linkedin": "https://linkedin.com/in/updated",
    "github": "https://github.com/updated",
    "facebook": "https://facebook.com/updated",
    "instagram": "https://instagram.com/updated"
  },
  "experience": [
    {
      "position": "Senior Developer",
      "company": "Tech Company",
      "period": "2020 - Present",
      "description": "Job description..."
    }
  ],
  "skills": {
    "frontend": {
      "name": "Frontend Development",
      "skills": [
        {"name": "React", "level": 90},
        {"name": "Vue.js", "level": 85}
      ]
    }
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["React", "Node.js"],
      "liveUrl": "https://project.com",
      "githubUrl": "https://github.com/project"
    }
  ]
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "CV data berhasil diperbarui",
  "data": "Updated CV data"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Data tidak valid"
}
```

## 📁 File Upload

### Upload Image
**POST** `/api/upload`

Upload gambar untuk profil atau project.

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Body:**
  - `image`: File gambar (jpg, jpeg, png, gif)
  - `type`: "profile" atau "project"

**Response Success (200):**
```json
{
  "success": true,
  "message": "File berhasil diupload",
  "filename": "uploaded_image.jpg",
  "path": "/uploads/uploaded_image.jpg"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "File tidak valid atau terlalu besar"
}
```

## 🏥 Health Check

### Server Status
**GET** `/api/health`

Cek status server dan database.

**Response Success (200):**
```json
{
  "success": true,
  "message": "Server running",
  "timestamp": "2025-09-17T14:30:00.000Z",
  "uptime": 3600,
  "dataFiles": {
    "cvData": true,
    "users": true
  }
}
```

## 📊 Data Models

### Personal Information
```typescript
interface Personal {
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
}
```

### About Section
```typescript
interface About {
  text1: string;
  text2: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
}
```

### Social Media
```typescript
interface Social {
  linkedin: string;
  github: string;
  facebook: string;
  instagram: string;
}
```

### Experience
```typescript
interface Experience {
  position: string;
  company: string;
  period: string;
  description: string;
}
```

### Skills
```typescript
interface Skill {
  name: string;
  level: number; // 0-100
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}
```

### Projects
```typescript
interface Project {
  name: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  image?: string;
}
```

## 🚨 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request berhasil |
| 400 | Bad Request | Data tidak valid |
| 401 | Unauthorized | Tidak terautentikasi |
| 403 | Forbidden | Akses ditolak |
| 404 | Not Found | Resource tidak ditemukan |
| 413 | Payload Too Large | File terlalu besar |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## 🔧 Rate Limiting

- **Limit:** 100 requests per 15 menit per IP
- **Headers:**
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 99
  - `X-RateLimit-Reset`: 1634567890

## 🛡️ Security Headers

- **Content-Security-Policy:** Restrict resource loading
- **X-Frame-Options:** DENY
- **X-Content-Type-Options:** nosniff
- **Referrer-Policy:** strict-origin-when-cross-origin

## 📝 Example Usage

### JavaScript (Fetch)
```javascript
// Login
const login = async (username, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

// Get CV Data
const getCVData = async () => {
  const response = await fetch('/api/cv');
  return response.json();
};

// Update CV Data
const updateCVData = async (data) => {
  const response = await fetch('/api/cv', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"refanvanh","password":"bnesindangpanon64"}'

# Get CV Data
curl http://localhost:3001/api/cv

# Update CV Data
curl -X PUT http://localhost:3001/api/cv \
  -H "Content-Type: application/json" \
  -d '{"personal":{"name":"New Name"}}'
```

## 🔄 WebSocket (Future)

Planned WebSocket implementation untuk real-time updates:
- `/ws/cv-updates` - Real-time CV data updates
- `/ws/admin-activity` - Admin activity monitoring

---

**📞 Support:** Jika ada pertanyaan tentang API, silakan buat issue di GitHub repository.
