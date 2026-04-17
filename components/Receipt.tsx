
import React, { useContext } from 'react';
import { Transaction } from '../types';
import { StoreContext } from '../App';
import { 
  X, CheckCircle2, Download, Printer, QrCode, Users
} from 'lucide-react';

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
  isReprint?: boolean;
}

const Receipt: React.FC<ReceiptProps> = ({ transaction, onClose, isReprint = false }) => {
  const { settings } = useContext(StoreContext);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-[40px] w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute right-8 top-8 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-all hover:rotate-90"
        >
          <X size={20} />
        </button>

        {/* Header with Luxury Gradient */}
        <div className="luxury-gradient pt-16 pb-20 px-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="bg-white/20 backdrop-blur-xl w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-white/40 shadow-2xl relative z-10">
            <CheckCircle2 size={48} className="text-emerald-400 drop-shadow-glow" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10 italic">
            {isReprint ? 'Duplicate Receipt' : 'Payment Confirmed'}
          </h2>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur px-4 py-1 rounded-full text-xs font-bold border border-white/20 relative z-10">
             <span className="opacity-60">REF NO:</span>
             <span className="tracking-widest uppercase font-black">{transaction.id}</span>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="px-10 -mt-10 relative z-10 pb-8">
          <div className="bg-white rounded-[32px] shadow-xl p-8 space-y-8 border border-slate-100 receipt-print-area">
            {/* Store Branding */}
            <div className="text-center pb-8 border-b border-dashed border-slate-200">
              <h1 className="text-3xl font-black text-blue-950 tracking-tighter italic uppercase">{settings.storeName}</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-2 mb-4">Premium Culinary & Lifestyle</p>
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-center text-[10px] font-black w-fit mx-auto border border-emerald-100 uppercase tracking-widest">
                Official Receipt
              </div>
            </div>

            {/* Transaction Metadata */}
            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div>
                <p className="mb-1 text-slate-300">Date & Time</p>
                <p className="text-slate-700">{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="mb-1 text-slate-300">Cashier</p>
                <p className="text-slate-700">{transaction.cashierName}</p>
              </div>
            </div>

            {/* Customer Section (If Applicable) */}
            {transaction.customerName && (
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center space-x-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
                   <Users size={18} />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Premium Client</p>
                    <p className="text-sm font-black text-blue-900">{transaction.customerName}</p>
                 </div>
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-4">
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-2">Order Summary</div>
              {transaction.items.map(item => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100" alt="" />
                      <div className="absolute -top-2 -right-2 bg-blue-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black shadow-lg">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">Rp {item.price.toLocaleString()} per unit</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-slate-800">Rp {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-6 border-t-2 border-dashed border-slate-100 space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                <span className="text-slate-800 font-black">Rp {transaction.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Tax (PPN {(settings.taxRate * 100).toFixed(0)}%)</span>
                <span className="text-slate-800 font-black">Rp {transaction.tax.toLocaleString()}</span>
              </div>
              {transaction.discount ? (
                <div className="flex justify-between text-xs font-bold p-2 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-red-400 uppercase tracking-widest">Promotional Disc</span>
                  <span className="text-red-600 font-black">-Rp {transaction.discount.toLocaleString()}</span>
                </div>
              ) : null}
              
              <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Total Paid Via {transaction.paymentMethod}</p>
                  <p className="text-3xl font-black text-blue-950 tracking-tighter italic">Rp {transaction.total.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                      <QrCode size={24} className="text-slate-300" />
                   </div>
                </div>
              </div>
            </div>

            {/* Closing */}
            <div className="text-center pt-8 border-t border-dashed border-slate-100 flex flex-col items-center">
              <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em] mb-4">Terima Kasih Atas Kunjungan Anda</p>
              <div className="flex space-x-2">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>)}
              </div>
            </div>
          </div>

          <div className="mt-8 flex space-x-4 no-print">
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl font-black text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl group"
            >
              <Printer size={20} className="group-hover:scale-110 transition-transform" />
              <span className="uppercase text-xs tracking-widest">Print Struk</span>
            </button>
            <button 
              onClick={onClose}
              className="flex-1 luxury-gradient text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-3 shadow-2xl hover:opacity-90 transform active:scale-95 transition-all group"
            >
              <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
              <span className="uppercase text-xs tracking-widest">SelesaI</span>
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-print-area, .receipt-print-area * {
            visibility: visible;
          }
          .receipt-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Receipt;
