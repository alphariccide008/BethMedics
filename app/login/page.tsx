'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) router.push('/');
  }, [session, router]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        toast.success('Welcome back!');
        router.push('/');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple-50 via-white to-brand-orange-50 flex items-center justify-center px-4 py-16">
      <div ref={cardRef} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold font-heading">
              Beth<span className="text-brand-purple">Medic</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100">
          {/* Demo credentials hint */}
          <div className="bg-brand-purple-50 border border-brand-purple-100 rounded-2xl p-4 mb-6">
            <p className="text-xs text-brand-purple font-medium mb-1">Demo Credentials</p>
            <p className="text-xs text-gray-600">Admin: <strong>admin@bethmedic.com</strong> / <strong>admin123</strong></p>
            <p className="text-xs text-gray-600">Customer: <strong>customer@example.com</strong> / <strong>customer123</strong></p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-3 mb-6 text-sm text-red-600">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link href="#" className="text-xs text-brand-purple hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-brand-purple font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <ShieldCheck size={14} />
          Secured with 256-bit SSL encryption
        </div>
      </div>
    </div>
  );
}
