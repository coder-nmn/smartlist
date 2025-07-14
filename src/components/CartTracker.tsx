"use client";

import React from "react";
import { useCart } from "../context/CartContext";

export default function CartTracker() {
  const { cartItems, budget, couponDiscount, appliedCoupon, getCartTotal, getFinalTotal, clearCoupon } = useCart();

  const cartTotal = getCartTotal();
  const finalTotal = getFinalTotal();
  const isOverBudget = budget > 0 && finalTotal > budget;
  const progressPercent = budget > 0 ? Math.min((finalTotal / budget) * 100, 100) : 0;

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Budget Watchdog</h2>
      
      {/* Cart Summary */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span>Subtotal:</span>
          <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && couponDiscount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="flex items-center">
              Coupon ({appliedCoupon.code}):
              <button
                onClick={clearCoupon}
                className="ml-2 text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </span>
            <span>-₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
          <span>Final Total:</span>
          <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
            ₹{finalTotal.toFixed(2)}
          </span>
        </div>
        
        {budget > 0 && (
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Budget:</span>
            <span>₹{budget.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Budget Progress Bar */}
      {budget > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Budget Usage</span>
            <span>{progressPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                isOverBudget 
                  ? "bg-red-600" 
                  : progressPercent > 80 
                  ? "bg-yellow-500" 
                  : "bg-green-600"
              }`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Budget Status Messages */}
      {budget > 0 && (
        <div className="space-y-2">
          {isOverBudget ? (
            <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              ⚠️ Warning: You have exceeded your budget by ₹{(finalTotal - budget).toFixed(2)}!
            </div>
          ) : progressPercent > 80 ? (
            <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
              ⚡ Caution: You're using {progressPercent.toFixed(1)}% of your budget
            </div>
          ) : (
            <div className="p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
              ✅ You're within budget! Remaining: ₹{(budget - finalTotal).toFixed(2)}
            </div>
          )}
        </div>
      )}

      {/* Cart Items Summary */}
      {cartItems.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-medium mb-2">Items in Cart ({cartItems.length})</h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="truncate">{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
