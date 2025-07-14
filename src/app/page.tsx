"use client";

import React from "react";
import { CartProvider } from "../context/CartContext";
import SmartList from "../components/SmartList";
import VoiceInput from "../components/VoiceInput";
import CartTracker from "../components/CartTracker";
import DealsPanel from "../components/DealsPanel";
import BudgetSetter from "../components/BudgetSetter";

export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-white text-black p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          SmartList – Intelligent Grocery Cart Assistant
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-1 space-y-6">
            <BudgetSetter />
            <VoiceInput />
            <DealsPanel />
          </section>
          <section className="md:col-span-2 flex flex-col gap-6">
            <SmartList />
            <CartTracker />
          </section>
        </div>
      </main>
    </CartProvider>
  );
}
