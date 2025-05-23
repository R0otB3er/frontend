import React, { useState, useEffect } from "react";
import { ShoppingCart, Filter } from "lucide-react";
import giftshopProducts from "@/data/giftshopProducts";
import { useCart } from "@/context/CartContext";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/merchandise`);
        const data = await response.json();
  
        // Map backend data into frontend format
        const formatted = data.map(item => ({
          id: item.Merchandise_ID,
          name: item.Item_Name,
          price: parseFloat(item.Item_Price),
          category: item.Item_Type,
          image: `/img/shop/${item.Merchandise_ID}.webp`,
          merchandise_id: item.Merchandise_ID,
        }));
  
        setProducts(formatted);
      } catch (error) {
        console.error("Failed to fetch shop items:", error);
      }
    }
  
    fetchProducts();
  }, []);
  const categories = products.length > 0
  ? ["All", ...new Set(products.map((product) => product.category))]
  : ["All"];

  const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Gift Shop</h1>
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  ${product.price}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-green-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Shopping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Shipping</h3>
            <p className="text-gray-600">
              Free shipping on orders over $50. Standard delivery within 3–5 business days.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Returns</h3>
            <p className="text-gray-600">
              Easy returns within 30 days of purchase. See our return policy for details.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Member Benefits</h3>
            <p className="text-gray-600">
              Zoo members receive 10% off all gift shop purchases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
