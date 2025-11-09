import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const SMARTLEAD_API_KEY = process.env.SMARTLEAD_API_KEY;

    if (!SMARTLEAD_API_KEY) {
      return NextResponse.json(
        { error: 'Smartlead API key not configured' },
        { status: 400 }
      );
    }

    const SMARTLEAD_URL = 'https://server.smartlead.ai/api/v1/campaigns';

    const res = await fetch(SMARTLEAD_URL, {
      headers: { Authorization: `Bearer ${SMARTLEAD_API_KEY}` },
    });

    if (!res.ok) {
      throw new Error(`Smartlead API error: ${res.status}`);
    }

    const { data } = await res.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid response from Smartlead API' },
        { status: 500 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    let syncedCount = 0;

    for (const c of data) {
      const sent = c.stats?.emails_sent ?? 0;
      const replies = c.stats?.replies ?? 0;
      const positives = c.stats?.positive_replies ?? 0;

      // Check if entry exists for today
      const { data: existing } = await supabase
        .from('outreach')
        .select('id')
        .eq('date', today)
        .eq('platform', 'smartlead')
        .eq('campaign_name', c.name)
        .single();

      if (existing) {
        // Update existing entry
        const { error } = await supabase
          .from('outreach')
          .update({
            messages_sent: sent,
            replies: replies,
            positive_replies: positives,
          })
          .eq('id', existing.id);

        if (error) {
          console.error(`Error updating campaign ${c.name}:`, error);
        } else {
          syncedCount++;
        }
      } else {
        // Insert new entry
        const { error } = await supabase.from('outreach').insert({
          date: today,
          platform: 'smartlead',
          campaign_name: c.name,
          messages_sent: sent,
          replies: replies,
          positive_replies: positives,
        });

        if (error) {
          console.error(`Error inserting campaign ${c.name}:`, error);
        } else {
          syncedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      campaigns: data.length,
      synced: syncedCount,
      date: today,
    });
  } catch (error: any) {
    console.error('Error syncing Smartlead campaigns:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync Smartlead campaigns',
        success: false,
      },
      { status: 500 }
    );
  }
}

