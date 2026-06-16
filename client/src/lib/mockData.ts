import type { CityLocation } from '../types'

// ========================================
// REFERENCE DATA — Delhi (Real locations, not demo data)
// ========================================

export const delhiLocations: Record<string, CityLocation[]> = {
  landmarks: [
    { name: 'India Gate', lat: 28.6129, lng: 77.2295, icon: '🏛️', address: 'Rajpath, India Gate, New Delhi', description: '42m war memorial, iconic landmark' },
    { name: 'Red Fort', lat: 28.6562, lng: 77.2410, icon: '🏰', address: 'Netaji Subhash Marg, Chandni Chowk', description: 'Mughal-era fort, UNESCO World Heritage Site' },
    { name: 'Qutub Minar', lat: 28.5245, lng: 77.1855, icon: '🗼', address: 'Mehrauli, New Delhi', description: '73m minaret, UNESCO World Heritage Site' },
    { name: "Humayun's Tomb", lat: 28.5933, lng: 77.2507, icon: '🕌', address: 'Nizamuddin East, New Delhi', description: 'Mughal architecture, inspiration for Taj Mahal' },
    { name: 'Lotus Temple', lat: 28.5535, lng: 77.2588, icon: '🪷', address: 'Bahapur, New Delhi', description: "Bahá'í House of Worship, lotus-shaped" },
    { name: 'Jama Masjid', lat: 28.6507, lng: 77.2334, icon: '🕌', address: 'Jama Masjid Road, Chandni Chowk', description: "India's largest mosque" },
    { name: 'Rashtrapati Bhavan', lat: 28.6143, lng: 77.1994, icon: '🏛️', address: "President's Estate, New Delhi", description: 'Official residence of President of India' },
    { name: 'Akshardham Temple', lat: 28.6127, lng: 77.2773, icon: '🛕', address: 'Noida Mor, New Delhi', description: 'Largest Hindu temple complex' },
    { name: 'Jantar Mantar', lat: 28.6271, lng: 77.2166, icon: '🔭', address: 'Connaught Place, New Delhi', description: 'Astronomical observation site' },
    { name: 'Purana Qila', lat: 28.6095, lng: 77.2436, icon: '🏰', address: 'Mathura Road, New Delhi', description: 'Ancient fort from 16th century' },
  ],
  hospitals: [
    { name: 'AIIMS Delhi', lat: 28.5672, lng: 77.2100, icon: '🏥', address: 'Ansari Nagar, New Delhi', description: 'Premier medical institution' },
    { name: 'Safdarjung Hospital', lat: 28.5685, lng: 77.2066, icon: '🏥', address: 'Ring Road, New Delhi', description: 'Major government hospital' },
    { name: 'Max Super Speciality Saket', lat: 28.5275, lng: 77.2138, icon: '🏥', address: 'Saket, New Delhi', description: 'Multi-specialty hospital' },
    { name: 'Apollo Hospital', lat: 28.5460, lng: 77.2840, icon: '🏥', address: 'Jasola, New Delhi', description: 'Leading private hospital' },
    { name: 'Sir Ganga Ram Hospital', lat: 28.6407, lng: 77.1926, icon: '🏥', address: 'Rajinder Nagar, New Delhi', description: 'Trust-run hospital' },
    { name: 'Lok Nayak Hospital', lat: 28.6387, lng: 77.2390, icon: '🏥', address: 'Jawaharlal Nehru Marg', description: '24x7 emergency services' },
  ],
  metro: [
    { name: 'Rajiv Chowk', lat: 28.6328, lng: 77.2197, icon: '🚇', address: 'Connaught Place', description: 'Blue & Yellow Line interchange, busiest station' },
    { name: 'Kashmere Gate', lat: 28.6675, lng: 77.2280, icon: '🚇', address: 'Kashmere Gate', description: 'Red, Yellow, Violet Line interchange' },
    { name: 'Central Secretariat', lat: 28.6145, lng: 77.2121, icon: '🚇', address: 'Central Secretariat', description: 'Yellow & Violet Line interchange' },
    { name: 'Hauz Khas', lat: 28.5432, lng: 77.2066, icon: '🚇', address: 'Hauz Khas Village', description: 'Yellow & Magenta Line interchange' },
    { name: 'New Delhi', lat: 28.6424, lng: 77.2197, icon: '🚇', address: 'New Delhi Railway Station', description: 'Yellow & Airport Express' },
    { name: 'HUDA City Centre', lat: 28.4594, lng: 77.0723, icon: '🚇', address: 'Gurugram', description: 'Yellow Line terminal' },
  ],
  food: [
    { name: 'Paranthe Wali Gali', lat: 28.6562, lng: 77.2310, icon: '🥘', address: 'Chandni Chowk', description: 'Famous for stuffed parathas since 1872' },
    { name: "Karim's", lat: 28.6510, lng: 77.2335, icon: '🍖', address: 'Jama Masjid', description: 'Legendary Mughlai cuisine since 1913' },
    { name: 'Khan Chacha', lat: 28.5955, lng: 77.2255, icon: '🌯', address: 'Khan Market', description: 'Best rolls and kebabs' },
    { name: 'Indian Accent', lat: 28.5955, lng: 77.1900, icon: '🍽️', address: 'The Lodhi', description: 'Award-winning modern Indian' },
    { name: 'Natraj Dahi Bhalle', lat: 28.6566, lng: 77.2296, icon: '🥙', address: 'Chandni Chowk', description: 'Best chaat in Delhi' },
    { name: 'Dilli Haat', lat: 28.5741, lng: 77.2081, icon: '🍛', address: 'INA', description: 'Cuisine from all Indian states' },
  ],
  shopping: [
    { name: 'Connaught Place', lat: 28.6315, lng: 77.2167, icon: '🛍️', address: 'Central Delhi', description: 'Colonial-era shopping district' },
    { name: 'Khan Market', lat: 28.6004, lng: 77.2266, icon: '🛍️', address: 'Khan Market', description: 'Premium boutiques and cafes' },
    { name: 'Sarojini Nagar Market', lat: 28.5751, lng: 77.1961, icon: '👗', address: 'Sarojini Nagar', description: 'Best bargain shopping' },
    { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2303, icon: '🏪', address: 'Old Delhi', description: 'Historic market since 17th century' },
    { name: 'Select Citywalk', lat: 28.5289, lng: 77.2190, icon: '🏬', address: 'Saket', description: 'Premium mall' },
    { name: 'DLF Mall of India', lat: 28.5672, lng: 77.3214, icon: '🏬', address: 'Noida', description: "India's largest mall" },
  ],
  temples: [
    { name: 'Akshardham Temple', lat: 28.6127, lng: 77.2773, icon: '🛕', address: 'Noida Mor', description: 'Largest Hindu temple complex' },
    { name: 'ISKCON Temple', lat: 28.4962, lng: 77.2526, icon: '🛕', address: 'Sant Nagar, East of Kailash', description: 'Krishna temple' },
    { name: 'Lotus Temple', lat: 28.5535, lng: 77.2588, icon: '🪷', address: 'Bahapur', description: "Bahá'í House of Worship" },
    { name: 'Birla Mandir', lat: 28.6328, lng: 77.1990, icon: '🛕', address: 'Mandir Marg', description: 'Hindu temple inaugurated by Gandhi' },
    { name: 'Gurudwara Bangla Sahib', lat: 28.6264, lng: 77.2091, icon: '🛕', address: 'Connaught Place', description: 'Prominent Sikh gurdwara' },
    { name: 'Nizamuddin Dargah', lat: 28.5908, lng: 77.2435, icon: '🕌', address: 'Nizamuddin West', description: 'Sufi shrine, qawwali music' },
  ],
  parks: [
    { name: 'Lodhi Garden', lat: 28.5933, lng: 77.2197, icon: '🌳', address: 'Lodhi Road', description: '90-acre park with Mughal tombs' },
    { name: 'India Gate Lawns', lat: 28.6129, lng: 77.2295, icon: '🌳', address: 'Rajpath', description: 'Popular evening hangout' },
    { name: 'Sunder Nursery', lat: 28.5928, lng: 77.2513, icon: '🌳', address: 'Near Humayun\'s Tomb', description: '90-acre heritage park' },
    { name: 'Garden of Five Senses', lat: 28.5120, lng: 77.1985, icon: '🌸', address: 'Saket', description: 'Leisure destination with art' },
    { name: 'Deer Park', lat: 28.5544, lng: 77.2100, icon: '🦌', address: 'Hauz Khas', description: 'Home to spotted deer' },
    { name: 'Buddha Jayanti Park', lat: 28.6017, lng: 77.1738, icon: '🌳', address: 'Ridge Road', description: 'Tranquil park dedicated to Buddha' },
  ],
}

