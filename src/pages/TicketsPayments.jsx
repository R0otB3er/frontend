import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function TicketsPayments() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const savedOrder = localStorage.getItem("ticketOrder"); // 🔁 Fix this line
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      alert("No order found. Redirecting to tickets page.");
      navigate("/tickets");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !paymentInfo.cardName ||
      !paymentInfo.cardNumber ||
      !paymentInfo.expiry ||
      !paymentInfo.cvv
    ) {
      alert("Please fill in all payment fields.");
      return;
    }

    alert("Payment successful! Thank you for your order.");
    localStorage.removeItem("ticketOrder"); 

    navigate("/");
  };

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Typography variant="h4" className="mb-6 text-center">
        Payment Information
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
