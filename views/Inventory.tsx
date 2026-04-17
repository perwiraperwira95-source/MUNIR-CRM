
import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../App';
import { 
  Boxes, History as HistoryIcon, Bell, 
  Search, Plus, Minus, ArrowUp, ArrowDown,
  AlertTriangle, CheckCircle2, ChevronRight,
  Filter, Calendar
} from 'lucide-react';
import { StockMovement, Product } from '../types';

const Inventory: React.FC = () => {
  const { products, stockHistory, updateProduct } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState<'status' | 'history'>('status');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filter === 'all' || 
        (filter === 'low' && p.stock > 0 && p.stock <= 10) || 
        (filter === 'out' && p.stock === 0);
      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, filter]);

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState('');

  const handleStockAdjust = (type: 'IN' | 'OUT') => {
    if (!adjustingProduct) return;
    const newStock = type === 'IN' 
      ? adjustingProduct.stock + adjustAmount 
      : Math.max(0, adjustingProduct.stock - adjustAmount);
    
    updateProduct({ ...adjustingProduct, stock: newStock }, adjustReason || `Manual ${type} adjustment`);
    setAdjustingProduct(null);
    setAdjustAmount(1);
    setAdjustReason('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 animate-in zoom-in slide-in-from-bottom-10 duration-500 shadow-2xl space-y-8 border border-slate-100">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Adjust Stock</h3>
               <button 
                 onClick={() => setAdjustingProduct(null)}
                 className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
               >
                 <Plus className="rotate-45" size={20} />
               </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-3xl flex items-center space-x-4">
               <img src={adjustingProduct.image} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" alt="" />
               <div>
                  <p className="font-black text-slate-800 uppercase tracking-tighter">{adjustingProduct.name}</p>
                  <p className="text-xs font-bold text-slate-400">Current Stock: {adjustingProduct.stock}</p>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">Quantity to Adjust</label>
                  <div className="flex items-center justify-center space-x-6">
                    <button 
                      onClick={() => setAdjustAmount(Math.max(1, adjustAmount - 1))}
                      className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      <Minus size={24} />
                    </button>
                    <span className="text-4xl font-black text-blue-900 w-20 text-center">{adjustAmount}</span>
                    <button 
                      onClick={() => setAdjustAmount(adjustAmount + 1)}
                      className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjustment Note</label>
                 <input 
                   type="text" 
                   placeholder="E.g. Restock, Damaged Goods..."
                   value={adjustReason}
                   onChange={e => setAdjustReason(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4">
                 <button 
                   onClick={() => handleStockAdjust('OUT')}
                   className="py-5 bg-red-50 text-red-600 border border-red-100 rounded-[22px] font-black uppercase text-xs tracking-widest flex flex-col items-center space-y-2 hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-900/5 active:scale-95"
                 >
                   <ArrowDown size={20} />
                   <span>Remove Stock</span>
                 </button>
                 <button 
                   onClick={() => handleStockAdjust('IN')}
                   className="py-5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[22px] font-black uppercase text-xs tracking-widest flex flex-col items-center space-y-2 hover:bg-emerald-600 hover:text-white transition-all shadow-xl shadow-emerald-900/5 active:scale-95"
                 >
                   <ArrowUp size={20} />
                   <span>Add Stock</span>
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/10 blur-[100px] rounded-full"></div>
        <div className="flex items-center space-x-6 relative z-10">
           <div className="w-16 h-16 bg-emerald-600/20 backdrop-blur-xl border border-emerald-500/20 rounded-[22px] flex items-center justify-center shadow-xl">
             <Boxes size={32} className="text-emerald-400" />
           </div>
           <div>
              <h1 className="text-3xl font-black tracking-tight italic uppercase">Inventory Master</h1>
              <p className="text-slate-400 font-medium">Precision tracking for your premium products.</p>
           </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/5 p-2 rounded-3xl border border-white/10 relative z-10">
           <button 
             onClick={() => setActiveTab('status')}
             className={`px-6 py-4 rounded-2xl flex flex-col items-center space-y-2 transition-all ${activeTab === 'status' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
           >
             <Boxes size={20} />
             <span className="text-[10px] font-black uppercase tracking-widest">Inventory Status</span>
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={`px-6 py-4 rounded-2xl flex flex-col items-center space-y-2 transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
           >
             <HistoryIcon size={20} />
             <span className="text-[10px] font-black uppercase tracking-widest">Stock History</span>
           </button>
        </div>
      </div>

      {activeTab === 'status' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Quick Alerts */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center italic border-b border-slate-50 pb-4">
                   <Bell size={20} className="mr-3 text-red-500" />
                   Stock Alerts
                 </h3>
                 <div className="space-y-4">
                    <div className={`p-5 rounded-3xl border transition-all ${outOfStockCount > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-transparent'}`}>
                       <div className="flex justify-between items-start mb-2">
                          <p className={`text-[10px] font-black uppercase tracking-widest ${outOfStockCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>Empty Stock</p>
                          <AlertTriangle size={16} className={outOfStockCount > 0 ? 'text-red-500' : 'text-slate-300'} />
                       </div>
                       <p className="text-3xl font-black text-slate-800">{outOfStockCount}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-1">Products need replenishing</p>
                    </div>

                    <div className={`p-5 rounded-3xl border transition-all ${lowStockCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-transparent'}`}>
                       <div className="flex justify-between items-start mb-2">
                          <p className={`text-[10px] font-black uppercase tracking-widest ${lowStockCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>Low Stock</p>
                          <HistoryIcon size={16} className={lowStockCount > 0 ? 'text-amber-500' : 'text-slate-300'} />
                       </div>
                       <p className="text-3xl font-black text-slate-800">{lowStockCount}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-1">Under 10 units threshold</p>
                    </div>

                    {outOfStockCount > 0 && (
                      <div className="bg-red-900 p-4 rounded-2xl flex items-center space-x-3 text-white animate-pulse">
                         <AlertTriangle size={20} className="text-red-400" />
                         <p className="text-[10px] font-black uppercase tracking-widest leading-normal">Immediate Action Required: {outOfStockCount} items empty</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Main Status List */}
           <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                 <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                    <div className="flex space-x-2">
                       {(['all', 'low', 'out'] as const).map(f => (
                         <button 
                           key={f}
                           onClick={() => setFilter(f)}
                           className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                         >
                           {f}
                         </button>
                       ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         type="text" 
                         placeholder="Search products..." 
                         value={searchTerm}
                         onChange={e => setSearchTerm(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold outline-none focus:border-emerald-300"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map(p => (
                      <div key={p.id} className="p-4 bg-white border border-slate-50 shadow-sm rounded-3xl flex items-center justify-between group hover:border-emerald-200 transition-all">
                         <div className="flex items-center space-x-4">
                            <div className="relative">
                               <img src={p.image} className="w-14 h-14 rounded-2xl object-cover border border-slate-100" alt="" />
                               {p.stock === 0 && (
                                 <div className="absolute inset-0 bg-red-500/40 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                                    <AlertTriangle size={16} className="text-white" />
                                 </div>
                               )}
                            </div>
                            <div>
                               <p className="font-black text-slate-800 uppercase tracking-tighter truncate max-w-[120px]">{p.name}</p>
                               <p className="text-[10px] font-bold text-slate-400">{p.category}</p>
                            </div>
                         </div>
                         
                         <div className="flex items-center space-x-4">
                            <div className="text-right">
                               <p className={`text-xl font-black tracking-tighter ${p.stock <= 5 ? 'text-red-500' : p.stock <= 10 ? 'text-amber-500' : 'text-blue-900'}`}>
                                 {p.stock} <span className="text-[8px] font-black text-slate-300 ml-0.5">UNITS</span>
                               </p>
                               <div className="flex items-center justify-end space-x-1">
                                  {p.stock <= 10 ? <AlertTriangle size={10} className={p.stock === 0 ? 'text-red-500' : 'text-amber-500'} /> : <CheckCircle2 size={10} className="text-emerald-500" />}
                                  <span className={`text-[8px] font-black uppercase tracking-widest ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {p.stock === 0 ? 'Restock ASAP' : p.stock <= 10 ? 'Low Stock' : 'Good'}
                                  </span>
                               </div>
                            </div>
                            <button 
                              onClick={() => setAdjustingProduct(p)}
                              className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-900 hover:text-white transition-all flex items-center justify-center"
                            >
                               <Plus size={18} />
                            </button>
                         </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="col-span-2 h-64 flex flex-col items-center justify-center text-slate-300 italic border border-dashed border-slate-100 rounded-[32px]">
                         <Boxes size={48} className="mb-4 opacity-10" />
                         <p>No products match your criteria.</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center italic">
                <HistoryIcon size={28} className="mr-3 text-blue-600" />
                Movement Log
              </h3>
              <div className="flex space-x-2">
                 <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:border-blue-200 border border-transparent transition-all">
                    <Calendar size={18} />
                 </button>
                 <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:border-blue-200 border border-transparent transition-all">
                    <Filter size={18} />
                 </button>
              </div>
           </div>

           <div className="flex-1 space-y-4">
              <div className="grid grid-cols-12 gap-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                 <div className="col-span-4 italic">Product Details</div>
                 <div className="col-span-2">Type</div>
                 <div className="col-span-1 text-center">Qty</div>
                 <div className="col-span-3">Reason</div>
                 <div className="col-span-2 text-right">Timestamp</div>
              </div>

              {stockHistory.map(m => (
                <div key={m.id} className="grid grid-cols-12 gap-4 items-center p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all rounded-3xl border border-transparent hover:border-blue-100">
                   <div className="col-span-4 flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-slate-300 uppercase">
                         {m.productName.charAt(0)}
                      </div>
                      <div>
                         <p className="font-black text-slate-800 uppercase tracking-tighter text-sm">{m.productName}</p>
                         <p className="text-[8px] font-bold text-slate-400 mt-0.5">ID: {m.productId.slice(0, 8)}</p>
                      </div>
                   </div>

                   <div className="col-span-2">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${m.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                         {m.type === 'IN' ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                         <span>STOCK {m.type}</span>
                      </div>
                   </div>

                   <div className="col-span-1 text-center font-black text-slate-800">
                      {m.quantity}
                   </div>

                   <div className="col-span-3">
                      <p className="text-xs font-bold text-slate-500 line-clamp-1">{m.reason}</p>
                   </div>

                   <div className="col-span-2 text-right">
                      <p className="text-[10px] font-black text-slate-900 tracking-tighter italic">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{new Date(m.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
              ))}

              {stockHistory.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300 underline decoration-slate-100 underline-offset-8">
                   <HistoryIcon size={48} className="mb-4 opacity-10" />
                   <p>No stock movement history recorded yet.</p>
                </div>
              )}
           </div>
           
           <div className="mt-8 p-6 bg-blue-900 rounded-[32px] text-white flex items-center justify-between shadow-2xl shadow-blue-900/40 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12 translate-x-10 group-hover:translate-x-0 transition-transform duration-1000"></div>
              <div className="flex items-center space-x-6 relative z-10">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                    <ChevronRight size={24} className="text-blue-400" />
                 </div>
                 <div>
                    <h4 className="font-black italic uppercase tracking-tight">Need a full inventory report?</h4>
                    <p className="text-xs text-blue-200 font-medium">Export all movements to PDF or CSV in the Analytics tab (under dev).</p>
                 </div>
              </div>
              <button className="bg-white text-blue-900 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10">
                 <span>Export Log</span>
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
