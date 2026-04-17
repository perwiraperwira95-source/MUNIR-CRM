
import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../App';
import { 
  Gift, Star, Crown, Shield, 
  TrendingUp, Award, Coins, ChevronRight,
  User as UserIcon, Zap, Search,
  ArrowUpRight
} from 'lucide-react';
import { Customer } from '../types';

const Loyalty: React.FC = () => {
  const { customers } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Silver' | 'Gold' | 'Platinum'>('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
      const matchesLevel = selectedCategory === 'all' || c.level === selectedCategory;
      return matchesSearch && matchesLevel;
    }).sort((a, b) => b.points - a.points);
  }, [customers, searchTerm, selectedCategory]);

  const levelConfig = {
    Bronze: { icon: <Shield size={16} />, color: 'bg-slate-400', textColor: 'text-slate-600', bg: 'bg-slate-50', next: 'Silver', threshold: 1000 },
    Silver: { icon: <Star size={16} />, color: 'bg-blue-400', textColor: 'text-blue-600', bg: 'bg-blue-50', next: 'Gold', threshold: 5000 },
    Gold: { icon: <Crown size={16} />, color: 'bg-amber-400', textColor: 'text-amber-600', bg: 'bg-amber-50', next: 'Platinum', threshold: 10000 },
    Platinum: { icon: <Award size={16} />, color: 'bg-purple-500', textColor: 'text-purple-600', bg: 'bg-purple-50', next: 'Max', threshold: 10000 }
  };

  const rewards = [
    { id: '1', name: 'Free Black Coffee', points: 200, icon: '☕' },
    { id: '2', name: '10% OFF Voucher', points: 500, icon: '🎫' },
    { id: '3', name: 'Munir Signature Steak', points: 1500, icon: '🥩' },
    { id: '4', name: 'Premium Member Kit', points: 5000, icon: '🎁' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex items-center space-x-6">
           <div className="w-16 h-16 luxury-gradient rounded-[22px] flex items-center justify-center text-white shadow-xl">
             <Gift size={32} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Elite Membership</h1>
              <p className="text-slate-400 font-medium">Manage loyalty tiers and point distribution.</p>
           </div>
        </div>
        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
           <div className="text-right pr-4 border-r border-slate-200">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Global Pts</p>
              <p className="text-xl font-black text-blue-900">{customers.reduce((sum, c) => sum + (c.points || 0), 0).toLocaleString()}</p>
           </div>
           <div className="pl-2">
              <button className="p-3 bg-white rounded-xl shadow-sm text-blue-600 hover:bg-blue-900 hover:text-white transition-all">
                <TrendingUp size={20} />
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Points List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                 <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center italic">
                   <Coins size={24} className="mr-3 text-amber-500" />
                   Customer Points Leaderboard
                 </h3>
                 <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Find client..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-bold outline-none focus:border-blue-300"
                    />
                 </div>
              </div>

              <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {(['all', 'Silver', 'Gold', 'Platinum'] as const).map(lev => (
                  <button
                    key={lev}
                    onClick={() => setSelectedCategory(lev)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === lev ? 'bg-blue-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {lev}
                  </button>
                ))}
              </div>

              <div className="space-y-4 flex-1">
                 {filteredCustomers.map((c, i) => {
                    const config = levelConfig[c.level as keyof typeof levelConfig];
                    const progress = Math.min(100, (c.points / config.threshold) * 100);
                    
                    return (
                      <div key={c.id} className="p-5 bg-white border border-slate-50 rounded-3xl flex items-center justify-between group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all">
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 uppercase">
                               {c.name.charAt(0)}
                            </div>
                            <div>
                               <div className="flex items-center space-x-2">
                                  <p className="font-black text-slate-800 uppercase tracking-tighter truncate max-w-[120px]">{c.name}</p>
                                  <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${config.bg} ${config.textColor} text-[8px] font-black uppercase tracking-widest`}>
                                     {config.icon}
                                     <span>{c.level}</span>
                                  </div>
                               </div>
                               <p className="text-[10px] text-slate-400 font-bold mt-0.5">{c.phone}</p>
                            </div>
                         </div>

                         <div className="flex-1 max-w-[200px] mx-8 hidden md:block">
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1">
                               <span>PROGRESS to {config.next}</span>
                               <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                               <div 
                                 className={`h-full ${config.color} transition-all duration-1000`} 
                                 style={{ width: `${progress}%` }}
                               ></div>
                            </div>
                         </div>

                         <div className="text-right flex items-center space-x-6">
                            <div className="text-right">
                               <p className="text-xl font-black text-blue-900 tracking-tighter">{c.points.toLocaleString()}</p>
                               <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">Loyalty Points</p>
                            </div>
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-900 hover:text-white transition-all">
                               <ChevronRight size={18} />
                            </button>
                         </div>
                      </div>
                    );
                 })}
                 {filteredCustomers.length === 0 && (
                   <div className="h-64 flex flex-col items-center justify-center text-slate-300 italic border border-dashed border-slate-100 rounded-[32px]">
                      <Search size={48} className="mb-4 opacity-10" />
                      <p>No membership data found.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Tier Info & Rewards */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              <h3 className="text-xl font-black italic tracking-tight flex items-center uppercase">
                <Zap size={20} className="mr-2 text-blue-400" />
                Tier Benefits
              </h3>
              <div className="space-y-4 relative z-10">
                 {Object.entries(levelConfig).map(([name, conf]) => (
                   <div key={name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center space-x-3">
                         <div className={`w-8 h-8 ${conf.color} rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/50`}>
                            {conf.icon}
                         </div>
                         <p className="font-black uppercase tracking-tighter">{name}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest">Entry</p>
                         <p className="text-sm font-black italic">{conf.threshold.toLocaleString()}+ PT</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Point Rewards</h3>
                 <div className="w-8 h-8 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shadow-inner">
                    <Star size={16} />
                 </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                 {rewards.map(r => (
                   <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all group cursor-pointer">
                      <div className="flex justify-between items-center mb-1">
                         <div className="flex items-center space-x-3">
                            <span className="text-2xl">{r.icon}</span>
                            <p className="font-black text-xs text-slate-800 uppercase tracking-tighter">{r.name}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-blue-900">{r.points} PT</p>
                         </div>
                      </div>
                      <div className="flex items-center text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                         <ArrowUpRight size={10} className="mr-1" />
                         <span>Available to redeem</span>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full p-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">
                 View Historical Redemptions
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
