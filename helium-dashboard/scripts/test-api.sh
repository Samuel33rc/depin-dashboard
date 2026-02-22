#!/bin/bash

echo "==================================="
echo "Helium Dashboard - API Tests"
echo "==================================="

echo ""
echo "Test 1: CoinGecko API (HNT Price)"
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=helium&vs_currencies=usd"
echo ""

echo ""
echo "Test 2: Helium Wallet API (Solana format)"
curl -s "https://entities.nft.helium.io/v2/wallet/7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV"
echo ""

echo ""
echo "Test 3: Invalid address format"
curl -s "https://entities.nft.helium.io/v2/wallet/invalid123"
echo ""

echo ""
echo "Test 4: IOT Token Price"
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=helium-iot&vs_currencies=usd"
echo ""

echo ""
echo "Test 5: Mobile Token Price"
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=mobile-token&vs_currencies=usd"
echo ""

echo "==================================="
echo "Tests completed"
echo "==================================="
