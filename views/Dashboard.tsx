
import React, { useContext } from 'react';
import { StoreContext } from '../App';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  DollarSign, ShoppingCart, Users, Package, 
  ArrowUpRight, ArrowDownRight, TrendingUp,
  // Fix: Added missing AlertCircle import
  AlertCircle 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { transactions, products } = useContext(StoreContext);

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalSales = transactions.length;
  const lowStockProducts = products.filter(p => p.stock < 10);
  
  // Chart Data
  const salesByDay = transactions.reduce((acc: any[], t) => {
    const day = new Date(t.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
    const existing = acc.find(item => item.day === day);
    if (existing) existing.amount += t.total;
    else acc.push({ day, amount: t.total });
    return acc;
  }, []);

  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) existing.value++;
    else acc.push({ name: p.category, value: 1 });
    return acc;
  }, []);

  const COLORS = ['#1e3a8a', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend: number, color: string }> = ({ title, value, icon, trend, color }) => (
    <div className="bg-white p-6 rounded-3xl luxury-card border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
          {icon}
        </div>
        <div className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`Rp ${totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          trend={12} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Orders" 
          value={totalSales.toString()} 
          icon={<ShoppingCart size={24} />} 
          trend={8} 
          color="bg-emerald-500"
        />
        <StatCard 
          title="Total Products" 
          value={products.length.toString()} 
          icon={<Package size={24} />} 
          trend={3} 
          color="bg-amber-500"
        />
        <StatCard 
          title="Avg. Transaction" 
          value={`Rp ${(totalSales ? totalRevenue / totalSales : 0).toLocaleString()}`} 
          icon={<TrendingUp size={24} />} 
          trend={-2} 
          color="bg-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl luxury-card border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Revenue Analysis</h3>
            <select className="bg-slate-50 border-none text-sm font-bold text-slate-500 rounded-xl px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  cursor={{stroke: '#1e3a8a', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="amount" stroke="#1e3a8a" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white p-8 rounded-3xl luxury-card border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Inventory Mix</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  <span className="font-medium text-slate-600">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-800">{cat.value} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Alerts & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl luxury-card border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={24} />
            <span>Low Stock Alerts</span>
          </h3>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-slate-400 text-sm italic">All inventory levels are healthy.</p>
            ) : (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center space-x-4">
                    <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt={p.name} />
                    <div>
                      <h4 className="font-bold text-slate-800">{p.name}</h4>
                      <p className="text-xs font-medium text-slate-500">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-black text-lg">{p.stock}</p>
                    <p className="text-[10px] uppercase font-bold text-red-400">Items left</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl luxury-card border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {t.cashierName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">#{t.id.slice(-6)}</h4>
                    <p className="text-xs font-medium text-slate-500">{new Date(t.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-800">Rp {t.total.toLocaleString()}</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-500">{t.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
