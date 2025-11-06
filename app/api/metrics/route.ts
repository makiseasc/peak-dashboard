import { NextResponse } from "next/server";

// Temporary mock data (replace later with Airtable or Notion)
export async function GET() {
  const metrics = {
    revenue: 15450 + Math.floor(Math.random() * 200),
    tasksCompleted: 42 + Math.floor(Math.random() * 5),
    openLeads: 18 + Math.floor(Math.random() * 3),
  };
  return NextResponse.json(metrics);
}

