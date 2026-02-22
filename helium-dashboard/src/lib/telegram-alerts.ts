const TELEGRAM_API = 'https://api.telegram.org';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface AlertMessage {
  type: 'offline' | 'online' | 'reward' | 'warning';
  title: string;
  message: string;
  timestamp?: string;
}

export async function sendTelegramAlert(
  config: TelegramConfig,
  alert: AlertMessage
): Promise<boolean> {
  try {
    const emoji = {
      offline: '🔴',
      online: '🟢',
      reward: '💰',
      warning: '⚠️'
    }[alert.type] || '📢';

    const message = `
${emoji} *${alert.title}*

${alert.message}

_Time: ${alert.timestamp || new Date().toISOString()}_
    `.trim();

    const response = await fetch(
      `${TELEGRAM_API}/bot${config.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      }
    );

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error('Error sending Telegram alert:', error);
    return false;
  }
}

export async function checkHeliumHotspotStatus(
  walletAddress: string,
  config: TelegramConfig
): Promise<void> {
  try {
    const response = await fetch(
      `https://entities.nft.helium.io/v2/wallet/${walletAddress}`
    );
    
    const data = await response.json();
    const hotspots = data.hotspots || [];
    const offlineHotspots = hotspots.filter((h: { status?: { online?: boolean } }) => h.status?.online !== true);
    
    if (offlineHotspots.length > 0) {
      await sendTelegramAlert(config, {
        type: 'offline',
        title: 'Hotspot Offline Alert',
        message: `${offlineHotspots.length} hotspot(s) offline for wallet ${walletAddress.slice(0, 8)}...`
      });
    }
  } catch (error) {
    console.error('Error checking hotspot status:', error);
  }
}

export function createAlertScheduler(
  config: TelegramConfig,
  wallets: string[],
  checkIntervalMs: number = 3600000
): NodeJS.Timeout {
  return setInterval(() => {
    wallets.forEach(wallet => {
      checkHeliumHotspotStatus(wallet, config);
    });
  }, checkIntervalMs);
}
