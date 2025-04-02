import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const ticketItems = [
  { id: "TICKET-1", name: "Adult Ticket", price: 20, type: "Ticket" },
  { id: "TICKET-2", name: "Child Ticket", price: 10, type: "Ticket" },
  { id: "TICKET-3", name: "Senior Ticket", price: 15, type: "Ticket" },
  { id: "TICKET-4", name: "Veteran Ticket", price: 12, type: "Ticket" }, // 👈 Added
];

const taxRate = 0.0825;

const membershipDiscounts = {
  none: 0,
  bronze: 0.05,
  silver: 0.1,
  gold: 0.15,
};

export default function TicketsOrder() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [membershipLevel] = useState("silver");

  const handleAddToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      setCart((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId, newQty) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, newQty) } : i
      )
    );
  };

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subtotal = calculateSubtotal();
  const discount = subtotal * membershipDiscounts[membershipLevel];
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    const orderDetails = {
      type: "ticket",
      membershipLevel,
      items: cart,
      subtotal,
      discount,
      tax,
      total,
    };
    localStorage.setItem("ticketOrder", JSON.stringify(orderDetails));
    navigate("/ticketspayments");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Typography variant="h4" className="mb-6 text-center">
        Purchase Tickets
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {ticketItems.map((item) => (
          <Card key={item.id}>
            <CardHeader floated={false} shadow={false} className="p-4">
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="small" color="gray">
                ${item.price.toFixed(2)}
              </Typography>
            </CardHeader>
            <CardBody className="pt-0">
              <Button
                onClick={() => handleAddToCart(item)}
                color="green"
                fullWidth
              >
                Add to Cart
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <Typography variant="h6" className="mb-4">
          Your Cart
        </Typography>

        {cart.length === 0 ? (
          <Typography color="gray">No items in cart.</Typography>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Item</th>
                <th className="text-center p-2">Quantity</th>
                <th className="text-right p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="w-16 border rounded px-2 py-1 text-center"
                      min={1}
                    />
                  </td>
                  <td className="p-2 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {cart.length > 0 && (
          <div className="mt-6 space-y-2 text-right">
            <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
            <Typography>
              Discount ({membershipLevel}): -${discount.toFixed(2)}
            </Typography>
            <Typography>Tax: ${tax.toFixed(2)}</Typography>
            <Typography variant="h6" className="text-green-600">
              Total: ${total.toFixed(2)}
            </Typography>
            <Button onClick={handleCheckout} color="green" className="mt-4">
              Proceed to Payment
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

