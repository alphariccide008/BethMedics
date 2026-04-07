'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, Eye, BadgeCheck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem);
  const [wishlist, setWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAdd = () => {
    setAdding(true);
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, stock: product.stock });
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="product-card group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-purple-100 hover:shadow-[0_12px_50px_rgba(124,58,237,0.12)] transition-all duration-400 hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 h-56">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-5xl">💊</div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="product-image object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-[#F97316] text-white font-black shadow-lg">-{discount}%</span>
          )}
          {product.featured && (
            <span className="badge bg-[#7C3AED] text-white font-bold">Featured</span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="badge bg-red-500 text-white font-semibold">Low Stock</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-400 text-white font-semibold">Sold Out</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setWishlist(!wishlist)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <Heart size={16} className={wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>

        {/* Quick view */}
        <Link
          href={`/products/${product.id}`}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur text-[#7C3AED] text-xs font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#7C3AED] hover:text-white shadow-lg whitespace-nowrap"
        >
          <Eye size={12} />
          Quick View
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand + category */}
        <div className="flex items-center gap-2 mb-2">
          {product.brand && (
            <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest">{product.brand}</span>
          )}
          <span className="text-[10px] text-gray-300">•</span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{product.category}</span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-slate-800 text-sm leading-snug mb-2.5 hover:text-[#7C3AED] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">(128)</span>
          <div className="flex items-center gap-1 ml-auto">
            <BadgeCheck size={13} className="text-emerald-500" />
            <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-slate-900">₦{product.price.toLocaleString()}</span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">₦{product.comparePrice.toLocaleString()}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
              adding
                ? 'bg-emerald-500 text-white scale-95'
                : product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#7C3AED] hover:bg-[#6B21A8] text-white hover:scale-105 shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
            }`}
          >
            <ShoppingCart size={13} />
            {adding ? '✓ Added' : product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
