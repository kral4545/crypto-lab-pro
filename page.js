import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Wallet, BookOpen, ShieldCheck, TrendingUp } from 'lucide-react';

// --- AYARLAR ---
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
const STARTING_BALANCE = 10000;

export default function CryptoLab() {
  const [user, setUser] = useState({ id: '1', name: 'Sen', isAdmin: true, balance: 10000 });
  const [btcPrice, setBtcPrice] = useState(0);
  const [activeTab, setActiveTab] = useState('trading');
  const [allUsers, setAllUsers] = useState([]); // Sadece Admin görebilir

  // 1. CANLI VERİ MOTORU (Binance WebSocket - Ücretsiz)
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBtcPrice(parseFloat(data.p).toFixed(2));
    };
    return () => ws.close();
  }, []);

  // 2. HAYALET İŞLEM FONKSİYONU
  const handleTrade = (type) => {
    const amount = 1000; // Örnek: Her tıkta 1000$'lık işlem
    if (type === 'BUY' && user.balance >= amount) {
      setUser({ ...user, balance: user.balance - amount });
      alert(`$${btcPrice} fiyattan BTC alındı!`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* ÜST BAR */}
      <nav className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-950">
        <h1 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
          <TrendingUp /> CRYPTO-LAB
        </h1>
        <div className="flex gap-6 items-center">
          <span className="text-green-400 font-mono">BTC: ${btcPrice}</span>
          <div className="bg-slate-800 px-4 py-1 rounded-full flex items-center gap-2">
            <Wallet size={16} /> ${user.balance.toLocaleString()}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* SOL MENÜ */}
        <aside className="w-64 border-r border-slate-800 h-[calc(100vh-64px)] p-4 space-y-4">
          <button onClick={() => setActiveTab('trading')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg"><LineChart /> Demo Trading</button>
          <button onClick={() => setActiveTab('education')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg"><BookOpen /> Eğitimler</button>
          {user.isAdmin && (
            <button onClick={() => setActiveTab('admin')} className="w-full flex items-center gap-3 p-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg"><ShieldCheck /> Admin Paneli</button>
          )}
        </aside>

        {/* ANA ALAN */}
        <main className="flex-1 p-8">
          {activeTab === 'trading' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-slate-800 h-96 rounded-xl border border-slate-700 flex items-center justify-center">
                 {/* Buraya TradingView Chart Gelecek */}
                 <p className="text-slate-500 italic">Grafik Yükleniyor (Sadece BTC & ETH)...</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                <h2 className="text-lg font-bold">Hızlı İşlem</h2>
                <button onClick={() => handleTrade('BUY')} className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold">AL (BUY)</button>
                <button onClick={() => handleTrade('SELL')} className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-lg font-bold">SAT (SELL)</button>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Ders 1: Mum Grafikleri</h2>
                <p className="text-slate-300">Trading dünyasına hoş geldin! İlk kural: Yeşil yükseliş, Kırmızı düşüştür...</p>
                <button className="mt-4 px-6 py-2 bg-yellow-600 rounded-lg">Sınava Gir</button>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-red-400">Yönetici Paneli</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="p-2">Kullanıcı</th>
                    <th className="p-2">Bakiye</th>
                    <th className="p-2">İlerleme</th>
                    <th className="p-2">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">Ahmet_Trading</td>
                    <td className="p-2 text-green-400">$12,400</td>
                    <td className="p-2">3/5 Ders</td>
                    <td className="p-2"><button className="text-xs bg-slate-700 px-2 py-1 rounded">İzle</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
           }
