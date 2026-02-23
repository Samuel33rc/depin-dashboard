# Discord Notifications Setup

## Why Discord?
- Free
- Real-time notifications
- No other account needed

---

## Step 1: Create a Discord Server

1. Download Discord (or go to discord.com)
2. Click "+" to create a new server
3. Name the server (e.g., "DePIN Ops")
4. Done!

---

## Step 2: Create a Webhook

1. **Right-click** on server name → **Server Settings**
2. Left menu → **Integrations**
3. Click **Webhooks** → **New Webhook**
4. Configure:
   - **Name**: "Waitlist Alerts"
   - **Channel**: Choose a channel (or create #waitlist)
5. Click **Copy Webhook URL**
6. **Save this URL!** (it looks like:
   `https://discord.com/api/webhooks/123456789/abcdef...`)

---

## Step 3: Configure in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select project **depin-ops**
3. Click **Settings**
4. Left menu → **Environment Variables**
5. Click **Add New**
6. Fill in:
   - **Name**: `DISCORD_WEBHOOK_URL`
   - **Value**: Paste your webhook URL
   - **Environment**: Production
7. Click **Save**

---

## Step 4: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click on the latest deployment
3. Click **Redeploy** (to apply the environment variable)

---

## Result

When someone joins the waitlist:
- You'll receive a Discord message with email and time
- Data is also saved in `waitlist.json`

---

## Before Each Deployment

```bash
# 1. Backup current waitlist (replace with your Vercel URL)
curl -s https://depin-ops.vercel.app/api/waitlist > waitlist-backup.json

# 2. Push code
git push

# 3. After deployment, new signups will come to Discord
```

**Alternative: Automatic script**
```bash
./scripts/export-waitlist.sh
```

---

## Troubleshooting

**No notifications?**
- Check that webhook URL is correct
- Check that variable is set to "Production"
- Redeploy after adding the variable
