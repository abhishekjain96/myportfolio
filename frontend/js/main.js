import * as api from './api.js';
const { getImageUrl, getImgPlaceholder } = api;

// Email Configuration
const EMAIL_CONFIG = {
    serviceId: 'service_8lcjfer',
    templateId: 'template_2jgiivq',
    publicKey: 'X1nZ-dDN4jxKKdcC7'
};

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.publicKey);

// Default profile - used when API fails (e.g. backend not running on localhost)
const DEFAULT_PROFILE = {
    name: 'ABHISHEK JAIN',
    title: 'SOFTWARE DEVELOPER',
    bio: 'Building innovative solutions with code 🚀',
    about: 'Passionate about creating elegant solutions to complex problems.',
    profilePhoto: '',
    aboutPhoto: ''
};

// App State
let appState = {
    profile: null,
    skills: [],
    projects: [],
    achievements: [],
    certificates: []
};

// DOM Elements
let elements = {};

// Initialize on load
window.addEventListener('load', async () => {
    cacheElements();
    await loadAllData();
    finishInit();
});

function finishInit() {
    document.getElementById('loading-screen').classList.add('hidden');
    AOS.init({ duration: 1000, once: true, offset: 100 });
    initTyped();
    initParticles();
    addEventListeners();
}

// Cache DOM elements
function cacheElements() {
    elements = {
        loadingScreen: document.getElementById('loading-screen'),
        navName: document.getElementById('nav-name'),
        heroName: document.getElementById('hero-name'),
        heroBio: document.getElementById('hero-bio'),
        aboutText: document.getElementById('about-text'),
        profilePhoto: document.getElementById('profile-photo'),
        aboutPhoto: document.getElementById('about-photo'),
        skillsContainer: document.getElementById('skills-container'),
        projectsContainer: document.getElementById('projects-container'),
        achievementsContainer: document.getElementById('other-achievements-container'),
        certificatesContainer: document.getElementById('certificates-container'),
        mainCertificateImage: document.getElementById('main-certificate-image')
    };
}

// Load all data from API
async function loadAllData() {
    try {
        const [profile, skills, projects, achievements, certificates] = await Promise.all([
            api.profileAPI.get(),
            api.skillsAPI.getAll(),
            api.projectsAPI.getAll(),
            api.achievementsAPI.getAll(),
            api.certificatesAPI.getAll()
        ]);
        appState = { profile, skills: skills || [], projects: projects || [], achievements: achievements || [], certificates: certificates || [] };
        renderAll();
    } catch (error) {
        console.warn('API unavailable, using fallback data:', error.message);
        appState = {
            profile: { ...DEFAULT_PROFILE },
            skills: [],
            projects: [],
            achievements: [],
            certificates: []
        };
        renderAll();
        showToast('⚠️ Using offline mode. Start backend for full data.', 'warning');
    }
    finishInit();
}

function renderAll() {
    if (appState.profile) renderProfile();
    renderSkills();
    renderProjects();
    renderAchievements();
    renderCertificates();
}

// Render Functions
function renderProfile() {
    if (!appState.profile) return;
    const { name, title, bio, about, profilePhoto, aboutPhoto } = appState.profile;
    elements.navName.textContent = name || 'Portfolio';
    elements.heroName.textContent = name || 'Portfolio';
    elements.heroBio.textContent = bio || '';
    elements.aboutText.textContent = about || '';
    const ph = getImgPlaceholder();
    elements.profilePhoto.src = getImageUrl(profilePhoto) || ph;
    elements.aboutPhoto.src = getImageUrl(aboutPhoto) || ph;
}

function renderSkills() {
    elements.skillsContainer.innerHTML = appState.skills
        .map((skill, i) => `
            <div class="mb-4 sm:mb-6" data-aos="fade-up" data-aos-delay="${i * 100}">
                <div class="flex justify-between mb-2">
                    <span class="font-semibold text-sm sm:text-base">${skill.name}</span>
                    <span class="text-cyan-400 font-bold text-sm sm:text-base">${skill.level}%</span>
                </div>
                <div class="h-3 sm:h-4 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
                    <div class="skill-bar h-full bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500" 
                         style="width: 0%;" data-width="${skill.level}"></div>
                </div>
            </div>
        `).join('');
    
    setTimeout(() => {
        document.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }, 200);
}

