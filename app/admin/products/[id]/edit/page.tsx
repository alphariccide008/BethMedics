'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Supplements', 'Medical Devices', 'First Aid', 'Personal Care', 'Diagnostics', 'Monitoring'];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(p => setForm({
        ...p,
        comparePrice: p.comparePrice?.toString() || '',
        price: p.price.toString(),
        stock: p.stock.toString(),
        tags: p.tags.join(', '),
      }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((p: any) => ({
      ...p,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock) || 0,
        images: form.image ? [form.image] : [],
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      };
      delete payload.createdAt;
      delete payload.updatedAt;

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Product updated!');
        router.push('/admin/products');
      } else {
        toast.error('Failed to update product');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 size={40} className="animate-spin text-brand-purple" />
    </div>
  );

  if (!form) return (
    <div className="p-8 text-center">
      <p className="text-gray-500">Product not found</p>
      <Link href="/admin/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-brand-purple transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1 line-clamp-1">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 font-heading">Product Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    required rows={5} className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <input name="brand" value={form.brand || ''} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                    <input name="sku" value={form.sku || ''} onChange={handleChange} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} className="input-field" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 font-heading">Pricing & Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required className="input-field pl-8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compare Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input name="comparePrice" type="number" step="0.01" min="0" value={form.comparePrice} onChange={handleChange} className="input-field pl-8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 font-heading">Product Image</h2>
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className="input-field mb-3" />
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                {form.image ? (
                  <Image src={form.image} alt="" width={200} height={200} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="text-center text-gray-300">
                    <ImageIcon size={40} className="mx-auto mb-2" />
                    <p className="text-xs">No image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 font-heading">Settings</h2>
              <div className="space-y-4">
                {[
                  { name: 'featured', label: 'Featured Product', desc: 'Show on homepage' },
                  { name: 'active', label: 'Visible in Store', desc: 'Customers can see this' },
                ].map(({ name, label, desc }) => (
                  <label key={name} className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${form[name] ? 'bg-brand-purple' : 'bg-gray-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form[name] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="sr-only" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
