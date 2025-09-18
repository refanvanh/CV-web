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
    try {
        console.log('Initializing app...');
        
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
        console.log('Loading CV data from server...');
        await loadCVDataFromServer();
        
        // Fallback: Ensure social media links are clickable even if data loading fails
        setTimeout(() => {
            ensureSocialLinksClickable();
        }, 2000);
        
        console.log('App initialized successfully');
        
        // Test edit button after initialization
        setTimeout(() => {
            const editButton = document.getElementById('editButton');
            if (editButton) {
                console.log('Edit button test - element exists:', editButton);
                console.log('Edit button test - computed style:', window.getComputedStyle(editButton));
                console.log('Edit button test - pointer events:', window.getComputedStyle(editButton).pointerEvents);
            }
        }, 1000);
    } catch (error) {
        console.error('Error initializing app:', error);
        // Continue even if there's an error
    }
}

// Setup event listeners
function setupEventListeners() {
    // Edit button
    const editButton = document.getElementById('editButton');
    if (editButton) {
        console.log('Edit button found:', editButton);
        editButton.addEventListener('click', function(e) {
            console.log('Edit button clicked!');
            e.preventDefault();
            openLoginModal();
        });
        console.log('Edit button event listener added');
        
        // Test if button is clickable
        editButton.style.pointerEvents = 'auto';
        editButton.style.cursor = 'pointer';
    } else {
        console.error('Edit button not found!');
    }

    // Close buttons
    const closeLoginBtn = document.getElementById('closeLoginModal');
    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', closeLoginModal);
    }

    const closeEditBtn = document.getElementById('closeEditModal');
    if (closeEditBtn) {
        closeEditBtn.addEventListener('click', closeEditModal);
    }

    const cancelEdit = document.getElementById('cancelEdit');
    if (cancelEdit) {
        cancelEdit.addEventListener('click', closeEditModal);
    }

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
    
    // Add event listeners for dynamic buttons
    const addExperienceBtn = document.getElementById('addExperience');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', addExperienceItem);
        console.log('Add experience button event listener added');
    } else {
        console.error('Add experience button not found!');
    }
    
    const addProjectBtn = document.getElementById('addProject');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', addProjectItem);
        console.log('Add project button event listener added');
    } else {
        console.error('Add project button not found!');
    }
    
    // Add skill category button
    const addSkillCategoryBtn = document.getElementById('addSkillCategory');
    if (addSkillCategoryBtn) {
        addSkillCategoryBtn.addEventListener('click', addSkillCategory);
        console.log('Add skill category button event listener added');
    }
    
    // Add event listeners for skill category buttons
    const skillButtons = document.querySelectorAll('[data-category]');
    console.log(`Found ${skillButtons.length} skill category buttons`);
    skillButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            console.log(`Adding skill item for category: ${category}`);
            addSkillItem(category);
        });
    });
    
    // Remove category buttons
    document.querySelectorAll('.remove-category').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            removeSkillCategory(category);
        });
    });
    
    // Edit form submission
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditForm);
        console.log('Edit form event listener added');
        
        // Also add click listener to submit button as backup
        const submitButton = editForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Submit button clicked');
                handleEditForm(e);
            });
            console.log('Submit button click listener added');
        }
    } else {
        console.error('Edit form not found!');
    }

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
    // Only select navigation links that start with # (internal links)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only process hash links (internal navigation), not external URLs
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // For external links (social media), let them open normally
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
    console.log('openLoginModal called, isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn) {
        console.log('User is logged in, opening edit modal');
        openEditModal();
        return;
    }
    
    console.log('Opening login modal');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('Login modal opened successfully');
    } else {
        console.error('Login modal not found!');
    }
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
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Debug: Check if buttons are visible
        const addExperienceBtn = document.getElementById('addExperience');
        const addProjectBtn = document.getElementById('addProject');
        console.log('Add experience button visible:', addExperienceBtn ? 'Yes' : 'No');
        console.log('Add project button visible:', addProjectBtn ? 'Yes' : 'No');
        
        loadCurrentData();
    }
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
    const clickedButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
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
            document.getElementById('editLocation').value = cvData.personal.location || '';
            
            // Populate about section
            if (cvData.about) {
                document.getElementById('editAboutText1').value = cvData.about.text1 || '';
                document.getElementById('editAboutText2').value = cvData.about.text2 || '';
                
                if (cvData.about.stats) {
                    document.getElementById('editStat1Number').value = cvData.about.stats[0]?.number || '';
                    document.getElementById('editStat1Label').value = cvData.about.stats[0]?.label || '';
                    document.getElementById('editStat2Number').value = cvData.about.stats[1]?.number || '';
                    document.getElementById('editStat2Label').value = cvData.about.stats[1]?.label || '';
                    document.getElementById('editStat3Number').value = cvData.about.stats[2]?.number || '';
                    document.getElementById('editStat3Label').value = cvData.about.stats[2]?.label || '';
                }
            }
            
            // Populate social media
            if (cvData.social) {
                document.getElementById('editLinkedin').value = cvData.social.linkedin || '';
                document.getElementById('editGithub').value = cvData.social.github || '';
                document.getElementById('editFacebook').value = cvData.social.facebook || '';
                document.getElementById('editInstagram').value = cvData.social.instagram || '';
            }
            
            // Load dynamic data after a short delay to ensure elements are rendered
            setTimeout(() => {
                loadDynamicData();
            }, 100);
        }
    } catch (error) {
        console.error('Error loading current data:', error);
        showNotification('Gagal memuat data CV', 'error');
    }
}

