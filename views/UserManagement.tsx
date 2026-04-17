
import React, { useContext, useState } from 'react';
import { StoreContext, AuthContext } from '../App';
import { 
  UserCog, User as UserIcon, Shield, Briefcase, 
  Trash2, Edit2, Plus, X, Check, Mail,
  Lock, Camera, Search, ChevronRight
} from 'lucide-react';
import { Role, User } from '../types';

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useContext(StoreContext);
  const { user: currentUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.CASHIER,
    avatar: ''
  });

  const openModal = (u?: User) => {
    if (u) {
      setEditingUser(u);
      setFormData({
        name: u.name,
        email: u.email,
        password: u.password || '',
        role: u.role,
        avatar: u.avatar
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: Role.CASHIER,
        avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: editingUser ? editingUser.id : `USER-${Date.now()}`,
      ...formData,
    };

    if (editingUser) updateUser(newUser);
    else addUser(newUser);

    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-blue-900 rounded-[22px] flex items-center justify-center text-white shadow-xl">
               <UserCog size={32} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Staff Management</h1>
               <p className="text-slate-400 font-medium">Configure roles and access permissions for your team.</p>
            </div>
         </div>
         <button 
           onClick={() => openModal()}
           className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-2xl shadow-blue-900/20 hover:scale-105 transition-all active:scale-95"
         >
           <Plus size={18} />
           <span>Recruit New Staff</span>
         </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
         <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
               <div>
                  <h3 className="text-xl font-black text-slate-800 italic uppercase">Access Control List</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global user directory</p>
               </div>
               <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search staff..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold outline-none focus:border-blue-300"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
               {filteredUsers.map(u => (
                 <div key={u.id} className="bg-white border border-slate-100 rounded-[32px] p-6 group hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                       <div className="relative">
                          <img src={u.avatar} className="w-16 h-16 rounded-[22px] object-cover shadow-lg border-2 border-white" alt="" />
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-md ${u.role === Role.ADMIN ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
                             {u.role === Role.ADMIN ? <Shield size={12} /> : <Briefcase size={12} />}
                          </div>
                       </div>
                       <div className="flex space-x-1">
                          <button 
                            onClick={() => openModal(u)}
                            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-900 hover:text-white transition-all shadow-sm"
                          >
                             <Edit2 size={16} />
                          </button>
                          {u.id !== currentUser?.id && (
                            <button 
                              onClick={() => { if(confirm('Fire this staff member?')) deleteUser(u.id); }}
                              className="p-2.5 bg-slate-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                               <Trash2 size={16} />
                            </button>
                          )}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div>
                          <h4 className="font-black text-slate-800 uppercase tracking-tighter text-lg">{u.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Mail size={10} className="mr-1.5" />
                            {u.email}
                          </p>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Authority Role</span>
                             <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${u.role === Role.ADMIN ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                {u.role === Role.ADMIN ? 'Administrator' : 'General Cashier'}
                             </span>
                          </div>
                          <ChevronRight size={20} className="text-slate-100 group-hover:text-blue-200 transition-colors" />
                       </div>
                    </div>
                 </div>
               ))}
               {filteredUsers.length === 0 && (
                 <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-300 italic border border-dashed border-slate-100 rounded-[40px]">
                    <UserIcon size={48} className="mb-4 opacity-10" />
                    <p>No personnel records found.</p>
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 animate-in zoom-in slide-in-from-bottom-10 duration-500 shadow-2xl space-y-8 border border-slate-100">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase">{editingUser ? 'Update Profile' : 'Staff Onboarding'}</h3>
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
               >
                 <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
               <div className="flex justify-center mb-4">
                  <div className="relative group">
                     <img src={formData.avatar} className="w-24 h-24 rounded-[32px] object-cover shadow-2xl border-4 border-white" alt="" />
                     <button 
                       type="button"
                       onClick={() => setFormData({...formData, avatar: `https://picsum.photos/seed/${Date.now()}/100/100`})}
                       className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-900 text-white rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform"
                     >
                        <Camera size={18} />
                     </button>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                     <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="text" required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-black focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase tracking-tighter"
                        />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="email" required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="staff@munir.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Password</label>
                     <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="password" required
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          placeholder="********"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Level</label>
                     <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <select 
                          value={formData.role}
                          onChange={e => setFormData({...formData, role: e.target.value as Role})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 text-sm font-black focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer uppercase tracking-widest"
                        >
                           <option value={Role.ADMIN}>Owner (Admin)</option>
                           <option value={Role.CASHIER}>Staff (Cashier)</option>
                        </select>
                     </div>
                  </div>
               </div>

               <button 
                 type="submit"
                 className="w-full luxury-gradient text-white py-5 rounded-[22px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-900/30 transform active:scale-95 transition-all flex items-center justify-center space-x-2"
               >
                 <Check size={20} />
                 <span>Deploy Staff Data</span>
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
