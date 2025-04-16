import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/user_managment/user_store";

export default function ShopPayments() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const Visitor_ID = useUserStore((state) => state.id);
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      alert("Cart is empty. Redirecting to shop.");
      navigate("/visitor/shop");
    } else {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxRate = 0.0825;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;
      const discount = 0; // Add discount logic if needed

      setOrderSummary({ subtotal, tax, discount, total });
    }
  }, [cartItems, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketItems = cartItems
      .filter((item) => item.type === "Ticket" && item.person_typeID && item.Attraction_ID)
      .flatMap((item) =>
        Array(item.quantity).fill([item.person_typeID, item.Attraction_ID])
      );

    const merchandiseItems = cartItems
      .filter((item) => item.type !== "Ticket")
      .map((item) => ({
        Merchandise_ID: item.id,
        quantity: item.quantity,
      }));

    const payload = {
      Visitor_ID,
      tickets: ticketItems,
      merchandise: merchandiseItems,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to complete payment");

      alert("✅ Payment successful! Thank you.");
      clearCart();
      navigate("/visitor/dashboard");
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!orderSummary) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Typography variant="h4" className="mb-6 text-center">
        Complete Your Purchase
      </Typography>

      <Card className="mb-10">
        <CardHeader floated={false} shadow={false} className="p-4">
          <Typography variant="h6">Order Summary</Typography>
        </CardHeader>
        <CardBody>
          <ul className="mb-4">
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between mb-2 text-sm">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="text-right space-y-1">
            <Typography>Subtotal: ${orderSummary.subtotal.toFixed(2)}</Typography>
            <Typography>Tax: ${orderSummary.tax.toFixed(2)}</Typography>
            <Typography>Discount: -${orderSummary.discount.toFixed(2)}</Typography>
            <Typography variant="h6" className="text-green-600">
              Total: ${orderSummary.total.toFixed(2)}
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
