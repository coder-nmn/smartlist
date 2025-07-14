import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'coupons.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    const coupons = JSON.parse(data);
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read coupons data' }, { status: 500 });
  }
}
