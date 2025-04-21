import React, { useEffect, useState } from "react";
import { Clock, MapPin, Calendar } from "lucide-react";

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState([]);

  // 🎯 Hardcoded descriptions & schedules
  const attractionDetails = {
    301: {
      description: "A scenic overlook where guests can observe majestic lions lounging in the sun.",
      schedule: "Daily, 9:00 AM – 9:00 PM",
    },
    302: {
      description: "Watch elephants splash and play in their naturalistic habitat with cascading waterfalls.",
      schedule: "Mon–Fri, 10:00 AM – 4:00 PM",
    },
    303: {
      description: "A rugged trail showcasing powerful grizzly bears in a forest environment.",
      schedule: "Weekends only, 11:00 AM – 3:00 PM",
    },
    304: {
      description: "A peaceful bamboo garden home to playful pandas and calming ambiance.",
      schedule: "Daily, 10:00 AM – 4:30 PM",
    },
    305: {
      description: "See adorable penguins waddle, swim, and slide in their icy habitat.",
      schedule: "Daily, 9:30 AM – 4:00 PM",
    },
    306: {
      description: "General exhibits and park experiences spanning across multiple habitats.",
      schedule: "Daily, 9:00 AM – 6:00 PM",
    },
    307: {
      description: "Interactive zone with educational exhibits and hands-on fun for kids.",
      schedule: "Weekdays, 10:00 AM – 2:00 PM",
    },
  };

  function isAttractionOpenNow(scheduleStr) {
    if (!scheduleStr || !scheduleStr.includes("–")) return false;
  
    const [startStr, endStr] = scheduleStr.match(/\d{1,2}:\d{2} [APM]{2}/g) || [];
  
    if (!startStr || !endStr) return false;
  
    const now = new Date();
  
    const today = now.toLocaleDateString("en-US");
    const start = new Date(`${today} ${startStr}`);
    const end = new Date(`${today} ${endStr}`);
  
    return now >= start && now <= end;
  }
  

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getAllAttractions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        // Inject image, description, and schedule
        const withDetails = data.map((a) => ({
          ...a,
          image: `/img/attractions/${a.id}.webp`,
          description: attractionDetails[a.id]?.description || "No description available.",
          schedule: attractionDetails[a.id]?.schedule || "Schedule not available.",
        }));

        setAttractions(withDetails);
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
                <p className="text-gray-600 mb-6">{attraction.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Schedule: {attraction.schedule}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
  <span
    className={`ml-1 font-medium ${
      ["maintenance in progress", "pending"].includes(attraction.status?.toLowerCase()) || !isAttractionOpenNow(attraction.schedule)
        ? "text-red-600"
        : "text-green-600"
    }`}
  >
    Status:{" "}
    {["maintenance in progress", "pending"].includes(attraction.status?.toLowerCase())
      ? "Closed for Maintenance"
      : isAttractionOpenNow(attraction.schedule)
      ? "Open"
      : "Closed"}
  </span>
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
            <p className="text-gray-600">
              Morning shows are typically less crowded. Plan your visit early for the best experience.
            </p>
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
