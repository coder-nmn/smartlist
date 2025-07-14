import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript missing' }, { status: 400 });
    }

    // Get the API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Load products data to match against
    const dataPath = path.join(process.cwd(), 'data', 'products.json');
    const productsData = fs.readFileSync(dataPath, 'utf8');
    const products = JSON.parse(productsData);

    // Prepare the system prompt
    const systemPrompt = `You are a grocery list parser. Parse voice input and return a JSON object with two keys:
1. "items": Array of item names mentioned (e.g., ["milk", "eggs", "cheese"])
2. "budget": Number extracted from phrases like "under ₹800" or "budget of 500" (return 0 if no budget mentioned)

Only return valid JSON, no additional text.`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Parse this voice input: "${transcript}"`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to call AI API');
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    const parsedData = JSON.parse(aiContent);
    
    // Match items with products from our database
    const matchedProducts = [];
    if (parsedData.items && Array.isArray(parsedData.items)) {
      for (const itemName of parsedData.items) {
        const matchedProduct = products.find((p: any) => 
          p.name.toLowerCase().includes(itemName.toLowerCase()) ||
          itemName.toLowerCase().includes(p.name.toLowerCase())
        );
        
        if (matchedProduct) {
          matchedProducts.push(matchedProduct);
        } else {
          // Create a generic product if no match found
          matchedProducts.push({
            id: `voice-${Date.now()}-${Math.random()}`,
            name: itemName,
            brand: 'Generic',
            price: 50, // Default price
            unit: '1 unit',
            category: 'grocery'
          });
        }
      }
    }

    return NextResponse.json({
      items: matchedProducts,
      budget: parsedData.budget || 0,
      originalTranscript: transcript
    });

  } catch (error) {
    console.error('Error parsing voice input:', error);
    return NextResponse.json({ 
      error: 'Failed to parse voice input',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
