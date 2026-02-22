const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const HELIUM_API = 'https://entities.nft.helium.io/v2';

export interface HeliumStats {
  totalHotspots: number;
  blockHeight?: number;
  activeHotspots: number;
}

export interface HeliumWallet {
  address: string;
  hotspotsCount: number;
  balances: {
    hnt: string;
    iot: string;
    mobile: string;
  };
}

export interface TokenPrice {
  usd: number;
  eur?: number;
}

export interface DashboardData {
  hntPrice: TokenPrice;
  iotPrice: TokenPrice;
  mobilePrice: TokenPrice;
  heliumStats: HeliumStats;
  wallet?: HeliumWallet;
  lastUpdated: string;
}

export function isValidSolanaAddress(address: string): boolean {
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaAddressRegex.test(address);
}

export async function getTokenPrices(): Promise<{ hnt: TokenPrice; iot: TokenPrice; mobile: TokenPrice }> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=helium,helium-iot,mobile-token&vs_currencies=usd`
    );
    const data = await response.json();
    
    return {
      hnt: { usd: data.helium?.usd || 0 },
      iot: { usd: data['helium-iot']?.usd || 0 },
      mobile: { usd: data['mobile-token']?.usd || 0 },
    };
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {
      hnt: { usd: 1.49 },
      iot: { usd: 0.01 },
      mobile: { usd: 0.02 },
    };
  }
}

export async function getHeliumStats(): Promise<HeliumStats> {
  try {
    const [iotResponse, mobileResponse] = await Promise.all([
      fetch(`${HELIUM_API}/hotspots/pagination-metadata?subnetwork=iot`),
      fetch(`${HELIUM_API}/hotspots/pagination-metadata?subnetwork=mobile`),
    ]);

    const iotData = await iotResponse.json();
    const mobileData = await mobileResponse.json();

    const iotHotspots = iotData.totalItems || 0;
    const mobileHotspots = mobileData.totalItems || 0;

    return {
      totalHotspots: iotHotspots + mobileHotspots,
      blockHeight: 0,
      activeHotspots: Math.floor((iotHotspots + mobileHotspots) * 0.4),
    };
  } catch (error) {
    console.error('Error fetching Helium stats:', error);
    return {
      totalHotspots: 1034455,
      blockHeight: 0,
      activeHotspots: 400000,
    };
  }
}

export async function getWalletData(walletAddress: string): Promise<HeliumWallet | null> {
  if (!isValidSolanaAddress(walletAddress)) {
    console.error('Invalid Solana address:', walletAddress);
    return null;
  }

  try {
    const response = await fetch(`${HELIUM_API}/wallet/${walletAddress}`);
    const data = await response.json();

    const getBalance = (mint: string) => {
      const balance = data.balances?.find((b: { mint: string; balance: string }) => b.mint === mint);
      return balance?.balance || '0';
    };

    return {
      address: walletAddress,
      hotspotsCount: data.hotspots_count || 0,
      balances: {
        hnt: getBalance('hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux'),
        iot: getBalance('iotEVVZLEywoTn1QdwNPddxPWszn3zFhEot3MfL9fns'),
        mobile: getBalance('mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6'),
      },
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return null;
  }
}

export async function getDashboardData(walletAddress?: string): Promise<DashboardData> {
  const [prices, stats, wallet] = await Promise.all([
    getTokenPrices(),
    getHeliumStats(),
    walletAddress ? getWalletData(walletAddress) : Promise.resolve(null),
  ]);

  return {
    hntPrice: prices.hnt,
    iotPrice: prices.iot,
    mobilePrice: prices.mobile,
    heliumStats: stats,
    wallet: wallet || undefined,
    lastUpdated: new Date().toISOString(),
  };
}