export const categoryEmojis: Record<string, string> = {
  Food: '🍕',
  Standup: '😂',
  Festival: '🎉',
  Workshop: '📚',
  Concert: '🎵',
  Theater: '🎭',
  Music: '🎶',
  Art: '🎨',
  Sports: '🏃',
  Nightlife: '🌃',
}

export const complaintCategoryLabels: Record<string, { label: string; emoji: string }> = {
  pothole: { label: 'Pothole', emoji: '🕳️' },
  garbage: { label: 'Garbage', emoji: '🗑️' },
  streetlight: { label: 'Streetlight', emoji: '💡' },
  water_leakage: { label: 'Water Leakage', emoji: '💧' },
  road_damage: { label: 'Road Damage', emoji: '🚧' },
  drainage: { label: 'Drainage', emoji: '🌊' },
  other: { label: 'Other', emoji: '📝' },
}

export const transportModeInfo: Record<string, { label: string; emoji: string; color: string }> = {
  metro: { label: 'Metro', emoji: '🚇', color: '#3b82f6' },
  bus: { label: 'Bus', emoji: '🚌', color: '#22c55e' },
  walking: { label: 'Walking', emoji: '🚶', color: '#f59e0b' },
  cab: { label: 'Cab', emoji: '🚕', color: '#ef4444' },
  auto: { label: 'Auto', emoji: '🛺', color: '#a855f7' },
}

export const metroLines = [
  { name: 'Blue Line', color: '#3b82f6', eta: 3 },
  { name: 'Yellow Line', color: '#eab308', eta: 5 },
  { name: 'Magenta Line', color: '#d946ef', eta: 8 },
  { name: 'Red Line', color: '#ef4444', eta: 4 },
  { name: 'Green Line', color: '#22c55e', eta: 6 },
  { name: 'Violet Line', color: '#8b5cf6', eta: 7 },
]
