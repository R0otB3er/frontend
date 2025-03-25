import React from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';

const attractions = [
  {
    id: 1,
    name: 'Wildlife Safari Tour',
    image: 'https://images.unsplash.com/photo-1544985361-b420d7a77043?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Experience an immersive guided tour through our wildlife habitats.',
    duration: '1.5 hours',
    location: 'Main Safari Route',
    schedule: 'Daily: 10:00 AM, 2:00 PM',
  },
  {
    id: 2,
    name: 'Penguin Feeding Show',
    image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Watch our playful penguins during their feeding time.',
    duration: '30 minutes',
    location: 'Penguin Paradise',
    schedule: 'Daily: 11:00 AM, 3:00 PM',
  },
  {
    id: 3,
    name: 'Animal Training Demonstration',
    image: 'https://content.api.news/v3/images/bin/287f4f52d97f5e4e2ef7215c9322fb56?width=1024',
    description: 'Learn about animal care and training techniques.',
    duration: '45 minutes',
    location: 'Training Arena',
    schedule: 'Wed-Sun: 1:00 PM',
  },
  {
    id: 4,
    name: 'Kids Discovery Zone',
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Interactive learning space for young wildlife enthusiasts.',
    duration: 'Open Access',
    location: 'Education Center',
    schedule: 'Daily: 9:00 AM - 5:00 PM',
  },
];

export default function AttractionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Attractions & Shows</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {attractions.map((attraction) => (
          <div key={attraction.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={attraction.image}
              alt={attraction.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{attraction.name}</h2>
              <p className="text-gray-600 mb-6">{attraction.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Duration: {attraction.duration}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Location: {attraction.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Schedule: {attraction.schedule}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-green-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Visitor Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Best Time to Visit</h3>
            <p className="text-gray-600">
              Morning shows are typically less crowded. Plan your visit early for the best experience.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What to Bring</h3>
            <p className="text-gray-600">
              Comfortable walking shoes, camera, and water bottle recommended.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-gray-600">
              All attractions are wheelchair accessible. Contact staff for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}