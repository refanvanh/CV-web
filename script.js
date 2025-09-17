// Global variables
let isLoggedIn = false;
let currentUser = null;
const API_BASE_URL = window.location.origin + '/api';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupSmoothScrolling();
    setupSkillBars();
});

// Initialize the application
async function initializeApp() {
    // Check if user is already logged in (from localStorage)
    const savedLogin = localStorage.getItem('cvAdminLogin');
    if (savedLogin) {
        const loginData = JSON.parse(savedLogin);
        if (loginData.isLoggedIn && loginData.expires > Date.now()) {
            isLoggedIn = true;
            currentUser = loginData.user;
            updateUIForLoggedInUser();
        }
    }
    
    // Load CV data from server
    await loadCVDataFromServer();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Edit form submission
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditForm);
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Skill range inputs
    const skillRanges = document.querySelectorAll('.skill-range');
    skillRanges.forEach(range => {
        range.addEventListener('input', function() {
            const percentage = this.nextElementSibling;
            percentage.textContent = this.value + '%';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const loginModal = document.getElementById('loginModal');
        const editModal = document.getElementById('editModal');
        
        if (event.target === loginModal) {
            closeLoginModal();
        }
        if (event.target === editModal) {
            closeEditModal();
        }
    });
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup skill bars animation
function setupSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                skillBar.style.width = '0%';
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 100);
                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Modal functions
function openLoginModal() {
    if (isLoggedIn) {
        openEditModal();
        return;
    }
    
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openEditModal() {
    if (!isLoggedIn) {
        openLoginModal();
        return;
    }
    
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loadCurrentData();
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Login handling
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            isLoggedIn = true;
            currentUser = data.user;
            
            // Save login state to localStorage (expires in 24 hours)
            const loginData = {
                isLoggedIn: true,
                user: currentUser,
                token: data.token,
                expires: Date.now() + (24 * 60 * 60 * 1000)
            };
            localStorage.setItem('cvAdminLogin', JSON.stringify(loginData));
            
            updateUIForLoggedInUser();
            closeLoginModal();
            showNotification('Login berhasil!', 'success');
            
            // Open edit modal after successful login
            setTimeout(() => {
                openEditModal();
            }, 500);
        } else {
            showNotification(data.error || 'Username atau password salah!', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Terjadi kesalahan saat login. Coba lagi.', 'error');
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit CV';
        editBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }
}

// Load current data into edit form
async function loadCurrentData() {
    try {
        const cvData = await loadCVDataFromServer();
        if (cvData) {
            // Populate personal information
            document.getElementById('editName').value = cvData.personal.name || '';
            document.getElementById('editTitle').value = cvData.personal.title || '';
            document.getElementById('editDescription').value = cvData.personal.description || '';
            document.getElementById('editEmail').value = cvData.personal.email || '';
            document.getElementById('editPhone').value = cvData.personal.phone || '';
        }
    } catch (error) {
        console.error('Error loading current data:', error);
        showNotification('Gagal memuat data CV', 'error');
    }
}

// Handle edit form submission
async function handleEditForm(e) {
    e.preventDefault();
    
    try {
        // Get form data
        const name = document.getElementById('editName').value;
        const title = document.getElementById('editTitle').value;
        const description = document.getElementById('editDescription').value;
        const email = document.getElementById('editEmail').value;
        const phone = document.getElementById('editPhone').value;
        
        // Get current CV data
        const currentCVData = await loadCVDataFromServer();
        
        // Update personal information
        const updatedCVData = {
            ...currentCVData,
            personal: {
                ...currentCVData.personal,
                name: name,
                title: title,
                description: description,
                email: email,
                phone: phone
            }
        };
        
        // Save to server
        const success = await saveCVDataToServer(updatedCVData);
        
        if (success) {
            // Update the page content
            updatePageContent({
                name: name,
                title: title,
                description: description,
                email: email,
                phone: phone
            });
            
            showNotification('CV berhasil diperbarui!', 'success');
            closeEditModal();
        } else {
            showNotification('Gagal menyimpan perubahan', 'error');
        }
    } catch (error) {
        console.error('Error saving CV data:', error);
        showNotification('Terjadi kesalahan saat menyimpan', 'error');
    }
}

// Update page content
function updatePageContent(data) {
    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && data.name) {
        heroTitle.innerHTML = `Halo, Saya <span class="highlight">${data.name}</span>`;
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && data.title) {
        heroSubtitle.textContent = data.title;
    }
    
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription && data.description) {
        heroDescription.textContent = data.description;
    }
    
    // Update contact section
    const contactItems = document.querySelectorAll('.contact-item');
    if (contactItems.length >= 2) {
        // Update email
        const emailItem = contactItems[0];
        const emailP = emailItem.querySelector('p');
        if (emailP && data.email) {
            emailP.textContent = data.email;
        }
        
        // Update phone
        const phoneItem = contactItems[1];
        const phoneP = phoneItem.querySelector('p');
        if (phoneP && data.phone) {
            phoneP.textContent = data.phone;
        }
    }
}

