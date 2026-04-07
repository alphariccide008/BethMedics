'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, Package } from 'lucide-react';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products?limit=200')
      .then(r => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        setProducts(p => p.filter(x => x.id !== id));
      } else {
        toast.error('Failed to delete product');
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, active: !product.active }),
      });
      if (res.ok) {
        toast.success(product.active ? 'Product hidden' : 'Product visible');
        fetchProducts();
      }
    } catch {
      toast.error('Failed to update product');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    Supplements: 'bg-purple-100 text-purple-700',
    'Medical Devices': 'bg-blue-100 text-blue-700',
    'First Aid': 'bg-red-100 text-red-700',
    'Personal Care': 'bg-green-100 text-green-700',
    Diagnostics: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-11 max-w-md"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Loader2 size={32} className="animate-spin text-brand-purple mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Package size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products found</p>
                    <Link href="/admin/products/new" className="mt-3 inline-block btn-primary text-sm">
                      Add First Product
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm line-clamp-1">{product.name}</p>
                          {product.sku && <p className="text-xs text-gray-400">{product.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`badge text-xs ${statusColors[product.category] || 'bg-gray-100 text-gray-600'}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
                        {product.comparePrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">₦{product.comparePrice.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-500' : product.stock < 30 ? 'text-orange-500' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggle(product)} className="flex items-center gap-1.5 text-xs font-medium">
                        {product.active
                          ? <><ToggleRight size={20} className="text-green-500" /> <span className="text-green-600">Live</span></>
                          : <><ToggleLeft size={20} className="text-gray-400" /> <span className="text-gray-500">Hidden</span></>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-brand-purple-50 flex items-center justify-center text-brand-purple hover:bg-brand-purple hover:text-white transition-all"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          {deleting === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
  );
}
