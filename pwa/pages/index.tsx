"use client";

import { BarChart3, Boxes, Tags } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Boxes className="w-12 h-12 text-blue-500" />,
      title: "Product Management",
      description: "Easily add, edit, and organize your products.",
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-blue-500" />,
      title: "Analytics",
      description: "Get insights on your product performance.",
    },
    {
      icon: <Tags className="w-12 h-12 text-blue-500" />,
      title: "Categorization",
      description: "Efficiently categorize and tag your products.",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      price: 999.99,
      description: "High-performance laptop for work and entertainment.",
    },
    {
      id: 2,
      name: "Smartphone",
      category: "Electronics",
      price: 699.99,
      description: "Latest model with advanced camera and long battery life.",
    },
    {
      id: 3,
      name: "Headphones",
      category: "Accessories",
      price: 149.99,
      description: "Noise-cancelling headphones with premium sound quality.",
    },
    {
      id: 4,
      name: "Desk Chair",
      category: "Furniture",
      price: 199.99,
      description:
        "Ergonomic office chair with lumbar support and adjustable height.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Manage Your Products with Ease
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your inventory, categorize efficiently, and boost your
              productivity.
            </p>
            <Link
              href="#"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-lg inline-block"
            >
              Start Free Trial
            </Link>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Sample Product List
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-left">Description</th>
                    <th className="py-3 px-6 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {product.category}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {product.description}
                      </td>
                      <td className="py-3 px-6 text-right">
                        ${product.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">ProductManager</h2>
              <p className="mt-2 text-sm">
                Simplifying product management for businesses.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-blue-400">
                About
              </Link>
              <Link href="#" className="hover:text-blue-400">
                Contact
              </Link>
              <Link href="#" className="hover:text-blue-400">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            © {new Date().getFullYear()} ProductManager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
