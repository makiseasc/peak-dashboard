import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Monitor endpoint for n8n workflow status tracking
export async function POST(req: NextRequest) {
  try {
    const { name, status, details } = await req.json();

    if (!name || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: name, status' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    // Log workflow status to pipeline table (or create a separate monitoring table)
    const { data, error } = await supabase
      .from('pipeline')
      .insert({
        stage: status === 'success' ? 'automation_ok' : 'automation_fail',
        client_name: `Workflow: ${name}`,
        deal_value: 0,
        notes: `Automation ${status}${details ? ` - ${details}` : ''}`,
        date: today,
      })
      .select()
      .single();

    if (error) {
      console.error('Monitor logging error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to log workflow status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      logged: true,
      workflow: name,
      status: status,
    });
  } catch (error: any) {
    console.error('Monitor endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', ok: false },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Monitor endpoint is active',
    timestamp: new Date().toISOString(),
  });
}

