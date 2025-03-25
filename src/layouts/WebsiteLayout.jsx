import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X, PawPrint, Ticket, Compass, ShoppingBag } from "lucide-react";

export function WebsiteLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Navbar */}
      <nav className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8" />
              <span className="text-xl font-bold">Lonestar Houston Zoo</span>
            </Link>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <NavLink to="/animals" icon={<PawPrint />} label="Animals" />
                <NavLink to="/tickets" icon={<Ticket />} label="Tickets" />
                <NavLink to="/attractions" icon={<Compass />} label="Attractions" />
                <NavLink to="/shop" icon={<ShoppingBag />} label="Shop" />
                <NavLink to="/sign-in" label="Sign In" />
                <NavLink to="/sign-up" label="Sign Up" />
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
              <MobileLink to="/animals" icon={<PawPrint />} label="Animals" />
              <MobileLink to="/tickets" icon={<Ticket />} label="Tickets" />
              <MobileLink to="/attractions" icon={<Compass />} label="Attractions" />
              <MobileLink to="/shop" icon={<ShoppingBag />} label="Shop" />
              <MobileLink to="/sign-in" label="Sign In" />
              <MobileLink to="/sign-up" label="Sign Up" />
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
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

// Desktop NavLink Component
function NavLink({ to, icon, label }) {
  return (
    <Link to={to} className="hover:text-green-200 flex items-center space-x-1">
      {icon && React.cloneElement(icon, { className: "h-5 w-5" })}
      <span>{label}</span>
    </Link>
  );
}

// Mobile NavLink Component
function MobileLink({ to, icon, label }) {
  return (
    <Link to={to} className="block px-3 py-2 rounded-md hover:bg-green-600 flex items-center space-x-2">
      {icon && React.cloneElement(icon, { className: "h-5 w-5" })}
      <span>{label}</span>
    </Link>
  );
}

WebsiteLayout.displayName = "/src/layout/WebsiteLayout.jsx";

export default WebsiteLayout;
