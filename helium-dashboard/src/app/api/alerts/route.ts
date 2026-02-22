import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramAlert, type AlertMessage } from '@/lib/telegram-alerts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { botToken, chatId, type, title, message } = body;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Missing botToken or chatId' },
        { status: 400 }
      );
    }

    const alert: AlertMessage = {
      type: type || 'warning',
      title: title || 'DePIN Alert',
      message: message || 'Alert from DePIN Ops',
      timestamp: new Date().toISOString()
    };

    const success = await sendTelegramAlert({ botToken, chatId }, alert);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send alert' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in alerts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'DePIN Ops Alerts API',
    methods: ['POST'],
    body: {
      botToken: 'string (required)',
      chatId: 'string (required)',
      type: 'offline | online | reward | warning',
      title: 'string (optional)',
      message: 'string (required)'
    }
  });
}
