/**
 * Hotels Module
 * Handles hotel data, searching, and filtering.
 */

const Hotels = {
    // Mock Data
    data: [
        {
            id: 1,
            name: "Grand Luxury Hotel",
            city: "Paris",
            rating: 5,
            price: 450,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            amenities: ["pool", "spa", "gym", "wifi", "restaurant"],
            description: "Experience world-class service at the heart of Paris.",
            rooms: [
                { type: "Deluxe King", price: 450, capacity: 2, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80" },
                { type: "Executive Suite", price: 750, capacity: 4, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
            ]
        },
        {
            id: 2,
            name: "Urban Boutique Stay",
            city: "New York",
            rating: 4,
            price: 280,
            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1225&q=80",
            amenities: ["wifi", "gym", "bar"],
            description: "Modern comfort in the middle of the concrete jungle.",
            rooms: [
                { type: "Queen Studio", price: 280, capacity: 2, image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
            ]
        },
        {
            id: 3,
            name: "Seaside Resort & Spa",
            city: "Bali",
            rating: 5,
            price: 320,
            image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1287&q=80",
            amenities: ["pool", "spa", "beach", "wifi", "breakfast"],
            description: "Relax in paradise with stunning ocean views.",
            rooms: [
                { type: "Ocean View Villa", price: 320, capacity: 2, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
                { type: "Family Bungalow", price: 500, capacity: 5, image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
            ]
        },
        {
            id: 4,
            name: "Alpine Lodge",
            city: "Zurich",
            rating: 4,
            price: 200,
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            amenities: ["wifi", "fireplace", "parking"],
            description: "Cozy retreat in the Swiss Alps.",
            rooms: [
                { type: "Standard Double", price: 200, capacity: 2, image: "https://images.unsplash.com/photo-1560448205-031b27facc8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
            ]
        },
        {
            id: 5,
            name: "Tokyo Tower Inn",
            city: "Tokyo",
            rating: 3,
            price: 150,
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            amenities: ["wifi", "restaurant"],
            description: "Efficient and convenient stay near Tokyo Tower.",
            rooms: [
                { type: "Compact Twin", price: 150, capacity: 2, image: "https://images.unsplash.com/photo-1554646543-a60d3dce8e00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
            ]
        },
        {
            id: 6,
            name: "London Royal Park",
            city: "London",
            rating: 5,
            price: 550,
            image: "https://images.unsplash.com/photo-1565031491598-e924d5ba69a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            amenities: ["wifi", "gym", "spa", "bar", "concierge"],
            description: "Regal elegance overlooking Hyde Park.",
            rooms: [
                { type: "Royal Suite", price: 1200, capacity: 2, image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80" },
                { type: "Deluxe King", price: 550, capacity: 2, image: "https://images.unsplash.com/photo-1590490359683-65813c23762d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80" }
            ]
        }
    ],

    // Get all hotels
    getAll: () => Hotels.data,

    // Get hotel by ID
    getById: (id) => Hotels.data.find(h => h.id == id),

    // Search hotels
    search: (criteria) => {
        let results = Hotels.data;

        if (criteria.city) {
            results = results.filter(h => h.city.toLowerCase().includes(criteria.city.toLowerCase()));
        }

        if (criteria.guests) {
            results = results.filter(h => h.rooms.some(r => r.capacity >= criteria.guests));
        }

        return results;
    },

    // Render hotel cards
    renderHotels: (hotels, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (hotels.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">No hotels found matching your criteria.</p>';
            return;
        }

        hotels.forEach(hotel => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${hotel.image}" alt="${hotel.name}" class="hotel-card-img">
                <div class="hotel-card-body">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <h3>${hotel.name}</h3>
                        <span class="hotel-price">$${hotel.price}/night</span>
                    </div>
                    <p style="color:var(--grey); margin-bottom:0.5rem;"><i class="fas fa-map-marker-alt"></i> ${hotel.city}</p>
                    <div class="amenities-preview">
                        ${'★'.repeat(hotel.rating)}${'☆'.repeat(5 - hotel.rating)}
                        <span>•</span>
                        ${hotel.amenities.slice(0, 3).join(', ')}...
                    </div>
                    <a href="hotel.html?id=${hotel.id}" class="btn btn-primary btn-block" style="text-align:center;">View Details</a>
                </div>
            `;
            container.appendChild(card);
        });
    }
};
