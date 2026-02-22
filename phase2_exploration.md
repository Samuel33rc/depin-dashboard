# Phase 2 : Exploration

## 2.1 Analyser la concurrence existante

### A. DePINscan (depinscan.io)

**Ce qu'ils font:**
- Analytics global DePIN
- Carte mondiale des appareils (42M+ devices)
- Market cap, volume, prix tokens
- 433 projets listés
- Statistiques par catégorie (Server, Wireless, Compute, AI, etc.)
- News et rapports (DePIN Report 2025)

**Ce qui leur MANQUE:**
- Pas de tracking personnel de rewards
- Pas de gestion de wallet
- Pas d'alertes
- Pas d'automatisation
- Pas spécifique à un utilisateur

**Position:** Explorateur global, pas un outil personnel

---

### B. Portfolio Trackers (CoinStats, Zapper, DeBank)

**Ce qu'ils font:**
- Track wallets crypto + DeFi
- 300+ wallets/exchanges supportés
- Calcul P&L automatique
- View multi-chain

**Ce qui leur MANQUE:**
- Pas spécifique DePIN
- Pas de données rewards DePIN
- Pas de monitoring hardware
- Pas d'alertes offline

**Position:** Tracker crypto générique

---

### C. GitHub Scripts (DEPINTools, depinCum)

**Ce qu'ils font:**
- Scripts Python/Node pour automation
- Daily check-in automation
- Multi-account support

**Ce qui leur MANQUE:**
- CLI seulement (pas GUI)
- Pas user-friendly
- Un seul projet à la fois
- Configuration technique requise

**Position:** Pour développeurs seulement

---

### D. Telegram Bots

**Ce qu'ils font:**
- Auto claim rewards
- Daily check-in

**Ce qui leur MANQUE:**
- Fragmenté (un bot par projet)
- Pas de vue unifiée

**Position:** Solutions temporaires

---

### E. DePIN Tracker (moken.io)

**Ce qu'ils font:**
- Dashboard rewards multi-projets
- Alertes offline
- Support Helium, GEODNET, WeatherXM
- Version gratuite + Premium

**Ce qui leur MANQUE:**
- Prix des tokens limité
- Pas d'automatisation
- Pas de tax reporting

**Position:** Leader actuel mais incomplet

---

## 2.2 Tableau comparatif

| Critère | DePINscan | CoinStats | Scripts | Telegram | DePIN Tracker |
|---------|-----------|-----------|---------|---------|---------------|
| GUI | ✅ | ✅ | ❌ | ❌ | ✅ |
| Multi | ✅ |-DePIN | ✅ ⚠️ | ❌ | ✅ |
| Alerts | ❌ | ❌ | ❌ | ✅ | ✅ |
| Automation | ❌ | ❌ | ✅ | ✅ | ❌ |
| User-friendly | ✅ | ✅ | ❌ | ⚠️ | ✅ |

---

## 2.3 Ce qui manque (Trou identifié)

**Personne ne fait:**
- Dashboard unifié personnel
- GUI simple (pas de code)
- Multi-DePIN + Multi-wallet
- Alerts proactives
- Automation (daily check-in)
- Monitoring hardware visual

---

## 2.4 Différenciateur clé

**NOTRE SOLUTION:**
GUI + Multi-DePIN + Alerts + Automation + Simplicité

Aucun concurrent ne combine tous ces éléments ensemble.

---

## 2.5 Opportunité validée

**Marché:**
- 42M+ appareils DePIN
- 433 projets
- $8.6B market cap
- Croissance rapide

**Problème résolu:**
- Complexité technique → simplification
- Multi-outils → un seul dashboard
- Manual → automation
- Inattention → alerts proactives

---

## 2.6 Définition du MVP

### Core Features (MVP v1)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Dashboard unifié** | Vue centrale de tous vos DePINs |
| 2 | **Connexion wallet** | Via adresse wallet (pas de private keys) |
| 3 | **Prix temps réel** | Via CoinGecko API |
| 4 | **Rewards totals** | Somme des earnings par DePIN |
| 5 | **Alertes offline** | Notification quand hotspot down |

### User Flow

```
1. User arrive sur le site
2. Entre son wallet address
3. Dashboard affiche:
   - Prix tokens (HNT, IOT, MOBILE)
   - Total rewards en USD
   - Status hotpots (online/offline)
4. User peut:
   - Ajouter d'autres wallets
   - Configurer alerts
   - Voir historique
```

### Stack Technique (0€)

| Composant | Tech | Coût |
|-----------|------|-------|
| Frontend | Next.js + Tailwind | $0 |
| API Calls | Client-side ou n8n | $0 |
| Database | Supabase (free tier) | $0 |
| Hosting | Vercel | $0 |
| Auth | Wallet connect (optionnel) | $0 |
| Alerts | Telegram Bot API | $0 |

### API Integration (Phase 1)

| DePIN | API | Status |
|-------|-----|--------|
| Helium | entities.nft.helium.io/v2 | ✅ Fonctionne |
| DIMO | identity-api.dimo.zone | ✅ Fonctionne |
| Prix | api.coingecko.com | ✅ Fonctionne |

### Limitations MVP v1

- Pas d'automatisation (juste monitoring)
- Pas de multi-wallet (v1)
- Pas d'historique long terme
- Alerts basiques seulement

---

## 2.7 Prochaines étapes

- [ ] Valider le MVP avec user tests
- [ ] Développer le dashboard
- [ ] Ajouter alerts Telegram
- [ ] Itérer based on feedback
