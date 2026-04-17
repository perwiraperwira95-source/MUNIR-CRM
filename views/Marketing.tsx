
import React, { useContext, useState, useMemo } from 'react';
import { StoreContext } from '../App';
import { 
  Megaphone, MessageSquare, Ticket, Percent, 
  Send, Users, Plus, Trash2, 
  CheckCircle2, ExternalLink, Calendar,
  Gift, ShoppingBag, ArrowRight
} from 'lucide-react';

interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: 'fixed' | 'percent';
  description: string;
  expiry: string;
}

const Marketing: React.FC = () => {
  const { customers, vouchers, addVoucher, deleteVoucher } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState<'wa' | 'discount' | 'vouchers'>('wa');
  
  // WhatsApp Blast State
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [promoMessage, setPromoMessage] = useState('🔥 MUNIR OFFICIAL PROMO! Dapatkan diskon 20% khusus hari ini untuk semua menu favoritmu. Gunakan kode: MUNIRLOYAL. Sampai jumpa di store kami! ✨');

  // Add Voucher Modal State
  const [showAddVoucher, setShowAddVoucher] = useState(false);
  const [newVoucher, setNewVoucher] = useState<Partial<Voucher>>({
    code: '',
    discount: 0,
    type: 'fixed',
    description: '',
    expiry: new Date().toISOString().split('T')[0]
  });

  const handleAddVoucher = () => {
    if (!newVoucher.code || !newVoucher.discount) return;
    const v: Voucher = {
      id: `VOU-${Date.now()}`,
      code: newVoucher.code.toUpperCase(),
      discount: Number(newVoucher.discount),
      type: newVoucher.type as 'fixed' | 'percent',
      description: newVoucher.description || '',
      expiry: newVoucher.expiry || ''
    };
    addVoucher(v);
    setShowAddVoucher(false);
    setNewVoucher({
      code: '',
      discount: 0,
      type: 'fixed',
      description: '',
      expiry: new Date().toISOString().split('T')[0]
    });
  };

  const toggleCustomer = (id: string) => {
    setSelectedCustomers(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleSendWA = (phone: string, name: string) => {
    const personalized = promoMessage.replace('[NAME]', name);
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(personalized)}`;
    window.open(url, '_blank');
  };

  const handleBulkSend = () => {
    if (selectedCustomers.length === 0) return;
    const target = customers.find(c => c.id === selectedCustomers[0]);
    if (target) {
      handleSendWA(target.phone, target.name);
      // In a real bulk app, it might cycle through them, but for browser/security, 
      // we usually open one at a time or use a real API. Here we just open the first one as demo.
      alert(`Opening WhatsApp for ${target.name}. Please repeat for other selections.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Add Voucher Modal */}
      {showAddVoucher && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 animate-in zoom-in slide-in-from-bottom-10 duration-500 shadow-2xl space-y-8 border border-slate-100">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">New Coupon</h3>
               <button 
                 onClick={() => setShowAddVoucher(false)}
                 className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
               >
                 <Trash2 size={20} />
               </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coupon Code</label>
                <input 
                  type="text" 
                  value={newVoucher.code}
                  onChange={e => setNewVoucher({...newVoucher, code: e.target.value})}
                  placeholder="E.G. MUNIRSALE"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase tracking-widest"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount</label>
                    <input 
                      type="number" 
                      value={newVoucher.discount === 0 ? '' : newVoucher.discount}
                      onChange={e => setNewVoucher({...newVoucher, discount: Number(e.target.value)})}
                      placeholder="Amount"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                    <select 
                      value={newVoucher.type}
                      onChange={e => setNewVoucher({...newVoucher, type: e.target.value as any})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                    >
                      <option value="fixed">Fixed IDR</option>
                      <option value="percent">Percentage %</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</label>
                <input 
                  type="date" 
                  value={newVoucher.expiry}
                  onChange={e => setNewVoucher({...newVoucher, expiry: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  value={newVoucher.description}
                  onChange={e => setNewVoucher({...newVoucher, description: e.target.value})}
                  placeholder="What is this for?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
                />
              </div>
            </div>

            <button 
              onClick={handleAddVoucher}
              className="w-full luxury-gradient text-white py-5 rounded-[22px] font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-900/40 transform active:scale-95 transition-all"
            >
              Confirm Deployment
            </button>
          </div>
        </div>
      )}
      {/* Header with Marketing Theme */}
      <div className="bg-slate-900 rounded-[40px] p-10 overflow-hidden relative text-white border border-slate-800 shadow-2xl">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[100px] rounded-full"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
               <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-4 py-1.5 rounded-full border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  <Megaphone size={14} />
                  <span>Marketing Command Center</span>
               </div>
               <h1 className="text-4xl font-black tracking-tighter italic">Drive Growth & Retention</h1>
               <p className="text-slate-400 max-w-lg font-medium">Control your promotions, blast WhatsApp messages, and manage loyalty vouchers from one luxury dashboard.</p>
            </div>
            <div className="flex bg-white/5 p-2 rounded-3xl backdrop-blur-xl border border-white/10">
               <button 
                 onClick={() => setActiveTab('wa')}
                 className={`px-6 py-4 rounded-2xl flex flex-col items-center space-y-2 transition-all ${activeTab === 'wa' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
               >
                 <MessageSquare size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest">WA Blast</span>
               </button>
               <button 
                 onClick={() => setActiveTab('discount')}
                 className={`px-6 py-4 rounded-2xl flex flex-col items-center space-y-2 transition-all ${activeTab === 'discount' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
               >
                 <Percent size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Diskon</span>
               </button>
               <button 
                 onClick={() => setActiveTab('vouchers')}
                 className={`px-6 py-4 rounded-2xl flex flex-col items-center space-y-2 transition-all ${activeTab === 'vouchers' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
               >
                 <Ticket size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Voucher</span>
               </button>
            </div>
         </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'wa' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center mb-6">
                    <Users size={24} className="mr-3 text-blue-600" />
                    Target Selection
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {customers.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => toggleCustomer(c.id)}
                        className={`p-4 rounded-3xl cursor-pointer border transition-all flex items-center justify-between ${selectedCustomers.includes(c.id) ? 'bg-blue-50 border-blue-200 shadow-inner' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                      >
                         <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedCustomers.includes(c.id) ? 'bg-blue-900 text-white' : 'bg-white text-slate-400'}`}>
                              {c.name.charAt(0)}
                            </div>
                            <div>
                               <p className="font-black text-sm text-slate-800 uppercase tracking-tighter">{c.name}</p>
                               <p className="text-[10px] text-slate-400 font-bold">{c.phone}</p>
                            </div>
                         </div>
                         {selectedCustomers.includes(c.id) && <CheckCircle2 size={16} className="text-blue-600" />}
                      </div>
                    ))}
                    {customers.length === 0 && <p className="text-slate-400 italic text-sm text-center py-10 col-span-2">No customers found in database.</p>}
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center uppercase italic">
                    <MessageSquare size={24} className="mr-3 text-emerald-500" />
                    Promo Composer
                  </h3>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Content</label>
                     <textarea 
                       value={promoMessage}
                       onChange={(e) => setPromoMessage(e.target.value)}
                       className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                       placeholder="Enter your promotional message here..."
                     />
                     <p className="text-[9px] text-slate-400 italic">Pro-tip: Use [NAME] to personalize your message (under dev).</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                     <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Recipients Selected</p>
                     <p className="text-2xl font-black text-blue-900">{selectedCustomers.length}</p>
                  </div>

                  <button 
                    onClick={handleBulkSend}
                    disabled={selectedCustomers.length === 0}
                    className="w-full luxury-gradient text-white py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl shadow-blue-900/40 hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all"
                  >
                    <span>Execute WA Blast</span>
                    <Send size={18} />
                  </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'discount' && (
          <div className="space-y-8">
             <div className="bg-white p-12 rounded-[50px] text-center space-y-6 border border-slate-100 shadow-sm">
                <div className="w-24 h-24 bg-emerald-50 rounded-[35px] flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                   <Percent size={48} />
                </div>
                <div className="max-w-xl mx-auto space-y-2">
                   <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Store-Wide Discounts</h2>
                   <p className="text-slate-400 font-medium">Coming Soon: Set global percentage or fixed amount discounts that apply automatically at the checkout.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left group hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">
                      <p className="font-black uppercase tracking-widest text-[10px] mb-2 text-emerald-600 group-hover:text-emerald-200">Flash Sale</p>
                      <h4 className="font-black text-lg">Happy Hour 30%</h4>
                      <p className="text-xs mt-1 text-slate-500 group-hover:text-emerald-100">Every Friday 14:00 - 16:00</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left group hover:bg-blue-900 hover:text-white transition-all cursor-pointer">
                      <p className="font-black uppercase tracking-widest text-[10px] mb-2 text-blue-600 group-hover:text-blue-300">Bundle Savings</p>
                      <h4 className="font-black text-lg">Coffee & Cake Set</h4>
                      <p className="text-xs mt-1 text-slate-500 group-hover:text-blue-200">Save Rp 15.000 on combos</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'vouchers' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
               <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Active Vouchers</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Digital coupon management</p>
               </div>
               <button 
                 onClick={() => setShowAddVoucher(true)}
                 className="bg-blue-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 shadow-xl hover:shadow-blue-900/20 transition-all active:scale-95"
               >
                  <Plus size={16} />
                  <span>Generate New</span>
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {vouchers.map(v => (
                 <div key={v.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all hover:border-blue-200">
                    <div className="bg-slate-50 p-6 border-b border-dashed border-slate-200 flex justify-between items-start">
                       <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                          <Ticket size={24} className="text-blue-900" />
                       </div>
                       <div className="bg-blue-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                         Active
                       </div>
                    </div>
                    <div className="p-8 flex-1 space-y-4">
                       <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Coupon Code</p>
                          <h4 className="text-2xl font-black text-slate-800 tracking-widest font-mono">{v.code}</h4>
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Benefits</p>
                          <p className="text-sm font-black text-blue-900 italic">{v.description}</p>
                       </div>
                       <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center text-[10px] text-slate-400 font-bold">
                             <Calendar size={12} className="mr-1" />
                             Exp: {v.expiry}
                          </div>
                          <div className="flex items-center text-emerald-500 font-black text-xs uppercase tracking-tighter">
                             <Gift size={14} className="mr-1" />
                             {v.type === 'fixed' ? `Rp ${v.discount.toLocaleString()}` : `${v.discount}% Off`}
                          </div>
                       </div>
                    </div>
                    <div className="p-4 bg-slate-50 flex space-x-2">
                       <button className="flex-1 py-3 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-blue-900 hover:text-white transition-all">
                          Edit
                       </button>
                       <button 
                         onClick={() => deleteVoucher(v.id)}
                         className="p-3 bg-white rounded-xl text-red-400 border border-slate-100 hover:bg-red-500 hover:text-white transition-all"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketing;
