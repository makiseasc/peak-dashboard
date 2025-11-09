import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createClient();

    // Gumroad webhook payload structure
    // Adjust these fields based on actual Gumroad webhook format
    const { product_name, price, created_at, sale_id } = body;

    // Validate required fields
    if (!price || !created_at) {
      return NextResponse.json(
        { error: 'Missing required fields: price, created_at' },
        { status: 400 }
      );
    }

    // Gumroad sends price in cents, convert to dollars
    const amount = typeof price === 'number' ? price / 100 : parseFloat(price) / 100;
    
    // Parse date from Gumroad format (ISO string)
    const date = created_at ? created_at.split('T')[0] : new Date().toISOString().split('T')[0];

    // Insert into revenue table
    const { data, error } = await supabase
      .from('revenue')
      .insert({
        source: 'gumroad',
        amount: amount,
        description: product_name || `Gumroad Sale ${sale_id || ''}`.trim(),
        date: date,
      })
      .select()
      .single();

    if (error) {
      console.error('Gumroad webhook error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to insert revenue' },
        { status: 500 }
      );
    }

    console.log('Gumroad sale recorded:', data);

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Revenue entry created successfully' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Gumroad webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to test webhook
export async function GET() {
  return NextResponse.json({
    message: 'Gumroad webhook endpoint is active',
    instructions: 'Configure this URL in Gumroad webhook settings',
  });
}

