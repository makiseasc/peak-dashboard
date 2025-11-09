import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Fetch all data
    const { data: revenue, error: revenueError } = await supabase
      .from('revenue')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (revenueError) {
      console.error('Error fetching revenue:', revenueError);
    }

    const { data: pipeline, error: pipelineError } = await supabase
      .from('pipeline')
      .select('*')
      .order('date', { ascending: false });

    if (pipelineError) {
      console.error('Error fetching pipeline:', pipelineError);
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: hla, error: hlaError } = await supabase
      .from('hla')
      .select('*')
      .eq('date', today);

    if (hlaError) {
      console.error('Error fetching HLA:', hlaError);
    }

    // Calculate metrics
    const totalRevenue = revenue?.reduce((sum, r) => sum + Number(r.amount || 0), 0) || 0;
    const avgDaily = revenue && revenue.length > 0 ? totalRevenue / revenue.length : 0;
    const activePipeline = pipeline?.filter(p => p.stage !== 'closed' && p.stage !== 'lost').length || 0;
    const completedHLA = hla?.filter(h => h.completed).length || 0;
    const totalHLA = hla?.length || 0;

    // Check if Claude API key is configured
    const claudeApiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (!claudeApiKey) {
      // Return report without AI if API key not configured
      return NextResponse.json({
        metrics: {
          totalRevenue,
          avgDaily,
          activePipeline,
          completedHLA,
          totalHLA,
        },
        report: `📊 DAILY OPERATIONS BRIEFING

Revenue (Last 30 days): $${totalRevenue.toFixed(0)}
Daily Average: $${avgDaily.toFixed(2)}
Active Pipeline Deals: ${activePipeline}
HLAs Completed: ${completedHLA}/${totalHLA}

${completedHLA === totalHLA && totalHLA > 0 ? '✅ All HLAs completed today!' : ''}
${activePipeline > 0 ? `🎯 ${activePipeline} active deals in pipeline` : ''}
${totalRevenue > 0 ? `💰 Revenue tracking: $${totalRevenue.toFixed(0)} over last 30 days` : ''}

Note: Claude API key not configured. Configure ANTHROPIC_API_KEY for AI-generated reports.`,
      });
    }

    // Generate AI report using Claude
    const prompt = `You are an executive operations analyst. Generate a concise daily briefing based on these metrics:

Revenue (Last 30 days): $${totalRevenue.toFixed(0)}
Daily Average: $${avgDaily.toFixed(2)}
Active Pipeline Deals: ${activePipeline}
HLAs Completed: ${completedHLA}/${totalHLA}

Format as a strategic operator briefing. Be direct, data-driven, and actionable. Include 1-2 priority recommendations. Keep it under 300 words.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const result = await response.json();
    const reportText = result.content?.[0]?.text || 'Failed to generate report';

    return NextResponse.json({
      metrics: {
        totalRevenue,
        avgDaily,
        activePipeline,
        completedHLA,
        totalHLA,
      },
      report: reportText,
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate report',
        metrics: {
          totalRevenue: 0,
          avgDaily: 0,
          activePipeline: 0,
          completedHLA: 0,
          totalHLA: 0,
        },
        report: 'Error generating report. Please check your API configuration.',
      },
      { status: 500 }
    );
  }
}

