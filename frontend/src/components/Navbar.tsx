"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BsCart3 } from 'react-icons/bs';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          
          <div className="flex-shrink-0">
            <Link href="/" onClick={closeMenu}>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">E-Commerce</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Products</Link>
            {userInfo && <Link href="/orders" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">My Orders</Link>}
            {userInfo && <Link href="/reports" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Reports</Link>}
            <Link href="/cart" onClick={closeMenu} className="relative text-gray-500 hover:text-blue-600 transition-colors">
              <BsCart3 size={24} />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-x-6">
            {userInfo ? (
              <a onClick={logout} className="cursor-pointer font-medium text-gray-600 hover:text-blue-600 transition-colors">Logout</a>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">Register</Link>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} aria-label="Open menu" className="p-2 rounded-md text-gray-600 hover:text-blue-600 transition-colors">
              <FaBars size={24} />
            </button>
          </div>
        </nav>
      </header>

      <div className={`fixed inset-0 z-50 bg-white/80 backdrop-blur-lg transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
          <button onClick={toggleMenu} aria-label="Close menu" className="absolute top-7 right-5 p-2 text-gray-600 hover:text-blue-600">
            <FaTimes size={28} />
          </button>
          
          <Link href="/" onClick={closeMenu} className="text-2xl text-gray-800 font-medium hover:text-blue-600">Products</Link>
          <Link href="/cart" onClick={closeMenu} className="text-2xl text-gray-800 font-medium hover:text-blue-600">My Cart</Link>
          
          {userInfo ? (
            <>
              <Link href="/orders" onClick={closeMenu} className="text-2xl text-gray-800 font-medium hover:text-blue-600">My Orders</Link>
              <Link href="/reports" onClick={closeMenu} className="text-2xl text-gray-800 font-medium hover:text-blue-600">Reports</Link>
              <hr className="w-1/2 border-gray-300" />
              <a onClick={handleLogout} className="cursor-pointer text-2xl font-medium text-gray-800 hover:text-blue-600">Logout</a>
            </>
          ) : (
            <>
              <hr className="w-1/2 border-gray-300" />
              <Link href="/login" onClick={closeMenu} className="text-2xl text-gray-800 font-medium hover:text-blue-600">Login</Link>
              <Link href="/register" onClick={closeMenu} className="text-2xl text-gray-800 font-medium hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;