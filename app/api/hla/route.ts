import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getTodayCST } from '@/lib/date-utils';

// GET - Fetch HLA data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || getTodayCST();
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

    const completed = todayData.filter(h => h.completed).length;
    const total = todayData.length;

    // Calculate total XP from completed HLAs for the selected date
    const totalXP = todayData
      .filter(h => h.completed)
      .reduce((sum, h) => sum + (h.xp || 10), 0);

    // Get recent HLAs for streak calculation
    const today = getTodayCST();
    const todayDate = new Date(today + 'T12:00:00');
    const startDate = new Date(todayDate);
    startDate.setDate(startDate.getDate() - days);
    
    const { data: recentData, error: recentError } = await supabase!
      .from('hla')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (recentError) throw recentError;

    // Calculate current streak (consecutive days with all HLAs completed)
    let streakCount = 0;
    
    // Check backwards from today for consecutive completed days
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today + 'T12:00:00');
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

    // Validate required fields
    if (!date || !title || !title.trim()) {
      console.error('HLA POST: Missing required fields', { date, title, body });
      return NextResponse.json(
        { error: 'Missing required fields: date and title are required' },
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('HLA POST: Invalid date format', { date });
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      console.warn('HLA POST: Supabase not configured');
      return NextResponse.json({
        success: true,
        message: 'Supabase not configured. Data not persisted.',
      });
    }

    // Prepare insert data
    const insertData: any = {
      date,
      title: title.trim(),
      description: description?.trim() || null,
      completed: false,
    };

    // Handle energy_level - can be string or number
    if (energy_level !== undefined && energy_level !== null && energy_level !== '') {
      const energyNum = typeof energy_level === 'number' ? energy_level : parseInt(String(energy_level));
      if (!isNaN(energyNum) && energyNum >= 1 && energyNum <= 10) {
        insertData.energy_level = energyNum;
      }
    }

    // Try to include xp and streak_count (graceful degradation if columns don't exist)
    // First attempt: include all columns
    let insertWithExtras = { ...insertData, xp: 10, streak_count: 0 };
    
    console.log('HLA POST: Inserting data', { insertWithExtras });

    let { data, error } = await supabase!
      .from('hla')
      .insert([insertWithExtras])
      .select()
      .single();

    // If error is about missing columns, retry without them
    if (error && (error.message?.includes('streak_count') || error.message?.includes('column') || error.code === '42703')) {
      console.warn('HLA POST: Retrying without optional columns (xp, streak_count)', error.message);
      
      // Retry with just the required fields
      const insertMinimal = { ...insertData };
      const { data: retryData, error: retryError } = await supabase!
        .from('hla')
        .insert([insertMinimal])
        .select()
        .single();
      
      if (retryError) {
        console.error('HLA POST: Supabase error (retry)', {
          error: retryError.message,
          code: retryError.code,
          details: retryError.details,
          hint: retryError.hint,
        });
        throw retryError;
      }
      
      data = retryData;
      error = null;
    } else if (error) {
      console.error('HLA POST: Supabase error', {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log('HLA POST: Success', { data });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('HLA POST: Error creating HLA', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
    });
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to create HLA';
    if (error.code === '23505') {
      errorMessage = 'HLA with this title already exists for this date';
    } else if (error.code === '23503') {
      errorMessage = 'Database constraint violation. Check your data.';
    } else if (error.code === '42501') {
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

// PUT - Update HLA (for toggling completion and editing)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, completed, title, description, energy_level } = body;

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
    
    // Handle completion toggle
    if (completed !== undefined) {
      updateData.completed = completed;
      // Award XP when completing (try with XP, fallback if column doesn't exist)
      if (completed) {
        updateData.xp = 10;
      }
    }
    
    // Handle title edit
    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        );
      }
      updateData.title = trimmedTitle;
    }
    
    // Handle description edit
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }
    
    // Handle energy_level edit
    if (energy_level !== undefined && energy_level !== null && energy_level !== '') {
      const energyNum = typeof energy_level === 'number' ? energy_level : parseInt(String(energy_level));
      if (!isNaN(energyNum) && energyNum >= 1 && energyNum <= 10) {
        updateData.energy_level = energyNum;
      }
    }

    // Try update with XP first (if completing)
    let { data, error } = await supabase!
      .from('hla')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    // If error is about missing XP column, retry without it
    if (error && (error.message?.includes('xp') || error.message?.includes('column') || error.code === '42703')) {
      console.warn('HLA PUT: Retrying without optional columns (xp)', error.message);
      
      const updateMinimal = { ...updateData };
      delete updateMinimal.xp;
      
      const { data: retryData, error: retryError } = await supabase!
        .from('hla')
        .update(updateMinimal)
        .eq('id', id)
        .select()
        .single();
      
      if (retryError) {
        console.error('HLA PUT: Supabase error (retry)', {
          error: retryError.message,
          code: retryError.code,
          details: retryError.details,
        });
        throw retryError;
      }
      
      data = retryData;
      error = null;
    } else if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating HLA:', error);
    
    let errorMessage = 'Failed to update HLA';
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

// DELETE - Remove HLA
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
      .from('hla')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('HLA DELETE: Supabase error', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting HLA:', error);
    
    let errorMessage = 'Failed to delete HLA';
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

