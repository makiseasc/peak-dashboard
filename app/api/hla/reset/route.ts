import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// POST - Daily reset endpoint (for n8n cron job)
// Resets all HLAs for today to incomplete
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    // Reset all HLAs for today to incomplete
    const { data, error } = await supabase
      .from('hla')
      .update({ completed: false })
      .eq('date', today)
      .select();

    if (error) {
      console.error('HLA reset error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to reset HLAs' },
        { status: 500 }
      );
    }

    console.log(`HLA reset completed for ${today}. ${data?.length || 0} HLAs reset.`);

    return NextResponse.json({
      success: true,
      message: `HLA reset completed for ${today}`,
      resetCount: data?.length || 0,
    });
  } catch (error: any) {
    console.error('HLA reset error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Test endpoint
export async function GET() {
  return NextResponse.json({
    message: 'HLA reset endpoint is active',
    instructions: 'Call POST /api/hla/reset to reset today\'s HLAs',
    cronUrl: 'https://your-vercel-domain.vercel.app/api/hla/reset',
  });
}

