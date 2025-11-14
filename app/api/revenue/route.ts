import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET - Fetch revenue data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (!isSupabaseConfigured()) {
      // Fallback to mock data if Supabase not configured
      return NextResponse.json({
        revenue: [],
        total: 0,
        dailyAverage: 0,
        bySource: {},
      });
    }

    const { data, error } = await supabase!
      .from('revenue')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) throw error;

    const total = data.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0);
    const dailyAverage = total / days;
    
    const bySource = data.reduce((acc: Record<string, number>, item) => {
      acc[item.source] = (acc[item.source] || 0) + parseFloat(item.amount.toString());
      return acc;
    }, {});

    return NextResponse.json({
      revenue: data,
      total,
      dailyAverage,
      bySource,
    });
  } catch (error: any) {
    console.error('Error fetching revenue:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch revenue' },
      { status: 500 }
    );
  }
}

// POST - Add new revenue entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, source, amount, description } = body;

    if (!date || !source || amount === undefined) {
      console.error('Revenue POST: Missing required fields', { date, source, amount, body });
      return NextResponse.json(
        { error: 'Missing required fields: date, source, amount' },
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('Revenue POST: Invalid date format', { date });
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      console.error('Revenue POST: Invalid amount', { amount });
      return NextResponse.json(
        { error: 'Invalid amount. Must be a positive number.' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      console.warn('Revenue POST: Supabase not configured');
      return NextResponse.json({
        success: true,
        message: 'Supabase not configured. Data not persisted.',
      });
    }

    const { data, error } = await supabase!
      .from('revenue')
      .insert([
        {
          date,
          source,
          amount: amountNum,
          description: description?.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Revenue POST: Supabase error', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Revenue POST: Error creating revenue entry', {
      error: error.message,
      code: error.code,
      details: error.details,
    });
    
    let errorMessage = 'Failed to create revenue entry';
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

// PUT - Update revenue entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, date, source, amount, description } = body;

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
    
    if (source !== undefined) {
      updateData.source = source;
    }
    
    if (amount !== undefined) {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum < 0) {
        return NextResponse.json(
          { error: 'Invalid amount. Must be a positive number.' },
          { status: 400 }
        );
      }
      updateData.amount = amountNum;
    }
    
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    const { data, error } = await supabase!
      .from('revenue')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Revenue PUT: Supabase error', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating revenue:', error);
    
    let errorMessage = 'Failed to update revenue entry';
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

// DELETE - Remove revenue entry
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
      .from('revenue')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Revenue DELETE: Supabase error', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting revenue:', error);
    
    let errorMessage = 'Failed to delete revenue entry';
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

