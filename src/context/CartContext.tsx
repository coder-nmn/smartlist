"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  unit: string;
  category?: string;
  isEssential?: boolean;
  imageUrl?: string;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number | null;
  minPurchase: number;
  expiryDate: string;
}

interface CartContextProps {
  cartItems: Product[];
  budget: number;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  setBudget: (amount: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  clearCoupon: () => void;
  getCartTotal: () => number;
  getFinalTotal: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [budget, setBudgetState] = useState<number>(0);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const addItem = (item: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (!existingItem) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const setBudget = (amount: number) => {
    setBudgetState(amount);
  };

  const applyCoupon = (coupon: Coupon) => {
    const cartTotal = getCartTotal();
    
    // Check minimum purchase requirement
    if (cartTotal >= coupon.minPurchase) {
      setAppliedCoupon(coupon);
      
      if (coupon.discountType === 'percentage' && coupon.discountValue) {
        setCouponDiscount((cartTotal * coupon.discountValue) / 100);
      } else if (coupon.discountType === 'fixed' && coupon.discountValue) {
        setCouponDiscount(Math.min(coupon.discountValue, cartTotal));
      } else {
        // Default to fixed discount
        setCouponDiscount(coupon.discountValue || 0);
      }
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  };

  const getFinalTotal = () => {
    return Math.max(0, getCartTotal() - couponDiscount);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        budget,
        couponDiscount,
        appliedCoupon,
        addItem,
        removeItem,
        setBudget,
        applyCoupon,
        clearCoupon,
        getCartTotal,
        getFinalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
