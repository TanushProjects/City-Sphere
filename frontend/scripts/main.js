/**
 * CitySphere - Main JavaScript (Standalone Version)
 * Works without backend - uses mock data
 * Chatbot removed for simplicity
 */

// ===========================================
// CONFIGURATION
// ===========================================
const CONFIG = {
    ANIMATION_DURATION: 0.6,
    SCROLL_OFFSET: 100
};

// ===========================================
// MOCK DATA - Delhi Demo Data
// ===========================================
const MockData = {
    weather: {
        city: 'Delhi',
        temperature: { current: 24, high: 28, low: 18 },
        condition: 'Partly Cloudy',
        humidity: 52,
        wind: 12,
        aqi: 156,
        rainChance: 0
    },

    cityMood: {
        mood: 'busy',
        description: 'Evening rush - people heading home from work',
        hashtags: ['#DelhiDiaries', '#WeekendVibes']
    },

    events: [
        {
            _id: '1',
            title: 'Delhi Food Truck Festival 2024',
            description: '50+ gourmet food trucks, live music, and entertainment for the whole family!',
            category: 'Food',
            date: '2024-12-15',
            location: { venue: 'JLN Stadium' },
            image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800',
            price: '₹499+',
            featured: true
        },
        {
            _id: '2',
            title: 'Stand-Up Comedy Night',
            description: 'An evening of laughter with India\'s top comedians!',
            category: 'Standup',
            date: '2024-12-14',
            location: { venue: 'Canvas Laugh Club' },
            image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800',
            price: '₹799+'
        },
        {
            _id: '3',
            title: 'Delhi International Arts Festival',
            description: 'Week-long celebration of classical dance, music, and theater',
            category: 'Festival',
            date: '2024-12-20',
            location: { venue: 'India Habitat Centre' },
            image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
            price: '₹200+',
            featured: true
        },
        {
            _id: '4',
            title: 'Tech Startup Summit Delhi',
            description: 'Connect with entrepreneurs, investors, and tech enthusiasts',
            category: 'Workshop',
            date: '2024-12-16',
            location: { venue: 'Pragati Maidan' },
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            price: '₹1999+'
        },
        {
            _id: '5',
            title: 'Indie Music Fest',
            description: 'Underground sounds with emerging artists from across India',
            category: 'Concert',
            date: '2024-12-11',
            location: { venue: 'Hauz Khas Social' },
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
            price: '₹599+',
            featured: true
        },
        {
            _id: '6',
            title: 'A Midsummer Night\'s Dream',
            description: 'Shakespeare\'s comedy performed under the stars at Purana Qila',
            category: 'Theater',
            date: '2024-12-15',
            location: { venue: 'Purana Qila' },
            image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
            price: '₹500+'
        }
    ],

    crowd: [
        { place: 'Select Citywalk', placeType: 'mall', level: 'high', prediction: { bestTimeToVisit: '11 AM - 1 PM' } },
        { place: 'Rajiv Chowk Metro', placeType: 'metro_station', level: 'very_high', prediction: { bestTimeToVisit: '11 AM - 4 PM' } },
        { place: 'Akshardham Temple', placeType: 'temple', level: 'moderate', prediction: { bestTimeToVisit: '3 PM - 5 PM' } },
        { place: 'Chandni Chowk', placeType: 'market', level: 'high', prediction: { bestTimeToVisit: '9 AM - 10 AM' } },
        { place: 'India Gate', placeType: 'tourist_spot', level: 'moderate', prediction: { bestTimeToVisit: '6 PM - 8 PM' } },
        { place: 'Connaught Place', placeType: 'market', level: 'high', prediction: { bestTimeToVisit: '11 AM - 2 PM' } }
    ],

    issues: [
        { id: 'CS-POT-ABC123', category: 'Pothole', location: 'Ring Road near AIIMS', status: 'In Progress', upvotes: 45, daysAgo: 7 },
        { id: 'CS-GAR-DEF456', category: 'Garbage', location: 'Lajpat Nagar Market', status: 'Acknowledged', upvotes: 23, daysAgo: 3 },
        { id: 'CS-WAT-JKL012', category: 'Water Logging', location: 'ITO Intersection', status: 'Resolved', upvotes: 156, daysAgo: 7 }
    ]
};

