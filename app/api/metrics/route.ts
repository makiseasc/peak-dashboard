import { NextResponse } from "next/server";

export async function GET() {
  const metrics = {
    revenue: 12450 + Math.floor(Math.random() * 5000),
    tasks: 42 + Math.floor(Math.random() * 10),
    leads: 18 + Math.floor(Math.random() * 5),
  };
  return NextResponse.json(metrics);
}

