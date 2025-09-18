const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root path
app.get('/', (req, res) => {
  try {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).json({ 
      error: 'Failed to load page',
      details: error.message,
      isVercel: isVercel
    });
  }
});

// Serve static files explicitly
app.get('/styles.css', (req, res) => {
  try {
    console.log('Serving styles.css');
    res.sendFile(path.join(__dirname, 'public', 'styles.css'));
  } catch (error) {
    console.error('Error serving styles.css:', error);
    res.status(404).send('CSS file not found');
  }
});

app.get('/script.js', (req, res) => {
  try {
    console.log('Serving script.js');
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
  } catch (error) {
    console.error('Error serving script.js:', error);
    res.status(404).send('JS file not found');
  }
});

app.get('/uploads/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    console.log('Serving upload file:', filename);
    res.sendFile(path.join(__dirname, 'public', 'uploads', filename));
  } catch (error) {
    console.error('Error serving upload file:', error);
    res.status(404).send('File not found');
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!require('fs').existsSync(uploadDir)) {
      require('fs').mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
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
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Data file paths
const DATA_DIR = 'data';
const CV_DATA_FILE = path.join(DATA_DIR, 'cv-data.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// In-memory storage for Vercel (read-only file system)
let inMemoryData = null;
let inMemoryUsers = null;

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Default data functions
function getDefaultCVData() {
  return {
    personal: {
      name: "Reza Fadjar Nawawi",
      title: "IT Engineer",
      description: "Engineer berpengalaman dengan passion menciptakan solusi digital inovatif dan user-friendly, didukung kemampuan problem-solving kuat di bidang software maupun hardware.",
      email: "rezafnaw@gmail.com",
      phone: "+62 838-9048-5939",
      location: "Bandung, Indonesia",
      profileImage: "/uploads/default-profile.jpg"
    },
    about: {
      text1: "Saya seorang IT Engineer dengan keahlian sebagai Full Stack Developer, Data Engineer, Hardware Engineer, dan Network Engineer, serta memiliki pengalaman profesional lebih dari 7 tahun di dunia teknologi. Berpengalaman dalam berbagai teknologi modern dan terus mengembangkan diri dengan mempelajari hal-hal baru.",
      text2: "Passion saya adalah menciptakan solusi teknologi yang tidak hanya fungsional, tetapi juga menghadirkan pengalaman pengguna yang optimal. Saya percaya bahwa teknologi terbaik adalah teknologi yang sederhana, efektif, dan mudah digunakan oleh semua orang.",
      stats: [
        { number: "7+", label: "Tahun Pengalaman" },
        { number: "4", label: "Proyek Selesai" },
        { number: "99+", label: "Klien Puas" }
      ]
    },
    experience: [
      {
        id: 1,
        position: "Full Stack Developer",
        company: "Freelance",
        period: "2025",
        description: "Mengembangkan aplikasi web end-to-end mulai dari perancangan database, implementasi backend, hingga pengembangan antarmuka frontend. Berpengalaman dalam integrasi API, optimasi performa aplikasi, serta memastikan pengalaman pengguna yang responsif dan user-friendly."
      },
      {
        id: 2,
        position: "Data Engineer",
        company: "PT Prosa Solusi Cerdas",
        period: "2018 - 2025",
        description: "Bertanggung jawab dalam merancang, mengelola, dan mengoptimalkan pipeline data untuk mendukung analisis dan pengembangan model AI. Berpengalaman dalam pengolahan data terstruktur maupun tidak terstruktur, serta kolaborasi lintas tim untuk memastikan ketersediaan data yang akurat, bersih, dan terintegrasi."
      },
      {
        id: 3,
        position: "Hardware and Network Engineer",
        company: "Freelance",
        period: "2015 - 2025",
        description: "Menangani instalasi, konfigurasi, dan troubleshooting perangkat keras serta jaringan. Berpengalaman dalam perbaikan komputer/laptop, optimasi sistem, dan pengelolaan jaringan WiFi maupun LAN untuk memastikan kinerja perangkat dan konektivitas yang stabil."
      }
    ],
    skills: {
      frontend: {
        name: "Frontend Development",
        skills: [
          { name: "React", level: 90 },
          { name: "Vue.js", level: 85 },
          { name: "JavaScript", level: 95 },
          { name: "TypeScript", level: 80 },
          { name: "HTML5", level: 95 },
          { name: "CSS3", level: 90 }
        ]
      },
      backend: {
        name: "Backend Development",
        skills: [
          { name: "Node.js", level: 88 },
          { name: "Python", level: 97 },
          { name: "PHP", level: 70 },
          { name: "MySQL", level: 85 },
          { name: "MongoDB", level: 80 },
          { name: "Express.js", level: 85 }
        ]
      },
      tools: {
        name: "Tools & Technologies",
        skills: [
          { name: "Git", level: 90 },
          { name: "Docker", level: 84 },
          { name: "Google Cloud", level: 80 },
          { name: "Bash", level: 92 },
          { name: "Firebase", level: 75 },
          { name: "Postman", level: 85 }
        ]
      }
    },
    projects: [
      {
        id: 1,
        name: "Platform Booking Mabar Badminton RaketerS",
        description: "Membangun platform digital yang memudahkan pemain badminton dalam melakukan booking sesi main bersama (mabar). Proyek ini bertujuan untuk meningkatkan kemudahan koordinasi, keteraturan jadwal, dan pengalaman bermain yang lebih terorganisir bagi komunitas badminton.",
        technologies: ["React", "TypeScript", "Node.js", "Express.js", "Google Sheets API", "Google Cloud Service Account", "Firebase Authentication", "ESLint", "Vercel", "Railway", "Docker"],
        liveUrl: "https://raketers.com",
        githubUrl: "https://github.com/refanvanh/bookingmabar-web",
        image: "/uploads/project1.jpg"
      },
      {
        id: 2,
        name: "Toko Oleh-Oleh Khas Serang Chadel Food",
        description: "Mengembangkan platform penjualan produk kuliner khas Serang dengan brand Chadel Food, yang berfokus pada penyediaan oleh-oleh lokal berkualitas. Proyek ini mendukung promosi UMKM daerah, memperluas distribusi produk, serta memberikan pengalaman belanja yang mudah dan modern bagi pelanggan.",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        liveUrl: "https://chadelfood.github.io/chadelfood/",
        githubUrl: "https://github.com/chadelfood/chadelfood",
        image: "/uploads/project2.jpg"
      },
      {
        id: 3,
        name: "Absensi Karyawan",
        description: "Membangun sistem absensi digital untuk mencatat kehadiran karyawan secara lebih efisien, akurat, dan mudah diakses. Proyek ini mendukung automasi proses administrasi, pelacakan jam kerja, serta penyusunan laporan kehadiran yang terintegrasi.",
        technologies: ["HTML5", "CSS3", "Vanilla JavaScript", "Google Sheets API", "Google Apps Script", "Google Cloud Console"],
        liveUrl: "https://refanvanh.github.io/presensi-web/",
        githubUrl: "https://github.com/refanvanh/presensi-web",
        image: "/uploads/project3.jpg"
      }
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/reza-fadjar-nawawi",
      github: "https://github.com/refanvanh/",
      facebook: "https://www.facebook.com/rezafadjarnawawi",
      instagram: "https://www.instagram.com/navaviinside/"
    }
  };
}

function getDefaultUsersData() {
  return {
    users: [
      {
        id: 1,
        username: "refanvanh",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // bnesindangpanon64
        role: "admin",
        createdAt: new Date().toISOString()
      }
    ]
  };
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    if (!isVercel) {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
    
    // Load data from file if exists, otherwise use default
    if (isVercel) {
      // On Vercel, try to load from file first, then use default
      try {
        const fileData = await fs.readFile(CV_DATA_FILE, 'utf8');
        inMemoryData = JSON.parse(fileData);
        console.log('Loaded CV data from file for Vercel');
        console.log('About section loaded:', inMemoryData.about);
      } catch (error) {
        console.log('Could not load CV data from file, using default data');
        console.log('Error:', error.message);
        inMemoryData = getDefaultCVData();
      }
      
      try {
        const usersData = await fs.readFile(USERS_FILE, 'utf8');
        inMemoryUsers = JSON.parse(usersData);
        console.log('Loaded users data from file for Vercel');
      } catch (error) {
        console.log('Could not load users data from file, using default data');
        inMemoryUsers = getDefaultUsersData();
      }
    } else if (!await fileExists(CV_DATA_FILE)) {
      const defaultCVData = getDefaultCVData();
      if (isVercel) {
        inMemoryData = defaultCVData;
      } else {
        await fs.writeFile(CV_DATA_FILE, JSON.stringify(defaultCVData, null, 2));
      }
    }

    // Initialize users if not exists
    if (isVercel || !await fileExists(USERS_FILE)) {
      const hashedPassword = await bcrypt.hash('bnesindangpanon64', 10);
      const defaultUsers = [
        {
          id: 1,
          username: 'refanvanh',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
      if (isVercel) {
        inMemoryUsers = defaultUsers;
      } else {
        await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
      }
    }
  } catch (error) {
    console.error('Error initializing data directory:', error);
  }
}

// Helper function to check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Helper function to read CV data
async function readCVData() {
  try {
    if (isVercel) {
      if (!inMemoryData) {
        console.log('Initializing in-memory data for Vercel...');
        await ensureDataDir();
      }
      return inMemoryData;
    } else {
      return JSON.parse(await fs.readFile(CV_DATA_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error in readCVData:', error);
    throw error;
  }
}

// Helper function to write CV data
async function writeCVData(data) {
  if (isVercel) {
    inMemoryData = data;
  } else {
    await fs.writeFile(CV_DATA_FILE, JSON.stringify(data, null, 2));
  }
}

// Helper function to read users data
async function readUsersData() {
  try {
    if (isVercel) {
      if (!inMemoryUsers) {
        console.log('Initializing in-memory users for Vercel...');
        await ensureDataDir();
      }
      return inMemoryUsers;
    } else {
      return JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error in readUsersData:', error);
    throw error;
  }
}

// Helper function to write users data
async function writeUsersData(data) {
  if (isVercel) {
    inMemoryUsers = data;
  } else {
    await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
  }
}

// JWT Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const users = await readUsersData();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get CV data
app.get('/api/cv', async (req, res) => {
  try {
    console.log('Getting CV data...');
    const cvData = await readCVData();
    console.log('CV data retrieved successfully');
    console.log('About section in response:', cvData.about);
    res.json(cvData);
  } catch (error) {
    console.error('Error reading CV data:', error);
    res.status(500).json({ 
      error: 'Failed to load CV data',
      details: error.message,
      isVercel: isVercel
    });
  }
});

// Update CV data
app.put('/api/cv', authenticateToken, async (req, res) => {
  try {
    const updatedData = req.body;
    updatedData.lastUpdated = new Date().toISOString();
    
    await writeCVData(updatedData);
    res.json({ success: true, message: 'CV data updated successfully' });
  } catch (error) {
    console.error('Error updating CV data:', error);
    res.status(500).json({ error: 'Failed to update CV data' });
  }
});

// Upload profile image
app.post('/api/upload/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Update CV data with new image URL
    const cvData = await readCVData();
    cvData.personal.profileImage = imageUrl;
    cvData.lastUpdated = new Date().toISOString();
    
    await writeCVData(cvData);
    
    res.json({ 
      success: true, 
      imageUrl,
      message: 'Profile image updated successfully' 
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload project image
app.post('/api/upload/project', authenticateToken, upload.single('projectImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl,
      message: 'Project image uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // In a real application, you would save this to a database
    // For now, we'll just log it
    console.log('Contact form submission:', { name, email, subject, message, timestamp: new Date() });

    res.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dataStatus = {
      cvData: false,
      users: false
    };
    
    try {
      const cvData = await readCVData();
      dataStatus.cvData = !!cvData;
    } catch (e) {
      console.error('CV data check failed:', e.message);
    }
    
    try {
      const users = await readUsersData();
      dataStatus.users = !!users;
    } catch (e) {
      console.error('Users data check failed:', e.message);
    }
    
    res.json({ 
      success: true, 
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      isVercel: isVercel,
      dataStatus: dataStatus
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Health check failed',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  await ensureDataDir();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
    console.log(`🔐 Admin credentials: Check ${USERS_FILE}`);
    console.log(`📝 CV data file: ${CV_DATA_FILE}`);
  });
}

startServer().catch(console.error);
