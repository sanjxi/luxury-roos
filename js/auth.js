/**
 * Authentication Module
 * Handles user registration, login, logout, and session management.
 */

const Auth = {
    // Utility to get users from localStorage
    getUsers: () => {
        const users = localStorage.getItem('hotelApp_users');
        return users ? JSON.parse(users) : [];
    },

    // Utility to save users to localStorage
    saveUsers: (users) => {
        localStorage.setItem('hotelApp_users', JSON.stringify(users));
    },

    // Register a new user
    register: (name, email, password) => {
        const users = Auth.getUsers();

        // Check if email already exists
        if (users.find(user => user.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: 'user_' + Date.now(),
            name,
            email,
            password // In a real app, this should be hashed
        };

        users.push(newUser);
        Auth.saveUsers(users);

        // Auto login after register
        Auth.login(email, password);

        return { success: true, message: 'Registration successful' };
    },

    // Login user
    login: (email, password) => {
        const users = Auth.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Create session (exclude password)
            const sessionUser = { ...user };
            delete sessionUser.password;

            localStorage.setItem('hotelApp_currentUser', JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        }

        return { success: false, message: 'Invalid email or password' };
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('hotelApp_currentUser');
        window.location.href = 'index.html';
    },

    // Get current logged in user
    getCurrentUser: () => {
        const user = localStorage.getItem('hotelApp_currentUser');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated, otherwise redirect
    requireAuth: () => {
        if (!Auth.getCurrentUser()) {
            window.location.href = 'login.html';
        }
    },

    // Update UI based on auth state
    updateNav: () => {
        const user = Auth.getCurrentUser();
        const navLinks = document.querySelector('.nav-links');

        if (!navLinks) return;

        // Common links for everyone
        const commonLinks = `
            <li><a href="index.html" class="nav-link">Home</a></li>
        `;

        if (user) {
            navLinks.innerHTML = `
                ${commonLinks}
                <li><a href="dashboard.html" class="nav-link">My Bookings</a></li>
                <li><span class="nav-link" style="color:var(--primary-hover);">Welcome, ${user.name}</span></li>
                <li><a href="#" onclick="Auth.logout()" class="nav-link">Logout</a></li>
            `;
        } else {
            navLinks.innerHTML = `
                ${commonLinks}
                <li><a href="login.html" class="nav-link">Login</a></li>
                <li><a href="register.html" class="nav-link btn btn-primary" style="padding: 8px 16px;">Register</a></li>
            `;
        }
    },

    // Admin Login
    loginAdmin: (email, password) => {
        // Hardcoded admin for demo
        if (email === 'admin@luxestays.com' && password === 'admin123') {
            const adminUser = {
                id: 'admin_01',
                name: 'Administrator',
                email: 'admin@luxestays.com',
                role: 'admin'
            };
            localStorage.setItem('hotelApp_currentUser', JSON.stringify(adminUser));
            return { success: true, user: adminUser };
        }
        return { success: false, message: 'Invalid admin credentials' };
    },

    // Check for global authentication and redirect if needed
    enforceGlobalAuth: () => {
        const user = Auth.getCurrentUser();
        const path = window.location.pathname;
        const page = path.split("/").pop();

        // Pages that don't satisfy auth requirement
        // entry.html is now the landing page
        const publicPages = ['entry.html', 'login.html', 'register.html', 'admin_login.html'];

        if (!user && !publicPages.includes(page)) {
            // For sub-pages, redirect to entry
            window.location.href = 'entry.html';
        }

        // Redirect logged-in users away from public pages
        if (user && publicPages.includes(page)) {
            if (user.role === 'admin') {
                window.location.href = 'admin_dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    }
};

// Run authentication check immediately
Auth.enforceGlobalAuth();

// Initialize nav on load
document.addEventListener('DOMContentLoaded', Auth.updateNav);
