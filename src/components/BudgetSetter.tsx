"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";

export default function BudgetSetter() {
  const [budgetInput, setBudgetInput] = useState("");
  const { budget, setBudget } = useCart();

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      setBudget(amount);
      setBudgetInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSetBudget();
    }
  };

  return (
    <div className="border p-4 rounded shadow bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Set Your Budget</h2>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">₹</span>
          <input
            type="number"
            placeholder="Enter budget amount"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          onClick={handleSetBudget}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Set Budget
        </button>
        {budget > 0 && (
          <div className="text-sm text-gray-600">
            Current Budget: <span className="font-semibold">₹{budget.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
