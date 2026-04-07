'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import {
  ShoppingCart, ArrowLeft, Star, Shield, Truck, RotateCcw,
  Plus, Minus, Heart, Share2, Loader2, CheckCircle2, Package
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        if (data.category) {
          fetch(`/api/products?category=${encodeURIComponent(data.category)}&limit=4`)
            .then((r) => r.json())
            .then((rel) => setRelated(rel.filter((p: Product) => p.id !== id).slice(0, 4)));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        stock: product.stock,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product?.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <Link href="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-purple transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-purple transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-brand-purple transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-brand-purple transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-card border border-gray-100 relative">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 badge bg-brand-orange text-white font-bold">
                  -{discount}% OFF
                </div>
              )}
              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart size={18} className={wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-brand-purple shadow-brand' : 'border-gray-200'}`}
                  >
                    <Image src={img} alt="" width={80} height={80} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & category */}
            <div className="flex items-center gap-3">
              {product.brand && (
                <span className="badge bg-brand-purple-50 text-brand-purple font-semibold">{product.brand}</span>
              )}
              <span className="badge bg-gray-100 text-gray-600">{product.category}</span>
              {product.featured && (
                <span className="badge bg-brand-orange text-white">Featured</span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-gray-600 text-sm">4.2 (128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
              {product.comparePrice && (
                <div>
                  <span className="text-lg text-gray-400 line-through block">₦{product.comparePrice.toLocaleString()}</span>
                  <span className="text-green-600 text-sm font-semibold">Save ₦{(product.comparePrice - product.price).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <Package size={16} className={product.stock > 0 ? 'text-green-500' : 'text-red-500'} />
              <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
              {product.sku && <span className="text-gray-400 text-xs ml-auto">SKU: {product.sku}</span>}
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                    added
                      ? 'bg-green-500 text-white scale-95'
                      : 'bg-brand-purple hover:bg-brand-purple-dark text-white hover:scale-[1.02] shadow-brand'
                  }`}
                >
                  {added ? (
                    <><CheckCircle2 size={20} /> Added to Cart!</>
                  ) : (
                    <><ShoppingCart size={20} /> Add to Cart</>
                  )}
                </button>
              </div>
            )}

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { icon: Shield, text: 'Authentic' },
                { icon: Truck, text: 'Free Shipping $50+' },
                { icon: RotateCcw, text: '30-Day Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 text-center">
                  <Icon size={18} className="text-brand-purple" />
                  <span className="text-xs text-gray-600 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="badge bg-gray-100 text-gray-600 text-xs">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
