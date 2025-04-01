import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const mockItems = [
  { id: "TICKET-1", name: "Adult Ticket", price: 20, type: "Ticket", vendorID: 101 },
  { id: "FOOD-1", name: "Hot Dog", price: 5, type: "Food", vendorID: 202 },
  { id: "GIFT-1", name: "Zoo T-Shirt", price: 15, type: "GiftShop", vendorID: 303 },
];

const taxRate = 0.0825; // 8.25% sales tax

const membershipDiscounts = {
  none: 0,
  bronze: 0.05,
  silver: 0.1,
  gold: 0.15,
};

export default function OrderPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [membershipLevel, setMembershipLevel] = useState("silver"); // hardcoded for now
  const [orderID, setOrderID] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("Pending");

  useEffect(() => {
    setOrderID(uuidv4());
    setOrderDate(new Date().toISOString().split("T")[0]);
  }, []);

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

  const discountRate = membershipDiscounts[membershipLevel] || 0;
  const subtotal = calculateSubtotal();
  const discount = subtotal * discountRate;
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    const orderDetails = {
      orderID,
      orderDate,
      orderStatus: "Confirmed",
      membershipLevel,
      saleType: cart.map((i) => i.type),
      vendorIDs: [...new Set(cart.map((i) => i.vendorID))],
      subtotal,
      discount,
      tax,
      total,
      items: cart,
    };

    localStorage.setItem("currentOrder", JSON.stringify(orderDetails));
    navigate("/payments");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Typography variant="h4" className="mb-6 text-center">
        Place Your Order
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {mockItems.map((item) => (
          <Card key={item.id}>
            <CardHeader floated={false} shadow={false} className="p-4">
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="small" color="gray">
                ${item.price.toFixed(2)} - {item.type}
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
                <th className="text-left p-2">Type</th>
                <th className="text-center p-2">Quantity</th>
                <th className="text-right p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.type}</td>
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
            <Typography>Discount ({membershipLevel}): -${discount.toFixed(2)}</Typography>
            <Typography>Tax: ${tax.toFixed(2)}</Typography>
            <Typography variant="h6" className="text-green-600">
              Total: ${total.toFixed(2)}
            </Typography>
            <Button
              onClick={handleCheckout}
              color="green"
              className="mt-4"
            >
              Proceed to Payment
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
