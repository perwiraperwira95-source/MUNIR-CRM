
import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../App';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Calendar, TrendingUp, Users, Package, 
  ArrowUpRight, ArrowDownRight, DollarSign,
  Activity, ShoppingBag
} from 'lucide-react';
import { Transaction, Product, Customer } from '../types';

const COLORS = ['#1e3a8a', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Reports: React.FC = () => {
  const { transactions, products, customers } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState<'time' | 'products' | 'customers'>('time');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Filter transactions based on selected range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.createdAt);
      if (timeRange === 'daily') {
        return tDate.toDateString() === now.toDateString();
      } else if (timeRange === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return tDate >= weekAgo;
      } else {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return tDate >= monthAgo;
      }
    });
  }, [transactions, timeRange]);

  // Aggregate data for Time Chart
  const timeChartData = useMemo(() => {
    const groups: { [key: string]: number } = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.createdAt);
      let label = '';
      if (timeRange === 'daily') {
        label = date.getHours() + ':00';
      } else {
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      groups[label] = (groups[label] || 0) + t.total;
    });

    return Object.entries(groups).map(([name, total]) => ({ name, total }));
  }, [filteredTransactions, timeRange]);

  // Aggregate Best Selling Products
  const bestSellingData = useMemo(() => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    transactions.forEach(t => {
      t.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.quantity * item.price;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [transactions]);

  // Aggregate Customer Spending
  const customerSpendingData = useMemo(() => {
    const spending: { [key: string]: { name: string; total: number; count: number } } = {};
    transactions.forEach(t => {
      if (t.customerId) {
        if (!spending[t.customerId]) {
          spending[t.customerId] = { name: t.customerName || 'Unknown', total: 0, count: 0 };
        }
        spending[t.customerId].total += t.total;
        spending[t.customerId].count += 1;
      }
    });

    return Object.values(spending)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [transactions]);

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = filteredTransactions.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Business Intelligence</h1>
          <p className="text-slate-400 font-medium mt-1">Real-time performance metrics and sales analytics.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('time')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'time' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sales Trends
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Best Sellers
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'customers' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Top Clients
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={14} className="mr-1" />
              <span>+12.5%</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Revenue</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">Rp {totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <ShoppingBag size={24} />
            </div>
            <div className="flex items-center text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={14} className="mr-1" />
              <span>+5.2%</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Orders</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{totalOrders} Orders</h3>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-amber-200 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <div className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-lg">
              <ArrowDownRight size={14} className="mr-1" />
              <span>-2.1%</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Avg Transaction</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">Rp {Math.round(avgOrderValue).toLocaleString()}</h3>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        {activeTab === 'time' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Sales Over Time</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Revenue performance by period</p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                {(['daily', 'weekly', 'monthly'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${timeRange === range ? 'bg-white text-blue-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeChartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
                    tickFormatter={(value) => `Rp ${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="total" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Best Selling Products</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">High-demand inventory performance</p>
              </div>
              <div className="space-y-4">
                {bestSellingData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-blue-100">
                    <div className="w-10 h-10 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-800 uppercase tracking-tighter">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity} Units Sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-blue-900">Rp {item.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[400px] flex flex-col items-center justify-center">
               <ResponsiveContainer width="100%" height={300}>
                 <PieChart>
                    <Pie
                      data={bestSellingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="quantity"
                    >
                      {bestSellingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '20px', fontWeight: 'bold', fontSize: '10px'}} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="text-center mt-4">
                 <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Share of Qty Sold</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Client Loyalty Ranking</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Top spending premium clients</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Revenue contribution</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerSpendingData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#1e293b', fontSize: 10, fontWeight: 'black', width: 60}}
                          width={80}
                        />
                        <Tooltip 
                           contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="total" fill="#1e3a8a" radius={[0, 10, 10, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Client Details</h4>
                  {customerSpendingData.map((cust, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                       <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center font-black">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-black text-slate-800">{cust.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cust.count} Visits</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-blue-900">Rp {cust.total.toLocaleString()}</p>
                          <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Premium Member</p>
                       </div>
                    </div>
                  ))}
                  {customerSpendingData.length === 0 && (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-300 italic text-sm">
                       <Users size={48} className="mb-4 opacity-20" />
                       <p>No customer transaction data available.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
