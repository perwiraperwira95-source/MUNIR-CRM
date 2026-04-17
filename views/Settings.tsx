
import React, { useContext, useState } from 'react';
import { StoreContext } from '../App';
import { 
  Settings as SettingsIcon, Store, Image, Phone, 
  Percent, Save, RefreshCcw, Bell, ShieldCheck,
  Smartphone, Globe, Palette
} from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useContext(StoreContext);
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      updateSettings(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-blue-900 rounded-[22px] flex items-center justify-center text-white shadow-xl">
               <SettingsIcon size={32} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Global Settings</h1>
               <p className="text-slate-400 font-medium">Configure your store identity and system parameters.</p>
            </div>
         </div>
         {showSuccess && (
           <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl flex items-center space-x-2 animate-in slide-in-from-right-10 border border-emerald-100 font-bold">
              <ShieldCheck size={20} />
              <span>Settings Synchronized!</span>
           </div>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Settings Form */}
         <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSave} className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center space-x-3">
                  <div className="p-2 bg-blue-900 text-white rounded-lg">
                     <Store size={18} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 italic uppercase">Store Identity</h3>
               </div>

               <div className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                        <div className="relative">
                           <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input 
                             type="text" required
                             value={formData.storeName}
                             onChange={e => setFormData({...formData, storeName: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-black focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase tracking-tighter"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                        <div className="relative">
                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input 
                             type="text" required
                             value={formData.whatsappNumber}
                             onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tax Rate (PPN)</label>
                     <div className="relative">
                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="number" step="0.01" required
                          value={formData.taxRate}
                          onChange={e => setFormData({...formData, taxRate: parseFloat(e.target.value)})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-black focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                           Decimals (0.11 = 11%)
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Logo URL</label>
                     <div className="relative">
                        <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="text"
                          value={formData.storeLogo}
                          onChange={e => setFormData({...formData, storeLogo: e.target.value})}
                          placeholder="https://example.com/logo.png"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                     </div>
                  </div>

                  <div className="pt-6">
                     <button 
                       type="submit"
                       disabled={isSaving}
                       className="luxury-gradient text-white px-10 py-5 rounded-[22px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-900/30 transform active:scale-95 transition-all flex items-center space-x-3 disabled:opacity-50"
                     >
                        {isSaving ? <RefreshCcw className="animate-spin" size={20} /> : <Save size={20} />}
                        <span>{isSaving ? 'Processing...' : 'Save Configuration'}</span>
                     </button>
                  </div>
               </div>
            </form>

            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg">
                     <Smartphone size={18} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 italic uppercase">System Information</h3>
               </div>
               <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-[32px]">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400">
                        <Globe size={24} />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Environment</p>
                        <p className="text-xs font-black text-slate-800 uppercase">Production v1.0.4</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-[32px]">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400">
                        <Palette size={24} />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">UI Framework</p>
                        <p className="text-xs font-black text-slate-800 uppercase">Munir Design System</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Preview Sidebar */}
         <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
               <h3 className="text-xl font-black text-slate-800 italic uppercase mb-6 flex items-center space-x-3">
                  <RefreshCcw size={20} className="text-blue-900" />
                  <span>Real-time Preview</span>
               </h3>
               
               <div className="p-6 luxury-gradient rounded-[32px] text-white space-y-6 shadow-xl">
                  <div className="flex items-center space-x-4">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                        {formData.storeLogo ? (
                           <img src={formData.storeLogo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-blue-900 font-black text-2xl">{formData.storeName.charAt(0)}</span>
                        )}
                     </div>
                     <div className="overflow-hidden">
                        <p className="font-black italic uppercase tracking-tighter truncate text-xl leading-none mb-1">{formData.storeName || 'Your Store'}</p>
                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Premium POS System</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/10 p-4 rounded-[22px] backdrop-blur-sm border border-white/10">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">WhatsApp</p>
                        <p className="text-[10px] font-bold truncate">{formData.whatsappNumber || 'Not Configured'}</p>
                     </div>
                     <div className="bg-white/10 p-4 rounded-[22px] backdrop-blur-sm border border-white/10">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Current PPN</p>
                        <p className="text-sm font-black">{(formData.taxRate * 100).toFixed(0)}%</p>
                     </div>
                  </div>
               </div>

               <div className="mt-8 space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                     <Bell size={20} className="text-blue-600 mt-1 shrink-0" />
                     <p className="text-[10px] font-medium text-blue-800 italic leading-relaxed">
                        Changes to store name and logo will be reflected immediately across the entire POS system and customer receipts.
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
               <h3 className="text-lg font-black uppercase tracking-widest mb-4 italic">Security Note</h3>
               <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                  Only administrators have permissions to modify these core system settings to ensure business integrity.
               </p>
               <div className="flex items-center space-x-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  <span>Encrypted Storage Secure</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