// Handle edit form submission
async function handleEditForm(e) {
    e.preventDefault();
    console.log('Form submission started...');
    
    try {
        // Get form data
        const name = document.getElementById('editName')?.value || '';
        const title = document.getElementById('editTitle')?.value || '';
        const description = document.getElementById('editDescription')?.value || '';
        const email = document.getElementById('editEmail')?.value || '';
        const phone = document.getElementById('editPhone')?.value || '';
        const location = document.getElementById('editLocation')?.value || '';
        
        console.log('Form data collected:', { name, title, description, email, phone, location });
        
        // Get about data
        const aboutText1 = document.getElementById('editAboutText1').value;
        const aboutText2 = document.getElementById('editAboutText2').value;
        const stat1Number = document.getElementById('editStat1Number').value;
        const stat1Label = document.getElementById('editStat1Label').value;
        const stat2Number = document.getElementById('editStat2Number').value;
        const stat2Label = document.getElementById('editStat2Label').value;
        const stat3Number = document.getElementById('editStat3Number').value;
        const stat3Label = document.getElementById('editStat3Label').value;
        
        // Get social media data
        const linkedin = document.getElementById('editLinkedin').value;
        const github = document.getElementById('editGithub').value;
        const facebook = document.getElementById('editFacebook').value;
        const instagram = document.getElementById('editInstagram').value;
        
        // Get dynamic data
        console.log('Getting dynamic data...');
        const experiences = getExperienceData();
        const skills = getSkillsData();
        const projects = getProjectsData();
        console.log('Dynamic data:', { experiences, skills, projects });
        
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
                phone: phone,
                location: location
            },
            about: {
                text1: aboutText1,
                text2: aboutText2,
                stats: [
                    { number: stat1Number, label: stat1Label },
                    { number: stat2Number, label: stat2Label },
                    { number: stat3Number, label: stat3Label }
                ]
            },
            social: {
                linkedin: linkedin,
                github: github,
                facebook: facebook,
                instagram: instagram
            },
            experience: experiences,
            skills: skills,
            projects: projects
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
                phone: phone,
                location: location,
                about: {
                    text1: aboutText1,
                    text2: aboutText2,
                    stats: [
                        { number: stat1Number, label: stat1Label },
                        { number: stat2Number, label: stat2Label },
                        { number: stat3Number, label: stat3Label }
                    ]
                },
                social: {
                    linkedin: linkedin,
                    github: github,
                    facebook: facebook,
                    instagram: instagram
                }
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
    const heroName = document.getElementById('heroName');
    if (heroName && data.name) {
        heroName.textContent = data.name;
    }
    
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle && data.title) {
        heroTitle.textContent = data.title;
    }
    
    const heroDescription = document.getElementById('heroDescription');
    if (heroDescription && data.description) {
        heroDescription.textContent = data.description;
    }
    
    // Update about section
    if (data.about) {
        const aboutText1 = document.getElementById('aboutText1');
        if (aboutText1 && data.about.text1) {
            aboutText1.textContent = data.about.text1;
        }
        
        const aboutText2 = document.getElementById('aboutText2');
        if (aboutText2 && data.about.text2) {
            aboutText2.textContent = data.about.text2;
        }
        
        // Update stats
        if (data.about.stats) {
            const stat1Number = document.getElementById('stat1Number');
            const stat1Label = document.getElementById('stat1Label');
            const stat2Number = document.getElementById('stat2Number');
            const stat2Label = document.getElementById('stat2Label');
            const stat3Number = document.getElementById('stat3Number');
            const stat3Label = document.getElementById('stat3Label');
            
            if (stat1Number && data.about.stats[0]?.number) {
                stat1Number.textContent = data.about.stats[0].number;
            }
            if (stat1Label && data.about.stats[0]?.label) {
                stat1Label.textContent = data.about.stats[0].label;
            }
            if (stat2Number && data.about.stats[1]?.number) {
                stat2Number.textContent = data.about.stats[1].number;
            }
            if (stat2Label && data.about.stats[1]?.label) {
                stat2Label.textContent = data.about.stats[1].label;
            }
            if (stat3Number && data.about.stats[2]?.number) {
                stat3Number.textContent = data.about.stats[2].number;
            }
            if (stat3Label && data.about.stats[2]?.label) {
                stat3Label.textContent = data.about.stats[2].label;
            }
        }
    }
    
    // Update social media links
    if (data.social) {
        const socialLinks = document.querySelectorAll('.social-link');
        if (socialLinks.length >= 4) {
            if (data.social.linkedin) {
                socialLinks[0].href = data.social.linkedin;
                socialLinks[0].target = '_blank';
                socialLinks[0].rel = 'noopener noreferrer';
            }
            if (data.social.github) {
                socialLinks[1].href = data.social.github;
                socialLinks[1].target = '_blank';
                socialLinks[1].rel = 'noopener noreferrer';
            }
            if (data.social.facebook) {
                socialLinks[2].href = data.social.facebook;
                socialLinks[2].target = '_blank';
                socialLinks[2].rel = 'noopener noreferrer';
            }
            if (data.social.instagram) {
                socialLinks[3].href = data.social.instagram;
                socialLinks[3].target = '_blank';
                socialLinks[3].rel = 'noopener noreferrer';
            }
        }
    }
    
    // Update contact section
    const contactEmail = document.getElementById('contactEmail');
    if (contactEmail && data.email) {
        contactEmail.textContent = data.email;
    }
    
    const contactPhone = document.getElementById('contactPhone');
    if (contactPhone && data.phone) {
        contactPhone.textContent = data.phone;
    }
    
    const contactLocation = document.getElementById('contactLocation');
    if (contactLocation && data.location) {
        contactLocation.textContent = data.location;
    }
    
    // Update experience section
    if (data.experience) {
        updateExperienceSection(data.experience);
    }
    
    // Update skills section
    if (data.skills) {
        updateSkillsSection(data.skills);
    }
    
    // Update projects section
    if (data.projects) {
        updateProjectsSection(data.projects);
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
        <button class="notification-close">
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
    
    // Add event listener for close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
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

// Ensure social media links are clickable
function ensureSocialLinksClickable() {
    console.log('Ensuring social media links are clickable...');
    const socialLinks = document.querySelectorAll('.social-link');
    console.log('Found social links for fallback:', socialLinks.length);
    
    // Default social media URLs (fallback)
    const defaultSocialUrls = {
        linkedin: 'https://www.linkedin.com/in/reza-fadjar-nawawi',
        github: 'https://github.com/refanvanh/',
        facebook: 'https://www.facebook.com/rezafadjarnawawi',
        instagram: 'https://www.instagram.com/navaviinside/'
    };
    
    if (socialLinks.length >= 4) {
        // Check if links are already set, if not set default ones
        if (!socialLinks[0].href || socialLinks[0].href === '#') {
            socialLinks[0].href = defaultSocialUrls.linkedin;
            socialLinks[0].target = '_blank';
            socialLinks[0].rel = 'noopener noreferrer';
            console.log('Set fallback LinkedIn link:', socialLinks[0].href);
        }
        
        if (!socialLinks[1].href || socialLinks[1].href === '#') {
            socialLinks[1].href = defaultSocialUrls.github;
            socialLinks[1].target = '_blank';
            socialLinks[1].rel = 'noopener noreferrer';
            console.log('Set fallback GitHub link:', socialLinks[1].href);
        }
        
        if (!socialLinks[2].href || socialLinks[2].href === '#') {
            socialLinks[2].href = defaultSocialUrls.facebook;
            socialLinks[2].target = '_blank';
            socialLinks[2].rel = 'noopener noreferrer';
            console.log('Set fallback Facebook link:', socialLinks[2].href);
        }
        
        if (!socialLinks[3].href || socialLinks[3].href === '#') {
            socialLinks[3].href = defaultSocialUrls.instagram;
            socialLinks[3].target = '_blank';
            socialLinks[3].rel = 'noopener noreferrer';
            console.log('Set fallback Instagram link:', socialLinks[3].href);
        }
        
        // Ensure all links have proper attributes
        socialLinks.forEach((link, index) => {
            if (link.href && link.href !== '#') {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                console.log(`Social link ${index} is ready:`, link.href);
            }
        });
    } else {
        console.error('Not enough social links found for fallback. Expected 4, found:', socialLinks.length);
    }
}

// Update page content from server data
function updatePageContentFromServer(cvData) {
    if (!cvData) return;
    
    // Update hero section
    const heroName = document.getElementById('heroName');
    if (heroName && cvData.personal.name) {
        heroName.textContent = cvData.personal.name;
    }
    
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle && cvData.personal.title) {
        heroTitle.textContent = cvData.personal.title;
    }
    
    const heroDescription = document.getElementById('heroDescription');
    if (heroDescription && cvData.personal.description) {
        heroDescription.textContent = cvData.personal.description;
    }
    
    // Update profile image
    const profileImg = document.getElementById('profileImg');
    if (profileImg && cvData.personal.profileImage) {
        profileImg.src = cvData.personal.profileImage;
    }
    
    // Update social media links
    if (cvData.social) {
        console.log('Updating social media links:', cvData.social);
        const socialLinks = document.querySelectorAll('.social-link');
        console.log('Found social links:', socialLinks.length);
        
        if (socialLinks.length >= 4) {
            if (cvData.social.linkedin) {
                socialLinks[0].href = cvData.social.linkedin;
                socialLinks[0].target = '_blank';
                socialLinks[0].rel = 'noopener noreferrer';
                console.log('LinkedIn link updated:', socialLinks[0].href);
            }
            if (cvData.social.github) {
                socialLinks[1].href = cvData.social.github;
                socialLinks[1].target = '_blank';
                socialLinks[1].rel = 'noopener noreferrer';
                console.log('GitHub link updated:', socialLinks[1].href);
            }
            if (cvData.social.facebook) {
                socialLinks[2].href = cvData.social.facebook;
                socialLinks[2].target = '_blank';
                socialLinks[2].rel = 'noopener noreferrer';
                console.log('Facebook link updated:', socialLinks[2].href);
            }
            if (cvData.social.instagram) {
                socialLinks[3].href = cvData.social.instagram;
                socialLinks[3].target = '_blank';
                socialLinks[3].rel = 'noopener noreferrer';
                console.log('Instagram link updated:', socialLinks[3].href);
            }
        } else {
            console.error('Not enough social links found. Expected 4, found:', socialLinks.length);
        }
    } else {
        console.log('No social media data found in CV data');
    }
    
    // Update contact section
    const contactEmail = document.getElementById('contactEmail');
    if (contactEmail && cvData.personal.email) {
        contactEmail.textContent = cvData.personal.email;
    }
    
    const contactPhone = document.getElementById('contactPhone');
    if (contactPhone && cvData.personal.phone) {
        contactPhone.textContent = cvData.personal.phone;
    }
    
    const contactLocation = document.getElementById('contactLocation');
    if (contactLocation && cvData.personal.location) {
        contactLocation.textContent = cvData.personal.location;
    }
    
    // Update about section
    if (cvData.about) {
        const aboutText1 = document.getElementById('aboutText1');
        if (aboutText1 && cvData.about.text1) {
            aboutText1.textContent = cvData.about.text1;
        }
        
        const aboutText2 = document.getElementById('aboutText2');
        if (aboutText2 && cvData.about.text2) {
            aboutText2.textContent = cvData.about.text2;
        }
        
        // Update stats
        if (cvData.about.stats) {
            const stat1Number = document.getElementById('stat1Number');
            const stat1Label = document.getElementById('stat1Label');
            const stat2Number = document.getElementById('stat2Number');
            const stat2Label = document.getElementById('stat2Label');
            const stat3Number = document.getElementById('stat3Number');
            const stat3Label = document.getElementById('stat3Label');
            
            if (stat1Number && cvData.about.stats[0]?.number) {
                stat1Number.textContent = cvData.about.stats[0].number;
            }
            if (stat1Label && cvData.about.stats[0]?.label) {
                stat1Label.textContent = cvData.about.stats[0].label;
            }
            if (stat2Number && cvData.about.stats[1]?.number) {
                stat2Number.textContent = cvData.about.stats[1].number;
            }
            if (stat2Label && cvData.about.stats[1]?.label) {
                stat2Label.textContent = cvData.about.stats[1].label;
            }
            if (stat3Number && cvData.about.stats[2]?.number) {
                stat3Number.textContent = cvData.about.stats[2].number;
            }
            if (stat3Label && cvData.about.stats[2]?.label) {
                stat3Label.textContent = cvData.about.stats[2].label;
            }
        }
    }
    
    // Update experience section
    updateExperienceSection(cvData.experience);
    
    // Update skills section
    updateSkillsSection(cvData.skills);
    
    // Update projects section
    updateProjectsSection(cvData.projects);
}

