'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Supplements', 'Medical Devices', 'First Aid', 'Personal Care', 'Diagnostics', 'Monitoring'];

const defaultForm = {
  name: '', description: '', price: '', comparePrice: '', image: '',
  category: 'Supplements', brand: '', stock: '', sku: '',
  tags: '', featured: false, active: true,
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === 'image') setImagePreview(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock) || 0,
        images: form.image ? [form.image] : [],
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Product created successfully!');
        router.push('/admin/products');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create product');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-brand-purple transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to add a product to the store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 font-heading">Product Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="e.g. Omega-3 Fish Oil Softgels 1000mg" required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Detailed product description..." required rows={5}
                    className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <input name="brand" value={form.brand} onChange={handleChange}
                      placeholder="BethMedic" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                    <input name="sku" value={form.sku} onChange={handleChange}
                      placeholder="BM-SUP-001" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange}
                    placeholder="omega-3, heart health, supplements" className="input-field" />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 font-heading">Pricing & Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange}
                      placeholder="0.00" required className="input-field pl-8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compare Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input name="comparePrice" type="number" step="0.01" min="0" value={form.comparePrice} onChange={handleChange}
                      placeholder="0.00" className="input-field pl-8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
                    placeholder="0" required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 font-heading">Product Image</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                <input name="image" value={form.image} onChange={handleChange}
                  placeholder="https://example.com/image.jpg" required className="input-field" />
                <p className="text-xs text-gray-400 mt-2">Paste a direct image URL (HTTPS recommended)</p>
              </div>

              {/* Preview */}
              <div className="mt-4 aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('')}
                  />
                ) : (
                  <div className="text-center text-gray-300">
                    <ImageIcon size={40} className="mx-auto mb-2" />
                    <p className="text-xs">Image preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 font-heading">Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-11 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-brand-purple' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="sr-only" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Featured Product</p>
                    <p className="text-xs text-gray-400">Show on homepage</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-11 h-6 rounded-full transition-colors relative ${form.active ? 'bg-brand-purple' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="sr-only" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Visible in Store</p>
                    <p className="text-xs text-gray-400">Customers can see this</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={saving}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
