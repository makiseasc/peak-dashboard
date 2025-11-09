import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json(); // 'twitter' or 'linkedin'

    if (!type || !['twitter', 'linkedin'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "twitter" or "linkedin"' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get latest revenue
    const { data: revenue, error: revenueError } = await supabase
      .from('revenue')
      .select('*')
      .order('date', { ascending: false })
      .limit(1);

    if (revenueError) {
      console.error('Error fetching latest revenue:', revenueError);
    }

    // Get revenue for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

    const { data: revenueMonth, error: revenueMonthError } = await supabase
      .from('revenue')
      .select('*')
      .gte('date', dateStr);

    if (revenueMonthError) {
      console.error('Error fetching monthly revenue:', revenueMonthError);
    }

    const latestRevenue = revenue?.[0]?.amount ? Number(revenue[0].amount) : 0;
    const monthlyRevenue = revenueMonth?.reduce((sum, r) => sum + Number(r.amount || 0), 0) || 0;

    // Check if Claude API key is configured
    const claudeApiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!claudeApiKey) {
      // Return fallback post if API key not configured
      const fallbackPost = type === 'twitter'
        ? `Just hit $${monthlyRevenue.toFixed(0)} in monthly consulting revenue. 🔱 Tesla-trained methodology delivering results. Next milestone: $${(monthlyRevenue * 1.5).toFixed(0)}.`
        : `Excited to share: $${monthlyRevenue.toFixed(0)} in monthly consulting revenue this month. Our constraint elimination methodology, refined from Tesla experience, is helping clients save 15-25 hours per week. Next milestone: $${(monthlyRevenue * 1.5).toFixed(0)}.`;

      return NextResponse.json({
        content: fallbackPost,
        metrics: { latestRevenue, monthlyRevenue },
        note: 'Claude API key not configured. Using fallback post.',
      });
    }

    // Generate AI post using Claude
    const prompt = type === 'twitter'
      ? `Write a confident, calm founder tweet (max 280 chars) about earning $${monthlyRevenue.toFixed(0)} in consulting revenue this month. Mention Tesla-trained methodology. No hype, just facts + next milestone. Include 🔱 emoji.`
      : `Write a 2-3 sentence LinkedIn post about $${monthlyRevenue.toFixed(0)} in monthly consulting revenue. Professional tone, mention constraint elimination methodology from Tesla background. Include proof point about client results (15-25 hrs/week saved).`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const result = await response.json();
    const postContent = result.content?.[0]?.text || 'Failed to generate post';

    return NextResponse.json({
      content: postContent,
      metrics: { latestRevenue, monthlyRevenue },
    });
  } catch (error: any) {
    console.error('Error generating proof post:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate proof post',
        metrics: { latestRevenue: 0, monthlyRevenue: 0 },
        content: 'Error generating post. Please check your API configuration.',
      },
      { status: 500 }
    );
  }
}

