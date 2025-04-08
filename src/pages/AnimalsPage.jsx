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
    image: 'https://redpandanetwork.org/get/files/image/galleries/28138502587_a0a020ae9a_k.jpeg?resize=1920x0&crop=1920x1040',
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
  {
    id: 5,
    name: 'Giraffe',
    category: 'Mammals',
    image: 'https://cdn.sanity.io/images/cphrnle8/production/231c6350832d857ffb4e20b9e797ad0c328ff0c9-1440x811.jpg?rect=264,0,912,811&w=1800&h=1600&q=100',
    description: 'Tallest land animals with long necks for reaching treetops.',
    habitat: 'African Savanna',
    diet: 'Herbivore',
  },
  {
    id: 6,
    name: 'Snow Leopard',
    category: 'Big Cats',
    image: 'https://media.istockphoto.com/id/521375354/photo/snow-leopard-in-snow-storm-iii.jpg?s=612x612&w=0&k=20&c=eWC_IuA1HPGo3YESfHaAKVHOzCKuwjF2i1GXn4Mvce8=',
    description: 'Elusive mountain-dwelling predator with thick fur and strong limbs.',
    habitat: 'Mountain Ranges',
    diet: 'Carnivore',
  },
  {
    id: 7,
    name: 'Flamingo',
    category: 'Birds',
    image: 'https://transforms.stlzoo.org/production/animals/caribbean-flamingo-01-01.jpg?w=1200&h=1544&auto=compress%2Cformat&fit=crop&crop=focalpoint&fp-x=0.4991&fp-y=0.1895&dm=1670880558&s=2b3e616f7ea76cae36a65cb524a3d3f1',
    description: 'Known for their bright pink color and one-legged stance.',
    habitat: 'Wetlands and Lagoons',
    diet: 'Herbivore',
  },
  {
    id: 8,
    name: 'Komodo Dragon',
    category: 'Reptiles',
    image: 'https://i.natgeofe.com/k/c02b35d2-bfd7-4ed9-aad4-8e25627cd481/komodo-dragon-head-on_3x2.jpg',
    description: 'Largest living lizard with a venomous bite.',
    habitat: 'Islands of Indonesia',
    diet: 'Carnivore',
  },
  {
    id: 9,
    name: 'Macaw',
    category: 'Birds',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuTd8YFkXhIxufTytSQSnGB0YSSJfE-qQElA&s',
    description: 'Colorful parrots known for intelligence and long lifespans.',
    habitat: 'Tropical Rainforest',
    diet: 'Herbivore',
  },
  {
    id: 10,
    name: 'Grizzly Bear',
    category: 'Mammals',
    image: 'https://defendersofwildlife-360365372.imgix.net/sites/default/files/2024-11/2017.11.28%20-%20Grizzly%20Bear%20Carrying%20Fish%20-%20Ursula%20Dubrick-fStop%20Foundation%20%281%29.jpg?fit=max&ixlib=php-4.1.0&w=1110',
    description: 'Massive omnivores with a powerful build and thick fur.',
    habitat: 'Forests & Mountains',
    diet: 'Carnivore',
  },
  {
    id: 11,
    name: 'Green Sea Turtle',
    category: 'Reptiles',
    image: 'https://www.4ocean.com/cdn/shop/articles/AdobeStock_176256068.jpg?crop=center&height=1200&v=1687353657&width=1200',
    description: 'Endangered marine reptiles that migrate long distances.',
    habitat: 'Tropical Oceans',
    diet: 'Herbivore',
  },
  {
    id: 12,
    name: 'Ring-tailed Lemur',
    category: 'Mammals',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-b6UKMEFhTrBFpGRuDtaQ_KygKRKt9x2_Aw&s',
    description: 'Highly social primates native to Madagascar with striped tails.',
    habitat: 'Dry Forests',
    diet: 'Herbivore',
  },
];

export default function AnimalsPage() {
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