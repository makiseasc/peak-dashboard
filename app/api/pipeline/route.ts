import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET - Fetch pipeline data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        deals: [],
        byStage: {},
        totalValue: 0,
      });
    }

    let query = supabase!.from('pipeline').select('*');

    if (stage) {
      query = query.eq('stage', stage);
    }

    if (activeOnly) {
      query = query.in('stage', ['discovery', 'proposal', 'negotiation']);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    const byStage = data.reduce((acc: Record<string, any[]>, deal) => {
      if (!acc[deal.stage]) acc[deal.stage] = [];
      acc[deal.stage].push(deal);
      return acc;
    }, {});

    const totalValue = data.reduce((sum, deal) => {
      return sum + (deal.deal_value ? parseFloat(deal.deal_value.toString()) : 0);
    }, 0);

    return NextResponse.json({
      deals: data,
      byStage,
      totalValue,
      counts: {
        discovery: byStage.discovery?.length || 0,
        proposal: byStage.proposal?.length || 0,
        negotiation: byStage.negotiation?.length || 0,
        closed: byStage.closed?.length || 0,
        lost: byStage.lost?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching pipeline:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pipeline' },
      { status: 500 }
    );
  }
}

// POST - Add new pipeline deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, stage, client_name, deal_value, notes } = body;

    if (!date || !stage) {
      return NextResponse.json(
        { error: 'Missing required fields: date, stage' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Supabase not configured. Data not persisted.',
      });
    }

    const { data, error } = await supabase!
      .from('pipeline')
      .insert([
        {
          date,
          stage,
          client_name: client_name || null,
          deal_value: deal_value ? parseFloat(deal_value) : null,
          notes: notes || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating pipeline deal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create pipeline deal' },
      { status: 500 }
    );
  }
}

