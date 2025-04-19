import { useEffect, useState } from "react";
import { useUserStore } from "@/user_managment/user_store";

export default function OrderHistory() {
  const { id: visitorId } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("⚠️ Unexpected order history format:", data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (visitorId && visitorId !== 1) {
      fetchOrderHistory();
    }
  }, [visitorId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Order History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No previous orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-md">
              <p className="font-medium mb-1">Order ID: {order.order_id}</p>
              <p className="text-sm text-gray-600">Date: {order.date}</p>

              <p className="text-sm text-gray-600">
                Subtotal: ${order.subtotal} <br />
                Tax (8.25%): ${order.tax} <br />
                <strong>Total: ${order.total}</strong>
                {order.discount > 0 && <> (after {order.discount}% discount)</>}
              </p>

              {Array.isArray(order.tickets) && order.tickets.length > 0 && (
                <>
                  <p className="mt-3 font-semibold">Tickets:</p>
                  <ul className="ml-4 list-disc">
                    {order.tickets.map((ticket, i) => (
                      <li key={i}>
                        {ticket.quantity} × {ticket.person_type} Ticket – {ticket.attraction} (${ticket.price.toFixed(2)} each)
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {Array.isArray(order.merchandise) && order.merchandise.length > 0 && (
                <>
                  <p className="mt-3 font-semibold">Merchandise:</p>
                  <ul className="ml-4 list-disc">
                    {order.merchandise.map((item, i) => (
                      <li key={i}>
                        {item.quantity} × {item.name} (${item.price.toFixed(2)} each)
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

