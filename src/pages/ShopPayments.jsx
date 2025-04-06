import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/user_managment/user_store";


import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function ShopPayments() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const visitorID = useUserStore((state) => state.id); // pull Visitor_ID

  const [order, setOrder] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const savedOrder = localStorage.getItem("shopOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      alert("No shop order found. Redirecting to shop.");
      navigate("/shop");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !paymentInfo.cardName ||
      !paymentInfo.cardNumber ||
      !paymentInfo.expiry ||
      !paymentInfo.cvv
    ) {
      alert("Please fill in all payment fields.");
      return;
    }

    //Build the payload
    const payload = {
      visitor_id: visitorID,
      items: order.items.map((item) => ({
        merchandise_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shop/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to complete payment");

      alert("Payment successful! Thank you for your shop purchase.");
      localStorage.removeItem("shopOrder");
      clearCart();
      navigate("/");
    } catch (error) {
      console.error(" Payment error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Typography variant="h4" className="mb-6 text-center">
        Shop Payment Information
      </Typography>

      <Card className="mb-10">
        <CardHeader floated={false} shadow={false} className="p-4">
          <Typography variant="h6">Shop Order Summary</Typography>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Cardholder Name"
            name="cardName"
            value={paymentInfo.cardName}
            onChange={handleChange}
            required
          />
          <Input
            label="Card Number"
            name="cardNumber"
            type="text"
            value={paymentInfo.cardNumber}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date (MM/YY)"
              name="expiry"
              type="text"
              value={paymentInfo.expiry}
              onChange={handleChange}
              required
            />
            <Input
              label="CVV"
              name="cvv"
              type="text"
              value={paymentInfo.cvv}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" color="green" fullWidth>
            Complete Payment
          </Button>
        </form>
      </Card>
    </div>
  );
}
