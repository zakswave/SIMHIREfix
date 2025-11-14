import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const OAuthCallback: React.FC = () => {
  const q = useQuery();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const provider = q.get('provider') || 'google';
  const state = q.get('state') || '/dashboard';
  const code = q.get('code');

  useEffect(() => {
    const t = setTimeout(() => {
      if (code === 'mock-code') {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 900);
    return () => clearTimeout(t);
  }, [code]);

  useEffect(() => {
    if (status === 'success') {
      const t = setTimeout(() => {
        navigate(state);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [status, state, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-md text-center">
        <Link to="/login" className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Link>
        <div className="bg-gray-900/70 backdrop-blur-xl rounded-card shadow-2xl border border-white/10 p-8">
          {status === 'pending' ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
              <p className="text-sm text-gray-300">Memverifikasi kode {provider}…</p>
            </div>
          ) : null}

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-primary-400" />
              <h2 className="text-xl font-semibold">Berhasil terautentikasi</h2>
              <p className="text-sm text-gray-300">Mengalihkan ke halaman tujuan…</p>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="flex flex-col items-center gap-2">
              <XCircle className="w-10 h-10 text-red-400" />
              <h2 className="text-xl font-semibold">Gagal memverifikasi</h2>
              <p className="text-sm text-gray-300">Kode tidak valid. Coba ulang proses login.</p>
              <Link to="/login" className="mt-2 text-primary-400 hover:text-primary-300">Kembali ke Login</Link>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthCallback;
