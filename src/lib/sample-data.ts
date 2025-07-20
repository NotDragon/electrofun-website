// Sample data for demonstration purposes
export const sampleKits = [
  {
    id: 'space-probe-1',
    name: 'Space Probe Kit',
    theme: 'Space Exploration',
    level: 1,
    description: 'Build your own space probe with sensors, data collection, and transmission capabilities. Perfect for learning about space missions and sensor technology.',
    price: 89.99,
    image_url: '/images/space-probe-kit.jpg',
    images: [
      '/images/space-probe-kit.jpg',
      '/images/space-probe-assembled.jpg',
      '/images/space-probe-components.jpg'
    ],
    features: [
      'Temperature and humidity sensors',
      'Light and pressure sensors',
      'Data transmission module',
      'Solar panel charging',
      'Real-time data logging'
    ],
    specifications: {
      'Dimensions': '15cm x 10cm x 5cm',
      'Weight': '250g',
      'Power': 'Solar + Battery',
      'Connectivity': 'WiFi + Bluetooth',
      'Sensors': 'Temperature, Humidity, Light, Pressure'
    }
  },
  {
    id: 'environmental-lab-2',
    name: 'Environmental Lab Kit',
    theme: 'Environmental Science',
    level: 2,
    description: 'Monitor environmental conditions with professional-grade sensors. Track temperature, humidity, air quality, and more in real-time.',
    price: 129.99,
    image_url: '/images/env-lab-kit.jpg',
    images: [
      '/images/env-lab-kit.jpg',
      '/images/env-lab-deployed.jpg',
      '/images/env-lab-dashboard.jpg'
    ],
    features: [
      'Air quality monitoring',
      'Weather station capabilities',
      'Long-term data collection',
      'Cloud data storage',
      'Mobile app integration'
    ],
    specifications: {
      'Dimensions': '20cm x 15cm x 8cm',
      'Weight': '400g',
      'Power': 'Rechargeable Battery',
      'Connectivity': 'WiFi + Cellular',
      'Sensors': 'Air Quality, Weather, UV, Noise'
    }
  },
  {
    id: 'art-light-3',
    name: 'Art & Light Kit',
    theme: 'Creative Technology',
    level: 3,
    description: 'Create stunning light displays and interactive art installations. Program custom animations and respond to sound and movement.',
    price: 149.99,
    image_url: '/images/art-light-kit.jpg',
    images: [
      '/images/art-light-kit.jpg',
      '/images/art-light-display.jpg',
      '/images/art-light-interactive.jpg'
    ],
    features: [
      'RGB LED matrix display',
      'Sound-reactive lighting',
      'Motion sensors',
      'Custom animation programming',
      'Wireless control'
    ],
    specifications: {
      'Dimensions': '25cm x 25cm x 3cm',
      'Weight': '300g',
      'Power': 'USB + Battery',
      'Connectivity': 'WiFi + Bluetooth',
      'LEDs': '64 RGB LEDs'
    }
  },
  {
    id: 'robotics-4',
    name: 'Robotics Kit',
    theme: 'Robotics',
    level: 4,
    description: 'Build and program your own robot with advanced sensors and motor control. Learn about robotics, automation, and AI.',
    price: 199.99,
    image_url: '/images/robotics-kit.jpg',
    images: [
      '/images/robotics-kit.jpg',
      '/images/robotics-assembled.jpg',
      '/images/robotics-programming.jpg'
    ],
    features: [
      'Dual motor control',
      'Ultrasonic distance sensors',
      'Line following capability',
      'Obstacle avoidance',
      'Programmable behaviors'
    ],
    specifications: {
      'Dimensions': '30cm x 20cm x 15cm',
      'Weight': '800g',
      'Power': 'Rechargeable Battery',
      'Connectivity': 'WiFi + Bluetooth',
      'Motors': '2 DC Motors with Encoders'
    }
  },
  {
    id: 'iot-smart-home-5',
    name: 'IoT Smart Home Kit',
    theme: 'Internet of Things',
    level: 5,
    description: 'Build a complete smart home system with automated lighting, climate control, security, and voice commands.',
    price: 299.99,
    image_url: '/images/iot-kit.jpg',
    images: [
      '/images/iot-kit.jpg',
      '/images/iot-smart-home.jpg',
      '/images/iot-dashboard.jpg'
    ],
    features: [
      'Smart lighting control',
      'Climate automation',
      'Security monitoring',
      'Voice assistant integration',
      'Mobile app control'
    ],
    specifications: {
      'Dimensions': 'Various components',
      'Weight': '1.2kg total',
      'Power': 'AC + Battery backup',
      'Connectivity': 'WiFi + Zigbee',
      'Components': 'Hub, Sensors, Actuators, Displays'
    }
  }
];

// Helper function to get kit by ID
export function getKitById(id: string) {
  return sampleKits.find(kit => kit.id === id);
}

// Helper function to get kits by theme
export function getKitsByTheme(theme: string) {
  return sampleKits.filter(kit => kit.theme === theme);
}

// Helper function to get kits by level
export function getKitsByLevel(level: number) {
  return sampleKits.filter(kit => kit.level === level);
} 