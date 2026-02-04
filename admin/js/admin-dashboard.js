/**
 * Admin Dashboard Logic
 * Checks session and renders data.
 */

// Verify Authentication immediately
AdminAuth.checkSession();

document.addEventListener('DOMContentLoaded', () => {
    // Set Admin Email in UI
    const session = JSON.parse(localStorage.getItem('admin_session'));
    if (session) {
        document.getElementById('admin-email-display').textContent = session.email;
    }

    // Logout Handler
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        AdminAuth.logout();
    });
});