// Get data from dynamic forms
function getExperienceData() {
    const experiences = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach((item, index) => {
        const position = item.querySelector('input[name*="[position]"]')?.value;
        const company = item.querySelector('input[name*="[company]"]')?.value;
        const period = item.querySelector('input[name*="[period]"]')?.value;
        const description = item.querySelector('textarea[name*="[description]"]')?.value;
        
        if (position || company || period || description) {
            experiences.push({
                id: index + 1,
                position: position || '',
                company: company || '',
                period: period || '',
                description: description || ''
            });
        }
    });
    
    return experiences;
}

function getSkillsData() {
    const skills = {};
    
    try {
        // Get all skill categories (both default and dynamic)
        const skillCategories = document.querySelectorAll('.skill-category');
        console.log(`Found ${skillCategories.length} skill categories`);
        
        skillCategories.forEach(categoryDiv => {
            const skillList = categoryDiv.querySelector('.skill-editor-list');
            if (!skillList) return;
            
            const category = skillList.getAttribute('data-category');
            const categoryName = categoryDiv.querySelector('h3').textContent;
            
            skills[category] = {
                name: categoryName,
                skills: []
            };
            
            const skillItems = skillList.querySelectorAll('.skill-editor-item');
            console.log(`Found ${skillItems.length} skill items for ${category}`);
            
            skillItems.forEach(item => {
                const name = item.querySelector('input[name*="[name]"]')?.value;
                const level = parseInt(item.querySelector('input[name*="[level]"]')?.value) || 0;
                
                if (name) {
                    skills[category].skills.push({
                        name: name,
                        level: level
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error getting skills data:', error);
    }
    
    console.log('Skills data collected:', skills);
    return skills;
}

function getProjectsData() {
    const projects = [];
    const projectItems = document.querySelectorAll('.project-editor-item');
    
    projectItems.forEach((item, index) => {
        const name = item.querySelector('input[name*="[name]"]')?.value;
        const description = item.querySelector('textarea[name*="[description]"]')?.value;
        const technologies = item.querySelector('input[name*="[technologies]"]')?.value;
        const liveUrl = item.querySelector('input[name*="[liveUrl]"]')?.value;
        const githubUrl = item.querySelector('input[name*="[githubUrl]"]')?.value;
        
        if (name || description || technologies) {
            projects.push({
                id: index + 1,
                name: name || '',
                description: description || '',
                technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
                liveUrl: liveUrl || '#',
                githubUrl: githubUrl || '#',
                image: `/uploads/project${(index % 3) + 1}.jpg` // Default image
            });
        }
    });
    
    return projects;
}

// Dynamic form functions
let experienceCounter = 0;
let projectCounter = 0;
let skillCounters = { frontend: 0, backend: 0, tools: 0 };
let skillCategoryCounter = 0;

// Add experience item
function addExperienceItem() {
    experienceCounter++;
    const experienceEditor = document.getElementById('experienceEditor');
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.innerHTML = `
        <div class="experience-controls">
            <button type="button" class="move-up-btn" title="Pindah ke atas">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button type="button" class="move-down-btn" title="Pindah ke bawah">
                <i class="fas fa-arrow-down"></i>
            </button>
            <button type="button" class="remove-item" title="Hapus">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="form-group">
            <label>Posisi</label>
            <input type="text" name="experience[${experienceCounter}][position]" placeholder="Contoh: Senior Developer">
        </div>
        <div class="form-group">
            <label>Perusahaan</label>
            <input type="text" name="experience[${experienceCounter}][company]" placeholder="Contoh: Tech Company">
        </div>
        <div class="form-group">
            <label>Periode</label>
            <input type="text" name="experience[${experienceCounter}][period]" placeholder="Contoh: 2022 - Sekarang">
        </div>
        <div class="form-group">
            <label>Deskripsi</label>
            <textarea name="experience[${experienceCounter}][description]" rows="3" placeholder="Deskripsikan tanggung jawab dan pencapaian..."></textarea>
        </div>
    `;
    
    // Add event listeners for control buttons
    const removeButton = experienceItem.querySelector('.remove-item');
    removeButton.addEventListener('click', function() {
        removeExperienceItem(this);
    });
    
    const moveUpButton = experienceItem.querySelector('.move-up-btn');
    moveUpButton.addEventListener('click', function() {
        moveExperienceUp(this);
    });
    
    const moveDownButton = experienceItem.querySelector('.move-down-btn');
    moveDownButton.addEventListener('click', function() {
        moveExperienceDown(this);
    });
    
    experienceEditor.appendChild(experienceItem);
    
    // Update button states
    updateExperienceMoveButtons();
}

// Remove experience item
function removeExperienceItem(button) {
    button.closest('.experience-item').remove();
    updateExperienceMoveButtons();
}

// Move experience up
function moveExperienceUp(button) {
    const experienceItem = button.closest('.experience-item');
    const previousItem = experienceItem.previousElementSibling;
    
    if (previousItem) {
        experienceItem.parentNode.insertBefore(experienceItem, previousItem);
        updateExperienceMoveButtons();
    }
}

// Move experience down
function moveExperienceDown(button) {
    const experienceItem = button.closest('.experience-item');
    const nextItem = experienceItem.nextElementSibling;
    
    if (nextItem) {
        experienceItem.parentNode.insertBefore(nextItem, experienceItem);
        updateExperienceMoveButtons();
    }
}

// Update move button states
function updateExperienceMoveButtons() {
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach((item, index) => {
        const moveUpBtn = item.querySelector('.move-up-btn');
        const moveDownBtn = item.querySelector('.move-down-btn');
        
        // Disable/enable move up button
        if (moveUpBtn) {
            moveUpBtn.disabled = index === 0;
            moveUpBtn.style.opacity = index === 0 ? '0.5' : '1';
            moveUpBtn.style.cursor = index === 0 ? 'not-allowed' : 'pointer';
        }
        
        // Disable/enable move down button
        if (moveDownBtn) {
            moveDownBtn.disabled = index === experienceItems.length - 1;
            moveDownBtn.style.opacity = index === experienceItems.length - 1 ? '0.5' : '1';
            moveDownBtn.style.cursor = index === experienceItems.length - 1 ? 'not-allowed' : 'pointer';
        }
    });
}

// Add project item
function addProjectItem() {
    projectCounter++;
    const projectsEditor = document.getElementById('projectsEditor');
    const projectItem = document.createElement('div');
    projectItem.className = 'project-editor-item';
    projectItem.innerHTML = `
        <button type="button" class="remove-item">&times;</button>
        <div class="form-group">
            <label>Nama Proyek</label>
            <input type="text" name="projects[${projectCounter}][name]" placeholder="Contoh: E-Commerce App">
        </div>
        <div class="form-group">
            <label>Deskripsi</label>
            <textarea name="projects[${projectCounter}][description]" rows="3" placeholder="Deskripsikan proyek..."></textarea>
        </div>
        <div class="form-group">
            <label>Teknologi</label>
            <input type="text" name="projects[${projectCounter}][technologies]" placeholder="Contoh: React, Node.js, MongoDB">
        </div>
        <div class="form-group">
            <label>Live URL</label>
            <input type="url" name="projects[${projectCounter}][liveUrl]" placeholder="https://example.com">
        </div>
        <div class="form-group">
            <label>GitHub URL</label>
            <input type="url" name="projects[${projectCounter}][githubUrl]" placeholder="https://github.com/username/project">
        </div>
    `;
    
    // Add event listener for remove button
    const removeButton = projectItem.querySelector('.remove-item');
    removeButton.addEventListener('click', function() {
        removeProjectItem(this);
    });
    
    projectsEditor.appendChild(projectItem);
}

// Remove project item
function removeProjectItem(button) {
    button.parentElement.remove();
}

// Add skill category
function addSkillCategory() {
    skillCategoryCounter++;
    const categoryId = `category_${skillCategoryCounter}`;
    const categoryName = prompt('Masukkan nama kategori keahlian:');
    
    if (!categoryName) return;
    
    const container = document.getElementById('skillCategoriesContainer');
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
        <div class="skill-editor-list" data-category="${categoryId}">
            <!-- Skills will be dynamically added here -->
        </div>
    `;
    
    container.appendChild(categoryDiv);
    
    // Initialize skill counter for this category
    skillCounters[categoryId] = 0;
    
    // Add event listeners
    const addSkillBtn = categoryDiv.querySelector(`[data-category="${categoryId}"]`);
    const removeCategoryBtn = categoryDiv.querySelector('.remove-category');
    
    addSkillBtn.addEventListener('click', () => addSkillItem(categoryId));
    removeCategoryBtn.addEventListener('click', () => removeSkillCategory(categoryId));
}

// Remove skill category
function removeSkillCategory(categoryId) {
    if (confirm('Apakah Anda yakin ingin menghapus kategori keahlian ini?')) {
        const categoryDiv = document.querySelector(`.skill-category .skill-editor-list[data-category="${categoryId}"]`).closest('.skill-category');
        categoryDiv.remove();
        delete skillCounters[categoryId];
    }
}

// Add skill item
function addSkillItem(category) {
    skillCounters[category]++;
    const skillList = document.querySelector(`.skill-editor-list[data-category="${category}"]`);
    
    if (!skillList) {
        console.error(`Skill list not found for category: ${category}`);
        return;
    }
    
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-editor-item';
    skillItem.innerHTML = `
        <input type="text" name="skills[${category}][${skillCounters[category]}][name]" placeholder="Nama Skill" value="">
        <input type="range" name="skills[${category}][${skillCounters[category]}][level]" min="0" max="100" value="50" class="skill-range">
        <span class="skill-percentage">50%</span>
        <button type="button" class="remove-item" style="position: static; width: auto; height: auto; padding: 5px 10px; border-radius: 4px;">Hapus</button>
    `;
    
    // Add event listeners
    const rangeInput = skillItem.querySelector('.skill-range');
    rangeInput.addEventListener('input', function() {
        updateSkillPercentage(this);
    });
    
    const removeButton = skillItem.querySelector('.remove-item');
    removeButton.addEventListener('click', function() {
        removeSkillItem(this);
    });
    
    skillList.appendChild(skillItem);
}

// Remove skill item
function removeSkillItem(button) {
    button.parentElement.remove();
}

// Update skill percentage display
function updateSkillPercentage(range) {
    const percentage = range.nextElementSibling;
    percentage.textContent = range.value + '%';
}

// Load dynamic data into forms
async function loadDynamicData() {
    try {
        console.log('Loading dynamic data...');
        const cvData = await loadCVDataFromServer();
        if (!cvData) {
            console.log('No CV data found, initializing empty forms');
            // Initialize empty forms if no data
            loadExperienceData([]);
            loadSkillsData({ frontend: [], backend: [], tools: [] });
            loadProjectsData([]);
            return;
        }
        
        console.log('CV data found, loading forms:', cvData);
        
        // Load experience data
        loadExperienceData(cvData.experience || []);
        
        // Load skills data
        loadSkillsData(cvData.skills || { frontend: [], backend: [], tools: [] });
        
        // Load projects data
        loadProjectsData(cvData.projects || []);
        
    } catch (error) {
        console.error('Error loading dynamic data:', error);
        // Initialize empty forms on error
        loadExperienceData([]);
        loadSkillsData({ frontend: [], backend: [], tools: [] });
        loadProjectsData([]);
    }
}

// Load experience data
function loadExperienceData(experiences) {
    console.log('Loading experience data:', experiences);
    const experienceEditor = document.getElementById('experienceEditor');
    if (!experienceEditor) {
        console.error('Experience editor not found!');
        return;
    }
    
    // Clear all existing content
    experienceEditor.innerHTML = '';
    experienceCounter = 0;
    
    if (experiences && experiences.length > 0) {
        console.log(`Loading ${experiences.length} experience items`);
        experiences.forEach(exp => {
            // Create new experience item with updated structure
            experienceCounter++;
            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';
            experienceItem.innerHTML = `
                <div class="experience-controls">
                    <button type="button" class="move-up-btn" title="Pindah ke atas">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button type="button" class="move-down-btn" title="Pindah ke bawah">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button type="button" class="remove-item" title="Hapus">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label>Posisi</label>
                    <input type="text" name="experience[${experienceCounter}][position]" placeholder="Contoh: Senior Developer" value="${exp.position || ''}">
                </div>
                <div class="form-group">
                    <label>Perusahaan</label>
                    <input type="text" name="experience[${experienceCounter}][company]" placeholder="Contoh: Tech Company" value="${exp.company || ''}">
                </div>
                <div class="form-group">
                    <label>Periode</label>
                    <input type="text" name="experience[${experienceCounter}][period]" placeholder="Contoh: Jan 2020 - Des 2022" value="${exp.period || ''}">
                </div>
                <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea name="experience[${experienceCounter}][description]" placeholder="Jelaskan tanggung jawab dan pencapaian Anda..." rows="3">${exp.description || ''}</textarea>
                </div>
            `;
            
            experienceEditor.appendChild(experienceItem);
            
            // Add event listeners
            const moveUpBtn = experienceItem.querySelector('.move-up-btn');
            const moveDownBtn = experienceItem.querySelector('.move-down-btn');
            const removeBtn = experienceItem.querySelector('.remove-item');
            
            if (moveUpBtn) moveUpBtn.addEventListener('click', () => moveExperienceUp(moveUpBtn));
            if (moveDownBtn) moveDownBtn.addEventListener('click', () => moveExperienceDown(moveDownBtn));
            if (removeBtn) removeBtn.addEventListener('click', () => removeExperienceItem(removeBtn));
        });
    } else {
        console.log('No experience data, adding one empty item');
        addExperienceItem();
    }
    
    // Update button states after loading
    updateExperienceMoveButtons();
}

// Load skills data
function loadSkillsData(skills) {
    if (!skills) return;
    
    // Reset counters
    skillCounters = { frontend: 0, backend: 0, tools: 0 };
    
    // Helper function to get skills array from category
    function getSkillsArray(category) {
        if (Array.isArray(category)) {
            return category;
        } else if (category && category.skills && Array.isArray(category.skills)) {
            return category.skills;
        }
        return [];
    }
    
    // Load each category
    ['frontend', 'backend', 'tools'].forEach(category => {
        const skillList = document.querySelector(`.skill-editor-list[data-category="${category}"]`);
        if (!skillList) return;
        
        skillList.innerHTML = '';
        
        const categorySkills = getSkillsArray(skills[category]);
        if (categorySkills.length > 0) {
            categorySkills.forEach(skill => {
                addSkillItem(category);
                const lastItem = skillList.lastElementChild;
                if (lastItem) {
                    lastItem.querySelector('input[name*="[name]"]').value = skill.name || '';
                    lastItem.querySelector('input[name*="[level]"]').value = skill.level || 50;
                    lastItem.querySelector('.skill-percentage').textContent = (skill.level || 50) + '%';
                }
            });
        }
    });
}

// Load projects data
function loadProjectsData(projects) {
    const projectsEditor = document.getElementById('projectsEditor');
    projectsEditor.innerHTML = '';
    projectCounter = 0;
    
    if (projects && projects.length > 0) {
        projects.forEach(project => {
            addProjectItem();
            const lastItem = projectsEditor.lastElementChild;
            lastItem.querySelector('input[name*="[name]"]').value = project.name || '';
            lastItem.querySelector('textarea[name*="[description]"]').value = project.description || '';
            lastItem.querySelector('input[name*="[technologies]"]').value = project.technologies ? project.technologies.join(', ') : '';
            lastItem.querySelector('input[name*="[liveUrl]"]').value = project.liveUrl || '';
            lastItem.querySelector('input[name*="[githubUrl]"]').value = project.githubUrl || '';
        });
    }
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
    
    // Helper function to get skills array from category
    function getSkillsArray(category) {
        if (Array.isArray(category)) {
            return category;
        } else if (category && category.skills && Array.isArray(category.skills)) {
            return category.skills;
        }
        return [];
    }
    
    // Update frontend skills
    if (skills.frontend) {
        const frontendSkills = document.querySelector('.skill-category:first-child .skill-items');
        if (frontendSkills) {
            frontendSkills.innerHTML = '';
            const frontendSkillsArray = getSkillsArray(skills.frontend);
            frontendSkillsArray.forEach(skill => {
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
            const backendSkillsArray = getSkillsArray(skills.backend);
            backendSkillsArray.forEach(skill => {
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
            const toolsSkillsArray = getSkillsArray(skills.tools);
            toolsSkillsArray.forEach(skill => {
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
                    <a href="${project.liveUrl || '#'}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i></a>
                    <a href="${project.githubUrl || '#'}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
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
