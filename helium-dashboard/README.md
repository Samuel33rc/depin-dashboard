# DePIN Ops

Unified dashboard for DePIN monitoring and management.

## Fonctionnalités

- Prix en temps réel HNT, IOT, MOBILE (via CoinGecko API)
- Statistiques du réseau Helium
- Support pour les adresses wallet Helium (format Solana)
- Support DIMO (véhicules connectés)
- Monitoring hotspots (online/offline)
- Alertes Telegram pour hotspots offline
- Design sombre moderne
- Tests automatisés (unit + browser)

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Tests

```bash
# Tests unitaires
npm run test

# Tests browser (Playwright)
npx tsx scripts/browser-test.ts

# Tests API (manuel)
./scripts/test-api.sh

# Couverture
npm run test:coverage
```

## Déploiement

```bash
# Déployer sur Vercel
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

## Notes API

Après la migration Helium vers Solana (2023), l'API a changé :
- Ancien format : `api.helium.io/v1/...`
- Nouveau format : `entities.nft.helium.io/v2/...`

Les adresses wallet doivent être au format Solana base58 (32-44 caractères).