// ===========================================
// THEME MANAGEMENT
// ===========================================
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('citysphere-theme') || 'day';
        this.setTheme(savedTheme);
        this.bindEvents();
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('citysphere-theme', theme);
        this.updateToggleIcon(theme);
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'night' ? 'day' : 'night';
        this.setTheme(newTheme);
    },

    updateToggleIcon(theme) {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.innerHTML = theme === 'night' ? '☀️' : '🌙';
        }
    },

    bindEvents() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }
};

// ===========================================
// GSAP ANIMATIONS
// ===========================================
const Animations = {
    init() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded');
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        this.initHeroAnimations();
        this.initScrollAnimations();
        this.initHoverAnimations();
    },

    initHeroAnimations() {
        gsap.from('.hero-text h1', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' });
        gsap.from('.hero-text p', { duration: 1, y: 30, opacity: 0, delay: 0.3, ease: 'power3.out' });
        gsap.from('.hero-text .btn', { duration: 0.8, y: 20, opacity: 0, delay: 0.5, stagger: 0.2, ease: 'power3.out' });
        gsap.from('.stat-item', { duration: 0.8, y: 30, opacity: 0, stagger: 0.15, delay: 0.7, ease: 'power3.out' });
        this.animateGradientBackground();
    },

    animateGradientBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        gsap.to(hero, { backgroundPosition: '100% 100%', duration: 20, repeat: -1, yoyo: true, ease: 'none' });
    },

    initScrollAnimations() {
        gsap.utils.toArray('.glass-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
                duration: 0.6, y: 50, opacity: 0, delay: i * 0.1, ease: 'power3.out'
            });
        });

        gsap.utils.toArray('.event-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
                duration: 0.8, x: i % 2 === 0 ? -100 : 100, opacity: 0, rotation: i % 2 === 0 ? -5 : 5, ease: 'power3.out'
            });
        });

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: { trigger: header, start: 'top 80%' },
                duration: 0.8, y: 30, opacity: 0, ease: 'power3.out'
            });
        });
    },

    initHoverAnimations() {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { duration: 0.3, y: -5, scale: 1.02, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { duration: 0.3, y: 0, scale: 1, ease: 'power2.out' });
            });
        });
    },

    pulseElement(element, intensity = 'moderate') {
        const scales = { low: 1.05, moderate: 1.1, high: 1.15, very_high: 1.2 };
        const durations = { low: 2, moderate: 1.5, high: 1, very_high: 0.5 };
        gsap.to(element, {
            duration: durations[intensity] || 1.5,
            scale: scales[intensity] || 1.1,
            repeat: -1, yoyo: true, ease: 'power1.inOut'
        });
    }
};

// ===========================================
// DASHBOARD WIDGETS (Mock Data)
// ===========================================
const Dashboard = {
    init() {
        this.loadWeather();
        this.loadCityMood();
        this.initMetroCountdown();
        this.initTrafficHeatmap();
    },

    loadWeather() {
        // Using mock data instead of API
        this.updateWeatherWidget(MockData.weather);
    },

    updateWeatherWidget(data) {
        const weatherCard = document.querySelector('.weather-card');
        if (!weatherCard) return;

        const tempEl = weatherCard.querySelector('.card-value');
        const conditionEl = weatherCard.querySelector('.weather-condition');

        if (tempEl) tempEl.textContent = `${data.temperature.current}°C`;
        if (conditionEl) conditionEl.textContent = data.condition;
    },

    loadCityMood() {
        this.updateMoodIndicator(MockData.cityMood);
    },

    updateMoodIndicator(data) {
        const moodEl = document.querySelector('.mood-indicator');
        if (!moodEl) return;

        const moodColors = {
            happy: '#22c55e',
            neutral: '#64748b',
            busy: '#f97316',
            festive: '#a855f7',
            rainy: '#3b82f6'
        };

        gsap.to(moodEl, {
            duration: 1,
            backgroundColor: moodColors[data.mood] || moodColors.neutral,
            ease: 'power2.out'
        });
    },

    initMetroCountdown() {
        const updateCountdown = () => {
            const countdowns = document.querySelectorAll('.metro-eta');
            countdowns.forEach(el => {
                const mins = parseInt(el.dataset.mins) || Math.floor(Math.random() * 10) + 1;
                el.textContent = `${mins} min`;
            });
        };
        updateCountdown();
        setInterval(updateCountdown, 60000);
    },

    initTrafficHeatmap() {
        const heatmap = document.querySelector('.traffic-heatmap');
        if (!heatmap) return;
        gsap.to(heatmap, { backgroundPosition: '100% 0%', duration: 10, repeat: -1, ease: 'none' });
    }
};

