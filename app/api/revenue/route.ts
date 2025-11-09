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
      return NextResponse.json(
        { error: 'Missing required fields: date, source, amount' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      // Fallback: return success but don't persist
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
          amount: parseFloat(amount),
          description: description || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating revenue entry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create revenue entry' },
      { status: 500 }
    );
  }
}

