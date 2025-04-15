import React from "react";
import { useCart } from "@/context/CartContext";
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom"; // ✅ Step 1
import { useUserStore } from "@/user_managment/user_store";


export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate(); // ✅ Step 2
   const { loggedIn } = useUserStore(); // ✅ Add this line near the top
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.0825;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Typography variant="h4" className="mb-6 text-center">
        Your Cart
      </Typography>

      <Card className="p-6">
        <CardBody>
          {cartItems.length === 0 ? (
            <Typography color="gray">Your cart is empty.</Typography>
          ) : (
            <>
              <table className="w-full table-auto text-sm mb-6">
                <thead>
                  <tr>
                    <th className="text-left p-2">Item</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-center p-2">Quantity</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.category || item.type}</td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          min={1}
                          className="w-16 border rounded px-2 py-1 text-center"
                        />
                      </td>
                      <td className="p-2 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        <Button
                          size="sm"
                          variant="outlined"
                          color="red"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right space-y-2">
                <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                <Typography>Tax (8.25%): ${tax.toFixed(2)}</Typography>
                <Typography variant="h6" className="text-green-700">
                  Total: ${total.toFixed(2)}
                </Typography>

               

<Button
  color="green"
  className="mt-4"
  onClick={() => {
    if (!loggedIn) {
      alert("Please sign in to continue with your purchase.");
      return;
    }

    const orderDetails = {
      items: cartItems,
      subtotal,
      discount: 0, // optional
      tax,
      total,
    };
    localStorage.setItem("shopOrder", JSON.stringify(orderDetails));
    navigate("/visitor/shoppayments"); // ✅ Route to visitor layout version
  }}
>
  Proceed to Checkout
</Button>

              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
