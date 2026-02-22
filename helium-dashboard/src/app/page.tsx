'use client';

import { useState, useEffect, useRef } from 'react';
import { getDashboardData } from '@/lib/helium-api';
import { getVehicleData } from '@/lib/dimo-api';

interface DashboardData {
  hntPrice: { usd: number };
  iotPrice: { usd: number };
  mobilePrice: { usd: number };
  heliumStats: { totalHotspots: number; activeHotspots: number };
  wallet?: {
    address: string;
    hotspotsCount: number;
    balances: { hnt: string; iot: string; mobile: string };
  };
  lastUpdated: string;
}

interface HistoricalDataPoint {
  timestamp: string;
  hntPrice: number;
  iotPrice: number;
  mobilePrice: number;
  totalValue: number;
}

interface DIMOData {
  totalVehicles: number;
  vehicles: Array<{
    tokenId: number;
    make: string;
    model: string;
    year: number;
  }>;
}

interface HotspotStatusData {
  walletAddress: string;
  totalHotspots: number;
  onlineHotspots: number;
  offlineHotspots: number;
  uptimePercentage: string;
  alertSent?: boolean;
  rewards?: {
    hnt: number;
    iot: number;
    mobile: number;
  };
}

export default function Home() {
  const [heliumWallet, setHeliumWallet] = useState('');
  const [dimoWallet, setDimoWallet] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [dimoData, setDimoData] = useState<DIMOData | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState<string>('');
  const [hotspotStatus, setHotspotStatus] = useState<HotspotStatusData | null>(null);
  const [checkingHotspots, setCheckingHotspots] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [history, setHistory] = useState<HistoricalDataPoint[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('depin-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (autoRefresh && data) {
      intervalRef.current = setInterval(() => {
        fetchData(false);
      }, refreshInterval * 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, refreshInterval, data]);

  const calculateWalletValue = () => {
    if (!data?.wallet) return 0;
    const { hnt, iot, mobile } = data.wallet.balances;
    return (
      parseFloat(hnt || '0') * data.hntPrice.usd +
      parseFloat(iot || '0') * data.iotPrice.usd +
      parseFloat(mobile || '0') * data.mobilePrice.usd
    );
  };

  const fetchData = async (saveHistory = true) => {
    setLoading(true);
    try {
      const dashboardData = await getDashboardData(heliumWallet || undefined);
      setData(dashboardData);

      if (dimoWallet) {
        const vehicleData = await getVehicleData(dimoWallet);
        setDimoData(vehicleData);
      }

      if (saveHistory && dashboardData) {
        const walletValue = calculateWalletValue();
        const newPoint: HistoricalDataPoint = {
          timestamp: new Date().toISOString(),
          hntPrice: dashboardData.hntPrice.usd,
          iotPrice: dashboardData.iotPrice.usd,
          mobilePrice: dashboardData.mobilePrice.usd,
          totalValue: walletValue || dashboardData.hntPrice.usd * 1000,
        };
        
        const updatedHistory = [...history, newPoint].slice(-50);
        setHistory(updatedHistory);
        localStorage.setItem('depin-history', JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const checkHotspots = async () => {
    if (!heliumWallet) {
      setAlertStatus('Please enter a Helium wallet address first');
      return;
    }

    setCheckingHotspots(true);
    setAlertStatus('Checking hotspot status...');

    try {
      const response = await fetch('/api/hotspots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: heliumWallet,
          botToken: telegramToken || undefined,
          chatId: telegramChatId || undefined,
          checkOffline: !!telegramToken && !!telegramChatId
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setHotspotStatus(result);
        if (result.alertSent) {
          setAlertStatus(`Alert sent! ${result.offlineHotspots} hotspots offline.`);
        } else {
          setAlertStatus(`Hotspots checked: ${result.onlineHotspots}/${result.totalHotspots} online`);
        }
      } else {
        setAlertStatus(`Error: ${result.error}`);
      }
    } catch {
      setAlertStatus('Error checking hotspots');
    }

    setCheckingHotspots(false);
  };

  const loadDemo = async () => {
    setHeliumWallet('7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV');
    setLoading(true);
    try {
      const dashboardData = await getDashboardData('7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV');
      setData(dashboardData);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const testTelegramAlert = async () => {
    if (!telegramToken || !telegramChatId) {
      setAlertStatus('Please enter both Telegram Token and Chat ID');
      return;
    }
    
    setAlertStatus('Sending test alert...');
    
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: telegramToken,
          chatId: telegramChatId,
          type: 'warning',
          title: 'DePIN Dashboard Test',
          message: 'Telegram alerts are configured correctly!'
        })
      });
      
      if (response.ok) {
        setAlertStatus('Test alert sent! Check your Telegram.');
      } else {
        setAlertStatus('Failed to send alert. Check your credentials.');
      }
    } catch {
      setAlertStatus('Error sending alert.');
    }
  };

  const exportToCSV = () => {
    if (!data && !dimoData) return;

    const vehicleRows = dimoData?.vehicles ? dimoData.vehicles.map(v => [v.tokenId, `${v.year} ${v.make} ${v.model}`]) : [];
    
    const rows = [
      ['DePIN Dashboard Export', new Date().toISOString()],
      [''],
      ['Token Prices'],
      ['Token', 'Price (USD)'],
      ['HNT', data?.hntPrice.usd.toFixed(2) || ''],
      ['IOT', data?.iotPrice.usd.toFixed(4) || ''],
      ['MOBILE', data?.mobilePrice.usd.toFixed(4) || ''],
      [''],
      ['Helium Network'],
      ['Metric', 'Value'],
      ['Total Hotspots', data?.heliumStats.totalHotspots || ''],
      ['Active Hotspots', data?.heliumStats.activeHotspots || ''],
      [''],
      ['DIMO'],
      ['Metric', 'Value'],
      ['Total Vehicles', dimoData?.totalVehicles || ''],
      ...vehicleRows,
    ];

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `depin-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] p-4 md:p-8 font-mono">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      <div className="max-w-5xl mx-auto relative">
        <header className="mb-12 border-b-2 border-[#ff6b35] pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-[#ff6b35] rounded-full animate-pulse"></div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-[#ff6b35]">//</span> DePIN OPS CENTER
            </h1>
          </div>
          <p className="text-[#666] text-sm ml-6">Decentralized Infrastructure Command</p>
        </header>

        <div className="grid gap-6 mb-8">
          <div className="bg-[#111] border border-[#333] p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#ff6b35]"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-[#ff6b35]">01</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#999]">Wallet Connection</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#666] mb-2 uppercase tracking-wide">
                  <span className="text-[#ff6b35]">⦿</span> Helium Wallet
                </label>
                <input
                  type="text"
                  value={heliumWallet}
                  onChange={(e) => setHeliumWallet(e.target.value)}
                  placeholder="Solana base58 address..."
                  className="w-full bg-[#0a0a0a] border border-[#333] px-4 py-3 text-sm text-[#e5e5e5] placeholder-[#444] focus:outline-none focus:border-[#ff6b35] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-[#666] mb-2 uppercase tracking-wide">
                  <span className="text-[#ff6b35]">⦿</span> DIMO Wallet
                </label>
                <input
                  type="text"
                  value={dimoWallet}
                  onChange={(e) => setDimoWallet(e.target.value)}
                  placeholder="0x... (Ethereum address)"
                  className="w-full bg-[#0a0a0a] border border-[#333] px-4 py-3 text-sm text-[#e5e5e5] placeholder-[#444] focus:outline-none focus:border-[#ff6b35] font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => fetchData(true)}
                  disabled={loading}
                  className="bg-[#ff6b35] hover:bg-[#ff8555] disabled:bg-[#444] text-black font-bold py-3 px-8 text-sm uppercase tracking-wider transition-colors"
                >
                  {loading ? '⟳ Loading' : '▶ Execute'}
                </button>
                <button
                  onClick={loadDemo}
                  disabled={loading}
                  className="border border-[#333] hover:border-[#ff6b35] text-[#666] hover:text-[#ff6b35] py-3 px-6 text-sm uppercase tracking-wider transition-colors"
                >
                  Demo Data
                </button>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`border ${autoRefresh ? 'border-[#00d4aa] text-[#00d4aa]' : 'border-[#333] text-[#666]'} hover:border-[#00d4aa] py-3 px-4 text-sm uppercase tracking-wider transition-colors`}
                >
                  {autoRefresh ? '◉ Live' : '○ Live'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-[#333] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#00d4aa]"></div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[#00d4aa]">02</span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#999]">Alert System</h3>
              </div>
              
              <div className="space-y-3">
                <input
                  type="password"
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  placeholder="Bot Token"
                  className="w-full bg-[#0a0a0a] border border-[#333] px-4 py-2 text-sm text-[#e5e5e5] placeholder-[#444] focus:outline-none focus:border-[#00d4aa] font-mono"
                />
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="Chat ID"
                  className="w-full bg-[#0a0a0a] border border-[#333] px-4 py-2 text-sm text-[#e5e5e5] placeholder-[#444] focus:outline-none focus:border-[#00d4aa] font-mono"
                />
                <button
                  onClick={testTelegramAlert}
                  className="w-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 hover:bg-[#00d4aa]/20 text-[#00d4aa] py-2 text-xs uppercase tracking-wider transition-colors"
                >
                  Test Connection
                </button>

                {alertStatus && (
                  <p className="text-xs text-[#666] pt-2 font-mono">→ {alertStatus}</p>
                )}
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#ffcc00]"></div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[#ffcc00]">03</span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#999]">Hotspot Monitor</h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={checkHotspots}
                  disabled={checkingHotspots || !heliumWallet}
                  className="w-full bg-[#ffcc00]/10 border border-[#ffcc00]/30 hover:bg-[#ffcc00]/20 text-[#ffcc00] py-2 text-xs uppercase tracking-wider transition-colors disabled:opacity-30"
                >
                  {checkingHotspots ? '⟳ Scanning...' : '◎ Scan Network'}
                </button>

                {hotspotStatus && (
                  <div className="space-y-2 pt-2 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-[#222]">
                      <span className="text-[#666]">Total Units</span>
                      <span className="text-[#e5e5e5]">{hotspotStatus.totalHotspots}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#222]">
                      <span className="text-[#666]">Online</span>
                      <span className="text-[#00d4aa]">{hotspotStatus.onlineHotspots}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#222]">
                      <span className="text-[#666]">Offline</span>
                      <span className="text-[#ff4444]">{hotspotStatus.offlineHotspots}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#666]">Uptime</span>
                      <span className="text-[#ffcc00]">{hotspotStatus.uptimePercentage}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {data && (
            <div className="bg-[#111] border border-[#333] p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs text-[#ff6b35]">04</span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#999]">Live Token Prices</h3>
                <span className="ml-auto text-xs text-[#444]">{data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : '--'}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0a0a0a] border border-[#222] p-4 text-center">
                  <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">HNT</p>
                  <p className="text-2xl font-bold text-[#ff6b35]">${data.hntPrice.usd.toFixed(2)}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#222] p-4 text-center">
                  <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">IOT</p>
                  <p className="text-2xl font-bold text-[#00d4aa]">${data.iotPrice.usd.toFixed(4)}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#222] p-4 text-center">
                  <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">MOBILE</p>
                  <p className="text-2xl font-bold text-[#a78bfa]">${data.mobilePrice.usd.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {data?.wallet && (
            <div className="bg-gradient-to-r from-[#ff6b35]/10 to-[#00d4aa]/10 border border-[#333] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[#ff6b35]">04b</span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#999]">Wallet Earnings</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0a0a0a] border border-[#222] p-3 text-center">
                  <p className="text-xs text-[#666] uppercase mb-1">HNT Balance</p>
                  <p className="text-lg font-bold text-[#ff6b35]">{parseFloat(data.wallet.balances.hnt || '0').toFixed(2)}</p>
                  <p className="text-xs text-[#444]">${(parseFloat(data.wallet.balances.hnt || '0') * data.hntPrice.usd).toFixed(2)}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#222] p-3 text-center">
                  <p className="text-xs text-[#666] uppercase mb-1">IOT Balance</p>
                  <p className="text-lg font-bold text-[#00d4aa]">{parseFloat(data.wallet.balances.iot || '0').toFixed(2)}</p>
                  <p className="text-xs text-[#444]">${(parseFloat(data.wallet.balances.iot || '0') * data.iotPrice.usd).toFixed(2)}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#222] p-3 text-center">
                  <p className="text-xs text-[#666] uppercase mb-1">MOBILE Balance</p>
                  <p className="text-lg font-bold text-[#a78bfa]">{parseFloat(data.wallet.balances.mobile || '0').toFixed(2)}</p>
                  <p className="text-xs text-[#444]">${(parseFloat(data.wallet.balances.mobile || '0') * data.mobilePrice.usd).toFixed(2)}</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#222] p-3 text-center">
                  <p className="text-xs text-[#666] uppercase mb-1">Total Value</p>
                  <p className="text-lg font-bold text-white">${calculateWalletValue().toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {history.length > 1 && (
            <div className="bg-[#111] border border-[#333] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[#a78bfa]">07</span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#999]">Price History</h3>
                <span className="ml-auto text-xs text-[#444]">{history.length} data points</span>
              </div>
              
              <div className="space-y-2">
                {history.slice(-5).reverse().map((point, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-[#222] text-xs font-mono">
                    <span className="text-[#666]">{new Date(point.timestamp).toLocaleString()}</span>
                    <div className="flex gap-4">
                      <span className="text-[#ff6b35]">HNT ${point.hntPrice.toFixed(2)}</span>
                      <span className="text-[#00d4aa]">${point.totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { setHistory([]); localStorage.removeItem('depin-history'); }}
                  className="text-xs text-[#666] hover:text-[#ff4444] uppercase tracking-wider"
                >
                  Clear History
                </button>
              </div>
            </div>
          )}

          {(data || dimoData) && (
            <div className="bg-[#111] border border-[#333] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#00d4aa]">05</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#999]">Fleet Overview</h3>
                </div>
                <button
                  onClick={exportToCSV}
                  className="text-xs text-[#666] hover:text-[#ff6b35] uppercase tracking-wider transition-colors"
                >
                  ↓ Export Data
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0a0a0a] border border-[#222] p-4 text-center">
                  <p className="text-3xl font-bold text-[#e5e5e5]">{data?.heliumStats.totalHotspots.toLocaleString() || '0'}</p>
                  <p className="text-[10px] text-[#666] uppercase tracking-wider mt-1">Hotspots</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#222] p-4 text-center">
                  <p className="text-3xl font-bold text-[#e5e5e5]">{dimoData?.totalVehicles || '0'}</p>
                  <p className="text-[10px] text-[#666] uppercase tracking-wider mt-1">Vehicles</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#222] p-4 text-center">
                  <p className="text-3xl font-bold text-[#00d4aa]">{data?.heliumStats.activeHotspots.toLocaleString() || '0'}</p>
                  <p className="text-[10px] text-[#666] uppercase tracking-wider mt-1">Online</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#222] p-4 text-center">
                  <p className="text-3xl font-bold text-[#ff4444]">{(data?.heliumStats.totalHotspots || 0) - (data?.heliumStats.activeHotspots || 0)}</p>
                  <p className="text-[10px] text-[#666] uppercase tracking-wider mt-1">Offline</p>
                </div>
              </div>
            </div>
          )}

          {dimoData && dimoData.vehicles.length > 0 && (
            <div className="bg-[#111] border border-[#333] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[#a78bfa]">06</span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#999]">DIMO Fleet</h3>
              </div>
              <div className="space-y-1">
                {dimoData.vehicles.map((vehicle) => (
                  <div key={vehicle.tokenId} className="flex justify-between items-center py-2 border-b border-[#222] last:border-0 font-mono text-sm">
                    <span className="text-[#e5e5e5]">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                    <span className="text-[#666]">#{vehicle.tokenId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#0a0a0a] border border-[#222] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00d4aa] rounded-full"></div>
              <span className="text-xs text-[#666] font-mono">SYSTEM ONLINE</span>
            </div>
            <span className="text-xs text-[#444] font-mono">Helium + DIMO</span>
          </div>
        </div>

        <footer className="mt-12 text-center text-[#333] text-xs font-mono">
          <p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
          <p className="mt-2">Decentralized Infrastructure Operations</p>
        </footer>
      </div>
    </div>
  );
}
