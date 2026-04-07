'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ShoppingBag, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then(r => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Status updated');
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(o => statusFilter === 'ALL' || o.status === statusFilter);
  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders · ₦{totalRevenue.toLocaleString()} revenue</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['ALL', ...statuses].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              statusFilter === s ? 'bg-brand-purple text-white shadow-brand' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-purple'
            }`}>
            {s} {s !== 'ALL' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={40} className="animate-spin text-brand-purple" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center border border-gray-100">
            <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              {/* Order header */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple-50 flex items-center justify-center">
                    <ShoppingBag size={18} className="text-brand-purple" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{order.user?.name}</p>
                    <p className="text-xs text-gray-500">{format(new Date(order.createdAt), 'MMM d, yyyy · h:mm a')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900 hidden sm:block">₦{order.total.toLocaleString()}</span>
                  <select
                    value={order.status}
                    onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                    onClick={e => e.stopPropagation()}
                    disabled={updating === order.id}
                    className={`text-xs font-semibold border rounded-full px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple transition-colors ${statusColors[order.status]}`}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {expanded === order.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</p>
                            </div>
                            <p className="text-sm font-bold text-gray-900">₦{(item.quantity * item.price).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">Shipping Details</h4>
                      <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
                        <p><span className="text-gray-500">Customer:</span> <span className="font-medium">{order.user?.name}</span></p>
                        <p><span className="text-gray-500">Email:</span> <span className="font-medium">{order.user?.email}</span></p>
                        <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.phone}</span></p>
                        <p><span className="text-gray-500">Address:</span> <span className="font-medium">{order.address}, {order.city}, {order.country}</span></p>
                        {order.notes && <p><span className="text-gray-500">Notes:</span> <span className="font-medium">{order.notes}</span></p>}
                        <div className="pt-2 border-t border-gray-100 flex justify-between">
                          <span className="text-gray-500">Total:</span>
                          <span className="font-bold text-brand-purple text-base">₦{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
