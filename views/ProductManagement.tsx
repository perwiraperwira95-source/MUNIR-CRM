
import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { Category, Product } from '../types';
import { Plus, Search, Edit2, Trash2, X, Upload, Image as ImageIcon, Check } from 'lucide-react';

const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: Category.MAKANAN,
    image: ''
  });

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        stock: 0,
        category: Category.MAKANAN,
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `PROD-${Date.now()}`,
      ...formData,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };

    if (editingProduct) updateProduct(newProduct, 'Manual Update from Product Management');
    else addProduct(newProduct);

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search master data..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm font-medium"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="luxury-gradient text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img src={p.image} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="" />
                    <div>
                      <h4 className="font-bold text-slate-800">{p.name}</h4>
                      <p className="text-xs text-slate-400">ID: {p.id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-black ${p.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                    {p.stock} units
                  </div>
                </td>
                <td className="px-6 py-4 font-black text-blue-900">
                  Rp {p.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => openModal(p)}
                      className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => { if(confirm('Delete product?')) deleteProduct(p.id) }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <p className="text-sm font-medium text-slate-500">Inventory Management Master Data</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm border border-slate-100">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700"
                    placeholder="e.g. Nasi Goreng Gila"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price (Rp)</label>
                    <input 
                      type="number" required
                      value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Initial Stock</label>
                    <input 
                      type="number" required
                      value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700 cursor-pointer"
                  >
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Media (URL)</label>
                  <div className="relative">
                    <input 
                      type="text" required
                      value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700 pr-10"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Image Preview</label>
                  <div className="w-full aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center group relative">
                    {formData.image ? (
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="mx-auto text-slate-300" size={40} />
                        <p className="text-xs text-slate-400 font-bold px-8">Valid URL required (jpg, png, webp)</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="bg-white/90 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl">Real-time Preview</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full luxury-gradient text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2 transform hover:scale-[1.02] transition-all"
                >
                  <Check size={20} />
                  <span>{editingProduct ? 'Update Inventory' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
