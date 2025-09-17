# 👨‍💻 Developer Guide

Panduan lengkap untuk developer yang ingin berkontribusi atau mengembangkan CV Portfolio Website.

## 🏗️ Architecture Overview

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Data Layer    │
│   (Client)      │    │   (Server)      │    │   (Storage)     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • HTML5         │    │ • Node.js       │    │ • JSON Files    │
│ • CSS3          │◄──►│ • Express.js    │◄──►│ • File System   │
│ • JavaScript    │    │ • Middleware    │    │ • Image Uploads │
│ • Font Awesome  │    │ • Security      │    │ • Static Files  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Technology Stack**
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Backend:** Node.js, Express.js
- **Database:** JSON file-based storage
- **Security:** Helmet.js, bcryptjs, rate limiting
- **File Upload:** Multer
- **Styling:** Custom CSS with Flexbox/Grid

## 📁 Project Structure

```
CV-web/
├── 📁 .git/                    # Git repository
├── 📁 data/                    # Data persistence layer
│   ├── cv-data.json           # CV content data
│   └── users.json             # Admin credentials
├── 📁 node_modules/           # Dependencies
├── 📁 public/                 # Static files & frontend
│   ├── index.html             # Main HTML file
│   ├── styles.css             # CSS styles
│   ├── script.js              # Frontend JavaScript
│   ├── favicon.ico            # Website icon
│   └── 📁 uploads/            # Uploaded images
│       ├── default-profile.jpg
│       ├── project1.jpg
│       ├── project2.jpg
│       └── project3.jpg
├── 📁 test files/             # Development test files
├── server.js                  # Backend server
├── package.json               # Project configuration
├── .gitignore                 # Git ignore rules
├── README.md                  # Main documentation
├── API_DOCUMENTATION.md       # API documentation
├── DEPLOYMENT_GUIDE.md        # Deployment guide
├── DEVELOPER_GUIDE.md         # This file
└── SECURITY.md                # Security guidelines
```

## 🚀 Development Setup

### **Prerequisites**
- Node.js 16.20.2+
- npm 6.0+
- Git
- Code editor (VS Code recommended)

### **Local Development**

1. **Clone Repository**
   ```bash
   git clone https://github.com/refanvanh/CV-web.git
   cd CV-web
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   # Windows
   npm start
   
   # Linux/Mac
   ./start.sh
   ```

4. **Access Application**
   - Main site: http://localhost:3001
   - Admin panel: Login with credentials in `data/users.json`

### **Development Scripts**

