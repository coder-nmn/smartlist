"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number | null;
  minPurchase: number;
  expiryDate: string;
}

export default function DealsPanel() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [message, setMessage] = useState("");
  const { applyCoupon, appliedCoupon, getCartTotal } = useCart();

  useEffect(() => {
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(data))
      .catch(() => setCoupons([]));
  }, []);

  const handleApplyCoupon = (coupon: Coupon) => {
    const cartTotal = getCartTotal();
    
    if (cartTotal === 0) {
      setMessage("Add items to cart before applying coupons");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (cartTotal < coupon.minPurchase) {
      setMessage(`Minimum purchase of ₹${coupon.minPurchase} required for this coupon`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Check if coupon is expired
    const expiryDate = new Date(coupon.expiryDate);
    const today = new Date();
    if (expiryDate < today) {
      setMessage("This coupon has expired");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (coupon.discountValue) {
      applyCoupon(coupon);
      setMessage(`Coupon ${coupon.code} applied successfully!`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const canApplyCoupon = (coupon: Coupon) => {
    const cartTotal = getCartTotal();
    return cartTotal >= coupon.minPurchase && !isExpired(coupon.expiryDate);
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Deals and Coupons Panel</h2>
      
      {/* Status Message */}
      {message && (
        <div className={`p-2 rounded text-sm mb-4 ${
          message.includes("successfully") 
            ? "bg-green-100 border border-green-300 text-green-700"
            : "bg-yellow-100 border border-yellow-300 text-yellow-700"
        }`}>
          {message}
        </div>
      )}

      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className="p-2 bg-blue-100 border border-blue-300 rounded mb-4">
          <div className="text-sm font-medium text-blue-800">
            Active Coupon: {appliedCoupon.code}
          </div>
          <div className="text-xs text-blue-600">
            {appliedCoupon.description}
          </div>
        </div>
      )}

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No active coupons available.</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {coupons.map((coupon) => (
            <div 
              key={coupon.id} 
              className={`border rounded p-3 ${
                isExpired(coupon.expiryDate) 
                  ? "bg-gray-100 border-gray-300" 
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className={`font-semibold ${
                    isExpired(coupon.expiryDate) ? "text-gray-500" : "text-black"
                  }`}>
                    {coupon.code}
                  </div>
                  <div className={`text-sm ${
                    isExpired(coupon.expiryDate) ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {coupon.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Min. purchase: ₹{coupon.minPurchase}
                  </div>
                  <div className={`text-xs ${
                    isExpired(coupon.expiryDate) ? "text-red-500" : "text-gray-500"
                  }`}>
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    {isExpired(coupon.expiryDate) && " (Expired)"}
                  </div>
                </div>
                
                <button
                  onClick={() => handleApplyCoupon(coupon)}
                  disabled={
                    isExpired(coupon.expiryDate) || 
                    appliedCoupon?.id === coupon.id ||
                    !canApplyCoupon(coupon)
                  }
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    appliedCoupon?.id === coupon.id
                      ? "bg-green-600 text-white"
                      : isExpired(coupon.expiryDate) || !canApplyCoupon(coupon)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {appliedCoupon?.id === coupon.id 
                    ? "Applied" 
                    : isExpired(coupon.expiryDate)
                    ? "Expired"
                    : "Apply"
                  }
                </button>
              </div>
              
              {coupon.discountValue && (
                <div className="text-sm font-medium text-green-600">
                  Save: {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%` 
                    : `₹${coupon.discountValue}`
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
