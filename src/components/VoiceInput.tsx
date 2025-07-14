"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a grocery list parser. Parse voice input and return a JSON object with two keys: 1. 'items': Array of item names mentioned (e.g., ['milk', 'eggs', 'cheese']) 2. 'budget': Number extracted from phrases like 'under ₹800' or 'budget of 500' (return 0 if no budget mentioned). Only return valid JSON, no additional text."
  );
  const { addItem, setBudget } = useCart();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Speech Recognition API not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = async (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setIsListening(false);
      
      // Process the transcript with AI
      await processVoiceInput(speechToText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const processVoiceInput = async (transcript: string) => {
    setIsProcessing(true);
    setError("");
    
    try {
      const response = await fetch("/api/parse-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Add items to cart
      if (data.items && Array.isArray(data.items)) {
        data.items.forEach((item: any) => {
          addItem(item);
        });
      }

      // Set budget if provided
      if (data.budget && data.budget > 0) {
        setBudget(data.budget);
      }

      setError("");
    } catch (error) {
      console.error("Error processing voice input:", error);
      setError(error instanceof Error ? error.message : "Failed to process voice input");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (!isProcessing) {
      setIsListening((prev) => !prev);
      setError("");
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Voice-Enabled List Creation</h2>
      
      {/* System Prompt Configuration */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          AI System Prompt (Customize as needed):
        </label>
        <textarea
          className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Enter system prompt for AI processing..."
        />
      </div>

      {/* Voice Input Controls */}
      <div className="flex flex-col space-y-3">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            isListening
              ? "bg-red-600 text-white hover:bg-red-700"
              : isProcessing
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isListening
            ? "🎤 Stop Listening"
            : isProcessing
            ? "🔄 Processing..."
            : "🎤 Start Listening"}
        </button>

        {/* Status Messages */}
        {error && (
          <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {transcript && (
          <div className="p-2 bg-blue-100 border border-blue-300 rounded">
            <div className="text-sm font-medium text-blue-800 mb-1">
              Transcript:
            </div>
            <div className="text-sm text-blue-700">"{transcript}"</div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-600 italic">
          💡 Try saying: "Add milk, eggs, and cheese under ₹800"
        </div>
      </div>
    </div>
  );
}