```bash
# Start server
npm start

# Start with specific port
PORT=3002 npm start

# Development mode with auto-restart
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## 🔧 Code Organization

### **Frontend Structure**

#### **HTML (index.html)**
- **Semantic markup** dengan proper HTML5 structure
- **Accessibility** features (ARIA labels, alt texts)
- **SEO optimization** (meta tags, structured data)
- **Responsive design** dengan viewport meta tag

#### **CSS (styles.css)**
```css
/* CSS Organization */
/* 1. Reset & Base Styles */
/* 2. Layout (Grid, Flexbox) */
/* 3. Components (Buttons, Forms, Cards) */
/* 4. Utilities (Spacing, Colors, Typography) */
/* 5. Responsive Design (Media Queries) */
/* 6. Animations & Transitions */
```

#### **JavaScript (script.js)**
```javascript
// JavaScript Organization
// 1. Global Variables & Configuration
// 2. DOM Content Loaded Event
// 3. Utility Functions
// 4. API Functions
// 5. Event Handlers
// 6. Dynamic Content Functions
// 7. Form Handling
// 8. Modal Management
```

### **Backend Structure**

#### **Server.js Organization**
```javascript
// 1. Dependencies & Imports
// 2. Configuration & Middleware
// 3. Security Middleware
// 4. API Routes
// 5. Static File Serving
// 6. Error Handling
// 7. Server Startup
```

## 🎯 Key Features Implementation

### **1. Dynamic Content Editing**

#### **Experience Section**
```javascript
// Add new experience item
function addExperienceItem() {
    experienceCounter++;
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-editor-item';
    experienceItem.innerHTML = `
        <div class="experience-controls">
            <button type="button" class="move-up-btn">↑</button>
            <button type="button" class="move-down-btn">↓</button>
            <button type="button" class="remove-item">×</button>
        </div>
        <!-- Form fields -->
    `;
    experienceEditor.appendChild(experienceItem);
}
```

#### **Skills Section**
```javascript
// Add new skill category
function addSkillCategory() {
    skillCategoryCounter++;
    const categoryId = `category_${skillCategoryCounter}`;
    const categoryName = prompt('Masukkan nama kategori keahlian:');
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skill-category';
    categoryDiv.innerHTML = `
        <div class="section-header">
            <h3>${categoryName}</h3>
            <div class="skill-category-controls">
                <button type="button" class="btn btn-secondary btn-sm" data-category="${categoryId}">+ Tambah Skill</button>
                <button type="button" class="btn btn-danger btn-sm remove-category" data-category="${categoryId}">×</button>
            </div>
        </div>
        <div class="skill-editor-list" data-category="${categoryId}"></div>
    `;
    
    skillCategoriesContainer.appendChild(categoryDiv);
}
```

### **2. File Upload System**

#### **Backend (Multer)**
```javascript
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
```

### **3. Security Implementation**

#### **Password Hashing**
```javascript
const bcrypt = require('bcryptjs');

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
```

## 🧪 Testing

### **Manual Testing Checklist**

#### **Frontend Testing**
- [ ] Responsive design di berbagai device
- [ ] Form validation bekerja dengan benar
- [ ] Modal login dan edit berfungsi
- [ ] Dynamic content (add/remove/edit) berfungsi
- [ ] File upload berfungsi
- [ ] Social media links membuka di tab baru

#### **Backend Testing**
- [ ] API endpoints mengembalikan response yang benar
- [ ] Authentication berfungsi
- [ ] File upload validation
- [ ] Rate limiting berfungsi
- [ ] Error handling yang proper

#### **Security Testing**
- [ ] Password hashing
- [ ] Input sanitization
- [ ] File upload security
- [ ] Rate limiting
- [ ] CORS configuration

### **Automated Testing (Future)**
```javascript
// Example test structure
describe('CV API', () => {
    test('GET /api/cv should return CV data', async () => {
        const response = await request(app).get('/api/cv');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
    
    test('POST /api/login should authenticate user', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'refanvanh', password: 'bnesindangpanon64' });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});
```

## 🔄 Data Flow

### **1. Page Load**
```
User visits site → Server serves HTML → JavaScript loads → API call to /api/cv → Data displayed
```

### **2. Admin Login**
```
User clicks edit → Login modal → Submit credentials → POST /api/login → JWT token → Edit modal opens
```

### **3. Content Update**
```
Admin edits content → Form submission → PUT /api/cv → Data saved to JSON → Page updated
```

### **4. File Upload**
```
Admin selects file → Form submission → POST /api/upload → File saved to uploads/ → URL returned
```

## 🎨 Styling Guidelines

### **CSS Architecture**
```css
/* 1. CSS Variables */
:root {
    --primary-color: #10b981;
    --secondary-color: #6b7280;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
    --info-color: #3b82f6;
}

/* 2. Component-based styling */
.btn {
    /* Base button styles */
}

.btn-primary {
    /* Primary button variant */
}

.btn-secondary {
    /* Secondary button variant */
}

/* 3. Utility classes */
.text-center { text-align: center; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
```

### **Responsive Design**
```css
/* Mobile First Approach */
.container {
    width: 100%;
    padding: 0 1rem;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        max-width: 750px;
        margin: 0 auto;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
    }
}
```

## 🚀 Performance Optimization

### **Frontend Optimization**
- **Minify CSS/JS** untuk production
- **Optimize images** (WebP format)
- **Lazy loading** untuk images
- **CDN** untuk static assets
- **Caching** strategies

### **Backend Optimization**
- **Gzip compression**
- **Database indexing** (jika menggunakan database)
- **Caching** untuk API responses
- **Connection pooling**
- **PM2 cluster mode**

## 🔧 Debugging

### **Frontend Debugging**
```javascript
// Console logging
console.log('Debug info:', data);

// Error handling
try {
    // Risky code
} catch (error) {
    console.error('Error:', error);
}

// Network debugging
fetch('/api/cv')
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => console.log('Data:', data))
    .catch(error => console.error('Error:', error));
```

### **Backend Debugging**
```javascript
// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});
```

## 📝 Code Standards

### **JavaScript Standards**
- **ES6+** syntax
- **const/let** instead of var
- **Arrow functions** where appropriate
- **Template literals** for strings
- **Destructuring** for objects/arrays
- **Async/await** for promises

### **CSS Standards**
- **BEM methodology** for class naming
- **Mobile-first** responsive design
- **CSS Grid/Flexbox** for layouts
- **CSS custom properties** for theming
- **Consistent spacing** scale

### **HTML Standards**
- **Semantic HTML5** elements
- **Accessibility** attributes
- **SEO-friendly** structure
- **Valid HTML** markup

## 🤝 Contributing

### **Pull Request Process**
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Create Pull Request

### **Code Review Checklist**
- [ ] Code follows project standards
- [ ] Tests pass
- [ ] No console errors
- [ ] Responsive design maintained
- [ ] Security considerations addressed
- [ ] Documentation updated

## 🐛 Common Issues & Solutions

### **Frontend Issues**

**1. Modal not opening**
```javascript
// Check if element exists
const modal = document.getElementById('editModal');
if (!modal) {
    console.error('Modal element not found');
    return;
}
```

**2. Form submission not working**
```javascript
// Check event listener attachment
const form = document.getElementById('editForm');
if (form) {
    form.addEventListener('submit', handleEditForm);
    console.log('Form event listener attached');
}
```

**3. Dynamic content not loading**
```javascript
// Check if DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Your code here
});
```

### **Backend Issues**

**1. CORS errors**
```javascript
// Check CORS configuration
app.use(cors({
    origin: ['http://localhost:3001', 'https://yourdomain.com'],
    credentials: true
}));
```

**2. File upload errors**
```javascript
// Check multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        // File type validation
    }
});
```

## 📚 Additional Resources

### **Documentation**
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

### **Tools**
- **VS Code Extensions:** Live Server, Prettier, ESLint
- **Browser DevTools:** Chrome DevTools, Firefox Developer Tools
- **API Testing:** Postman, Insomnia
- **Version Control:** Git, GitHub Desktop

---

**🎉 Happy Coding! Jika ada pertanyaan, silakan buat issue di GitHub repository.**
