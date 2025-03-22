import React from 'react';
import { MapPin, Fish, Leaf } from 'lucide-react';

const animals = [
  {
    id: 1,
    name: 'African Lion',
    category: 'Big Cats',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'The king of the jungle, known for its magnificent mane and powerful roar.',
    habitat: 'African Savanna',
    diet: 'Carnivore',
  },
  {
    id: 2,
    name: 'Asian Elephant',
    category: 'Mammals',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Highly intelligent and social animals with remarkable memory.',
    habitat: 'Tropical Forest',
    diet: 'Herbivore',
  },
  {
    id: 3,
    name: 'Red Panda',
    category: 'Mammals',
    image: 'https://images.unsplash.com/photo-1585668874132-fa6dd7cc4a39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Adorable tree-dwelling mammals known for their reddish fur and cute appearance.',
    habitat: 'Mountain Forest',
    diet: 'Herbivore',
  },
  {
    id: 4,
    name: 'Penguin',
    category: 'Birds',
    image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Flightless birds that are excellent swimmers and highly social.',
    habitat: 'Antarctic Coast',
    diet: 'Carnivore',
  },
];

function AnimalsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Animals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {animals.map((animal) => (
          <div key={animal.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold">{animal.name}</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {animal.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{animal.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Habitat: {animal.habitat}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  {animal.diet === 'Carnivore' ? (
                    <Fish className="h-5 w-5 mr-2" />
                  ) : (
                    <Leaf className="h-5 w-5 mr-2" />
                  )}
                  <span>Diet: {animal.diet}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimalsPage;