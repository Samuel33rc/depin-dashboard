import axios from 'axios';

const HELIUM_API = 'https://entities.nft.helium.io/v2';

export interface Hotspot {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'challenged';
  lastHeartbeat: number;
  rewardScale: number;
}

export interface HotspotCheckResult {
  walletAddress: string;
  totalHotspots: number;
  onlineHotspots: number;
  offlineHotspots: number;
  hotspots: Hotspot[];
}

interface HeliumApiHotspot {
  address?: string;
  id?: string;
  name?: string;
  status?: {
    online?: boolean;
    challenged?: boolean;
  };
  last_heartbeat?: number;
  reward_scale?: number;
}

export async function checkHotspotStatus(walletAddress: string): Promise<HotspotCheckResult | null> {
  if (!walletAddress) return null;

  try {
    const response = await axios.get(`${HELIUM_API}/wallet/${walletAddress}`);
    const data = response.data;

    const hotspots: Hotspot[] = (data.hotspots || []).map((h: HeliumApiHotspot) => ({
      id: h.address || h.id || '',
      name: h.name || h.address?.slice(0, 8) || 'Unknown',
      status: h.status?.online ? 'online' : h.status?.challenged ? 'challenged' : 'offline',
      lastHeartbeat: h.last_heartbeat || 0,
      rewardScale: h.reward_scale || 0,
    }));

    const onlineHotspots = hotspots.filter(h => h.status === 'online').length;
    const offlineHotspots = hotspots.filter(h => h.status === 'offline').length;

    return {
      walletAddress,
      totalHotspots: hotspots.length,
      onlineHotspots,
      offlineHotspots,
      hotspots,
    };
  } catch (error) {
    console.error('Error checking hotspot status:', error);
    return null;
  }
}

export function getOfflineHotspots(result: HotspotCheckResult): Hotspot[] {
  return result.hotspots.filter(h => h.status === 'offline');
}

export function calculateUptimePercentage(result: HotspotCheckResult): number {
  if (result.totalHotspots === 0) return 0;
  return (result.onlineHotspots / result.totalHotspots) * 100;
}
