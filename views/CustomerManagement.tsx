
import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { Customer } from '../types';
import { 
  Users, Search, UserPlus, Phone, MapPin, 
  Trash2, Edit, X, Check, MoreVertical,
  Calendar, ArrowRightCircle
} from 'lucide-react';

const CustomerManagement: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useContext(StoreContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const resetForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setPhone(customer.phone);
    setAddress(customer.address);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        name,
        phone,
        address
      });
    } else {
      addCustomer({
        id: `CST-${Date.now()}`,
        name,
        phone,
        address,
        createdAt: new Date().toISOString()
      });
    }
    
    resetForm();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight text-gradient">Customer Registry</h1>
          </div>
          <p className="text-slate-400 font-medium">Manage your premium client database and their profiles.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="luxury-gradient text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-blue-900/20 transform hover:scale-105 active:scale-95 transition-all"
        >
          <UserPlus size={20} />
          <span>Add New Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or phone number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm font-medium text-slate-800"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-6 py-4">Client Detail</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Users size={48} className="text-slate-200 mb-4" />
                          <p className="text-slate-400 font-medium italic">No premium clients found in this segment.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(customer => (
                      <tr key={customer.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-xs border border-white shadow-sm">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 group-hover:text-blue-900 transition-colors">{customer.name}</p>
                              <div className="flex items-center text-[10px] text-slate-400 font-bold mt-1">
                                <MapPin size={10} className="mr-1" />
                                <span className="truncate max-w-[150px]">{customer.address}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-2 text-slate-600 font-bold text-xs bg-slate-100/50 px-3 py-1.5 rounded-lg w-fit">
                            <Phone size={12} className="text-blue-500" />
                            <span>{customer.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                            <Calendar size={12} />
                            <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button 
                              onClick={() => handleEdit(customer)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => deleteCustomer(customer.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Panel / Form */}
        <div className="space-y-6">
          {showForm ? (
            <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {editingCustomer ? 'Refine Profile' : 'New Client Registry'}
                </h3>
                <button onClick={resetForm} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Identity</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Sultan Munir"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Link</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="tel" 
                      placeholder="e.g. 0812-3456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Prime Residence</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                    <textarea 
                      required
                      placeholder="Full delivery address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-800 resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button 
                    type="submit"
                    className="flex-1 luxury-gradient text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-900/20 flex items-center justify-center space-x-2 transform active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    <Check size={18} />
                    <span>{editingCustomer ? 'Apply Changes' : 'Confirm Registration'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group h-full min-h-[400px] flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Users size={200} />
              </div>
              
              <div className="relative z-10">
                <div className="bg-emerald-400 text-blue-950 px-3 py-1 rounded-full text-[10px] font-black w-fit mb-4">
                  CLIENT INSIGHTS
                </div>
                <h3 className="text-3xl font-black leading-tight mb-4 tracking-tighter italic">"Your customers are your greatest asset."</h3>
                <p className="text-blue-100/70 text-sm font-medium mb-8 leading-relaxed">
                  Keeping track of names, numbers, and addresses allows for better delivery management and personalized loyalty rewards.
                </p>
                <div className="flex items-center space-x-4 border-t border-white/10 pt-6">
                   <div>
                     <p className="text-2xl font-black">{customers.length}</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Total Registered</p>
                   </div>
                   <div className="w-px h-8 bg-white/10"></div>
                   <div>
                     <p className="text-2xl font-black text-emerald-400">Premium</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Tier Level</p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
