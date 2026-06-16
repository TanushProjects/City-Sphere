import mongoose from 'mongoose'
import { config } from '../config/index.js'
import { Event } from '../models/Event.js'

const sampleEvents = [
  {
    title: 'Delhi Street Food Festival',
    description: 'Experience the best of Delhi\'s legendary street food culture! Over 50 food stalls featuring chaat, paranthas, kebabs, biryanis, and more from across Old and New Delhi. Live music performances and cooking demonstrations throughout the day.',
    category: 'food',
    date: new Date(Date.now() + 2 * 86400000),
    endDate: new Date(Date.now() + 4 * 86400000),
    time: '11:00 AM - 10:00 PM',
    location: { name: 'JLN Stadium', address: 'Lodhi Road, New Delhi', lat: 28.5923, lng: 77.2379 },
    price: 200,
    featured: true,
    organizer: 'Delhi Food Council',
    tags: ['food', 'street-food', 'festival', 'family'],
    attendees: 1200,
    maxAttendees: 5000,
  },
  {
    title: 'Indie Music Night — Hauz Khas',
    description: 'An electrifying evening of indie rock, folk-fusion, and electronic music from Delhi\'s top underground artists. Featuring live performances, open mic sessions, and DJ sets in the iconic Hauz Khas Village setting.',
    category: 'music',
    date: new Date(Date.now() + 3 * 86400000),
    time: '7:00 PM - 11:30 PM',
    location: { name: 'Social, Hauz Khas Village', address: '9-A, Hauz Khas Village, New Delhi', lat: 28.4964, lng: 77.2004 },
    price: 500,
    featured: true,
    organizer: 'Delhi Music Collective',
    tags: ['music', 'indie', 'live', 'nightlife'],
    attendees: 150,
    maxAttendees: 300,
  },
  {
    title: 'Lodhi Art District Walking Tour',
    description: 'Guided tour of India\'s first open-air art district. Explore stunning murals by international and Indian artists on the walls of Lodhi Colony. Learn about the stories behind each artwork and the St+Art India Foundation.',
    category: 'art',
    date: new Date(Date.now() + 5 * 86400000),
    time: '10:00 AM - 12:30 PM',
    location: { name: 'Lodhi Art District', address: 'Lodhi Colony, New Delhi', lat: 28.5895, lng: 77.2274 },
    price: 0,
    featured: true,
    organizer: 'St+Art India Foundation',
    tags: ['art', 'walking-tour', 'free', 'culture'],
    attendees: 30,
    maxAttendees: 50,
  },
  {
    title: 'Delhi Half Marathon 2024',
    description: 'Join thousands of runners for Delhi\'s biggest running event! Routes through historic landmarks including India Gate, Rajpath, and Lutyens\' Delhi. Categories: 21K, 10K, and 5K Fun Run.',
    category: 'sports',
    date: new Date(Date.now() + 10 * 86400000),
    time: '5:30 AM - 11:00 AM',
    location: { name: 'Jawaharlal Nehru Stadium', address: 'Lodhi Road, New Delhi', lat: 28.5819, lng: 77.2334 },
    price: 800,
    maxPrice: 2000,
    featured: true,
    organizer: 'Procam International',
    tags: ['sports', 'running', 'marathon', 'fitness'],
    attendees: 5000,
    maxAttendees: 35000,
  },
  {
    title: 'Weekend Pottery Workshop',
    description: 'Learn the art of pottery in this hands-on workshop! Create your own ceramic pieces guided by expert artisans. All materials and firing included. Take home your creations after glazing.',
    category: 'workshop',
    date: new Date(Date.now() + 6 * 86400000),
    time: '2:00 PM - 5:00 PM',
    location: { name: 'Delhi Blue Pottery Trust', address: 'Delhi Haat, INA, New Delhi', lat: 28.5729, lng: 77.2100 },
    price: 1500,
    organizer: 'Craftsman\'s Studio',
    tags: ['workshop', 'pottery', 'craft', 'creative'],
    attendees: 12,
    maxAttendees: 20,
  },
  {
    title: 'Dilli Haat Cultural Festival',
    description: 'A vibrant celebration of India\'s diverse crafts, cuisines, and performing arts. Traditional artisans from across states showcase their crafts. Live folk music and dance performances every evening.',
    category: 'festival',
    date: new Date(Date.now() + 1 * 86400000),
    endDate: new Date(Date.now() + 7 * 86400000),
    time: '10:30 AM - 9:00 PM',
    location: { name: 'Dilli Haat, INA', address: 'Sri Aurobindo Marg, Opposite INA Market', lat: 28.5729, lng: 77.2100 },
    price: 30,
    featured: true,
    organizer: 'DTTDC',
    tags: ['festival', 'culture', 'crafts', 'food', 'family'],
    attendees: 800,
    maxAttendees: 3000,
  },
  {
    title: 'Stand-Up Comedy Night',
    description: 'Get ready to laugh! Delhi\'s best comedians take the stage for a hilarious evening of stand-up comedy. Featuring both established names and fresh new talent on the Delhi comedy circuit.',
    category: 'theater',
    date: new Date(Date.now() + 4 * 86400000),
    time: '8:00 PM - 10:30 PM',
    location: { name: 'Canvas Laugh Club', address: 'DLF CyberHub, Gurgaon', lat: 28.4949, lng: 77.0882 },
    price: 400,
    organizer: 'The Comedy Factory',
    tags: ['comedy', 'stand-up', 'nightlife', 'entertainment'],
    attendees: 80,
    maxAttendees: 150,
  },
  {
    title: 'Yoga at Sunset — Deer Park',
    description: 'Free community yoga session in the beautiful Deer Park, Hauz Khas. All levels welcome. Bring your own mat. Guided by certified yoga instructors with meditation and pranayama.',
    category: 'sports',
    date: new Date(Date.now() + 2 * 86400000),
    time: '5:30 PM - 7:00 PM',
    location: { name: 'Deer Park', address: 'Hauz Khas, New Delhi', lat: 28.4938, lng: 77.1998 },
    price: 0,
    organizer: 'Delhi Yoga Community',
    tags: ['yoga', 'fitness', 'free', 'outdoor', 'wellness'],
    attendees: 45,
    maxAttendees: 100,
  },
  {
    title: 'Photography Walk — Old Delhi',
    description: 'Capture the soul of Old Delhi with fellow photographers! Walk through Chandni Chowk, Jama Masjid, and the narrow bylanes. Tips on street photography, composition, and editing.',
    category: 'workshop',
    date: new Date(Date.now() + 7 * 86400000),
    time: '7:00 AM - 10:00 AM',
    location: { name: 'Chandni Chowk', address: 'Chandni Chowk, Old Delhi', lat: 28.6566, lng: 77.2301 },
    price: 300,
    organizer: 'Delhi Photo Club',
    tags: ['photography', 'workshop', 'heritage', 'walking-tour'],
    attendees: 20,
    maxAttendees: 25,
  },
  {
    title: 'Electronic Music Festival — Magnetic Fields',
    description: 'Delhi NCR\'s premier electronic music festival featuring international DJs and Indian electronic artists. Multiple stages, art installations, and immersive experiences.',
    category: 'music',
    date: new Date(Date.now() + 14 * 86400000),
    endDate: new Date(Date.now() + 16 * 86400000),
    time: '4:00 PM - 4:00 AM',
    location: { name: 'Leisure Valley Park', address: 'Sector 29, Gurgaon', lat: 28.4685, lng: 77.0636 },
    price: 2500,
    maxPrice: 5000,
    featured: true,
    organizer: 'Magnetic Fields',
    tags: ['electronic', 'music', 'festival', 'dj', 'nightlife'],
    attendees: 3000,
    maxAttendees: 10000,
  },
  {
    title: 'Delhi Book Fair 2024',
    description: 'Annual international book fair with publishers from around the world. Book launches, author meet-and-greets, literary discussions, and children\'s workshops. Huge discounts on books!',
    category: 'festival',
    date: new Date(Date.now() + 8 * 86400000),
    endDate: new Date(Date.now() + 15 * 86400000),
    time: '10:00 AM - 8:00 PM',
    location: { name: 'Pragati Maidan', address: 'Pragati Maidan, New Delhi', lat: 28.6179, lng: 77.2481 },
    price: 20,
    organizer: 'National Book Trust',
    tags: ['books', 'literature', 'festival', 'family', 'education'],
    attendees: 5000,
    maxAttendees: 50000,
  },
  {
    title: 'Qutub Festival — Classical Music & Dance',
    description: 'Experience classical Indian music and dance against the breathtaking backdrop of the Qutub Minar. Featuring performances by renowned artists in Hindustani and Carnatic traditions.',
    category: 'music',
    date: new Date(Date.now() + 12 * 86400000),
    endDate: new Date(Date.now() + 14 * 86400000),
    time: '6:30 PM - 9:30 PM',
    location: { name: 'Qutub Minar Complex', address: 'Mehrauli, New Delhi', lat: 28.5245, lng: 77.1855 },
    price: 350,
    featured: true,
    organizer: 'Delhi Tourism',
    tags: ['classical', 'music', 'dance', 'heritage', 'culture'],
    attendees: 400,
    maxAttendees: 1000,
  },
]

async function seed(): Promise<void> {
  try {
    await mongoose.connect(config.mongodb.uri)
    console.log('✅ Connected to MongoDB')

    // Clear existing events
    await Event.deleteMany({})
    console.log('🗑️  Cleared existing events')

    // Insert sample events
    await Event.insertMany(sampleEvents)
    console.log(`✅ Seeded ${sampleEvents.length} events`)

    console.log('\n📊 Seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seed()
