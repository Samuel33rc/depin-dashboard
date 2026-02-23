# Setup Discord Notifications

## Pourquoi Discord?
- Gratuit
- Notifications en temps réel
- Pas besoin d'autre compte

---

## Étape 1: Créer un serveur Discord

1. Télécharger Discord (ou aller sur discord.com)
2. Clic sur "+" pour créer un nouveau serveur
3. Nommer le serveur (ex: "DePIN Ops")
4. C'est fait!

---

## Étape 2: Créer un Webhook

1. **Clic droit** sur le nom du serveur (dans la liste des salons) → **Server Settings**
2. Menu gauche → **Integrations**
3. Clic sur **Webhooks** → **New Webhook**
4. Configurer:
   - **Name**: "Waitlist Alerts"
   - **Channel**: Choisir un salon (ou créer un salon #waitlist)
5. Clic sur **Copy Webhook URL**
6. **Sauvegarder cette URL quelque part!** (elle ressemble à:
   `https://discord.com/api/webhooks/123456789/abcdef...`)

---

## Étape 3: Configurer sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner le projet **depin-ops**
3. Cliquer sur **Settings** (en haut)
4. Menu gauche → **Environment Variables**
5. Clic sur **Add New**
6. Remplir:
   - **Name**: `DISCORD_WEBHOOK_URL`
   - **Value**: Coller l'URL du webhook copiée
   - **Environment**: Production
7. Clic sur **Save**

---

## Étape 4: Redéployer

1. Aller sur l'onglet **Deployments** dans Vercel
2. Clic sur le dernier déploiement
3. Clic sur **Redeploy** (pour prendre en compte la variable d'environnement)

---

## Résultat

Quand quelqu'un rejoint la waitlist:
- Tu reçevras un message Discord avec l'email et l'heure
- Les données sont aussi sauvegardées dans `waitlist.json`

---

## Avant chaque déploiement

```bash
# 1. Sauvegarder la waitlist actuelle (remplacer par ton URL Vercel)
curl -s https://depin-ops.vercel.app/api/waitlist > waitlist-backup.json

# 2. Pusher le code
git push

# 3. Après déploiement, les nouvelles inscriptions arrivent sur Discord
```

**Alternative: Script automatique**
```bash
./scripts/export-waitlist.sh
```

---

## Dépannage

**Pas de notifications?**
- Vérifier que l'URL du webhook est correcte
- Vérifier que la variable est bien en "Production"
- Redeployer après ajout de la variable
