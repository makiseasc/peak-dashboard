import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET - Fetch HLA data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const days = parseInt(searchParams.get('days') || '7');

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        hlas: [],
        today: [],
        completed: 0,
        total: 0,
      });
    }

    // Get today's HLAs
    const { data: todayData, error: todayError } = await supabase!
      .from('hla')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (todayError) throw todayError;

    // Get recent HLAs for streak calculation
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data: recentData, error: recentError } = await supabase!
      .from('hla')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (recentError) throw recentError;

    const completed = todayData.filter(h => h.completed).length;
    const total = todayData.length;

    // Calculate total XP from completed HLAs today
    const totalXP = todayData
      .filter(h => h.completed)
      .reduce((sum, h) => sum + (h.xp || 10), 0);

    // Calculate current streak (consecutive days with all HLAs completed)
    let streakCount = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Check backwards from today for consecutive completed days
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayHLAs = recentData.filter(h => h.date === dateStr);
      if (dayHLAs.length === 0) break; // No HLAs for this day
      
      const allCompleted = dayHLAs.every(h => h.completed);
      if (allCompleted && dayHLAs.length > 0) {
        streakCount++;
      } else {
        break; // Streak broken
      }
    }

    return NextResponse.json({
      hlas: recentData,
      today: todayData,
      completed,
      total,
      totalXP,
      streakCount,
    });
  } catch (error: any) {
    console.error('Error fetching HLA:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch HLA' },
      { status: 500 }
    );
  }
}

// POST - Create new HLA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, title, description, energy_level } = body;

    if (!date || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: date, title' },
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
      .from('hla')
      .insert([
        {
          date,
          title,
          description: description || null,
          energy_level: energy_level || null,
          completed: false,
          xp: 10, // Default XP
          streak_count: 0, // Default streak
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating HLA:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create HLA' },
      { status: 500 }
    );
  }
}

// PUT - Update HLA (for toggling completion)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, completed, energy_level } = body;

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
    if (completed !== undefined) {
      updateData.completed = completed;
      // Award XP when completing (default 10, can be customized)
      if (completed) {
        updateData.xp = 10; // Default XP for completion
      }
    }
    if (energy_level !== undefined) updateData.energy_level = energy_level;

    const { data, error } = await supabase!
      .from('hla')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating HLA:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update HLA' },
      { status: 500 }
    );
  }
}

