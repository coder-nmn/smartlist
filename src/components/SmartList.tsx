"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  isEssential: boolean;
  unit: string;
  imageUrl?: string;
}

export default function SmartList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cheaperOptions, setCheaperOptions] = useState<{ [key: string]: Product[] }>({});
  const { cartItems, addItem, removeItem } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeItem(productId);
  };

  const suggestCheaperOptions = (product: Product) => {
    const alternatives = products.filter(
      (p) =>
        p.category === product.category &&
        p.price < product.price &&
        p.id !== product.id
    );
    setCheaperOptions((prev) => ({ ...prev, [product.id]: alternatives }));
  };

  const hideCheaperOptions = (productId: string) => {
    setCheaperOptions((prev) => {
      const newOptions = { ...prev };
      delete newOptions[productId];
      return newOptions;
    });
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Smart Grocery List</h2>
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products List */}
        <div>
          <h3 className="font-semibold mb-2">Available Products</h3>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      {product.brand} - ₹{product.price} / {product.unit}
                    </div>
                    {product.isEssential && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                        Essential
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      className={`px-3 py-1 rounded text-sm ${
                        isInCart(product.id)
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id)}
                    >
                      {isInCart(product.id) ? "Added" : "Add"}
                    </button>
                    <button
                      className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={() => suggestCheaperOptions(product)}
                    >
                      Cheaper Options
                    </button>
                  </div>
                </div>
                
                {cheaperOptions[product.id] && cheaperOptions[product.id].length > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-yellow-800">
                        Cheaper Alternatives:
                      </span>
                      <button
                        className="text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => hideCheaperOptions(product.id)}
                      >
                        Hide
                      </button>
                    </div>
                    <div className="space-y-1">
                      {cheaperOptions[product.id].map((alt) => (
                        <div key={alt.id} className="flex justify-between items-center text-sm">
                          <span>
                            {alt.brand} - ₹{alt.price} 
                            <span className="text-green-600 font-medium">
                              (Save ₹{product.price - alt.price})
                            </span>
                          </span>
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => handleAddToCart(alt)}
                          >
                            Add This
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cart Items */}
        <div>
          <h3 className="font-semibold mb-2">Cart Items ({cartItems.length})</h3>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items in cart</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="border rounded p-3 bg-blue-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {item.brand} - ₹{item.price} / {item.unit}
                      </div>
                    </div>
                    <button
                      className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
