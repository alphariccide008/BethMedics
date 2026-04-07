'use client';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-28 h-28 rounded-full bg-brand-purple-50 flex items-center justify-center">
          <ShoppingBag size={52} className="text-brand-purple/30" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-heading">Your cart is empty</h2>
          <p className="text-gray-500">Looks like you haven't added any products yet.</p>
        </div>
        <Link href="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">{items.reduce((s, i) => s + i.quantity, 0)} items</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-card p-5 border border-gray-100 flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-brand-purple transition-colors line-clamp-2 text-sm mb-1 block">
                    {item.name}
                  </Link>
                  <p className="text-brand-purple font-bold text-lg">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-40">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-red-400 hover:text-red-600 text-sm transition-colors">
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-bold text-gray-900 text-base flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Link href="/products" className="text-brand-purple hover:text-brand-purple-dark font-medium text-sm transition-colors">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-5 font-heading">Order Summary</h2>
              <div className="space-y-3 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${total().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={total() >= 50 ? 'text-green-600 font-semibold' : ''}>
                    {total() >= 50 ? 'FREE' : '$5.99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Estimated Tax</span>
                  <span>${(total() * 0.08).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-xl pt-5 mb-6">
                <span>Total</span>
                <span>${(total() + (total() >= 50 ? 0 : 5.99) + total() * 0.08).toFixed(2)}</span>
              </div>

              {total() < 50 && (
                <div className="bg-brand-orange-50 border border-brand-orange/20 rounded-xl p-3 mb-5 text-sm text-brand-orange-dark">
                  Add <strong>${(50 - total()).toFixed(2)}</strong> more for free shipping!
                </div>
              )}

              <Link href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-brand text-base mb-3">
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
                <ShieldCheck size={14} />
                Secure & encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
