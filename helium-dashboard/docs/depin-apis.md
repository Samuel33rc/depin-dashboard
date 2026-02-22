# DePIN APIs - Cartographie Complète

## Résumé des Tests API

### ✅ APIs Testées avec Succès

| Projet | Type | Endpoint | Status | Prix Token |
|--------|------|----------|--------|------------|
| **Helium** | REST | `entities.nft.helium.io/v2` | ✅ Fonctionne | $1.50 |
| **DIMO** | GraphQL | `identity-api.dimo.zone` | ✅ Fonctionne | $0.011 |
| **Filecoin** | RPC JSON | `api.node.glif.io/rpc/v1` | ✅ Fonctionne | $0.93 |
| **CoinGecko** | REST | `api.coingecko.com` | ✅ Fonctionne | - |

### ❌ APIs Inaccessibles

| Projet | Problème |
|--------|----------|
| **Render** | Whitelist nécessaire + token d'accès |
| **Hivemapper** | Pas d'API publique trouvée |
| **Grass** | Via Telegram bot uniquement |
| **NodePay** | Bot Telegram uniquement |

---

## Détails des APIs Fonctionnelles

### 1. Helium (✅)

**Endpoint:** `https://entities.nft.helium.io/v2`

**Tests réussis:**
```bash
# Wallet data
curl "https://entities.nft.helium.io/v2/wallet/7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV"

# Hotspots stats
curl "https://entities.nft.helium.io/v2/hotspots/pagination-metadata?subnetwork=iot"
```

**Données accessibles:**
- Wallet balances (HNT, IOT, MOBILE)
- Hotspots count par subnetwork
- Détails des hotspots

---

### 2. DIMO (✅)

**Endpoint:** `https://identity-api.dimo.zone`

**Test réussi:**
```bash
curl -X POST "https://identity-api.dimo.zone/query" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ vehicles(first: 3) { nodes { tokenId definition { make model year } } } }"}'
```

**Réponse:**
```json
{
  "data": {
    "vehicles": {
      "nodes": [
        {"tokenId": 190090, "definition": {"make": "BMW", "model": "i3s", "year": 2020}},
        {"tokenId": 190089, "definition": {"make": "Ford", "model": "Puma", "year": 2023}},
        {"tokenId": 190088, "definition": {"make": "Chevrolet", "model": "Colorado", "year": 2024}}
      ]
    }
  }
}
```

**Données accessibles:**
- Véhicules connectés (make, model, year)
- Token IDs
- Données de télémétrie (API séparée)

---

### 3. Filecoin (✅)

**Endpoint:** `https://api.node.glif.io/rpc/v1`

**Test réussi:**
```bash
curl -X POST "https://api.node.glif.io/rpc/v1" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"Filecoin.ChainHead","params":[],"id":1}'
```

**Réponse:** Block height, timestamp, etc.

**Données accessibles:**
- Chain head
- État de la blockchain
- Infos des mineurs

**Note:** Trop complexe pour un projet simple - nécessite parsing RPC avancé

---

### 4. CoinGecko (✅)

**Endpoint:** `https://api.coingecko.com/api/v3`

**Prix DePIN actuels:**
```bash
curl "https://api.coingecko.com/api/v3/simple/price?ids=helium,render-token,filecoin,hivemapper,grass,dimo&vs_currencies=usd"
```

**Résultat:**
```json
{
  "dimo": {"usd": 0.011},
  "filecoin": {"usd": 0.93},
  "grass": {"usd": 0.18},
  "hivemapper": {"usd": 0.0035},
  "render-token": {"usd": 1.40},
  "helium": {"usd": 1.50}
}
```

---

## Classement pour Notre Projet

| # | Projet | Accessibilité | Complexité | Score |
|---|--------|---------------|------------|-------|
| 1 | **Helium** | ⭐⭐⭐⭐⭐ | ⭐⭐ | 7/10 |
| 2 | **DIMO** | ⭐⭐⭐⭐⭐ | ⭐⭐ | 7/10 |
| 3 | **CoinGecko** | ⭐⭐⭐⭐⭐ | ⭐ | 6/10 |
| 4 | **Filecoin** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 5/10 |
| 5 | **Render** | ⭐ | ⭐⭐⭐ | 2/10 |
| 6 | **Hivemapper** | ⭐ | ⭐⭐⭐ | 2/10 |
| 7 | **Grass** | ❌ | - | 0/10 |

---

## Recommandation

Pour un dashboard unifié DePIN, commencer avec:
1. **Helium** - Déjà implémenté
2. **DIMO** - API GraphQL simple
3. **Prix via CoinGecko** - Pour tous les tokens

Les autres (Render, Hivemapper, Grass) nécessitent soit:
- Un processus de whitelist (Render)
- Pas d'API publique (Grass, Hivemapper)
- Trop complexe (Filecoin)
