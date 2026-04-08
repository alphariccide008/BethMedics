'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Package, ShoppingBag, TrendingUp, ArrowRight, Plus, MessageSquare, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  pendingOrders: number;
  lowStock: any[];
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    pendingOrders: 0,
    lowStock: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
        ]);

        const products = pRes.ok ? await pRes.json() : [];
        const orders = oRes.ok ? await oRes.json() : [];

        const safeProducts = Array.isArray(products) ? products : [];
        const safeOrders = Array.isArray(orders) ? orders : [];

        setStats({
          totalProducts: safeProducts.length,
          totalOrders: safeOrders.length,
          totalRevenue: safeOrders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0),
          recentOrders: safeOrders.slice(0, 5),
          pendingOrders: safeOrders.filter((o: any) => o.status === 'PENDING').length,
          lowStock: safeProducts.filter((p: any) => p.stock < 10 && p.active).slice(0, 5),
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loading && cardsRef.current) {
      gsap.fromTo(cardsRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      iconBg: 'bg-purple-50',
      iconColor: 'text-[#7C3AED]',
      badgeBg: 'bg-purple-50 text-[#7C3AED]',
      borderColor: 'border-purple-100',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      iconBg: 'bg-orange-50',
      iconColor: 'text-[#F97316]',
      badgeBg: 'bg-orange-50 text-[#F97316]',
      borderColor: 'border-orange-100',
    },
    {
      label: 'Total Revenue',
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      badgeBg: 'bg-green-50 text-green-600',
      borderColor: 'border-green-100',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: AlertTriangle,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      badgeBg: 'bg-yellow-50 text-yellow-600',
      borderColor: 'border-yellow-100',
    },
  ];

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Dr. Precious! Here's your store overview.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6B21A8] text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-md whitespace-nowrap"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>Could not connect to database. Check your environment variables on Vercel.</span>
        </div>
      )}

      {/* Stat cards */}
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))
          : statCards.map(({ label, value, icon: Icon, iconBg, iconColor, badgeBg, borderColor }) => (
              <div
                key={label}
                className={`bg-white rounded-2xl border ${borderColor} p-5 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon size={22} className={iconColor} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeBg}`}>
                    {label === 'Pending Orders' && stats.pendingOrders > 0 ? 'Action needed' : 'Live'}
                  </span>
                </div>
                <p className="text-2xl font-black text-gray-900 font-heading">{value}</p>
                <p className="text-sm text-gray-400 mt-1 font-medium">{label}</p>
              </div>
            ))}
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 font-heading text-base">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[#7C3AED] hover:text-[#6B21A8] flex items-center gap-1 font-semibold"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm font-medium">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={15} className="text-[#7C3AED]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {order.user?.name || 'Guest'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(order.createdAt), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                    ₦{Number(order.total).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-6">
          {/* Low Stock */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 font-heading text-base">Low Stock Alert</h2>
              <Link
                href="/admin/products"
                className="text-sm text-[#7C3AED] hover:text-[#6B21A8] flex items-center gap-1 font-semibold"
              >
                Manage <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : stats.lowStock.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package size={32} className="mx-auto mb-2 text-gray-200" />
                <p className="text-xs font-medium">All products well-stocked</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.lowStock.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100"
                  >
                    <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-red-500 font-bold">{p.stock} left</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 font-heading text-base mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-purple-50 text-[#7C3AED] text-sm font-semibold hover:bg-[#7C3AED] hover:text-white transition-all group"
              >
                <Plus size={16} />
                Add New Product
              </Link>
              <Link
                href="/admin/chat"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-orange-50 text-[#F97316] text-sm font-semibold hover:bg-[#F97316] hover:text-white transition-all group"
              >
                <MessageSquare size={16} />
                Customer Messages
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-all group"
              >
                <ShoppingBag size={16} />
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
