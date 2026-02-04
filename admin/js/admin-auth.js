/**
 * Admin Authentication Module
 * Handles specific admin logic, credentials, and security features.
 */

const AdminAuth = {
    // Configuration
    config: {
        adminEmail: 'sanjai@gamil.com',
        adminPass: '1234',
        lockoutDuration: 30000, // 30 seconds
        maxAttempts: 3
    },

    // Initialize Auth State
    init: () => {
        // Check for existing lockout on load
        const lockoutTime = localStorage.getItem('admin_lockout_until');
        if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
            return { locked: true, remaining: parseInt(lockoutTime) - Date.now() };
        }
        // Clear expired lockout
        if (lockoutTime) {
            localStorage.removeItem('admin_lockout_until');
            localStorage.setItem('admin_attempts', '0');
        }
        return { locked: false };
    },

    // Login Function
    login: (email, password) => {
        const { adminEmail, adminPass, maxAttempts, lockoutDuration } = AdminAuth.config;

        // Check Lockout
        const authState = AdminAuth.init();
        if (authState.locked) {
            return {
                success: false,
                locked: true,
                message: `Too many attempts. Wait ${Math.ceil(authState.remaining / 1000)}s.`
            };
        }

        // Validate Credentials
        if (email === adminEmail && password === adminPass) {
            // Success
            localStorage.setItem('admin_session', JSON.stringify({
                logged_in: true,
                email: email,
                timestamp: Date.now()
            }));
            localStorage.removeItem('admin_attempts'); // Reset attempts
            return { success: true };
        } else {
            // Failed Attempt Logic
            let attempts = parseInt(localStorage.getItem('admin_attempts') || '0');
            attempts++;
            localStorage.setItem('admin_attempts', attempts.toString());

            if (attempts >= maxAttempts) {
                const lockoutUntil = Date.now() + lockoutDuration;
                localStorage.setItem('admin_lockout_until', lockoutUntil.toString());
                return {
                    success: false,
                    locked: true,
                    message: `Account locked for 30s due to multiple failed attempts.`
                };
            }

            return {
                success: false,
                locked: false,
                message: `Invalid credentials. ${maxAttempts - attempts} attempts remaining.`
            };
        }
    },

    // Check if logged in (for dashboard)
    checkSession: () => {
        const session = JSON.parse(localStorage.getItem('admin_session'));
        if (!session || !session.logged_in) {
            window.location.href = 'admin-login.html';
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('admin_session');
        window.location.href = 'admin-login.html';
    }
};
