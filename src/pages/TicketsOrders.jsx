import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/user_managment/user_store";

export default function TicketsOrder() {
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { loggedIn } = useUserStore();

  const [ticketPrice, setTicketPrice] = useState(0);
  const [personTypeID, setPersonTypeID] = useState(null);
  const [attractionID, setAttractionID] = useState(null);
  const [personTypes, setPersonTypes] = useState([]);
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    const fetchFormInfo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/form-info`);
        const data = await res.json();
        setPersonTypes(data.personTypes);
        setAttractions(data.attractions);
      } catch (err) {
        console.error("Failed to fetch ticket form info:", err);
      }
    };

    fetchFormInfo();
  }, []);

  const getTicketLabel = (id) => {
    const type = personTypes.find((pt) => pt.PersonType_ID === id);
    return type?.ticket_person || "Ticket";
  };

  const handleAddToCart = () => {
    if (!personTypeID || !attractionID) {
      alert("Please select both person type and attraction.");
      return;
    }

    const id = `ticket-${personTypeID}-${attractionID}`;
    const name = `${getTicketLabel(personTypeID)} - ${attractions.find((a) => a.Attraction_ID === attractionID)?.Attraction_Name}`;
    const price = personTypeID === 1 ? 20 : personTypeID === 2 ? 10 : 15; // You can also fetch from DB

    addToCart({
      id,
      name,
      price,
      quantity: 1,
      type: "Ticket",
      person_typeID: personTypeID,
      Attraction_ID: attractionID,
    });
  };

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const ticketCart = cartItems.filter((item) => item.type === "Ticket");
  const subtotal = ticketCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!loggedIn) {
      alert("Please sign in to continue with your purchase.");
      return;
    }
    navigate("/visitor/cart");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Typography variant="h4" className="mb-6 text-center">
        Purchase Tickets
      </Typography>

      <Card className="mb-10">
        <CardHeader floated={false} shadow={false} className="p-4">
          <Typography variant="h6">Ticket Options</Typography>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Select Person Type"
            onChange={(val) => setPersonTypeID(parseInt(val))}
          >
            {personTypes.map((pt) => (
              <Option key={pt.PersonType_ID} value={pt.PersonType_ID.toString()}>
                {pt.ticket_person}
              </Option>
            ))}
          </Select>

          <Select
            label="Select Attraction"
            onChange={(val) => setAttractionID(parseInt(val))}
          >
            {attractions.map((a) => (
              <Option key={a.Attraction_ID} value={a.Attraction_ID.toString()}>
                {a.Attraction_Name}
              </Option>
            ))}
          </Select>

          <Button onClick={handleAddToCart} color="green" fullWidth>
            Add Ticket to Cart
          </Button>
        </CardBody>
      </Card>

      <Card className="p-6">
        <Typography variant="h6" className="mb-4">
          Your Ticket Cart
        </Typography>

        {ticketCart.length === 0 ? (
          <Typography color="gray">No tickets in cart.</Typography>
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
              {ticketCart.map((item) => (
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

        {ticketCart.length > 0 && (
          <div className="mt-6 space-y-2 text-right">
            <Typography variant="h6" className="text-green-600">
              Total: ${subtotal.toFixed(2)}
            </Typography>
            <Button onClick={handleCheckout} color="green" className="mt-4">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
