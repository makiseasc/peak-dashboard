import { NextRequest, NextResponse } from 'next/server';

// Mock Claude endpoint for when API key is not available
// Provides fallback responses to keep UI functional

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, prompt, metrics } = body;

    // Mock responses based on type
    if (type === 'report') {
      const mockReport = `📊 DAILY OPERATIONS BRIEFING

Revenue (Last 30 days): $${metrics?.totalRevenue?.toFixed(0) || 0}
Daily Average: $${metrics?.avgDaily?.toFixed(2) || 0}
Active Pipeline Deals: ${metrics?.activePipeline || 0}
HLAs Completed: ${metrics?.completedHLA || 0}/${metrics?.totalHLA || 0}

${metrics?.completedHLA === metrics?.totalHLA && metrics?.totalHLA > 0 ? '✅ All HLAs completed today!' : ''}
${metrics?.activePipeline > 0 ? `🎯 ${metrics.activePipeline} active deals in pipeline` : ''}
${metrics?.totalRevenue > 0 ? `💰 Revenue tracking: $${metrics.totalRevenue.toFixed(0)} over last 30 days` : ''}

PRIORITY RECOMMENDATIONS:
1. Focus on closing active pipeline deals
2. Maintain HLA completion streak
3. Continue revenue growth trajectory

Note: Claude API key not configured. This is a mock report. Configure ANTHROPIC_API_KEY for AI-generated reports.`;

      return NextResponse.json({
        content: mockReport,
        isMock: true,
      });
    }

    if (type === 'proof') {
      const platform = body.platform || 'twitter';
      const monthlyRevenue = metrics?.monthlyRevenue || 0;
      
      if (platform === 'twitter') {
        const mockTwitter = `Just hit $${monthlyRevenue.toFixed(0)} in monthly consulting revenue. 🔱 Tesla-trained methodology delivering results. Next milestone: $${(monthlyRevenue * 1.5).toFixed(0)}.`;
        
        return NextResponse.json({
          content: mockTwitter,
          isMock: true,
        });
      } else {
        const mockLinkedIn = `Excited to share: $${monthlyRevenue.toFixed(0)} in monthly consulting revenue this month. Our constraint elimination methodology, refined from Tesla experience, is helping clients save 15-25 hours per week. Next milestone: $${(monthlyRevenue * 1.5).toFixed(0)}.`;
        
        return NextResponse.json({
          content: mockLinkedIn,
          isMock: true,
        });
      }
    }

    // Generic mock response
    return NextResponse.json({
      content: '⚙️ [MOCK] Claude API key not configured. This is a placeholder response.',
      isMock: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Mock endpoint error' },
      { status: 500 }
    );
  }
}

