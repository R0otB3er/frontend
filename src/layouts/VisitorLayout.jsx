import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  PawPrint,
  Ticket,
  Compass,
  ShoppingBag,
  ShoppingCart,
  LogOut,
  Clock,
  Pencil,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/user_managment/user_store";

export function VisitorLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const clearState = useUserStore((state) => state.clearState);

  const handleSignOut = () => {
    clearState();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Navbar */}
      <nav className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/visitor/dashboard" className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8" />
              <span className="text-xl font-bold">Lonestar Houston Zoo</span>
            </Link>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <NavLink to="/visitor/animals" icon={<PawPrint />} label="Animals" />
                <NavLink to="/visitor/tickets" icon={<Ticket />} label="Tickets" />
                <NavLink to="/visitor/attractions" icon={<Compass />} label="Attractions" />
                <NavLink to="/visitor/shop" icon={<ShoppingBag />} label="Shop" />
                <NavLink to="/visitor/order-history" icon={<Clock />} label="Order History" />
                <Link to="/visitor/edit-profile" className="relative group">
  <div className="h-10 w-10 rounded-full border-2 border-white bg-white overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-green-400">
  <img
  src="/img/placeholder-user-white-outline.png"
  alt="Visitor Avatar"
  className="w-10 h-10 rounded-full object-cover"
/>
    <div className="absolute bottom-0 right-0 bg-gray-600 rounded-full p-0.5">
      <Pencil className="h-3 w-3 text-white" />
    </div>
  </div>
</Link>

                <button onClick={handleSignOut} className="hover:text-green-200 flex items-center space-x-1">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
                <Link to="/visitor/cart" className="relative hover:text-green-200">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:text-green-200 hover:bg-green-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileLink to="/visitor/animals" icon={<PawPrint />} label="Animals" />
              <MobileLink to="/visitor/tickets" icon={<Ticket />} label="Tickets" />
              <MobileLink to="/visitor/attractions" icon={<Compass />} label="Attractions" />
              <MobileLink to="/visitor/shop" icon={<ShoppingBag />} label="Shop" />
              <MobileLink to="/visitor/order-history" icon={<Clock />} label="Order History" />
              <Link to="/visitor/edit-profile" className="relative group">
  <div className="h-10 w-10 rounded-full border-2 border-white bg-white overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-green-400">
  <img
  src="/img/placeholder-user-white-outline.png"
  alt="Visitor Avatar"
  className="w-10 h-10 rounded-full object-cover"
/>
    <div className="absolute bottom-0 right-0 bg-gray-600 rounded-full p-0.5">
      <Pencil className="h-3 w-3 text-white" />
    </div>
  </div>
</Link>


              <button onClick={handleSignOut} className="hover:text-green-200 flex items-center space-x-2 px-3 py-2 w-full">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
              <Link to="/visitor/cart" className="relative hover:text-green-200 px-3 py-2 flex items-center">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Visit Us</h3>
              <p>123 Zoo Avenue</p>
              <p>Lonestar Houston City, WC 12345</p>
              <p>Phone: (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hours</h3>
              <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p>Sat - Sun: 8:00 AM - 7:00 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <a href="#" className="block hover:text-green-200">Facebook</a>
              <a href="#" className="block hover:text-green-200">Twitter</a>
              <a href="#" className="block hover:text-green-200">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link to={to} className="hover:text-green-200 flex items-center space-x-1">
      {icon && React.cloneElement(icon, { className: "h-5 w-5" })}
      <span>{label}</span>
    </Link>
  );
}

function MobileLink({ to, icon, label }) {
  return (
    <Link to={to} className="block px-3 py-2 rounded-md hover:bg-green-600 flex items-center space-x-2">
      {icon && React.cloneElement(icon, { className: "h-5 w-5" })}
      <span>{label}</span>
    </Link>
  );
}

VisitorLayout.displayName = "/src/layout/VisitorLayout.jsx";

export default VisitorLayout;

