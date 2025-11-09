// app/api/test-log/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔥🔥🔥 TEST LOG WORKS! 🔥🔥🔥')
  return NextResponse.json({ test: 'success' })
}