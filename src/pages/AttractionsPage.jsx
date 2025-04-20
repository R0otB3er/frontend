import React, { useEffect, useState } from "react";
import { Clock, MapPin, Calendar } from "lucide-react";

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getAllAttractions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        // Add dynamic image paths
        const withImages = data.map((a) => ({
          ...a,
          image: `/img/attractions/${a.id}.webp`,
        }));

        setAttractions(withImages);
      } catch (err) {
        console.error("Failed to fetch attractions:", err);
      }
    }

    fetchAttractions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Attractions & Shows</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.isArray(attractions) && attractions.length > 0 ? (
          attractions.map((attraction) => (
            <div key={attraction.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={attraction.image}
                alt={attraction.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{attraction.name}</h2>
                <p className="text-gray-600 mb-6">{attraction.description || "No description available."}</p>

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
          ))
        ) : (
          <p className="text-gray-600">No attractions available.</p>
        )}
      </div>

      <div className="mt-12 bg-green-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Visitor Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Best Time to Visit</h3>
            <p className="text-gray-600">Morning shows are typically less crowded. Plan your visit early for the best experience.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What to Bring</h3>
            <p className="text-gray-600">Comfortable walking shoes, camera, and water bottle recommended.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-gray-600">All attractions are wheelchair accessible. Contact staff for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