function renderProjects() {
    elements.projectsContainer.innerHTML = appState.projects
        .map((project, i) => `
            <div class="glass rounded-xl sm:rounded-2xl overflow-hidden hover-lift transition-all cursor-pointer group" 
                 onclick="window.app.showProjectDetails('${project._id}')"
                 data-aos="fade-up" data-aos-delay="${i * 150}">
                <div class="aspect-video bg-gray-800 overflow-hidden relative">
                    <img src="${getImageUrl(project.image)}" alt="${project.title}" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="text-lg sm:text-2xl font-bold mb-2 bg-gradient-to-r from-red-500 to-cyan-500 bg-clip-text text-transparent">
                        ${project.title}
                    </h3>
                    <p class="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-3 sm:mb-4">
                        ${project.tech.map(tech => `
                            <span class="px-2 sm:px-3 py-1 text-xs bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-300">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                    <button class="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                        View Details <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `).join('');
}

function renderAchievements() {
    const mainContainer = document.getElementById('main-achievement-container');
    if (!mainContainer) return;
    
    if (!appState.achievements.length) {
        mainContainer.innerHTML = '';
        elements.achievementsContainer.innerHTML = '<p class="text-gray-400 col-span-full text-center py-8">No achievements yet.</p>';
        return;
    }
    
    // Main achievement (first one)
    const mainAchievement = appState.achievements[0];
    const colorClasses = {
        gold: 'from-yellow-400 to-orange-500',
        blue: 'from-blue-400 to-cyan-500',
        purple: 'from-purple-400 to-pink-500',
        green: 'from-green-400 to-emerald-500',
        red: 'from-red-400 to-rose-500'
    };
    const mainColor = colorClasses[mainAchievement.color] || 'from-yellow-400 to-orange-500';
    const hasMainImage = mainAchievement && mainAchievement.image;
    
    const badges = mainAchievement.badges || [mainAchievement.title || '1st Place', mainAchievement.year || '2025', '500+ Participants'];
    const bullets = mainAchievement.bullets || (mainAchievement.details ? [mainAchievement.details] : []);
    const stats = mainAchievement.stats || [
        { value: '1st', label: 'Rank' },
        { value: '500+', label: 'Students' },
        { value: 'Python', label: 'Language' }
    ];
    const subTitle = mainAchievement.subTitle || mainAchievement.title || '';

    mainContainer.innerHTML = `
        <div class="glass rounded-3xl overflow-hidden hover-lift transition-all" data-aos="zoom-in" data-aos-delay="200">
            <div class="grid lg:grid-cols-2 gap-0">
                <div class="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-6 sm:p-8 ${hasMainImage ? 'cursor-pointer group' : ''}" ${hasMainImage ? 'onclick="window.app.showAchievementModal(0)"' : ''}>
                    <div class="absolute top-4 right-4 z-10">
                        <span class="px-4 py-2 bg-gradient-to-r ${mainColor} text-black font-black rounded-full text-xs sm:text-sm shadow-lg">
                            <i class="fas fa-trophy mr-1"></i> WINNER
                        </span>
                    </div>
                    <div class="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-800">
                        <img id="main-certificate-image" src="${hasMainImage ? getImageUrl(mainAchievement.image) : getImgPlaceholder()}" alt="${mainAchievement.title || 'Achievement'}" class="w-full h-full object-cover ${hasMainImage ? 'group-hover:scale-110' : ''} transition-transform duration-700">
                        ${hasMainImage ? `
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div class="text-center">
                                <i class="fas fa-search-plus text-5xl text-white mb-3"></i>
                                <p class="text-white font-bold text-lg">Click to View Full</p>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    ${hasMainImage ? `
                    <div class="mt-4 flex justify-center">
                        <span class="px-6 py-3 bg-white/10 rounded-full font-semibold text-sm flex items-center gap-2">
                            <i class="fas fa-expand-alt"></i> View Full Size
                        </span>
                    </div>
                    ` : ''}
                </div>
                <div class="p-6 sm:p-10 flex flex-col justify-center">
                    <div class="flex flex-wrap gap-3 mb-6">
                        ${badges.slice(0, 3).map((b, i) => `
                        <span class="px-4 py-2 ${i === 0 ? `bg-gradient-to-r ${mainColor} text-black` : i === 1 ? 'bg-purple-500/20 border border-purple-500 text-purple-300' : 'bg-blue-500/20 border border-blue-500 text-blue-300'} font-bold rounded-lg text-sm">${b}</span>
                        `).join('')}
                    </div>
                    <h3 class="text-3xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        ${mainAchievement.title || 'Achievement'}
                    </h3>
                    <h4 class="text-xl sm:text-2xl font-bold text-white mb-6">
                        🏆 ${subTitle}
                    </h4>
                    <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                        ${mainAchievement.description || ''}
                    </p>
                    ${bullets.length ? `
                    <div class="space-y-3 mb-6">
                        ${bullets.map(b => `
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <i class="fas fa-check text-green-400"></i>
                            </div>
                            <p class="text-gray-300">${b}</p>
                        </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    <div class="grid grid-cols-3 gap-4 p-4 bg-black/30 rounded-xl border border-yellow-500/30">
                        ${stats.slice(0, 3).map((s, i) => `
                        <div class="text-center ${i === 1 ? 'border-l border-r border-gray-700' : ''}">
                            <div class="text-2xl sm:text-3xl font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-purple-400' : 'text-cyan-400'}">${s.value || ''}</div>
                            <div class="text-xs sm:text-sm text-gray-400">${s.label || ''}</div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Re-cache main image element after render
    elements.mainCertificateImage = document.getElementById('main-certificate-image');
    
    // Other achievements
    const otherAchievements = appState.achievements.slice(1);
    elements.achievementsContainer.innerHTML = otherAchievements
        .map((ach, i) => {
            const fullIndex = i + 1;
            const hasImage = ach.image;
            return `
            <div class="glass rounded-2xl overflow-hidden hover-lift transition-all ${hasImage ? 'cursor-pointer' : ''}" data-aos="fade-up" data-aos-delay="${(i + 1) * 100}" ${hasImage ? `onclick="window.app.showAchievementModal(${fullIndex})"` : ''}>
                ${hasImage ? `
                <div class="aspect-video bg-gray-800 overflow-hidden">
                    <img src="${getImageUrl(ach.image)}" alt="${ach.title}" class="w-full h-full object-cover">
                </div>
                ` : ''}
                <div class="p-4 sm:p-6">
                    <div class="flex items-start gap-3 sm:gap-4 mb-3">
                        <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${colorClasses[ach.color] || 'from-yellow-400 to-orange-500'} flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-${ach.icon || 'trophy'} text-lg sm:text-2xl text-white"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-base sm:text-xl font-bold mb-2">${ach.title}</h3>
                            <p class="text-gray-400 text-xs sm:text-sm line-clamp-2">${ach.description || ''}</p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-3 border-t border-gray-700">
                        <span class="text-cyan-400 font-semibold text-xs sm:text-sm truncate flex-1 mr-2">${(ach.subTitle || ach.description || '').substring(0, 40)}${(ach.subTitle || ach.description || '').length > 40 ? '...' : ''}</span>
                        <span class="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs flex-shrink-0">${ach.year || ''}</span>
                    </div>
                    ${hasImage ? '<p class="text-xs text-gray-500 mt-2"><i class="fas fa-search-plus mr-1"></i> Click to view full</p>' : ''}
                </div>
            </div>
        `}).join('');
}

function renderCertificates() {
    elements.certificatesContainer.innerHTML = appState.certificates
        .map((cert, i) => `
            <div class="glass rounded-xl sm:rounded-2xl overflow-hidden hover-lift transition-all" data-aos="fade-up" data-aos-delay="${i * 100}">
                <div class="aspect-video bg-gray-800 overflow-hidden relative group cursor-pointer"
                     onclick="window.app.showCertificateModal(${i})">
                    <img src="${getImageUrl(cert.image)}" alt="${cert.title}" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i class="fas fa-search-plus text-3xl sm:text-4xl text-white"></i>
                    </div>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="text-base sm:text-xl font-bold mb-2">${cert.title}</h3>
                    <p class="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">${cert.issuer}</p>
                    <p class="text-gray-500 text-xs mb-3">${cert.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-purple-400 font-semibold text-xs sm:text-sm">View Certificate</span>
                        <span class="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs">${cert.date}</span>
                    </div>
                </div>
            </div>
        `).join('');
}

// Initialize Typed.js
function initTyped() {
    new Typed('#typed-text', {
        strings: [
            appState.profile.title,
            'FULL STACK DEVELOPER',
            'PROBLEM SOLVER',
            'CODE ENTHUSIAST'
        ],
        typeSpeed: 80,        // Thoda slow
        backSpeed: 40,         // Slow backspace
        startDelay: 1000,      // 1 sec pehle start
        backDelay: 2000,       // 2 sec rukna before next
        loop: true,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true
    });
}

// Initialize Particles
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = Math.random() > 0.5 ? '#FF0033' : '#00F3FF';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    function init() {
        for (let i = 0; i < 100; i++) particles.push(new Particle());
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, i) => {
            particle.update();
            particle.draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[j].x - particle.x;
                const dy = particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

// Image: read file as base64 data URL
function readFileAsDataURL(file, maxMB = 5) {
    return new Promise((resolve, reject) => {
        if (file.size > maxMB * 1024 * 1024) {
            reject(new Error(`File too large. Max ${maxMB}MB.`));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Initialize image URL + upload handlers
function initImageHandlers() {
    // Profile Photo
    const profileUrl = document.getElementById('profile-photo-url');
    const profileFile = document.getElementById('profile-photo-upload');
    const profilePreview = document.getElementById('profile-photo-preview');
    const profileValue = document.getElementById('profile-photo-value');
    if (profileUrl) profileUrl.addEventListener('input', () => {
        const v = profileUrl.value.trim();
        if (v) {
            profilePreview.src = v;
            if (profileValue) profileValue.value = v;
        }
    });
    if (profileFile) profileFile.addEventListener('change', async (e) => {
        const f = e.target.files?.[0];
        if (f) {
            try {
                const data = await readFileAsDataURL(f);
                profilePreview.src = data;
                if (profileValue) profileValue.value = data;
                if (profileUrl) profileUrl.value = '';
            } catch (err) { showToast(err.message || 'Upload failed', 'error'); }
        }
    });

    // About Photo
    const aboutUrl = document.getElementById('about-photo-url');
    const aboutFile = document.getElementById('about-photo-upload');
    const aboutPreview = document.getElementById('about-photo-preview');
    const aboutValue = document.getElementById('about-photo-value');
    if (aboutUrl) aboutUrl.addEventListener('input', () => {
        const v = aboutUrl.value.trim();
        if (v) {
            aboutPreview.src = v;
            if (aboutValue) aboutValue.value = v;
        }
    });
    if (aboutFile) aboutFile.addEventListener('change', async (e) => {
        const f = e.target.files?.[0];
        if (f) {
            try {
                const data = await readFileAsDataURL(f);
                aboutPreview.src = data;
                if (aboutValue) aboutValue.value = data;
                if (aboutUrl) aboutUrl.value = '';
            } catch (err) { showToast(err.message || 'Upload failed', 'error'); }
        }
    });

    // Project image
    const projUrl = document.getElementById('proj-image');
    const projFile = document.getElementById('proj-image-upload');
    if (projFile) projFile.addEventListener('change', async (e) => {
        const f = e.target.files?.[0];
        if (f) {
            try {
                const data = await readFileAsDataURL(f);
                projUrl.value = data;
                projUrl.required = false;
            } catch (err) { showToast(err.message || 'Upload failed', 'error'); }
        }
    });

    // Achievement image
    const achUrl = document.getElementById('ach-image');
    const achFile = document.getElementById('ach-image-upload');
    if (achFile) achFile.addEventListener('change', async (e) => {
        const f = e.target.files?.[0];
        if (f) {
            try {
                const data = await readFileAsDataURL(f);
                achUrl.value = data;
            } catch (err) { showToast(err.message || 'Upload failed', 'error'); }
        }
    });

    // Certificate image
    const certUrl = document.getElementById('cert-image');
    const certFile = document.getElementById('cert-image-upload');
    if (certFile) certFile.addEventListener('change', async (e) => {
        const f = e.target.files?.[0];
        if (f) {
            try {
                const data = await readFileAsDataURL(f);
                certUrl.value = data;
                certUrl.required = false;
            } catch (err) { showToast(err.message || 'Upload failed', 'error'); }
        }
    });
}

// Add Event Listeners
function addEventListeners() {
    // Image load failure - use placeholder (prevents 404 errors in console)
    document.addEventListener('error', (e) => {
        if (e.target?.tagName === 'IMG' && !e.target.dataset.noFallback) {
            e.target.src = getImgPlaceholder();
        }
    }, true);

    // Mouse trail
    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 1000);
    });
    
    // Parallax effect
    window.addEventListener('mousemove', (e) => {
        const parallaxElements = document.querySelectorAll('.parallax');
        const x = (window.innerWidth - e.pageX) / 100;
        const y = (window.innerHeight - e.pageY) / 100;
        parallaxElements.forEach(el => {
            el.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });
    
    // Contact form
    document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);
    
    // Admin login form
    document.getElementById('admin-login-form').addEventListener('submit', handleAdminLogin);
    
    // Admin CRUD forms
    document.getElementById('project-form').addEventListener('submit', saveProject);
    document.getElementById('achievement-form').addEventListener('submit', saveAchievement);
    document.getElementById('certificate-form').addEventListener('submit', saveCertificate);
    
    // Mobile menu
    // Mobile menu - FIXED VERSION
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    // Remove any existing listeners by cloning and replacing
    const newBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
    
    // Add fresh click listener
    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
        console.log('Menu toggled'); // Debug
    });

    // Close menu when clicking links
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });

    // Close when clicking outside (optional)
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !newBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

    initImageHandlers();
}

// Handle Contact Form Submit
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const btn = document.getElementById('send-btn');
    const btnText = document.getElementById('send-text');
    const originalText = btnText.textContent;
    
    btnText.textContent = 'Sending...';
    btn.disabled = true;
    
    try {
        await emailjs.sendForm(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            e.target,
            EMAIL_CONFIG.publicKey
        );
        
        showToast('✅ Message sent successfully!');
        e.target.reset();
    } catch (error) {
        console.error('EmailJS Error:', error);
        showToast('❌ Failed to send message', 'error');
    }
    
    btnText.textContent = originalText;
    btn.disabled = false;
}

// Handle Admin Login
async function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    try {
        const response = await api.authAPI.login({ username, password });
        localStorage.setItem('adminToken', response.token);
        closeModal('admin-login-modal');
        // Fresh login - token is valid, open panel directly without verify
        await showAdminPanel(true);
        showToast('✅ Login successful!');
    } catch (error) {
        showToast('❌ Invalid credentials!', 'error');
    }
}

// Show Admin Panel (skipVerify = true when coming from fresh login)
async function showAdminPanel(skipVerify = false) {
    try {
        if (!skipVerify) {
            await api.authAPI.verify();
        }
        
        // Open panel first so user sees it immediately
        document.getElementById('admin-panel-modal').classList.add('active');
        
        // Load data (with null checks)
        try {
            if (appState.profile) loadAdminProfile();
            loadAdminSkills();
            loadAdminProjects();
            loadAdminAchievements();
            loadAdminCertificates();
        } catch (loadErr) {
            console.warn('Admin data load:', loadErr);
        }
    } catch (error) {
        showToast('❌ Session expired', 'error');
        localStorage.removeItem('adminToken');
    }
}

// Admin Functions
function loadAdminProfile() {
    if (!appState.profile) return;
    const { name, title, bio, about, profilePhoto, aboutPhoto } = appState.profile;
    
    document.getElementById('profile-name').value = name;
    document.getElementById('profile-title').value = title;
    document.getElementById('profile-bio').value = bio;
    document.getElementById('profile-about').value = about;
    
    const pSrc = getImageUrl(profilePhoto) || profilePhoto || 'assets/images/abhishek.png';
    const aSrc = getImageUrl(aboutPhoto) || aboutPhoto || 'assets/images/abhishek.png';
    document.getElementById('profile-photo-preview').src = pSrc;
    document.getElementById('about-photo-preview').src = aSrc;
    const purl = document.getElementById('profile-photo-url');
    const aurl = document.getElementById('about-photo-url');
    const pval = document.getElementById('profile-photo-value');
    const aval = document.getElementById('about-photo-value');
    if (purl && profilePhoto && (profilePhoto.startsWith('http') || profilePhoto.startsWith('/'))) purl.value = profilePhoto;
    if (aurl && aboutPhoto && (aboutPhoto.startsWith('http') || aboutPhoto.startsWith('/'))) aurl.value = aboutPhoto;
    if (pval && profilePhoto) pval.value = profilePhoto;
    if (aval && aboutPhoto) aval.value = aboutPhoto;
}

async function saveProfile() {
    const pval = document.getElementById('profile-photo-value')?.value;
    const aval = document.getElementById('about-photo-value')?.value;
    const pPreview = document.getElementById('profile-photo-preview');
    const aPreview = document.getElementById('about-photo-preview');
    const profilePhoto = (pval && pval.length > 0) ? pval : (pPreview?.src || '');
    const aboutPhoto = (aval && aval.length > 0) ? aval : (aPreview?.src || '');
    const updatedProfile = {
        name: document.getElementById('profile-name').value,
        title: document.getElementById('profile-title').value,
        bio: document.getElementById('profile-bio').value,
        about: document.getElementById('profile-about').value,
        profilePhoto: profilePhoto || 'assets/images/abhishek.png',
        aboutPhoto: aboutPhoto || 'assets/images/abhishek.png'
    };
    
    try {
        appState.profile = await api.profileAPI.update(updatedProfile);
        renderProfile();
        showToast('✅ Profile updated!');
    } catch (error) {
        showToast('❌ Update failed', 'error');
    }
}

function loadAdminSkills() {
    const list = document.getElementById('admin-skills-list');
    if (!list) return;
    
    list.innerHTML = (appState.skills || [])
        .map((skill, i) => `
            <div class="glass rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover-lift transition">
                <input type="text" value="${skill.name}" id="skill-name-${i}" 
                       class="flex-1 w-full px-3 sm:px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base">
                <input type="number" value="${skill.level}" id="skill-level-${i}" min="0" max="100" 
                       class="w-20 sm:w-24 px-3 sm:px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base">
                <button onclick="window.app.deleteSkill('${skill._id}', ${i})" class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition text-sm sm:text-base">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('') +
        `<button onclick="window.app.saveSkills()" class="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold mt-4 hover-lift text-sm sm:text-base">
            <i class="fas fa-save mr-2"></i> Save Skills
        </button>`;
}

async function saveSkills() {
    const skillData = appState.skills.map((skill, i) => ({
        _id: skill._id,
        name: document.getElementById(`skill-name-${i}`)?.value || skill.name,
        level: Number(document.getElementById(`skill-level-${i}`)?.value) || skill.level
    }));
    
    try {
        for (const s of skillData) {
            if (String(s._id).startsWith('temp-')) {
                await api.skillsAPI.create({ name: s.name, level: s.level });
            } else {
                await api.skillsAPI.update(s._id, { name: s.name, level: s.level });
            }
        }
        appState.skills = await api.skillsAPI.getAll();
        renderSkills();
        loadAdminSkills();
        showToast('✅ Skills saved!');
    } catch (error) {
        showToast('❌ Save failed', 'error');
    }
}

async function deleteSkill(id, index) {
    if (!confirm('Delete this skill?')) return;
    
    try {
        if (!String(id).startsWith('temp-')) {
            await api.skillsAPI.delete(id);
        }
        appState.skills.splice(index, 1);
        loadAdminSkills();
        renderSkills();
        showToast('🗑️ Deleted!');
    } catch (error) {
        showToast('❌ Delete failed', 'error');
    }
}

function addSkill() {
    appState.skills.push({
        _id: 'temp-' + Date.now(),
        name: 'New Skill',
        level: 80
    });
    loadAdminSkills();
}

function loadAdminProjects() {
    const list = document.getElementById('admin-projects-list');
    if (!list) return;
    list.innerHTML = (appState.projects || []).map((p, i) => `
        <div class="glass rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex-1">
                <p class="font-semibold text-cyan-400">${p.title}</p>
                <p class="text-gray-400 text-sm mt-1">${(p.description || '').substring(0, 80)}...</p>
            </div>
            <div class="flex gap-2">
                <button onclick="window.app.editProject(${i})" class="px-3 py-2 bg-cyan-500 rounded-lg text-sm font-bold hover:bg-cyan-600">Edit</button>
                <button onclick="window.app.deleteProject('${p._id}', ${i})" class="px-3 py-2 bg-red-500 rounded-lg text-sm font-bold hover:bg-red-600">Delete</button>
            </div>
        </div>
    `).join('') || '<p class="text-gray-400">No projects yet. Click Add Project to create one.</p>';
}

function loadAdminAchievements() {
    const list = document.getElementById('admin-achievements-list');
    if (!list) return;
    const achievements = appState.achievements || [];
    list.innerHTML = achievements.length ? achievements.map((a, i) => `
        <div class="glass rounded-lg p-4 flex flex-col sm:flex-row gap-4">
            ${a.image ? `<img src="${getImageUrl(a.image)}" alt="${a.title}" class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0">` : '<div class="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0"><i class="fas fa-trophy text-2xl text-gray-500"></i></div>'}
            <div class="flex-1 min-w-0">
                <p class="font-semibold text-yellow-400">${a.title || 'Untitled'}</p>
                <p class="text-gray-400 text-sm mt-1">${(a.description || '').substring(0, 100)}${(a.description || '').length > 100 ? '...' : ''}</p>
                <p class="text-gray-500 text-xs mt-2">${a.year || ''} • ${a.icon || 'trophy'} • ${a.color || 'gold'}</p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
                <button onclick="window.app.editAchievement(${i})" class="px-3 py-2 bg-yellow-500 rounded-lg text-sm font-bold hover:bg-yellow-600 text-black">Edit</button>
                <button onclick="window.app.deleteAchievement('${a._id}', ${i})" class="px-3 py-2 bg-red-500 rounded-lg text-sm font-bold hover:bg-red-600">Delete</button>
            </div>
        </div>
    `).join('') : '<p class="text-gray-400">No achievements yet. Click Add Achievement to create one.</p>';
}

function loadAdminCertificates() {
    const list = document.getElementById('admin-certificates-list');
    if (!list) return;
    list.innerHTML = (appState.certificates || []).map((c, i) => `
        <div class="glass rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex-1">
                <p class="font-semibold text-purple-400">${c.title}</p>
                <p class="text-gray-400 text-sm mt-1">${c.issuer}</p>
                <p class="text-gray-500 text-xs mt-2">${c.date}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="window.app.editCertificate(${i})" class="px-3 py-2 bg-purple-500 rounded-lg text-sm font-bold hover:bg-purple-600">Edit</button>
                <button onclick="window.app.deleteCertificate('${c._id}', ${i})" class="px-3 py-2 bg-red-500 rounded-lg text-sm font-bold hover:bg-red-600">Delete</button>
            </div>
        </div>
    `).join('') || '<p class="text-gray-400">No certificates yet. Click Add Certificate to create one.</p>';
}

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type === 'error') toast.style.background = 'linear-gradient(90deg, #FF0033, #FF6B6B)';
    if (type === 'warning') toast.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 400);
    }, 3000);
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById('tab-' + tabName).classList.remove('hidden');
    
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('bg-cyan-500');
        btn.classList.add('bg-gray-700');
    });
    
    document.querySelector(`[onclick="window.app.switchTab('${tabName}')"]`)
        .classList.remove('bg-gray-700');
    document.querySelector(`[onclick="window.app.switchTab('${tabName}')"]`)
        .classList.add('bg-cyan-500');
}

// Certificate & Achievement View Modal
let currentCertificateIndex = 0;
let currentViewMode = 'certificate'; // 'certificate' or 'achievement'

function showCertificateModal(index) {
    if (!appState.certificates[index]) return;
    currentViewMode = 'certificate';
    currentCertificateIndex = index;
    const cert = appState.certificates[index];
    document.getElementById('modal-certificate-only').classList.remove('hidden');
    document.getElementById('modal-achievement-full').classList.add('hidden');
    document.getElementById('modal-certificate-image').src = getImageUrl(cert.image);
    document.getElementById('cert-back-to-details').classList.add('hidden');
    document.getElementById('certificate-modal').classList.add('active');
}

function showAchievementFullSize() {
    const ach = appState.achievements?.[currentCertificateIndex];
    if (!ach) return;
    currentViewMode = 'achievement-fullsize';
    document.getElementById('modal-certificate-only').classList.remove('hidden');
    document.getElementById('modal-achievement-full').classList.add('hidden');
    document.getElementById('modal-certificate-image').src = ach.image ? getImageUrl(ach.image) : getImgPlaceholder();
    document.getElementById('cert-back-to-details').classList.remove('hidden');
}

function backToAchievementDetails() {
    currentViewMode = 'achievement';
    document.getElementById('modal-certificate-only').classList.add('hidden');
    document.getElementById('modal-achievement-full').classList.remove('hidden');
    document.getElementById('cert-back-to-details').classList.add('hidden');
}

function showAchievementModal(index) {
    const ach = appState.achievements?.[index];
    if (!ach) return;
    currentViewMode = 'achievement';
    currentCertificateIndex = index;
    document.getElementById('modal-certificate-only').classList.add('hidden');
    document.getElementById('modal-achievement-full').classList.remove('hidden');
    const imgEl = document.getElementById('modal-achievement-image');
    imgEl.src = ach.image ? getImageUrl(ach.image) : getImgPlaceholder();
    imgEl.alt = ach.title || 'Achievement';
    const badges = ach.badges || [ach.title || '1st Place', ach.year || '2025', '500+ Participants'];
    const bullets = ach.bullets || [];
    const stats = ach.stats || [{ value: '1st', label: 'Rank' }, { value: '500+', label: 'Students' }, { value: 'Python', label: 'Language' }];
    const colorClasses = { gold: 'from-yellow-400 to-orange-500', blue: 'from-blue-400 to-cyan-500', purple: 'from-purple-400 to-pink-500', green: 'from-green-400 to-emerald-500', red: 'from-red-400 to-rose-500' };
    const mainColor = colorClasses[ach.color] || 'from-yellow-400 to-orange-500';
    document.getElementById('modal-achievement-details').innerHTML = `
        <div class="flex flex-wrap gap-3 mb-6">
            ${badges.slice(0, 3).map((b, i) => `<span class="px-4 py-2 ${i === 0 ? `bg-gradient-to-r ${mainColor} text-black` : i === 1 ? 'bg-purple-500/20 border border-purple-500 text-purple-300' : 'bg-blue-500/20 border border-blue-500 text-blue-300'} font-bold rounded-lg text-sm">${b}</span>`).join('')}
        </div>
        <h3 class="text-2xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">${ach.title || ''}</h3>
        <h4 class="text-xl font-bold text-white mb-4">🏆 ${ach.subTitle || ''}</h4>
        <p class="text-gray-300 mb-6">${ach.description || ''}</p>
        ${bullets.length ? `<div class="space-y-2 mb-6">${bullets.map(b => `<div class="flex gap-2"><i class="fas fa-check text-green-400 mt-1"></i><p class="text-gray-300">${b}</p></div>`).join('')}</div>` : ''}
        <div class="grid grid-cols-3 gap-4 p-4 bg-black/30 rounded-xl border border-yellow-500/30">
            ${stats.slice(0, 3).map((s, i) => `<div class="text-center ${i === 1 ? 'border-l border-r border-gray-700' : ''}"><div class="text-xl font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-purple-400' : 'text-cyan-400'}">${s.value || ''}</div><div class="text-xs text-gray-400">${s.label || ''}</div></div>`).join('')}
        </div>
    `;
    document.getElementById('certificate-modal').classList.add('active');
}

function closeCertificateModal() {
    document.getElementById('certificate-modal').classList.remove('active');
}

function downloadCertificate() {
    const isAchievement = currentViewMode === 'achievement' || currentViewMode === 'achievement-fullsize';
    const img = (currentViewMode === 'achievement-fullsize' || currentViewMode === 'certificate')
        ? document.getElementById('modal-certificate-image')
        : document.getElementById('modal-achievement-image');
    if (!img?.src) return;
    const link = document.createElement('a');
    link.href = img.src;
    link.download = isAchievement ? `achievement-${currentCertificateIndex + 1}.jpg` : `certificate-${currentCertificateIndex + 1}.jpg`;
    link.click();
}

// Project Details Modal
async function showProjectDetails(id) {
    const project = appState.projects.find(p => p._id === id);
    if (!project) return;
    
    document.getElementById('project-modal-title').textContent = project.title;
    document.getElementById('project-modal-content').innerHTML = `
        <img src="${getImageUrl(project.image)}" alt="${project.title}" class="w-full rounded-lg sm:rounded-xl mb-4 sm:mb-6 hover:scale-105 transition-transform">
        <div class="space-y-4 sm:space-y-6">
            <div>
                <h4 class="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-cyan-400 flex items-center gap-2">
                    <i class="fas fa-info-circle"></i> Overview
                </h4>
                <p class="text-gray-300 leading-relaxed text-sm sm:text-base">${project.fullDescription}</p>
            </div>
            <div>
                <h4 class="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-cyan-400 flex items-center gap-2">
                    <i class="fas fa-star"></i> Key Features
                </h4>
                <ul class="grid sm:grid-cols-2 gap-2 sm:gap-3">
                    ${(project.features || []).map(f => `
                        <li class="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                            <i class="fas fa-check-circle text-green-400"></i>
                            <span>${f}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div>
                <h4 class="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-cyan-400 flex items-center gap-2">
                    <i class="fas fa-code"></i> Technologies
                </h4>
                <div class="flex flex-wrap gap-2 sm:gap-3">
                    ${(project.tech || []).map(tech => `
                        <span class="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-lg text-cyan-300 font-semibold text-xs sm:text-base">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <a href="${project.liveUrl}" target="_blank" 
                   class="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-center hover-lift glow transition text-sm sm:text-base">
                    <i class="fas fa-external-link-alt mr-2"></i> Live Demo
                </a>
                <a href="${project.codeUrl}" target="_blank" 
                   class="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 border border-cyan-500/50 rounded-lg font-bold text-center hover-lift glow transition text-sm sm:text-base">
                    <i class="fab fa-github mr-2"></i> View Code
                </a>
            </div>
        </div>
    `;
    
    document.getElementById('project-details-modal').classList.add('active');
}

function logout() {
    if (confirm('Logout from admin panel?')) {
        localStorage.removeItem('adminToken');
        closeModal('admin-panel-modal');
        showToast('👋 Logged out');
    }
}

// Project CRUD
let editingProjectIndex = -1;
function addProject() {
    editingProjectIndex = -1;
    document.getElementById('project-form-title').textContent = 'Add Project';
    document.getElementById('project-form').reset();
    const fu = document.getElementById('proj-image-upload');
    if (fu) fu.value = '';
    document.getElementById('project-form-modal').classList.add('active');
}
function editProject(index) {
    editingProjectIndex = index;
    const p = appState.projects[index];
    document.getElementById('project-form-title').textContent = 'Edit Project';
    const fu = document.getElementById('proj-image-upload');
    if (fu) fu.value = '';
    document.getElementById('proj-title').value = p.title || '';
    document.getElementById('proj-description').value = p.description || '';
    document.getElementById('proj-fullDescription').value = p.fullDescription || '';
    document.getElementById('proj-image').value = p.image || '';
    document.getElementById('proj-tech').value = (p.tech || []).join(', ');
    document.getElementById('proj-features').value = (p.features || []).join(', ');
    document.getElementById('proj-liveUrl').value = p.liveUrl || '';
    document.getElementById('proj-codeUrl').value = p.codeUrl || '';
    document.getElementById('project-form-modal').classList.add('active');
}
async function saveProject(e) {
    e.preventDefault();
    const imgVal = document.getElementById('proj-image').value?.trim();
    if (!imgVal) {
        showToast('Please add Image URL or upload an image', 'error');
        return;
    }
    const data = {
        title: document.getElementById('proj-title').value,
        description: document.getElementById('proj-description').value,
        fullDescription: document.getElementById('proj-fullDescription').value,
        image: imgVal,
        tech: document.getElementById('proj-tech').value.split(',').map(s => s.trim()).filter(Boolean),
        features: document.getElementById('proj-features').value.split(',').map(s => s.trim()).filter(Boolean),
        liveUrl: document.getElementById('proj-liveUrl').value || '#',
        codeUrl: document.getElementById('proj-codeUrl').value || '#'
    };
    try {
        if (editingProjectIndex >= 0) {
            const id = appState.projects[editingProjectIndex]._id;
            await api.projectsAPI.update(id, data);
        } else {
            await api.projectsAPI.create(data);
        }
        appState.projects = await api.projectsAPI.getAll();
        renderProjects();
        loadAdminProjects();
        closeModal('project-form-modal');
        showToast('✅ Project saved!');
    } catch (err) {
        showToast('❌ Save failed', 'error');
    }
}
async function deleteProject(id, index) {
    if (!confirm('Delete this project?')) return;
    try {
        await api.projectsAPI.delete(id);
        appState.projects = await api.projectsAPI.getAll();
        renderProjects();
        loadAdminProjects();
        showToast('🗑️ Deleted!');
    } catch (err) {
        showToast('❌ Delete failed', 'error');
    }
}

// Achievement CRUD
let editingAchievementIndex = -1;
function addAchievement() {
    editingAchievementIndex = -1;
    document.getElementById('achievement-form-title').textContent = 'Add Achievement';
    document.getElementById('achievement-form').reset();
    const fu = document.getElementById('ach-image-upload');
    if (fu) fu.value = '';
    document.getElementById('achievement-form-modal').classList.add('active');
}
function editAchievement(index) {
    editingAchievementIndex = index;
    const a = appState.achievements[index];
    document.getElementById('achievement-form-title').textContent = 'Edit Achievement';
    const fu = document.getElementById('ach-image-upload');
    if (fu) fu.value = '';
    document.getElementById('ach-title').value = a.title || '';
    document.getElementById('ach-subTitle').value = a.subTitle || '';
    document.getElementById('ach-description').value = a.description || '';
    document.getElementById('ach-badges').value = (a.badges || []).join(', ');
    document.getElementById('ach-bullets').value = (a.bullets || []).join('\n');
    document.getElementById('ach-stats').value = (a.stats || []).map(s => `${s.value || ''}|${s.label || ''}`).join('\n');
    document.getElementById('ach-year').value = a.year || '';
    document.getElementById('ach-icon').value = a.icon || 'trophy';
    document.getElementById('ach-color').value = a.color || 'gold';
    document.getElementById('ach-image').value = a.image || '';
    document.getElementById('achievement-form-modal').classList.add('active');
}
async function saveAchievement(e) {
    e.preventDefault();
    const statsRaw = document.getElementById('ach-stats').value.split('\n').map(s => s.trim()).filter(Boolean);
    const stats = statsRaw.map(line => {
        const [value, label] = line.split('|').map(x => x?.trim() || '');
        return { value, label };
    }).filter(s => s.value || s.label);
    const data = {
        title: document.getElementById('ach-title').value,
        subTitle: document.getElementById('ach-subTitle').value || '',
        description: document.getElementById('ach-description').value,
        badges: document.getElementById('ach-badges').value.split(',').map(s => s.trim()).filter(Boolean),
        bullets: document.getElementById('ach-bullets').value.split('\n').map(s => s.trim()).filter(Boolean),
        stats,
        icon: document.getElementById('ach-icon').value || 'trophy',
        color: document.getElementById('ach-color').value,
        year: document.getElementById('ach-year').value || '',
        image: document.getElementById('ach-image').value || ''
    };
    try {
        if (editingAchievementIndex >= 0) {
            const id = appState.achievements[editingAchievementIndex]._id;
            await api.achievementsAPI.update(id, data);
        } else {
            await api.achievementsAPI.create(data);
        }
        appState.achievements = await api.achievementsAPI.getAll();
        renderAchievements();
        loadAdminAchievements();
        closeModal('achievement-form-modal');
        showToast('✅ Achievement saved!');
    } catch (err) {
        showToast('❌ Save failed', 'error');
    }
}
async function deleteAchievement(id, index) {
    if (!confirm('Delete this achievement?')) return;
    try {
        await api.achievementsAPI.delete(id);
        appState.achievements = await api.achievementsAPI.getAll();
        renderAchievements();
        loadAdminAchievements();
        showToast('🗑️ Deleted!');
    } catch (err) {
        showToast('❌ Delete failed', 'error');
    }
}

// Certificate CRUD
let editingCertificateIndex = -1;
function addCertificate() {
    editingCertificateIndex = -1;
    document.getElementById('certificate-form-title').textContent = 'Add Certificate';
    document.getElementById('certificate-form').reset();
    const fu = document.getElementById('cert-image-upload');
    if (fu) fu.value = '';
    document.getElementById('certificate-form-modal').classList.add('active');
}
function editCertificate(index) {
    editingCertificateIndex = index;
    const c = appState.certificates[index];
    document.getElementById('certificate-form-title').textContent = 'Edit Certificate';
    const fu = document.getElementById('cert-image-upload');
    if (fu) fu.value = '';
    document.getElementById('cert-title').value = c.title || '';
    document.getElementById('cert-issuer').value = c.issuer || '';
    document.getElementById('cert-date').value = c.date || '';
    document.getElementById('cert-image').value = c.image || '';
    document.getElementById('cert-description').value = c.description || '';
    document.getElementById('certificate-form-modal').classList.add('active');
}
async function saveCertificate(e) {
    e.preventDefault();
    const imgVal = document.getElementById('cert-image').value?.trim();
    if (!imgVal) {
        showToast('Please add Image URL or upload an image', 'error');
        return;
    }
    const data = {
        title: document.getElementById('cert-title').value,
        issuer: document.getElementById('cert-issuer').value,
        date: document.getElementById('cert-date').value,
        image: imgVal,
        description: document.getElementById('cert-description').value
    };
    try {
        if (editingCertificateIndex >= 0) {
            const id = appState.certificates[editingCertificateIndex]._id;
            await api.certificatesAPI.update(id, data);
        } else {
            await api.certificatesAPI.create(data);
        }
        appState.certificates = await api.certificatesAPI.getAll();
        renderCertificates();
        loadAdminCertificates();
        closeModal('certificate-form-modal');
        showToast('✅ Certificate saved!');
    } catch (err) {
        showToast('❌ Save failed', 'error');
    }
}
async function deleteCertificate(id, index) {
    if (!confirm('Delete this certificate?')) return;
    try {
        await api.certificatesAPI.delete(id);
        appState.certificates = await api.certificatesAPI.getAll();
        renderCertificates();
        loadAdminCertificates();
        showToast('🗑️ Deleted!');
    } catch (err) {
        showToast('❌ Delete failed', 'error');
    }
}

// Export functions to window for global access
window.app = {
    showAdminLogin: () => document.getElementById('admin-login-modal').classList.add('active'),
    closeModal,
    switchTab,
    saveProfile,
    addSkill,
    deleteSkill,
    saveSkills,
    addProject,
    editProject,
    deleteProject,
    addAchievement,
    editAchievement,
    deleteAchievement,
    addCertificate,
    editCertificate,
    deleteCertificate,
    showCertificateModal,
    showAchievementModal,
    showAchievementFullSize,
    backToAchievementDetails,
    closeCertificateModal,
    downloadCertificate,
    showProjectDetails,
    logout
};

console.log('🚀 Portfolio MERN Application Loaded!');
console.log('✅ Data now loaded from MongoDB via API');
console.log('✅ Admin panel with authentication');