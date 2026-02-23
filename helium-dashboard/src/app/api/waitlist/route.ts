import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WAITLIST_FILE = path.join(process.cwd(), 'waitlist.json');

interface WaitlistEntry {
  email: string;
  timestamp: string;
}

function readWaitlist(): WaitlistEntry[] {
  try {
    if (fs.existsSync(WAITLIST_FILE)) {
      const data = fs.readFileSync(WAITLIST_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading waitlist:', error);
  }
  return [];
}

function writeWaitlist(entries: WaitlistEntry[]): void {
  try {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(entries, null, 2));
  } catch (error) {
    console.error('Error writing waitlist:', error);
  }
}

async function sendDiscordNotification(email: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '🎉 New Waitlist Signup!',
          color: 0xff6b35,
          fields: [
            { name: 'Email', value: email },
            { name: 'Time', value: new Date().toLocaleString() }
          ],
          footer: { text: 'DePIN Ops' }
        }]
      })
    });
  } catch (error) {
    console.error('Discord notification error:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const waitlist = readWaitlist();
    
    const alreadyExists = waitlist.some((entry) => entry.email === email);
    if (alreadyExists) {
      return NextResponse.json(
        { error: 'Email already on waitlist' },
        { status: 400 }
      );
    }

    waitlist.push({
      email,
      timestamp: new Date().toISOString(),
    });

    writeWaitlist(waitlist);
    
    await sendDiscordNotification(email);
    console.log('New waitlist signup:', email);

    return NextResponse.json(
      { message: 'Successfully joined waitlist', count: waitlist.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const waitlist = readWaitlist();
  return NextResponse.json(
    { count: waitlist.length, waitlist },
    { status: 200 }
  );
}
