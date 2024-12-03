import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            ProductManager
          </Link>
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              href="/categories"
              className="text-gray-600 hover:text-gray-800"
            >
              Categories
            </Link>
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-800"
            >
              Products
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-gray-800">
              Docs
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-800">
              Admin
            </Link>
            <Link
              href="/categories/create"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Get Started
            </Link>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <Link
              href="#features"
              className="block text-gray-600 hover:text-gray-800 py-2"
            >
              Features
            </Link>
            <Link
              href="#products"
              className="block text-gray-600 hover:text-gray-800 py-2"
            >
              Products
            </Link>
            <Link
              href="#"
              className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
