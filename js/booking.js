/**
 * Booking Module
 * Handles creating bookings and calculating costs.
 */

const Booking = {
    // Get all bookings
    getBookings: () => {
        const bookings = localStorage.getItem('hotelApp_bookings');
        return bookings ? JSON.parse(bookings) : [];
    },

    // Save bookings
    saveBookings: (bookings) => {
        localStorage.setItem('hotelApp_bookings', JSON.stringify(bookings));
    },

    // Calculate number of nights
    calculateNights: (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // Create a new booking
    create: (bookingData) => {
        const bookings = Booking.getBookings();

        // Validation: Check double booking (simplified)
        // In a real app, this would be complex backend logic

        const newBooking = {
            id: 'bk_' + Date.now(),
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            ...bookingData
        };

        bookings.push(newBooking);
        Booking.saveBookings(bookings);

        return { success: true, bookingId: newBooking.id };
    },

    // Get bookings for a specific user
    getUserBookings: (userId) => {
        const bookings = Booking.getBookings();
        // Join with Hotel data for display
        return bookings
            .filter(b => b.userId === userId)
            .map(b => {
                const hotel = Hotels.getById(b.hotelId);
                return {
                    ...b,
                    hotelName: hotel ? hotel.name : 'Unknown Hotel',
                    hotelCity: hotel ? hotel.city : 'Unknown City',
                    image: hotel ? hotel.image : ''
                };
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Cancel a booking
    cancel: (bookingId) => {
        let bookings = Booking.getBookings();
        const index = bookings.findIndex(b => b.id === bookingId);

        if (index !== -1) {
            bookings[index].status = 'cancelled';
            Booking.saveBookings(bookings);
            return true;
        }
        return false;
    }
};
