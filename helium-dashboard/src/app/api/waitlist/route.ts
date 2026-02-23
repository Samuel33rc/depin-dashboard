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
    { count: waitlist.length, message: 'Use POST to join waitlist' },
    { status: 200 }
  );
}
