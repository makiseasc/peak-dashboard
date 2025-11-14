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
      console.error('Pipeline POST: Missing required fields', { date, stage, body });
      return NextResponse.json(
        { error: 'Missing required fields: date, stage' },
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('Pipeline POST: Invalid date format', { date });
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate stage
    const validStages = ['discovery', 'proposal', 'negotiation', 'closed', 'lost'];
    if (!validStages.includes(stage)) {
      console.error('Pipeline POST: Invalid stage', { stage });
      return NextResponse.json(
        { error: `Invalid stage. Must be one of: ${validStages.join(', ')}` },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      console.warn('Pipeline POST: Supabase not configured');
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
          client_name: client_name?.trim() || null,
          deal_value: deal_value ? parseFloat(deal_value) : null,
          notes: notes?.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Pipeline POST: Supabase error', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Pipeline POST: Error creating pipeline deal', {
      error: error.message,
      code: error.code,
      details: error.details,
    });
    
    let errorMessage = 'Failed to create pipeline deal';
    if (error.code === '42501') {
      errorMessage = 'Permission denied. Check Supabase RLS policies.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage, details: error.details || null },
      { status: 500 }
    );
  }
}

// PUT - Update pipeline deal
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, date, stage, client_name, deal_value, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Supabase not configured. Data not persisted.',
      });
    }

    const updateData: any = {};
    
    if (date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
          { error: 'Invalid date format. Expected YYYY-MM-DD' },
          { status: 400 }
        );
      }
      updateData.date = date;
    }
    
    if (stage !== undefined) {
      const validStages = ['discovery', 'proposal', 'negotiation', 'closed', 'lost'];
      if (!validStages.includes(stage)) {
        return NextResponse.json(
          { error: `Invalid stage. Must be one of: ${validStages.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.stage = stage;
    }
    
    if (client_name !== undefined) {
      updateData.client_name = client_name?.trim() || null;
    }
    
    if (deal_value !== undefined) {
      updateData.deal_value = deal_value ? parseFloat(deal_value) : null;
    }
    
    if (notes !== undefined) {
      updateData.notes = notes?.trim() || null;
    }

    const { data, error } = await supabase!
      .from('pipeline')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Pipeline PUT: Supabase error', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating pipeline:', error);
    
    let errorMessage = 'Failed to update pipeline deal';
    if (error.code === '42501') {
      errorMessage = 'Permission denied. Check Supabase RLS policies.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Remove pipeline deal
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Supabase not configured. Data not persisted.',
      });
    }

    const { error } = await supabase!
      .from('pipeline')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Pipeline DELETE: Supabase error', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting pipeline:', error);
    
    let errorMessage = 'Failed to delete pipeline deal';
    if (error.code === '42501') {
      errorMessage = 'Permission denied. Check Supabase RLS policies.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

