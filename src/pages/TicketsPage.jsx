import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users, Info } from 'lucide-react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:3000/api/tickets')
      .then(response => {
        setTickets(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Purchase Tickets</h1>

      <div className="mb-8">
        <div className="bg-green-50 p-6 rounded-lg">
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
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{ticket.type}</h3>
            <p className="text-3xl font-bold text-green-600 mb-4">
              ${ticket.price}
            </p>
            <div className="flex items-start mb-4">
              <Info className="h-5 w-5 text-gray-400 mr-2 mt-1" />
              <p className="text-gray-600">{ticket.description}</p>
            </div>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Add to Cart
            </button>
          </div>
        ))}
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