// ===========================================
// EVENTS MANAGER (Mock Data)
// ===========================================
const EventsManager = {
    events: MockData.events,

    init() {
        this.renderEvents(this.events);
        this.bindFilterButtons();
    },

    bindFilterButtons() {
        const filterBtns = document.querySelectorAll('[data-filter]');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active state
                filterBtns.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-secondary');
                });
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');

                // Filter events
                if (filter === 'all') {
                    this.renderEvents(this.events);
                } else {
                    const filtered = this.events.filter(e =>
                        e.category.toLowerCase() === filter.toLowerCase()
                    );
                    this.renderEvents(filtered);
                }
            });
        });
    },

    renderEvents(events) {
        const container = document.querySelector('.events-grid');
        if (!container) return;

        container.innerHTML = events.map(event => this.createEventCard(event)).join('');

        // Re-trigger animations
        if (typeof gsap !== 'undefined') {
            gsap.from('.event-card', {
                duration: 0.5, y: 30, opacity: 0, stagger: 0.1, ease: 'power2.out'
            });
        }
    },

    createEventCard(event) {
        const date = new Date(event.date);
        const formattedDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

        return `
            <article class="glass-card event-card" data-id="${event._id}">
                <img src="${event.image}" alt="${event.title}" class="event-image" loading="lazy">
                <div class="event-content">
                    <span class="event-category">${this.getCategoryEmoji(event.category)} ${event.category}</span>
                    <h3 class="event-title">${event.title}</h3>
                    <p>${event.description.substring(0, 100)}...</p>
                    <div class="event-meta">
                        <span>📅 ${formattedDate}</span>
                        <span>📍 ${event.location.venue}</span>
                    </div>
                    <div class="mt-md flex gap-sm">
                        <span style="background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem;">${event.price}</span>
                        ${event.featured ? '<span style="background: rgba(34, 197, 94, 0.2); color: #22c55e; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem;">Featured</span>' : ''}
                    </div>
                </div>
            </article>
        `;
    },

    getCategoryEmoji(category) {
        const emojis = {
            'Food': '🍕', 'Standup': '😂', 'Festival': '🎉',
            'Workshop': '📚', 'Concert': '🎵', 'Theater': '🎭'
        };
        return emojis[category] || '🎪';
    }
};

