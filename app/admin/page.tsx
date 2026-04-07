'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight, Plus, MessageSquare, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  pendingOrders: number;
  lowStock: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
    ]).then(([products, orders]) => {
      const totalRevenue = orders.reduce((s: number, o: any) => s + o.total, 0);
      const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;
      const lowStock = products.filter((p: any) => p.stock < 10 && p.active);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5),
        pendingOrders,
        lowStock: lowStock.slice(0, 5),
      });
    }).finally(() => setLoading(false));
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
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-brand-purple',
      light: 'bg-brand-purple-50',
      text: 'text-brand-purple',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: 'bg-brand-orange',
      light: 'bg-brand-orange-50',
      text: 'text-brand-orange',
    },
    {
      label: 'Revenue',
      value: `₦${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      light: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders ?? 0,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      light: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Beth! Here's what's happening today.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, light, text }) => (
          <div key={label} className="card p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${light} flex items-center justify-center`}>
                <Icon size={22} className={text} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${light} ${text}`}>
                {label === 'Pending Orders' && (value as number) > 0 ? 'Action needed' : 'Active'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 font-heading">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 font-heading">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-brand-purple hover:text-brand-purple-dark flex items-center gap-1 font-medium">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats?.recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-brand-purple-50 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={16} className="text-brand-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-500">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                  <span className={`badge text-xs ${statusColors[order.status]}`}>{order.status}</span>
                  <span className="font-bold text-gray-900 text-sm">₦{order.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="card p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 font-heading">Low Stock Alert</h2>
            <Link href="/admin/products" className="text-sm text-brand-purple hover:text-brand-purple-dark flex items-center gap-1 font-medium">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : stats?.lowStock.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">All products are well-stocked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.lowStock.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-red-500 font-medium">{p.stock} left</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
            <Link href="/admin/products/new" className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-brand-purple-50 text-brand-purple text-sm font-medium hover:bg-brand-purple hover:text-white transition-all">
              <Plus size={16} />
              Add New Product
            </Link>
            <Link href="/admin/chat" className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-brand-orange-50 text-brand-orange text-sm font-medium hover:bg-brand-orange hover:text-white transition-all">
              <MessageSquare size={16} />
              Customer Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
