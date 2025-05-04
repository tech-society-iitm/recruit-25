// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store (resets on server restart)
const ipStore: Record<string, { count: number, timestamp: number }> = {};

export function middleware(request: NextRequest) {
  // Only apply to your form submission endpoint
  if (request.nextUrl.pathname === '/api/recruit') {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    if (!ipStore[ip]) {
      ipStore[ip] = { count: 0, timestamp: now };
    }
    
    // Reset count if over 1 minute old
    if (now - ipStore[ip].timestamp > 60 * 1000) {
      ipStore[ip].count = 0;
      ipStore[ip].timestamp = now;
    }
    
    // Increment count
    ipStore[ip].count++;
    
    // Limit to 5 requests per minute
    if (ipStore[ip].count > 5) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/recruit',
};