
import React, { useState, useContext, useMemo } from 'react';
import { StoreContext, AuthContext } from '../App';
import { Category, CartItem, Transaction, PaymentMethod, Customer } from '../types';
import Receipt from '../components/Receipt';
import { 
  Search, Plus, Minus, Trash2, CreditCard, 
  Wallet, Banknote, QrCode, Download, Printer,
  X, CheckCircle2, ChevronRight,
  ShoppingCart, Users, MapPin, Phone
} from 'lucide-react';

const POS: React.FC = () => {
  const { products, addTransaction, customers, updateCustomerLoyalty, settings } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState('');

  const selectedCustomer = useMemo(() => 
    customers.find(c => c.id === selectedCustomerId), 
    [customers, selectedCustomerId]
  );

  const filteredCustomers = useMemo(() => 
    customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
    ).slice(0, 5),
    [customers, customerSearch]
  );

  const categories = ['All', ...Object.values(Category)];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory && p.stock > 0;
    });
  }, [products, searchTerm, selectedCategory]);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        const originalProduct = products.find(p => p.id === id);
        if (originalProduct && newQty > originalProduct.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * settings.taxRate;
  const total = subtotal + tax - discount;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const transaction: Transaction = {
      id: `TRX-${Date.now()}`,
      items: [...cart],
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      cashierName: user?.name || 'Unknown',
      customerId: selectedCustomerId || undefined,
      customerName: selectedCustomer?.name || undefined,
      createdAt: new Date().toISOString(),
    };

    addTransaction(transaction);
    
    // Update Loyalty Points (1 point per 10k IDR)
    if (selectedCustomerId) {
      const earnedPoints = Math.floor(total / 10000);
      updateCustomerLoyalty(selectedCustomerId, earnedPoints);
    }

    setLastTransaction(transaction);
    setShowReceipt(true);
    setCart([]);
    setDiscount(0);
    setSelectedCustomerId('');
    setCustomerSearch('');
  };

  return (
    <div className="flex gap-8 h-full min-h-[600px]">
      {showReceipt && lastTransaction && (
        <Receipt 
          transaction={lastTransaction} 
          onClose={() => setShowReceipt(false)} 
        />
      )}

      {/* Product Selection */}
      <div className="flex-1 flex flex-col space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Quick search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm font-medium text-slate-800"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat 
                  ? 'bg-blue-900 text-white border-blue-900 shadow-lg' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="bg-white rounded-3xl p-3 luxury-card border border-slate-100 cursor-pointer group relative overflow-hidden"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-blue-900 shadow-sm border border-blue-100">
                  Stock: {product.stock}
                </div>
              </div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">{product.category}</p>
              <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-900 transition-colors">{product.name}</h4>
              <p className="text-blue-900 font-black mt-1">Rp {product.price.toLocaleString()}</p>
              
              <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <Plus size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="w-96 flex flex-col space-y-4">
        <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xl font-black text-slate-800">Current Cart</h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">{cart.length} unique items</p>
            </div>
            <button 
              onClick={() => setCart([])}
              className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-xl"
              title="Clear Cart"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Customer Selection */}
            <div className="px-2 pb-2">
               <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    {selectedCustomer ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Users size={16} />}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search customer..." 
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className={`w-full bg-slate-50 border ${selectedCustomer ? 'border-emerald-200 ring-4 ring-emerald-500/5' : 'border-slate-100'} rounded-xl py-2 pl-9 pr-8 text-xs font-bold outline-none focus:border-blue-300 transition-all`}
                  />
                  {selectedCustomerId && (
                    <button 
                      onClick={() => { setSelectedCustomerId(''); setCustomerSearch(''); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {customerSearch && !selectedCustomerId && filteredCustomers.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                       {filteredCustomers.map(c => (
                         <button 
                           key={c.id}
                           onClick={() => {
                             setSelectedCustomerId(c.id);
                             setCustomerSearch(c.name);
                           }}
                           className="w-full text-left px-4 py-3 hover:bg-slate-50 flex justify-between items-center group transition-colors"
                         >
                           <div>
                             <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">{c.name}</p>
                             <p className="text-[10px] text-slate-400">{c.phone}</p>
                           </div>
                           <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </button>
                       ))}
                    </div>
                  )}

                  {customerSearch && !selectedCustomerId && filteredCustomers.length === 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 p-4 text-center">
                       <p className="text-[10px] font-bold text-slate-400 italic">No client found.</p>
                    </div>
                  )}
               </div>
               {selectedCustomer && (
                 <div className="mt-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone size={10} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={10} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[100px]">{selectedCustomer.address}</span>
                    </div>
                 </div>
               )}
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <ShoppingCart size={32} />
                </div>
                <p className="text-slate-400 font-medium">Cart is empty.<br/>Select products to begin.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl group border border-transparent hover:border-blue-100 transition-all">
                  <img src={item.image} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                    <p className="text-xs font-black text-blue-900">Rp {(item.price * item.quantity).toLocaleString()}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg px-1 py-0.5 shadow-sm">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-slate-400 hover:text-blue-600">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-slate-400 hover:text-blue-600">
                          <Plus size={14} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-slate-50 space-y-4">
            <div className="space-y-2 text-sm border-b border-slate-200 pb-4">
              <div className="flex justify-between font-medium text-slate-500">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-500">
                <span>PPN (11%)</span>
                <span>Rp {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center group">
                 <span className="text-slate-500">Manual Discount</span>
                 <input 
                   type="number" 
                   value={discount} 
                   onChange={(e) => setDiscount(Number(e.target.value))}
                   className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-red-500 font-bold outline-none focus:border-red-400"
                 />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Grand Total</span>
              <span className="text-3xl font-black text-blue-900 tracking-tighter">Rp {total.toLocaleString()}</span>
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: PaymentMethod.CASH, icon: <Banknote size={16}/> },
                  { id: PaymentMethod.QRIS, icon: <QrCode size={16}/> },
                  { id: PaymentMethod.EWALLET_DANA, icon: <Wallet size={16}/> },
                  { id: PaymentMethod.TRANSFER, icon: <CreditCard size={16}/> },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      paymentMethod === method.id 
                      ? 'bg-blue-900 text-white border-blue-900 shadow-md' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                    }`}
                    title={method.id}
                  >
                    {method.icon}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full luxury-gradient hover:opacity-90 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-xl shadow-blue-900/20 transform transition-transform hover:scale-[1.02] active:scale-95"
            >
              <span>PROCESS PAYMENT</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
