
import React, { useContext, useState } from 'react';
import { StoreContext } from '../App';
import { Search, Filter, Calendar, Printer, Download, Eye, Tag, Users } from 'lucide-react';
import { Transaction } from '../types';
import Receipt from '../components/Receipt';

const TransactionHistory: React.FC = () => {
  const { transactions } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filtered = transactions.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {selectedTransaction && (
        <Receipt 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
          isReprint
        />
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Filter by Order ID or Cashier..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm font-medium"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
            <Calendar size={20} />
          </button>
          <button className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
            <Filter size={20} />
          </button>
          <button className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 border border-blue-100 hover:bg-blue-100 transition-all">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Global Sales Ledger</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filtered.length} total entries</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cashier</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3 opacity-30">
                    <Tag size={48} />
                    <p className="text-sm font-bold">No transactions found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-blue-900">#{t.id.slice(-6)}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{t.items.length} Items</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 font-medium">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(t.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                       <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs">
                         {t.cashierName.charAt(0)}
                       </div>
                       <span className="text-sm font-bold text-slate-700">{t.cashierName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-tighter">
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-800">
                      Rp {t.total.toLocaleString()}
                    </div>
                    {t.customerName && (
                      <div className="flex items-center text-[9px] text-blue-500 font-bold mt-1 uppercase tracking-tighter">
                         <Users size={8} className="mr-1" />
                         <span>{t.customerName}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedTransaction(t)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                         onClick={() => setSelectedTransaction(t)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all" 
                        title="Print Invoice"
                      >
                        <Printer size={18} />
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
  );
};

export default TransactionHistory;
