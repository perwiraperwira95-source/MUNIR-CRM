
import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../App';
import { 
  Users, Crown, Zap, Moon, 
  MapPin, Phone, MessageSquare, 
  Mail, ExternalLink, TrendingUp,
  AlertCircle, ChevronRight, Star,
  Calendar
} from 'lucide-react';
import { Customer, Transaction } from '../types';

const CustomerInsight: React.FC = () => {
  const { customers, transactions } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState<'top' | 'loyal' | 'inactive'>('top');

  // Helper: Aggregate Customer Data
  const customerMetrics = useMemo(() => {
    const stats: { 
      [key: string]: { 
        id: string; 
        name: string; 
        phone: string; 
        address: string;
        totalSpending: number; 
        orderCount: number; 
        lastOrderDate: string | null;
      } 
    } = {};

    // Initialize with all customers
    customers.forEach(c => {
      stats[c.id] = {
        id: c.id,
        name: c.name,
        phone: c.phone,
        address: c.address,
        totalSpending: 0,
        orderCount: 0,
        lastOrderDate: null
      };
    });

    // Aggregate from transactions
    transactions.forEach(t => {
      if (t.customerId && stats[t.customerId]) {
        stats[t.customerId].totalSpending += t.total;
        stats[t.customerId].orderCount += 1;
        
        const tDate = new Date(t.createdAt);
        if (!stats[t.customerId].lastOrderDate || tDate > new Date(stats[t.customerId].lastOrderDate!)) {
          stats[t.customerId].lastOrderDate = t.createdAt;
        }
      }
    });

    return Object.values(stats);
  }, [customers, transactions]);

  // CATEGORY: TOP CUSTOMER (By Spending)
  const topCustomers = useMemo(() => {
    return [...customerMetrics]
      .filter(c => c.totalSpending > 0)
      .sort((a, b) => b.totalSpending - a.totalSpending)
      .slice(0, 10);
  }, [customerMetrics]);

  // CATEGORY: CUSTOMER ROYAL/LOYAL (By Frequency)
  const loyalCustomers = useMemo(() => {
    return [...customerMetrics]
      .filter(c => c.orderCount > 1)
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 10);
  }, [customerMetrics]);

  // CATEGORY: CUSTOMER TIDAK AKTIF (No order in > 30 days or 0 orders)
  const inactiveCustomers = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return [...customerMetrics].filter(c => {
      if (!c.lastOrderDate) return true; // Never ordered
      return new Date(c.lastOrderDate) < thirtyDaysAgo;
    });
  }, [customerMetrics]);

  const renderCustomerCard = (c: any, rank?: number) => (
    <div key={c.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all group flex items-center justify-between">
      <div className="flex items-center space-x-5">
        <div className="relative">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-xl text-slate-400 border border-white shadow-sm overflow-hidden uppercase">
            {c.name.charAt(0)}
          </div>
          {rank !== undefined && rank < 3 && (
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-400 border-4 border-white flex items-center justify-center shadow-lg">
              <Star size={14} className="text-white fill-white" />
            </div>
          )}
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-black text-slate-800 text-lg tracking-tight truncate group-hover:text-blue-900 transition-colors uppercase italic">{c.name}</h4>
            <div className={`w-2 h-2 rounded-full ${c.lastOrderDate && (new Date().getTime() - new Date(c.lastOrderDate).getTime() < 7 * 24 * 3600 * 1000) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <Phone size={10} className="mr-1 text-blue-500" />
              <span>{c.phone}</span>
            </div>
            <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden md:flex">
              <MapPin size={10} className="mr-1 text-emerald-500" />
              <span className="truncate max-w-[150px]">{c.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-right flex items-center space-x-8">
        <div className="hidden sm:block">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">Activity Level</p>
          <div className="flex space-x-1">
             {[...Array(5)].map((_, i) => (
               <div key={i} className={`w-3 h-1 rounded-full ${i < Math.min(5, c.orderCount) ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
             ))}
          </div>
        </div>

        <div className="text-right min-w-[120px]">
          {activeTab === 'top' && (
            <>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Contributor</p>
              <p className="text-xl font-black text-blue-900">Rp {c.totalSpending.toLocaleString()}</p>
            </>
          )}
          {activeTab === 'loyal' && (
            <>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Frequency</p>
              <p className="text-xl font-black text-emerald-600">{c.orderCount} Orders</p>
            </>
          )}
          {activeTab === 'inactive' && (
            <>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Last Seen</p>
              <p className="text-xs font-black text-slate-600 italic">
                {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'Never'}
              </p>
            </>
          )}
        </div>

        <div className="flex space-x-2">
           <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-900 hover:text-white transition-all shadow-sm">
              <Phone size={18} />
           </button>
           <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
              <MessageSquare size={18} />
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Hero Header */}
      <div className="relative h-64 luxury-gradient rounded-[40px] overflow-hidden flex flex-col items-center justify-center text-white shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-center space-y-4 px-6">
          <div className="bg-white/20 backdrop-blur-xl px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] border border-white/30 inline-block shadow-lg">
             Customer CRM Intelligence
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic drop-shadow-2xl">Elevate Every Relationship</h1>
          <p className="text-blue-100/70 font-medium max-w-xl mx-auto">
            Deep dive into your client database. Identify high-value patterns, reward loyalty, and re-engage dormant customers.
          </p>
        </div>
      </div>

      {/* Tabs / Filter Navigation */}
      <div className="flex space-x-4 bg-white p-2 rounded-[28px] shadow-sm border border-slate-100 max-w-2xl mx-auto -mt-12 relative z-20">
        <button 
          onClick={() => setActiveTab('top')}
          className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-[22px] transition-all duration-300 ${activeTab === 'top' ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Crown size={20} className={activeTab === 'top' ? 'text-amber-400' : ''} />
          <span className="text-sm font-black uppercase tracking-widest">Top Spend</span>
        </button>
        <button 
          onClick={() => setActiveTab('loyal')}
          className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-[22px] transition-all duration-300 ${activeTab === 'loyal' ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Zap size={20} className={activeTab === 'loyal' ? 'text-emerald-400' : ''} />
          <span className="text-sm font-black uppercase tracking-widest">Royal Clients</span>
        </button>
        <button 
          onClick={() => setActiveTab('inactive')}
          className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-[22px] transition-all duration-300 ${activeTab === 'inactive' ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Moon size={20} className={activeTab === 'inactive' ? 'text-blue-200' : ''} />
          <span className="text-sm font-black uppercase tracking-widest">Dormant</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Database</p>
            <p className="text-3xl font-black text-slate-800">{customers.length}</p>
         </div>
         <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-2">Retention Rate</p>
            <p className="text-3xl font-black text-emerald-700">82.4%</p>
         </div>
         <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-2">Active Recency</p>
            <p className="text-3xl font-black text-blue-800">14 Days</p>
         </div>
         <div className="bg-slate-900 p-6 rounded-[32px] border border-slate-800 shadow-sm flex flex-col items-center justify-center text-center text-white">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Growth Score</p>
            <p className="text-3xl font-black text-white">+18.2</p>
         </div>
      </div>

      {/* List Area */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <TrendingUp size={18} className="text-blue-900" />
            <h3 className="text-xl font-black text-slate-800 tracking-tight italic">
              {activeTab === 'top' && 'The Elite Spend Segment'}
              {activeTab === 'loyal' && 'The Loyalty Powerhouse'}
              {activeTab === 'inactive' && 'The Re-engagement Opportunity'}
            </h3>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {activeTab === 'top' && `${topCustomers.length} Records Found`}
            {activeTab === 'loyal' && `${loyalCustomers.length} Records Found`}
            {activeTab === 'inactive' && `${inactiveCustomers.length} Records Found`}
          </span>
        </div>

        <div className="space-y-4">
          {activeTab === 'top' && (
            topCustomers.length === 0 ? (
              <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center flex flex-col items-center">
                 <Users size={64} className="text-slate-200 mb-6" />
                 <p className="text-slate-400 font-bold italic">No spending data to generate elite rankings.</p>
              </div>
            ) : topCustomers.map((c, i) => renderCustomerCard(c, i))
          )}

          {activeTab === 'loyal' && (
            loyalCustomers.length === 0 ? (
              <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center flex flex-col items-center">
                 <Users size={64} className="text-slate-200 mb-6" />
                 <p className="text-slate-400 font-bold italic">No frequency data to generate loyalty rankings.</p>
              </div>
            ) : loyalCustomers.map((c) => renderCustomerCard(c))
          )}

          {activeTab === 'inactive' && (
            inactiveCustomers.length === 0 ? (
              <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center flex flex-col items-center">
                 <Zap size={64} className="text-emerald-300 mb-6" />
                 <p className="text-slate-400 font-bold italic">Exceptional retention! All clients are currently active.</p>
              </div>
            ) : inactiveCustomers.map((c) => renderCustomerCard(c))
          )}
        </div>
      </div>

      {/* Promotion Alert */}
      {activeTab === 'inactive' && inactiveCustomers.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom duration-700">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <AlertCircle size={32} />
              </div>
              <div>
                 <h4 className="text-2xl font-black text-slate-800 tracking-tight italic mb-1">Win-Back Strategy Recommended</h4>
                 <p className="text-slate-600 text-sm font-medium">These {inactiveCustomers.length} clients haven't shopped with us in over 30 days. Consider sending a 15% incentive.</p>
              </div>
           </div>
           <button className="whitespace-nowrap bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center space-x-3">
              <span>Execute Campaign</span>
              <ChevronRight size={18} />
           </button>
        </div>
      )}
    </div>
  );
};

export default CustomerInsight;