// ===========================================
// CROWD PREDICTOR (Mock Data)
// ===========================================
const CrowdPredictor = {
    init() {
        this.renderCrowdIndicators(MockData.crowd);
    },

    renderCrowdIndicators(data) {
        const container = document.querySelector('.crowd-grid');
        if (!container) return;

        // Only update on index page if the crowd-grid is empty or different
        const existingCards = container.querySelectorAll('.crowd-card');
        if (existingCards.length > 0) {
            // Already has static content, just animate
            document.querySelectorAll('.crowd-indicator').forEach(indicator => {
                const level = indicator.dataset.level;
                Animations.pulseElement(indicator, level);
            });
            return;
        }

        container.innerHTML = data.map(item => this.createCrowdCard(item)).join('');

        document.querySelectorAll('.crowd-indicator').forEach(indicator => {
            const level = indicator.dataset.level;
            Animations.pulseElement(indicator, level);
        });
    },

    createCrowdCard(item) {
        const icons = {
            mall: '🛍️', metro_station: '🚇', temple: '🛕',
            market: '🏪', tourist_spot: '📸'
        };

        return `
            <div class="glass-card crowd-card">
                <div class="crowd-indicator ${item.level.replace('_', '-')}" data-level="${item.level}">
                    ${icons[item.placeType] || '📍'}
                </div>
                <h4>${item.place}</h4>
                <p class="crowd-level-text">${item.level.replace('_', ' ')}</p>
                <p class="crowd-prediction">Best time: ${item.prediction.bestTimeToVisit}</p>
            </div>
        `;
    }
};

// ===========================================
// ISSUE REPORTER (localStorage)
// ===========================================
const IssueReporter = {
    init() {
        this.bindFormEvents();
    },

    bindFormEvents() {
        const form = document.querySelector('#issue-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitIssue(new FormData(form));
        });
    },

    submitIssue(formData) {
        const data = Object.fromEntries(formData.entries());

        // Generate complaint ID
        const categories = { pothole: 'POT', garbage: 'GAR', streetlight: 'STR', water_logging: 'WAT', road_damage: 'ROD', drainage: 'DRN', other: 'OTH' };
        const prefix = categories[data.category] || 'OTH';
        const complaintId = `CS-${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Save to localStorage
        const issues = JSON.parse(localStorage.getItem('citysphere-issues') || '[]');
        issues.push({
            id: complaintId,
            ...data,
            status: 'Submitted',
            date: new Date().toISOString(),
            upvotes: 0
        });
        localStorage.setItem('citysphere-issues', JSON.stringify(issues));

        // Show success
        alert(`✅ Issue reported successfully!\n\nComplaint ID: ${complaintId}\n\nWe'll notify the authorities.`);

        // Reset form
        document.querySelector('#issue-form').reset();
    }
};

