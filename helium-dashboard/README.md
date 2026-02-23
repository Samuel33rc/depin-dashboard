# DePIN Ops

Unified dashboard for DePIN monitoring and management.

## Features

- Real-time HNT, IOT, MOBILE prices (via CoinGecko API)
- Helium network statistics
- Helium wallet support (Solana format)
- DIMO support (connected vehicles)
- Hotspot monitoring (online/offline)
- Telegram alerts for offline hotspots
- Modern dark design
- Automated tests (unit + browser)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Tests

```bash
# Unit tests
npm run test

# Browser tests (Playwright)
npx tsx scripts/browser-test.ts

# API tests (manual)
./scripts/test-api.sh

# Coverage
npm run test:coverage
```

## Deployment

```bash
# Deploy to Vercel
vercel --prod
```

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Vitest (tests)
- Playwright (browser tests)
- CoinGecko API
- Helium API v2
- DIMO API

## Waitlist

### Setup Discord Notification (Optional)

1. Create a Discord webhook:
   - Go to Server Settings → Integrations → Webhooks
   - Create new webhook
   - Copy the webhook URL

2. Add to Vercel environment variables:
   - Key: `DISCORD_WEBHOOK_URL`
   - Value: your webhook URL

### Get Waitlist Data

```bash
# Via API (requires deployment)
curl https://depin-ops.vercel.app/api/waitlist
```

Or check locally:
```bash
cat waitlist.json
```
