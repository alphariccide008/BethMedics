'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { gsap } from 'gsap';

export default function CartSidebar() {
  const pathname = usePathname();
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCartStore();
  if (pathname?.startsWith('/admin')) return null;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarRef.current || !overlayRef.current) return;
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(sidebarRef.current, { x: '100%' }, { x: 0, duration: 0.4, ease: 'power3.out' });
    } else {
      gsap.to(sidebarRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl translate-x-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple-50 flex items-center justify-center">
              <ShoppingBag size={20} className="text-brand-purple" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg font-heading">Your Cart</h2>
              <p className="text-sm text-gray-500">{count()} item{count() !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-24 h-24 rounded-full bg-brand-purple-50 flex items-center justify-center">
                <ShoppingBag size={40} className="text-brand-purple/40" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Your cart is empty</p>
                <p className="text-sm text-gray-500">Add some products to get started!</p>
              </div>
              <button
                onClick={closeCart}
                className="btn-primary text-sm px-6 py-2.5"
              >
                Shop Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-3 hover:bg-brand-purple-50/30 transition-colors">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm leading-tight line-clamp-2 mb-1.5">
                    {item.name}
                  </p>
                  <p className="font-bold text-brand-purple text-sm">₦{item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-brand-purple hover:text-brand-purple transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-brand-purple hover:text-brand-purple transition-colors disabled:opacity-50"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-xl text-gray-900">₦{total().toLocaleString()}</span>
            </div>
            {total() < 50000 && (
              <div className="bg-brand-orange-50 rounded-xl p-3 text-sm text-brand-orange-dark">
                Add ₦{(50000 - total()).toLocaleString()} more for <strong>free shipping!</strong>
              </div>
            )}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-brand"
            >
              Checkout
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/products"
              onClick={closeCart}
              className="block text-center text-sm text-brand-purple hover:text-brand-purple-dark font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