// ===========================================
// MAP INTEGRATION (Leaflet + OpenStreetMap - FREE!)
// ===========================================
const MapManager = {
    map: null,
    markers: [],
    markerLayers: {
        landmarks: [], hospitals: [], metro: [], food: [],
        shopping: [], temples: [], parks: [], issues: []
    },

    // Delhi locations data
    delhiLocations: {
        landmarks: [
            { name: 'India Gate', lat: 28.6129, lng: 77.2295, icon: '🏛️', address: 'Rajpath, India Gate, New Delhi', description: '42m war memorial, iconic landmark' },
            { name: 'Red Fort', lat: 28.6562, lng: 77.2410, icon: '🏰', address: 'Netaji Subhash Marg, Chandni Chowk', description: 'Mughal-era fort, UNESCO World Heritage Site' },
            { name: 'Qutub Minar', lat: 28.5245, lng: 77.1855, icon: '🗼', address: 'Mehrauli, New Delhi', description: '73m minaret, UNESCO World Heritage Site' },
            { name: 'Humayun\'s Tomb', lat: 28.5933, lng: 77.2507, icon: '🕌', address: 'Nizamuddin East, New Delhi', description: 'Mughal architecture, inspiration for Taj Mahal' },
            { name: 'Lotus Temple', lat: 28.5535, lng: 77.2588, icon: '🪷', address: 'Bahapur, New Delhi', description: 'Bahá\'í House of Worship, lotus-shaped' },
            { name: 'Jama Masjid', lat: 28.6507, lng: 77.2334, icon: '🕌', address: 'Jama Masjid Road, Chandni Chowk', description: 'India\'s largest mosque' },
            { name: 'Rashtrapati Bhavan', lat: 28.6143, lng: 77.1994, icon: '🏛️', address: 'President\'s Estate, New Delhi', description: 'Official residence of President of India' },
            { name: 'Akshardham Temple', lat: 28.6127, lng: 77.2773, icon: '🛕', address: 'Noida Mor, New Delhi', description: 'Largest Hindu temple complex' },
            { name: 'Jantar Mantar', lat: 28.6271, lng: 77.2166, icon: '🔭', address: 'Connaught Place, New Delhi', description: 'Astronomical observation site' },
            { name: 'Purana Qila', lat: 28.6095, lng: 77.2436, icon: '🏰', address: 'Mathura Road, New Delhi', description: 'Ancient fort from 16th century' }
        ],
        hospitals: [
            { name: 'AIIMS Delhi', lat: 28.5672, lng: 77.2100, icon: '🏥', address: 'Ansari Nagar, New Delhi', description: 'Premier medical institution' },
            { name: 'Safdarjung Hospital', lat: 28.5685, lng: 77.2066, icon: '🏥', address: 'Ring Road, New Delhi', description: 'Major government hospital' },
            { name: 'Max Super Speciality Saket', lat: 28.5275, lng: 77.2138, icon: '🏥', address: 'Saket, New Delhi', description: 'Multi-specialty hospital' },
            { name: 'Apollo Hospital', lat: 28.5460, lng: 77.2840, icon: '🏥', address: 'Jasola, New Delhi', description: 'Leading private hospital' },
            { name: 'Sir Ganga Ram Hospital', lat: 28.6407, lng: 77.1926, icon: '🏥', address: 'Rajinder Nagar, New Delhi', description: 'Trust-run hospital' },
            { name: 'Lok Nayak Hospital', lat: 28.6387, lng: 77.2390, icon: '🏥', address: 'Jawaharlal Nehru Marg', description: '24x7 emergency services' }
        ],
        metro: [
            { name: 'Rajiv Chowk', lat: 28.6328, lng: 77.2197, icon: '🚇', address: 'Connaught Place', description: 'Blue & Yellow Line interchange, busiest station' },
            { name: 'Kashmere Gate', lat: 28.6675, lng: 77.2280, icon: '🚇', address: 'Kashmere Gate', description: 'Red, Yellow, Violet Line interchange' },
            { name: 'Central Secretariat', lat: 28.6145, lng: 77.2121, icon: '🚇', address: 'Central Secretariat', description: 'Yellow & Violet Line interchange' },
            { name: 'Hauz Khas', lat: 28.5432, lng: 77.2066, icon: '🚇', address: 'Hauz Khas Village', description: 'Yellow & Magenta Line interchange' },
            { name: 'New Delhi', lat: 28.6424, lng: 77.2197, icon: '🚇', address: 'New Delhi Railway Station', description: 'Yellow & Airport Express' },
            { name: 'HUDA City Centre', lat: 28.4594, lng: 77.0723, icon: '🚇', address: 'Gurugram', description: 'Yellow Line terminal' }
        ],
        food: [
            { name: 'Paranthe Wali Gali', lat: 28.6562, lng: 77.2310, icon: '🥘', address: 'Chandni Chowk', description: 'Famous for stuffed parathas since 1872' },
            { name: 'Karim\'s', lat: 28.6510, lng: 77.2335, icon: '🍖', address: 'Jama Masjid', description: 'Legendary Mughlai cuisine since 1913' },
            { name: 'Khan Chacha', lat: 28.5955, lng: 77.2255, icon: '🌯', address: 'Khan Market', description: 'Best rolls and kebabs' },
            { name: 'Indian Accent', lat: 28.5955, lng: 77.1900, icon: '🍽️', address: 'The Lodhi', description: 'Award-winning modern Indian' },
            { name: 'Natraj Dahi Bhalle', lat: 28.6566, lng: 77.2296, icon: '🥙', address: 'Chandni Chowk', description: 'Best chaat in Delhi' },
            { name: 'Dilli Haat', lat: 28.5741, lng: 77.2081, icon: '🍛', address: 'INA', description: 'Cuisine from all Indian states' }
        ],
        shopping: [
            { name: 'Connaught Place', lat: 28.6315, lng: 77.2167, icon: '🛍️', address: 'Central Delhi', description: 'Colonial-era shopping district' },
            { name: 'Khan Market', lat: 28.6004, lng: 77.2266, icon: '🛍️', address: 'Khan Market', description: 'Premium boutiques and cafes' },
            { name: 'Sarojini Nagar Market', lat: 28.5751, lng: 77.1961, icon: '👗', address: 'Sarojini Nagar', description: 'Best bargain shopping' },
            { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2303, icon: '🏪', address: 'Old Delhi', description: 'Historic market since 17th century' },
            { name: 'Select Citywalk', lat: 28.5289, lng: 77.2190, icon: '🏬', address: 'Saket', description: 'Premium mall' },
            { name: 'DLF Mall of India', lat: 28.5672, lng: 77.3214, icon: '🏬', address: 'Noida', description: 'India\'s largest mall' }
        ],
        temples: [
            { name: 'Akshardham Temple', lat: 28.6127, lng: 77.2773, icon: '🛕', address: 'Noida Mor', description: 'Largest Hindu temple complex' },
            { name: 'ISKCON Temple', lat: 28.4962, lng: 77.2526, icon: '🛕', address: 'Sant Nagar, East of Kailash', description: 'Krishna temple' },
            { name: 'Lotus Temple', lat: 28.5535, lng: 77.2588, icon: '🪷', address: 'Bahapur', description: 'Bahá\'í House of Worship' },
            { name: 'Birla Mandir', lat: 28.6328, lng: 77.1990, icon: '🛕', address: 'Mandir Marg', description: 'Hindu temple inaugurated by Gandhi' },
            { name: 'Gurudwara Bangla Sahib', lat: 28.6264, lng: 77.2091, icon: '🛕', address: 'Connaught Place', description: 'Prominent Sikh gurdwara' },
            { name: 'Nizamuddin Dargah', lat: 28.5908, lng: 77.2435, icon: '🕌', address: 'Nizamuddin West', description: 'Sufi shrine, qawwali music' }
        ],
        parks: [
            { name: 'Lodhi Garden', lat: 28.5933, lng: 77.2197, icon: '🌳', address: 'Lodhi Road', description: '90-acre park with Mughal tombs' },
            { name: 'India Gate Lawns', lat: 28.6129, lng: 77.2295, icon: '🌳', address: 'Rajpath', description: 'Popular evening hangout' },
            { name: 'Sunder Nursery', lat: 28.5928, lng: 77.2513, icon: '🌳', address: 'Near Humayun\'s Tomb', description: '90-acre heritage park' },
            { name: 'Garden of Five Senses', lat: 28.5120, lng: 77.1985, icon: '🌸', address: 'Saket', description: 'Leisure destination with art' },
            { name: 'Deer Park', lat: 28.5544, lng: 77.2100, icon: '🦌', address: 'Hauz Khas', description: 'Home to spotted deer' },
            { name: 'Buddha Jayanti Park', lat: 28.6017, lng: 77.1738, icon: '🌳', address: 'Ridge Road', description: 'Tranquil park dedicated to Buddha' }
        ],
        issues: [
            { name: 'Pothole - Ring Road', lat: 28.5800, lng: 77.2380, icon: '⚠️', address: 'Ring Road near AIIMS', description: 'Large pothole reported' },
            { name: 'Garbage - Lajpat Nagar', lat: 28.5700, lng: 77.2500, icon: '🗑️', address: 'Lajpat Nagar Market', description: 'Garbage overflow issue' },
            { name: 'Streetlight - CP', lat: 28.6310, lng: 77.2200, icon: '💡', address: 'Connaught Place', description: 'Broken streetlight' },
            { name: 'Water Logging - ITO', lat: 28.6287, lng: 77.2414, icon: '💧', address: 'ITO Intersection', description: 'Water logging during rains' }
        ]
    },

    init() {
        if (typeof L === 'undefined') {
            console.warn('Leaflet not loaded');
            return;
        }

        const mapContainer = document.getElementById('map');
        const loadingEl = document.getElementById('map-loading');
        if (!mapContainer) return;

        if (loadingEl) loadingEl.style.display = 'none';
        mapContainer.style.display = 'block';

        this.map = L.map('map', {
            center: [28.6139, 77.2090],
            zoom: 12,
            zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        this.loadMarkers('landmarks');
        this.bindFilterButtons();
        this.bindLocationButton();

        console.log('🗺️ Map initialized with OpenStreetMap');
    },

    loadMarkers(category = 'landmarks') {
        this.clearAllMarkers();
        this.addMarkersForCategory(category);
    },

    clearAllMarkers() {
        Object.keys(this.markerLayers).forEach(key => {
            this.markerLayers[key].forEach(marker => {
                if (this.map) this.map.removeLayer(marker);
            });
            this.markerLayers[key] = [];
        });
    },

    addMarkersForCategory(category) {
        const locations = this.delhiLocations[category];
        if (!locations) return;

        locations.forEach((location, index) => {
            const marker = this.createMarker(location);
            this.markerLayers[category].push(marker);
            setTimeout(() => marker.addTo(this.map), index * 50);
        });
    },

    createMarker(location) {
        const iconHtml = `<div class="custom-marker" style="font-size: 1.8rem; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">${location.icon}</div>`;
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'leaflet-emoji-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });

        const marker = L.marker([location.lat, location.lng], { icon: customIcon });
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${location.icon} ${location.name}</h4>
                <p class="popup-address">📍 ${location.address}</p>
                ${location.description ? `<p class="popup-desc">${location.description}</p>` : ''}
                <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" 
                   target="_blank" class="popup-directions">🧭 Get Directions</a>
            </div>
        `);
        return marker;
    },

    bindFilterButtons() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadMarkers(filter);
            });
        });
    },

    bindLocationButton() {
        const locationBtn = document.getElementById('btn-location');
        if (!locationBtn) return;

        locationBtn.addEventListener('click', () => {
            if ('geolocation' in navigator) {
                locationBtn.innerHTML = '⏳ Locating...';
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.map.flyTo([latitude, longitude], 15);
                        const userIcon = L.divIcon({
                            html: '<div style="font-size: 2rem; animation: pulse 1s infinite;">📍</div>',
                            className: 'leaflet-emoji-icon',
                            iconSize: [30, 30],
                            iconAnchor: [15, 30]
                        });
                        L.marker([latitude, longitude], { icon: userIcon })
                            .addTo(this.map)
                            .bindPopup('<h4>📍 You are here!</h4>')
                            .openPopup();
                        locationBtn.innerHTML = '📍 My Location';
                    },
                    () => {
                        alert('Could not get your location. Please enable location access.');
                        locationBtn.innerHTML = '📍 My Location';
                    }
                );
            }
        });
    }
};

// ===========================================
// BUDGET PLANNER
// ===========================================
const BudgetPlanner = {
    values: { rent: 15000, food: 8000, commute: 3000, utilities: 2000, entertainment: 5000 },

    init() {
        this.bindSliders();
    },

    bindSliders() {
        document.querySelectorAll('.budget-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const category = e.target.dataset.category;
                this.values[category] = parseInt(e.target.value);
                this.updateDisplay(category, e.target.value);
            });
        });
    },

    updateDisplay(category, value) {
        const display = document.querySelector(`[data-display="${category}"]`);
        if (display) display.textContent = `₹${parseInt(value).toLocaleString()}`;
    }
};

// ===========================================
// INITIALIZATION
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Animations.init();
    Dashboard.init();

    const path = window.location.pathname;

    if (path.includes('events')) {
        EventsManager.init();
    }

    if (path.includes('map')) {
        MapManager.init();
    }

    if (path.includes('budget')) {
        BudgetPlanner.init();
    }

    CrowdPredictor.init();
    IssueReporter.init();

    console.log('🌆 CitySphere initialized (Standalone Mode)');
});

// Export for external use
window.CitySphere = {
    ThemeManager,
    Animations,
    Dashboard,
    MapManager,
    MockData
};
