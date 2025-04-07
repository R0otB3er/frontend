import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store"; // Correct path if needed

export default function TicketsPayments() {
  const navigate = useNavigate();
  const { id: Visitor_ID } = useUserStore(); // ✅ Grab Visitor_ID from login
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("ticketOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      alert("No order found. Redirecting to tickets page.");
      navigate("/tickets");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Visitor_ID,
      tickets: order.items.map((item) => [
        item.person_typeID,
        item.Attraction_ID,
      ]),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit ticket payment");

      alert("Payment successful! Thank you for your order.");
      localStorage.removeItem("ticketOrder");
      navigate("/");
    } catch (err) {
      console.error("❌ Ticket payment error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Typography variant="h4" className="mb-6 text-center">
        Confirm Ticket Payment
      </Typography>

      <Card className="mb-10">
        <CardHeader floated={false} shadow={false} className="p-4">
          <Typography variant="h6">Order Summary</Typography>
        </CardHeader>
        <CardBody>
          <ul className="mb-4">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between mb-2 text-sm">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="text-right space-y-1">
            <Typography>Subtotal: ${order.subtotal.toFixed(2)}</Typography>
            <Typography>Discount: -${order.discount.toFixed(2)}</Typography>
            <Typography>Tax: ${order.tax.toFixed(2)}</Typography>
            <Typography variant="h6" className="text-green-600">
              Total: ${order.total.toFixed(2)}
            </Typography>
          </div>
        </CardBody>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <Button type="submit" color="green" fullWidth>
            Complete Payment
          </Button>
        </form>
      </Card>
    </div>
  );
}

