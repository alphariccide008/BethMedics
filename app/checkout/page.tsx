'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ShieldCheck, Truck, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    address: '', city: '', state: 'Lagos', phone: '', notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push('/login'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address: form.address, city: form.city, country: form.state, phone: form.phone, notes: form.notes }),
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        toast.error('Order failed. Please try again.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-card p-12 max-w-lg w-full text-center border border-gray-100">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Order Placed!</h2>
          <p className="text-gray-600 mb-2">Thank you for shopping with BethMedic.</p>
          <p className="text-gray-500 text-sm mb-8">You'll receive a confirmation email shortly. Your order will be processed and shipped within 1-2 business days.</p>
          <div className="flex gap-3">
            <Link href="/" className="flex-1 btn-outline text-center">Back to Home</Link>
            <Link href="/products" className="flex-1 btn-primary text-center">Shop More</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
          <Link href="/products" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-brand-purple transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold font-heading">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h2 className="font-bold text-lg text-gray-900 mb-5 font-heading flex items-center gap-2">
                <Truck size={20} className="text-brand-purple" />
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input name="address" type="text" value={form.address} onChange={handleChange}
                    placeholder="123 Main St, Apt 4" required className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City / LGA *</label>
                    <input name="city" type="text" value={form.city} onChange={handleChange}
                      placeholder="e.g. Ikeja" required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <select name="state" value={form.state} onChange={handleChange} className="input-field">
                      {['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT – Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="+234 800 000 0000" required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Any special delivery instructions..." rows={3}
                    className="input-field resize-none" />
                </div>
              </div>
            </div>

            {/* Payment notice */}
            <div className="bg-brand-purple-50 border border-brand-purple-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-brand-purple mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-brand-purple text-sm">Secure Checkout</p>
                  <p className="text-gray-600 text-xs mt-1">
                    This is a demo store. No real payment is processed. Orders are saved for admin review.
                  </p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
              {loading ? 'Placing Order...' : `Place Order — ₦${total().toLocaleString()}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-5 font-heading">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{total().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={total() >= 50000 ? 'text-green-600 font-medium' : ''}>
                    {total() >= 50000 ? 'FREE' : '₦2,500'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₦{(total() + (total() >= 50000 ? 0 : 2500)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
