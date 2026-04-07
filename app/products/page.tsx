'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { gsap } from 'gsap';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';

const categories = ['All', 'Supplements', 'Medical Devices', 'First Aid', 'Personal Care', 'Diagnostics', 'Monitoring'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const feat = searchParams.get('featured');
    if (feat === 'true') setCategory('All');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (searchParams.get('featured') === 'true' && !debouncedSearch) params.set('featured', 'true');

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          if (sort === 'price-asc') return a.price - b.price;
          if (sort === 'price-desc') return b.price - a.price;
          if (sort === 'name') return a.name.localeCompare(b.name);
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setProducts(sorted);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, debouncedSearch, sort, searchParams]);

  useEffect(() => {
    if (!loading && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">
            {category === 'All' ? 'All Products' : category}
          </h1>
          <p className="text-gray-500">{loading ? '...' : `${products.length} products found`}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field sm:w-52"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:border-brand-purple hover:text-brand-purple transition-colors sm:hidden"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-brand-purple text-white shadow-brand'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-purple hover:text-brand-purple'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={40} className="animate-spin text-brand-purple" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="mt-6 btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Loader2 size={40} className="animate-spin text-brand-purple" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
