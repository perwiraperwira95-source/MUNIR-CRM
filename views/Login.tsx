
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Lock, Mail, ChevronRight, Store } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@munir.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen luxury-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl relative">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-900 rounded-2xl mb-4 shadow-xl">
               <Store size={40} className="text-amber-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Munir Official</h1>
            <p className="text-slate-500 font-medium mt-1">Premium Point of Sale Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-slate-800"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Secret Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-slate-800"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-gradient hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In Now'}</span>
              {!loading && <ChevronRight size={20} />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Demo access: <br/> 
              <span className="text-blue-600 font-bold">admin@munir.com</span> (Admin) <br/>
              <span className="text-blue-600 font-bold">cashier@munir.com</span> (Cashier)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
