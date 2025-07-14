import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'products.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    const products = JSON.parse(data);
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (query) {
      const filtered = products.filter((p: any) =>
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.brand.toLowerCase().includes(query.toLowerCase())
      );
      return NextResponse.json(filtered);
    }
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products data' }, { status: 500 });
  }
}
