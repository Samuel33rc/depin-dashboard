'use client';

import { useState } from 'react';
import { getDashboardData } from '@/lib/helium-api';
import { getVehicleData } from '@/lib/dimo-api';

interface DashboardData {
  hntPrice: { usd: number };
  iotPrice: { usd: number };
  mobilePrice: { usd: number };
  heliumStats: { totalHotspots: number; activeHotspots: number };
  lastUpdated: string;
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const dashboardData = await getDashboardData(heliumWallet || undefined);
      setData(dashboardData);

      if (dimoWallet) {
        const vehicleData = await getVehicleData(dimoWallet);
        setDimoData(vehicleData);
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
          message: 'Telegram alerts are configured correctly! ✅'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            DePIN Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Unified Multi-DePIN Overview</p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Connect Your Wallets</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Helium Wallet Address (optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={heliumWallet}
                  onChange={(e) => setHeliumWallet(e.target.value)}
                  placeholder="Enter Helium wallet address"
                  className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">DIMO Wallet Address (optional)</label>
              <input
                type="text"
                value={dimoWallet}
                onChange={(e) => setDimoWallet(e.target.value)}
                placeholder="Enter DIMO wallet address (0x...)"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchData}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Loading...' : 'Get Data'}
              </button>
              <button
                onClick={loadDemo}
                disabled={loading}
                className="bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Load Demo
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Telegram Alerts (Optional)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Telegram Bot Token</label>
              <input
                type="password"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="Enter your Telegram bot token"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Telegram Chat ID</label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Enter your Telegram chat ID"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={testTelegramAlert}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Test Alert
            </button>

            {alertStatus && (
              <p className="text-sm text-slate-400">{alertStatus}</p>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Hotspot Monitor</h3>
          
          <div className="space-y-4">
            <button
              onClick={checkHotspots}
              disabled={checkingHotspots || !heliumWallet}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {checkingHotspots ? 'Checking...' : 'Check Hotspot Status'}
            </button>

            {hotspotStatus && (
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">Total Hotspots</span>
                  <span className="font-medium">{hotspotStatus.totalHotspots}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">Online</span>
                  <span className="font-medium text-green-400">{hotspotStatus.onlineHotspots}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">Offline</span>
                  <span className="font-medium text-red-400">{hotspotStatus.offlineHotspots}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Uptime</span>
                  <span className="font-medium">{hotspotStatus.uptimePercentage}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
              HNT Price
            </h3>
            <p className="text-3xl font-bold text-cyan-400">
              ${data?.hntPrice.usd.toFixed(2) || '--'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Helium Token</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
              IOT Price
            </h3>
            <p className="text-3xl font-bold text-green-400">
              ${data?.iotPrice.usd.toFixed(4) || '--'}
            </p>
            <p className="text-xs text-slate-500 mt-1">IoT Subnet</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
              MOBILE Price
            </h3>
            <p className="text-3xl font-bold text-purple-400">
              ${data?.mobilePrice.usd.toFixed(4) || '--'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Mobile Subnet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
              Helium Hotspots
            </h3>
            <p className="text-2xl font-bold text-white">
              {data?.heliumStats.totalHotspots.toLocaleString() || '--'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Active: {data?.heliumStats.activeHotspots.toLocaleString() || '--'}
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
              DIMO Vehicles
            </h3>
            <p className="text-2xl font-bold text-white">
              {dimoData?.totalVehicles || '--'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Connected vehicles</p>
          </div>
        </div>

        {dimoData && dimoData.vehicles.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Your DIMO Vehicles</h3>
            <div className="space-y-2">
              {dimoData.vehicles.map((vehicle) => (
                <div key={vehicle.tokenId} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                  <span className="text-white">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                  <span className="text-slate-400 text-sm">Token #{vehicle.tokenId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Network Status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">Last Updated</span>
              <span className="text-slate-300">
                {data ? new Date(data.lastUpdated).toLocaleTimeString() : '--'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Status</span>
              <span className="text-green-400">● Active</span>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>DePIN Dashboard • Helium + DIMO • Built with Next.js</p>
        </footer>
      </div>
    </div>
  );
}
