import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// GET - Fetch operator stats (XP, streaks, completion rates)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '14');

    // Get HLA data for last N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const dateStr = startDate.toISOString().split('T')[0];

    const { data: hlaData, error: hlaError } = await supabase
      .from('hla')
      .select('*')
      .gte('date', dateStr)
      .order('date', { ascending: false });

    if (hlaError) throw hlaError;

    // Calculate stats
    const totalXP = hlaData
      ?.filter(h => h.completed)
      .reduce((sum, h) => sum + (h.xp || 10), 0) || 0;

    // Calculate completion rate by day
    const completionByDay: Record<string, { total: number; completed: number }> = {};
    hlaData?.forEach(h => {
      if (!completionByDay[h.date]) {
        completionByDay[h.date] = { total: 0, completed: 0 };
      }
      completionByDay[h.date].total++;
      if (h.completed) {
        completionByDay[h.date].completed++;
      }
    });

    // Calculate streak
    let streakCount = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < days; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayHLAs = hlaData?.filter(h => h.date === dateStr) || [];
      if (dayHLAs.length === 0) break;
      
      const allCompleted = dayHLAs.every(h => h.completed);
      if (allCompleted && dayHLAs.length > 0) {
        streakCount++;
      } else {
        break;
      }
    }

    // Calculate completion rate
    const totalHLAs = hlaData?.length || 0;
    const completedHLAs = hlaData?.filter(h => h.completed).length || 0;
    const completionRate = totalHLAs > 0 
      ? ((completedHLAs / totalHLAs) * 100).toFixed(1)
      : '0.0';

    // Get best streak
    const bestStreak = Math.max(
      ...(hlaData?.map(h => h.streak_count || 0) || [0]),
      0
    );

    // Daily completion chart data
    const chartData = Object.entries(completionByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({
        date,
        completion: stats.total > 0 
          ? ((stats.completed / stats.total) * 100).toFixed(0)
          : '0',
        total: stats.total,
        completed: stats.completed,
      }))
      .slice(-days); // Last N days

    return NextResponse.json({
      totalXP,
      streakCount,
      bestStreak,
      completionRate: parseFloat(completionRate),
      totalHLAs,
      completedHLAs,
      chartData,
      days,
    });
  } catch (error: any) {
    console.error('Error fetching operator stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch operator stats' },
      { status: 500 }
    );
  }
}

