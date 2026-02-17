// API Base URL - Production (Render) aur Development ke liye
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : 'https://myportfolio-zncr.onrender.com';

const API_URL = API_BASE_URL + '/api';
const API_BASE = API_BASE_URL;

// Resolve image URL (handles relative paths from backend)
export const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return API_BASE + (url.startsWith('/') ? url : '/' + url);
};

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = 'Bearer ' + token.trim();
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'API call failed');
    }
    
    return data;
}

// Auth API
export const authAPI = {
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    verify: () => apiCall('/auth/verify')
};

// Profile API
export const profileAPI = {
    get: () => apiCall('/profile'),
    update: (data) => apiCall('/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};

// Skills API
export const skillsAPI = {
    getAll: () => apiCall('/skills'),
    create: (data) => apiCall('/skills', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiCall(`/skills/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`/skills/${id}`, {
        method: 'DELETE'
    })
};

// Projects API
export const projectsAPI = {
    getAll: () => apiCall('/projects'),
    create: (data) => apiCall('/projects', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiCall(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`/projects/${id}`, {
        method: 'DELETE'
    })
};

// Achievements API
export const achievementsAPI = {
    getAll: () => apiCall('/achievements'),
    create: (data) => apiCall('/achievements', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiCall(`/achievements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`/achievements/${id}`, {
        method: 'DELETE'
    })
};

// Certificates API
export const certificatesAPI = {
    getAll: () => apiCall('/certificates'),
    create: (data) => apiCall('/certificates', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiCall(`/certificates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`/certificates/${id}`, {
        method: 'DELETE'
    })
};