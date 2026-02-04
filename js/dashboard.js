/**
 * Dashboard Module
 * Handles displaying user bookings.
 */

const Dashboard = {
    init: () => {
        try {
            console.log('Dashboard Init Started');
            Auth.requireAuth();
            const user = Auth.getCurrentUser();
            console.log('User loaded:', user);

            if (user) {
                document.getElementById('user-name').textContent = user.name || 'Guest User';
                document.getElementById('user-email').textContent = user.email || '';
            }

            // Render Bookings & Calculate Loyalty
            // Check if Booking module exists
            if (typeof Booking !== 'undefined') {
                const bookings = Booking.getUserBookings(user.id);
                console.log('Bookings loaded:', bookings);
                Dashboard.renderBookings(bookings);
                Dashboard.updateLoyalty(bookings.length);
            } else {
                console.error('Booking module not loaded');
                document.getElementById('bookings-list').innerHTML = '<p style="color:red">Error loading booking system.</p>';
            }

            // Edit Profile Form
            const editForm = document.getElementById('edit-profile-form');
            if (editForm) {
                editForm.addEventListener('submit', Dashboard.handleUpdateProfile);
            }
        } catch (error) {
            console.error('Dashboard Init Failed:', error);
            document.getElementById('user-name').textContent = 'Error';
            // Optional: alert('Dashboard failed to load: ' + error.message);
        }
    },

    updateLoyalty: (count) => {
        const badge = document.getElementById('loyalty-badge');
        let tier = 'Member';
        let borderColor = 'rgba(255,255,255,0.3)';

        if (count >= 5) {
            tier = 'SILVER';
            borderColor = '#C0C0C0'; // Silver
        }
        if (count >= 10) {
            tier = 'GOLD';
            borderColor = '#FFD700'; // Gold
        }
        if (count >= 20) {
            tier = 'PLATINUM';
            borderColor = '#E5E4E2'; // Platinum
        }

        if (badge) {
            badge.textContent = tier;
            badge.style.border = `1px solid ${borderColor}`;
            if (count >= 10) badge.style.color = '#FFD700';
        }
    },

    openEditModal: () => {
        const user = Auth.getCurrentUser();
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-phone').value = user.phone || '';
        document.getElementById('edit-profile-modal').style.display = 'flex';
    },

    closeEditModal: () => {
        document.getElementById('edit-profile-modal').style.display = 'none';
    },

    handleUpdateProfile: (e) => {
        e.preventDefault();
        const user = Auth.getCurrentUser();
        const newName = document.getElementById('edit-name').value;
        const newPhone = document.getElementById('edit-phone').value;

        // Update User Object
        user.name = newName;
        user.phone = newPhone;

        // Save to Session & LocalStorage (Deep update needed)
        // Update Session
        localStorage.setItem('hotelApp_currentUser', JSON.stringify(user));

        // Update Main User List
        const users = Auth.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = { ...users[index], name: newName, phone: newPhone };
            Auth.saveUsers(users);
        }

        // Update UI
        document.getElementById('user-name').textContent = newName;
        Dashboard.closeEditModal();
        alert('Profile updated successfully!');
    },

    renderBookings: (bookings) => { // Modified to accept bookings array directly
        const container = document.getElementById('bookings-list');

        if (bookings.length === 0) {
            container.innerHTML = '<p>You have no bookings yet.</p>';
            return;
        }

        container.innerHTML = bookings.map(b => `
            <div class="booking-item">
                <div style="display:flex; gap:1rem; align-items:center;">
                    <img src="${b.image}" style="width:80px; height:80px; object-fit:cover; border-radius:4px;">
                    <div>
                        <h4>${b.hotelName}</h4>
                        <p>${b.hotelCity}</p>
                        <p class="text-xs" style="font-size:0.9rem; color:var(--grey);">
                            ${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}
                            (${b.nights} nights)
                        </p>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:bold; margin-bottom:0.5rem;">$${b.totalPrice}</div>
                    <span style="
                        padding: 4px 8px; 
                        border-radius: 4px; 
                        background: ${b.status === 'confirmed' ? '#d4edda' : '#f8d7da'}; 
                        color: ${b.status === 'confirmed' ? '#155724' : '#721c24'}; 
                        font-size: 0.8rem;
                        display:inline-block;
                        margin-bottom: 0.5rem;
                    ">
                        ${b.status.toUpperCase()}
                    </span>
                    ${b.status === 'confirmed' ? `
                        <br>
                        <button onclick="Dashboard.handleCancel('${b.id}')" style="color:var(--danger); background:none; border:none; cursor:pointer; text-decoration:underline; font-size:0.9rem;">
                            Cancel Booking
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    handleCancel: (bookingId) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            if (Booking.cancel(bookingId)) {
                alert('Booking cancelled successfully.');
                const user = Auth.getCurrentUser();
                // Re-fetch to update content
                const bookings = Booking.getUserBookings(user.id);
                Dashboard.renderBookings(bookings);
                Dashboard.updateLoyalty(bookings.length);
            }
        }
    }
};
