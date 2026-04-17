
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  History, 
  LogOut, 
  User as UserIcon, 
  Search,
  Plus,
  Trash2,
  Printer,
  Download,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Activity,
  ShoppingBag,
  Zap,
  Users,
  BarChart3,
  Megaphone,
  Ticket,
  Percent,
  Star,
  Gift,
  Boxes,
  Bell,
  UserCog,
  Settings as SettingsIcon
} from 'lucide-react';
import { User, Role, Product, Transaction, Category, PaymentMethod, CartItem, Customer, Voucher, StockMovement, StoreSettings } from './types';
import { INITIAL_USERS, INITIAL_PRODUCTS, TAX_RATE } from './constants';
import Dashboard from './views/Dashboard';
import POS from './views/POS';
import ProductManagement from './views/ProductManagement';
import TransactionHistory from './views/TransactionHistory';
import CustomerManagement from './views/CustomerManagement';
import Reports from './views/Reports';
import CustomerInsight from './views/CustomerInsight';
import Marketing from './views/Marketing';
import Loyalty from './views/Loyalty';
import Inventory from './views/Inventory';
import UserManagement from './views/UserManagement';
import Settings from './views/Settings';
import Logout from './views/Logout';
import Login from './views/Login';

// Context Definitions
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {}
});

interface StoreContextType {
  products: Product[];
  transactions: Transaction[];
  customers: Customer[];
  vouchers: Voucher[];
  stockHistory: StockMovement[];
  users: User[];
  settings: StoreSettings;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product, reason?: string) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (t: Transaction) => void;
  addCustomer: (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  addVoucher: (v: Voucher) => void;
  deleteVoucher: (id: string) => void;
  updateCustomerLoyalty: (id: string, points: number) => void;
  addStockMovement: (m: StockMovement) => void;
  addUser: (u: User) => void;
  updateUser: (u: User) => void;
  deleteUser: (id: string) => void;
  updateSettings: (s: StoreSettings) => void;
}

