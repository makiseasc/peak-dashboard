import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();
    const supabase = createClient();

    // Cal.com webhook payload structure
    // Adjust these fields based on actual Cal.com webhook format
    const { name, startTime, email, eventType, bookingId } = booking;

    // Validate required fields
    if (!startTime) {
      return NextResponse.json(
        { error: 'Missing required field: startTime' },
        { status: 400 }
      );
    }

    // Parse date from Cal.com format (ISO string)
    const date = startTime.split('T')[0];

    // Extract client name (could be name, email, or eventType)
    const clientName = name || email || eventType?.title || 'Cal.com Booking';

    // Insert into pipeline table
    const { data, error } = await supabase
      .from('pipeline')
      .insert({
        stage: 'discovery',
        client_name: clientName,
        deal_value: 0,
        date: date,
        notes: `Auto-added from Cal.com${bookingId ? ` (Booking ID: ${bookingId})` : ''}${email ? ` - ${email}` : ''}`,
      })
      .select()
      .single();

    if (error) {
      console.error('Cal.com webhook error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to insert pipeline entry' },
        { status: 500 }
      );
    }

    console.log('Cal.com booking added to pipeline:', data);

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Booking added to pipeline successfully' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Cal.com webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to test webhook
export async function GET() {
  return NextResponse.json({
    message: 'Cal.com webhook endpoint is active',
    instructions: 'Configure this URL in Cal.com webhook settings',
    webhookUrl: 'https://makiseops.app.n8n.cloud/webhook/calcom-booking',
  });
}

