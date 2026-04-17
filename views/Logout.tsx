
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const Logout: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Add a small delay for visual feedback
    const timer = setTimeout(() => {
      logout();
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 text-center max-w-md w-full space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-blue-900 to-red-500 animate-gradient-x"></div>
        
        <div className="relative">
           <div className="w-24 h-24 bg-red-50 rounded-[35px] flex items-center justify-center text-red-500 mx-auto shadow-inner relative">
              <LogOut size={48} />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-[35px]"
              />
           </div>
        </div>

        <div className="space-y-2">
           <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Signing Out</h2>
           <p className="text-slate-400 font-medium">Please wait while we secure your session and finalize data synchronization.</p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-blue-900 font-bold">
           <Loader2 size={20} className="animate-spin" />
           <span className="text-sm uppercase tracking-widest">Processing...</span>
        </div>

        <div className="pt-4">
           <button 
             onClick={() => navigate('/login')}
             className="text-slate-400 hover:text-blue-900 font-black uppercase text-[10px] tracking-widest flex items-center justify-center space-x-2 w-full transition-colors"
           >
              <ArrowLeft size={14} />
              <span>Cancel & Return</span>
           </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-red-50 rounded-full blur-2xl opacity-50"></div>
      </motion.div>
    </div>
  );
};

export default Logout;
