import { NextRequest, NextResponse } from 'next/server';
import { checkHotspotStatus, getOfflineHotspots, calculateUptimePercentage } from '@/lib/hotspot-monitor';
import { sendTelegramAlert } from '@/lib/telegram-alerts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, botToken, chatId, checkOffline } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing walletAddress' },
        { status: 400 }
      );
    }

    const result = await checkHotspotStatus(walletAddress);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to fetch hotspot data' },
        { status: 500 }
      );
    }

    const response: Record<string, unknown> = {
      walletAddress: result.walletAddress,
      totalHotspots: result.totalHotspots,
      onlineHotspots: result.onlineHotspots,
      offlineHotspots: result.offlineHotspots,
      uptimePercentage: calculateUptimePercentage(result).toFixed(2),
    };

    if (checkOffline && botToken && chatId) {
      const offlineHotspots = getOfflineHotspots(result);
      
      if (offlineHotspots.length > 0) {
        await sendTelegramAlert(
          { botToken, chatId },
          {
            type: 'offline',
            title: 'Hotspot Offline Alert',
            message: `${offlineHotspots.length} of ${result.totalHotspots} hotspots are offline!\n\n${offlineHotspots.slice(0, 3).map(h => `• ${h.name}: ${h.status}`).join('\n')}${offlineHotspots.length > 3 ? `\n...and ${offlineHotspots.length - 3} more` : ''}`
          }
        );
        response.alertSent = true;
      } else {
        response.alertSent = false;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in hotspot status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Helium Hotspot Monitor API',
    methods: ['POST'],
    body: {
      walletAddress: 'string (required)',
      botToken: 'string (optional - for sending alerts)',
      chatId: 'string (optional - for sending alerts)',
      checkOffline: 'boolean (optional - trigger alert if hotspots offline)'
    }
  });
}