export const StoreContext = createContext<StoreContextType>({
  products: [],
  transactions: [],
  customers: [],
  vouchers: [],
  stockHistory: [],
  users: [],
  settings: {
    storeName: 'Munir Official',
    storeLogo: '',
    whatsappNumber: '+62',
    taxRate: 0.11
  },
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  addTransaction: () => {},
  addCustomer: () => {},
  updateCustomer: () => {},
  deleteCustomer: () => {},
  addVoucher: () => {},
  deleteVoucher: () => {},
  updateCustomerLoyalty: () => {},
  addStockMovement: () => {},
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  updateSettings: () => {}
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const { settings } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 luxury-gradient text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
            {settings.storeLogo ? (
              <img src={settings.storeLogo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-2xl font-black text-blue-900">{settings.storeName.charAt(0)}</span>
            )}
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl font-bold tracking-tight truncate">{settings.storeName}</h1>
            <p className="text-xs text-blue-100 opacity-80 uppercase tracking-widest font-bold">Official POS</p>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/pos" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Cashier (POS)</span>
          </Link>
          <Link to="/customers" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <Users size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Customers</span>
          </Link>
          {user?.role === Role.ADMIN && (
            <>
              <Link to="/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <Package size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Products</span>
              </Link>
              <Link to="/inventory" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <Boxes size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Inventory</span>
              </Link>
            </>
          )}
          <Link to="/history" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <History size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Transactions</span>
          </Link>
          <Link to="/reports" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <BarChart3 size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Reports</span>
          </Link>
          <Link to="/crm" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <Zap size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">CRM Insight</span>
          </Link>
          <Link to="/marketing" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <Megaphone size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Marketing</span>
          </Link>
          {user?.role === Role.ADMIN && (
            <>
              <Link to="/users" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <UserCog size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">User Management</span>
              </Link>
              <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
                <SettingsIcon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Settings</span>
              </Link>
            </>
          )}
          <Link to="/loyalty" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <Gift size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Loyalty</span>
          </Link>
          <Link to="/logout" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group text-red-200">
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout System</span>
          </Link>
        </nav>

        <div className="p-6 mt-auto border-t border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <img src={user?.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white/20" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/logout')}
            className="flex items-center space-x-2 w-full px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-lg transition-all duration-300 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">
        <header className="sticky top-0 z-10 glass px-8 py-4 flex justify-between items-center shadow-sm shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name.split(' ')[0]}</h2>
          <div className="flex items-center space-x-6">
             <div className="hidden md:flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-100 italic">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span>Secure System Online</span>
             </div>
             <button 
               onClick={() => navigate('/logout')}
               className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm group"
             >
               <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
               <span>Keluar Sistem</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('munir_pos_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('munir_pos_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('munir_pos_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('munir_pos_customers');
    const parsed = saved ? JSON.parse(saved) : [];
    // Ensure legacy customers have points/level
    return parsed.map((c: any) => ({
      ...c,
      points: c.points ?? 0,
      level: c.level ?? 'Bronze'
    }));
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('munir_pos_vouchers');
    return saved ? JSON.parse(saved) : [
      { id: '1', code: 'MUNIRLOYAL', discount: 20000, type: 'fixed', description: 'Potongan 20rb khusus member', expiry: '2026-12-31' },
      { id: '2', code: 'NEWYEAR2026', discount: 15, type: 'percent', description: 'Diskon 15% awal tahun', expiry: '2026-02-01' }
    ];
  });

  const [stockHistory, setStockHistory] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('munir_pos_stock_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('munir_pos_users');
    let parsedUsers: User[] = saved ? JSON.parse(saved) : INITIAL_USERS;
    
    // Ensure initial users always have the latest passwords even if they were saved before we added passwords
    return parsedUsers.map(u => {
      const initial = INITIAL_USERS.find(iu => iu.id === u.id);
      if (initial && (!u.password || initial.password !== u.password)) {
        return { ...u, password: initial.password };
      }
      return u;
    });
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('munir_pos_settings');
    return saved ? JSON.parse(saved) : {
      storeName: 'Munir Official',
      storeLogo: '',
      whatsappNumber: '+628123456789',
      taxRate: 0.11
    };
  });

  useEffect(() => {
    localStorage.setItem('munir_pos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('munir_pos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('munir_pos_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('munir_pos_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('munir_pos_stock_history', JSON.stringify(stockHistory));
  }, [stockHistory]);

  useEffect(() => {
    localStorage.setItem('munir_pos_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('munir_pos_settings', JSON.stringify(settings));
  }, [settings]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const found = users.find(u => u.email === email && u.password === pass);
    if (found) {
      setUser(found);
      localStorage.setItem('munir_pos_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('munir_pos_user');
  };

  const addProduct = (p: Product) => {
    setProducts([p, ...products]);
    addStockMovement({
      id: `STK-${Date.now()}`,
      productId: p.id,
      productName: p.name,
      type: 'IN',
      quantity: p.stock,
      reason: 'Initial Stock Creation',
      createdAt: new Date().toISOString()
    });
  };

  const updateProduct = (p: Product, reason: string = 'Update Info') => {
    const old = products.find(prod => prod.id === p.id);
    if (old && old.stock !== p.stock) {
      const diff = p.stock - old.stock;
      addStockMovement({
        id: `STK-${Date.now()}`,
        productId: p.id,
        productName: p.name,
        type: diff > 0 ? 'IN' : 'OUT',
        quantity: Math.abs(diff),
        reason: reason,
        createdAt: new Date().toISOString()
      });
    }
    setProducts(products.map(old => old.id === p.id ? p : old));
  };

  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));
  
  const addTransaction = (t: Transaction) => {
    setTransactions([t, ...transactions]);
    // Deduct stock and record history
    setProducts(prev => prev.map(p => {
      const soldItem = t.items.find(item => item.id === p.id);
      if (soldItem) {
        addStockMovement({
          id: `STK-${Date.now()}-${p.id}`,
          productId: p.id,
          productName: p.name,
          type: 'OUT',
          quantity: soldItem.quantity,
          reason: `Sale ${t.id}`,
          createdAt: new Date().toISOString()
        });
        return { ...p, stock: p.stock - soldItem.quantity };
      }
      return p;
    }));
  };

  const addCustomer = (c: Customer) => setCustomers([{ ...c, points: c.points ?? 0, level: c.level ?? 'Bronze' }, ...customers]);
  const updateCustomer = (c: Customer) => setCustomers(customers.map(old => old.id === c.id ? c : old));
  const deleteCustomer = (id: string) => setCustomers(customers.filter(c => c.id !== id));

  const addVoucher = (v: Voucher) => setVouchers([v, ...vouchers]);
  const deleteVoucher = (id: string) => setVouchers(vouchers.filter(v => v.id !== id));

  const updateCustomerLoyalty = (id: string, addPoints: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newPoints = c.points + addPoints;
        let newLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
        if (newPoints >= 10000) newLevel = 'Platinum';
        else if (newPoints >= 5000) newLevel = 'Gold';
        else if (newPoints >= 1000) newLevel = 'Silver';
        return { ...c, points: newPoints, level: newLevel };
      }
      return c;
    }));
  };

  const addStockMovement = (m: StockMovement) => setStockHistory([m, ...stockHistory]);

  useEffect(() => {
    localStorage.setItem('munir_pos_users', JSON.stringify(users));
  }, [users]);

  const addUser = (u: User) => setUsers([u, ...users]);
  const updateUser = (u: User) => setUsers(users.map(old => old.id === u.id ? u : old));
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));
  const updateSettings = (s: StoreSettings) => setSettings(s);

  const authValue = { user, login, logout };
  const storeValue = { 
    products, 
    transactions, 
    customers,
    vouchers,
    stockHistory,
    users,
    settings,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addTransaction,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addVoucher,
    deleteVoucher,
    updateCustomerLoyalty,
    addStockMovement,
    addUser,
    updateUser,
    deleteUser,
    updateSettings
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly }) => {
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== Role.ADMIN) return <Navigate to="/" />;
    return <Layout>{children}</Layout>;
  };

  return (
    <AuthContext.Provider value={authValue}>
      <StoreContext.Provider value={storeValue}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><CustomerManagement /></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute><CustomerInsight /></ProtectedRoute>} />
            <Route path="/loyalty" element={<ProtectedRoute><Loyalty /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute adminOnly><Settings /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute adminOnly><Marketing /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute adminOnly><ProductManagement /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </StoreContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
