// API Base URL
const API_BASE = '/api';

// Auth functions
class Auth {
    static async register(userData) {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    }

    static async login(credentials) {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static removeToken() {
        localStorage.removeItem('token');
    }

    static isLoggedIn() {
        return !!this.getToken();
    }

    static async getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                this.removeToken();
                return null;
            }
        } catch (error) {
            this.removeToken();
            return null;
        }
    }
}

// Contract functions
class ContractAPI {
    static async create(contractData) {
        const token = Auth.getToken();
        const response = await fetch(`${API_BASE}/contracts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(contractData)
        });
        return await response.json();
    }

    static async getMyContracts() {
        const token = Auth.getToken();
        const response = await fetch(`${API_BASE}/contracts/my-contracts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    static async getContract(id) {
        const token = Auth.getToken();
        const response = await fetch(`${API_BASE}/contracts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }
}

// Admin functions
class AdminAPI {
    static async getContracts(params = {}) {
        const token = Auth.getToken();
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE}/admin/contracts?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    static async updateContract(id, updates) {
        const token = Auth.getToken();
        const response = await fetch(`${API_BASE}/admin/contracts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });
        return await response.json();
    }

    static async getUsers(params = {}) {
        const token = Auth.getToken();
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE}/admin/users?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    static async getRevenue() {
        const token = Auth.getToken();
        const response = await fetch(`${API_BASE}/admin/revenue`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    static async getDashboard() {
        const token = Auth.getToken();
        const response = await fetch(`${API_BASE}/admin/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }
}

// UI Management
class UIManager {
    static showModal(modalId) {
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    }

    static hideModal(modalId) {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
        modal.hide();
    }

    static showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const container = document.querySelector('.container') || document.body;
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    static updateNavigation() {
        const loginBtn = document.querySelector('a[data-bs-target="#loginModal"]');
        const registerBtn = document.querySelector('a[data-bs-target="#registerModal"]');
        const userMenu = document.getElementById('userMenu');

        if (Auth.isLoggedIn()) {
            Auth.getCurrentUser().then(user => {
                if (user) {
                    if (loginBtn) loginBtn.style.display = 'none';
                    if (registerBtn) registerBtn.style.display = 'none';

                    if (userMenu) {
                        userMenu.style.display = 'block';
                        userMenu.innerHTML = `
                            <div class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                    <i class="fas fa-user me-1"></i>${user.name}
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" onclick="showUserDashboard()">Dashboard</a></li>
                                    ${user.role === 'admin' ? '<li><a class="dropdown-item" href="#" onclick="showAdminPanel()">Admin Panel</a></li>' : ''}
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
                                </ul>
                            </div>
                        `;
                    }
                }
            });
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation based on login status
    UIManager.updateNavigation();

    // Login form
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };

        try {
            const result = await Auth.login(formData);
            if (result.token) {
                Auth.setToken(result.token);
                UIManager.hideModal('loginModal');
                UIManager.showAlert('Login successful!', 'success');
                UIManager.updateNavigation();
                this.reset();
            } else {
                UIManager.showAlert(result.message || 'Login failed', 'danger');
            }
        } catch (error) {
            UIManager.showAlert('Login failed. Please try again.', 'danger');
        }
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value
        };

        try {
            const result = await Auth.register(formData);
            if (result.token) {
                Auth.setToken(result.token);
                UIManager.hideModal('registerModal');
                UIManager.showAlert('Registration successful!', 'success');
                UIManager.updateNavigation();
                this.reset();
            } else {
                UIManager.showAlert(result.message || 'Registration failed', 'danger');
            }
        } catch (error) {
            UIManager.showAlert('Registration failed. Please try again.', 'danger');
        }
    });

    // Contract form
    document.getElementById('contractForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!Auth.isLoggedIn()) {
            UIManager.showAlert('Please login to submit a contract', 'warning');
            UIManager.showModal('loginModal');
            return;
        }

        const formData = {
            serviceType: document.getElementById('serviceType').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            targetInfo: document.getElementById('targetInfo').value,
            clientName: document.getElementById('clientName').value,
            clientEmail: document.getElementById('clientEmail').value,
            anonymousService: document.getElementById('anonymousService').checked
        };

        try {
            const result = await ContractAPI.create(formData);
            if (result.contract) {
                UIManager.hideModal('startContractModal');
                UIManager.showAlert('Contract submitted successfully! Our team will review it soon.', 'success');
                this.reset();
            } else {
                UIManager.showAlert(result.message || 'Contract submission failed', 'danger');
            }
        } catch (error) {
            UIManager.showAlert('Contract submission failed. Please try again.', 'danger');
        }
    });
});

// Global functions for UI
async function showUserDashboard() {
    try {
        const contracts = await ContractAPI.getMyContracts();
        // Implement dashboard UI here
        UIManager.showAlert('User dashboard functionality will be implemented in the next phase', 'info');
    } catch (error) {
        UIManager.showAlert('Failed to load dashboard', 'danger');
    }
}

async function showAdminPanel() {
    try {
        const dashboard = await AdminAPI.getDashboard();
        // Implement admin panel UI here
        UIManager.showAlert('Admin panel functionality will be implemented in the next phase', 'info');
    } catch (error) {
        UIManager.showAlert('Access denied or failed to load admin panel', 'danger');
    }
}

function logout() {
    Auth.removeToken();
    UIManager.showAlert('Logged out successfully', 'success');
    UIManager.updateNavigation();
    window.location.reload();
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
