import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// GET - Fetch outreach data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const platform = searchParams.get('platform');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const supabase = createClient();

    let query = supabase
      .from('outreach')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate totals
    const totals = data.reduce(
      (acc, entry) => ({
        sent: acc.sent + (entry.messages_sent || 0),
        replies: acc.replies + (entry.replies || 0),
        positives: acc.positives + (entry.positive_replies || 0),
      }),
      { sent: 0, replies: 0, positives: 0 }
    );

    const responseRate = totals.sent > 0 
      ? ((totals.replies / totals.sent) * 100).toFixed(1)
      : '0.0';

    const positiveRate = totals.replies > 0
      ? ((totals.positives / totals.replies) * 100).toFixed(1)
      : '0.0';

    // Group by platform
    const byPlatform = data.reduce((acc: Record<string, any>, entry) => {
      if (!acc[entry.platform]) {
        acc[entry.platform] = {
          sent: 0,
          replies: 0,
          positives: 0,
          entries: [],
        };
      }
      acc[entry.platform].sent += entry.messages_sent || 0;
      acc[entry.platform].replies += entry.replies || 0;
      acc[entry.platform].positives += entry.positive_replies || 0;
      acc[entry.platform].entries.push(entry);
      return acc;
    }, {});

    return NextResponse.json({
      outreach: data,
      totals,
      responseRate: parseFloat(responseRate),
      positiveRate: parseFloat(positiveRate),
      byPlatform,
    });
  } catch (error: any) {
    console.error('Error fetching outreach:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch outreach' },
      { status: 500 }
    );
  }
}

// POST - Add new outreach entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, platform, messages_sent, replies, positive_replies, campaign_name } = body;

    if (!date || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: date, platform' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('outreach')
      .insert([
        {
          date,
          platform,
          messages_sent: messages_sent || 0,
          replies: replies || 0,
          positive_replies: positive_replies || 0,
          campaign_name: campaign_name || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating outreach entry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create outreach entry' },
      { status: 500 }
    );
  }
}

