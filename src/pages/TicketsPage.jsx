import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store"; // 👈 Import user info

export default function TicketsPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();
  const { loggedIn, user_type } = useUserStore(); // 👈 Get auth info

  const handleProceedToCheckout = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    // 👇 Route based on whether the user is signed in as a visitor
    if (loggedIn && user_type === "visitor") {
      navigate("/visitor/ticketsorders");
    } else {
      navigate("/ticketsorders");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Purchase Tickets</h1>

      <div className="mb-8 bg-green-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Plan Your Visit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleProceedToCheckout}
          className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
        >
          Proceed to Buy Tickets
        </button>
      </div>

      <div className="mt-12 bg-green-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Important Information</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Tickets are valid only for the selected date</li>
          <li>• Children under 3 years enter free</li>
          <li>• Family Pack includes 2 Adult + 2 Child tickets</li>
          <li>• Tickets are non-refundable but can be rescheduled</li>
        </ul>
      </div>
    </div>
  );
}