// Handle contact form submission
async function handleContactForm(e) {
    e.preventDefault();
    
    try {
        // Get form data
        const formData = new FormData(e.target);
        const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const subject = formData.get('subject') || e.target.querySelectorAll('input[type="text"]')[1].value;
        const message = formData.get('message') || e.target.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Mohon lengkapi semua field!', 'error');
            return;
        }
        
        // Send to server
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, subject, message })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
            e.target.reset();
        } else {
            showNotification(data.error || 'Gagal mengirim pesan', 'error');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        showNotification('Terjadi kesalahan saat mengirim pesan', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: background-color 0.3s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// API Functions

// Load CV data from server
async function loadCVDataFromServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/cv`);
        if (response.ok) {
            const cvData = await response.json();
            updatePageContentFromServer(cvData);
            return cvData;
        } else {
            console.error('Failed to load CV data from server');
            return null;
        }
    } catch (error) {
        console.error('Error loading CV data from server:', error);
        return null;
    }
}

// Save CV data to server
async function saveCVDataToServer(cvData) {
    try {
        const loginData = JSON.parse(localStorage.getItem('cvAdminLogin') || '{}');
        const token = loginData.token;
        
        if (!token) {
            showNotification('Anda harus login terlebih dahulu', 'error');
            return false;
        }
        
        const response = await fetch(`${API_BASE_URL}/cv`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cvData)
        });
        
        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            showNotification(data.error || 'Gagal menyimpan data', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error saving CV data to server:', error);
        showNotification('Terjadi kesalahan saat menyimpan', 'error');
        return false;
    }
}

// Update page content from server data
function updatePageContentFromServer(cvData) {
    if (!cvData) return;
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && cvData.personal.name) {
        heroTitle.innerHTML = `Halo, Saya <span class="highlight">${cvData.personal.name}</span>`;
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && cvData.personal.title) {
        heroSubtitle.textContent = cvData.personal.title;
    }
    
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription && cvData.personal.description) {
        heroDescription.textContent = cvData.personal.description;
    }
    
    // Update profile image
    const profileImg = document.querySelector('.profile-img');
    if (profileImg && cvData.personal.profileImage) {
        profileImg.src = cvData.personal.profileImage;
    }
    
    // Update contact section
    const contactItems = document.querySelectorAll('.contact-item');
    if (contactItems.length >= 3) {
        // Update email
        const emailItem = contactItems[0];
        const emailP = emailItem.querySelector('p');
        if (emailP && cvData.personal.email) {
            emailP.textContent = cvData.personal.email;
        }
        
        // Update phone
        const phoneItem = contactItems[1];
        const phoneP = phoneItem.querySelector('p');
        if (phoneP && cvData.personal.phone) {
            phoneP.textContent = cvData.personal.phone;
        }
        
        // Update location
        const locationItem = contactItems[2];
        const locationP = locationItem.querySelector('p');
        if (locationP && cvData.personal.location) {
            locationP.textContent = cvData.personal.location;
        }
    }
    
    // Update experience section
    updateExperienceSection(cvData.experience);
    
    // Update skills section
    updateSkillsSection(cvData.skills);
    
    // Update projects section
    updateProjectsSection(cvData.projects);
}

// Update experience section
function updateExperienceSection(experiences) {
    const timeline = document.querySelector('.timeline');
    if (!timeline || !experiences) return;
    
    timeline.innerHTML = '';
    
    experiences.forEach((exp, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h3>${exp.position}</h3>
                <h4>${exp.company}</h4>
                <span class="timeline-date">${exp.period}</span>
                <p>${exp.description}</p>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });
}

// Update skills section
function updateSkillsSection(skills) {
    if (!skills) return;
    
    // Update frontend skills
    if (skills.frontend) {
        const frontendSkills = document.querySelector('.skill-category:first-child .skill-items');
        if (frontendSkills) {
            frontendSkills.innerHTML = '';
            skills.frontend.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.innerHTML = `
                    <span>${skill.name}</span>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                `;
                frontendSkills.appendChild(skillItem);
            });
        }
    }
    
    // Update backend skills
    if (skills.backend) {
        const backendSkills = document.querySelector('.skill-category:nth-child(2) .skill-items');
        if (backendSkills) {
            backendSkills.innerHTML = '';
            skills.backend.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.innerHTML = `
                    <span>${skill.name}</span>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                `;
                backendSkills.appendChild(skillItem);
            });
        }
    }
    
    // Update tools skills
    if (skills.tools) {
        const toolsSkills = document.querySelector('.skill-category:last-child .skill-items');
        if (toolsSkills) {
            toolsSkills.innerHTML = '';
            skills.tools.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.innerHTML = `
                    <span>${skill.name}</span>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                `;
                toolsSkills.appendChild(skillItem);
            });
        }
    }
}

// Update projects section
function updateProjectsSection(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || !projects) return;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image || 'https://via.placeholder.com/400x250/4f46e5/ffffff?text=Project'}" alt="${project.name}">
                <div class="project-overlay">
                    <a href="${project.liveUrl || '#'}" class="project-link"><i class="fas fa-external-link-alt"></i></a>
                    <a href="${project.githubUrl || '#'}" class="project-link"><i class="fab fa-github"></i></a>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

// Logout functionality
function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('cvAdminLogin');
    
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editBtn.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
    }
    
    showNotification('Anda telah logout', 'info');
}

// Add logout button to edit modal
function addLogoutButton() {
    const editModal = document.getElementById('editModal');
    if (editModal && !editModal.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-secondary logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.style.cssText = 'position: absolute; top: 15px; left: 20px;';
        logoutBtn.onclick = function() {
            logout();
            closeEditModal();
        };
        
        const modalContent = editModal.querySelector('.modal-content');
        modalContent.style.position = 'relative';
        modalContent.appendChild(logoutBtn);
    }
}

// Initialize logout button when edit modal opens
const originalOpenEditModal = openEditModal;
openEditModal = function() {
    originalOpenEditModal();
    addLogoutButton();
};
