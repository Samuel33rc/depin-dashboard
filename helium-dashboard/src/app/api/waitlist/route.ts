import { NextResponse } from 'next/server';

const waitlist: Array<{ email: string; timestamp: string }> = [];

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
  return NextResponse.json(
    { count: waitlist.length, message: 'Use POST to join waitlist' },
    { status: 200 }
  );
}
