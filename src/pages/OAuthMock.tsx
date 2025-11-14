import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const GoogleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg">
    <path d="M255.9 133.5c0-10.1-.9-17.4-2.8-25H130v47.3h72.7c-1.5 11.8-9.6 29.6-27.5 41.6l-.3 2.4 40 31 2.8.3c25.5-23.5 40.2-58.1 40.2-97.6z" fill="#4285F4"/>
    <path d="M130 261.1c36.4 0 66.9-12 89.2-32.8l-42.5-32.9c-11.4 8-26.8 13.6-46.7 13.6-35.7 0-66-23.5-76.8-56l-2.3.2-41.6 32.2-.5 2.2C31.4 231.5 77.5 261.1 130 261.1z" fill="#34A853"/>
    <path d="M53.2 152.9c-2.9-8.6-4.6-17.8-4.6-27.3s1.7-18.7 4.5-27.3l-.1-1.8L11 63.5l-1.9.9C3.2 80.1 0 97.1 0 125.6s3.2 45.5 9.1 61.2l44.1-34z" fill="#FBBC05"/>
    <path d="M130 49.4c25.4 0 42.5 11 52.3 20.1l38.2-37.3C196.7 12.1 166.4 0 130 0 77.5 0 31.4 29.6 9.1 64.4L53 98.4C63.9 66 94.3 49.4 130 49.4z" fill="#EA4335"/>
  </svg>
);

const LinkedInLogo = () => (
  <svg width="22" height="22" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="#0A66C2" d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24.84 107 0 81.7 0 51.9 0 22 24.84 0 53.84 0s53.84 22 53.84 51.9c0 29.8-24.84 55.1-53.84 55.1zM447.9 448H355.2V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.6V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.6 42.7-48.5 87.8-48.5 93.9 0 111.2 61.8 111.2 142.3V448z"/>
  </svg>
);

const OAuthMock: React.FC = () => {
  const { provider } = useParams<{ provider: 'google' | 'linkedin' }>();
  const navigate = useNavigate();
  const q = useQuery();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const state = q.get('state') || '/';

  const brand = useMemo(() => {
    if (provider === 'linkedin') {
      return {
        name: 'LinkedIn',
        color: '#0A66C2',
        bg: 'from-gray-900 via-gray-800 to-blue-900',
        logo: <LinkedInLogo />,
        hint: 'Gunakan email dan password LinkedIn tiruan (apa saja) untuk melanjutkan.'
      } as const;
    }
    return {
      name: 'Google',
      color: '#4285F4',
      bg: 'from-gray-900 via-gray-800 to-primary-900',
      logo: <GoogleLogo />,
      hint: 'Masukkan email Google tiruan (apa saja) untuk melanjutkan.'
    } as const;
  }, [provider]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      const params = new URLSearchParams({ provider: provider || 'google', code: 'mock-code', state });
      navigate(`/auth/callback?${params.toString()}`);
    }, 900);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${brand.bg} text-white flex items-center justify-center p-6 relative`}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Link>

        <div className="bg-gray-900/70 backdrop-blur-xl rounded-card shadow-2xl border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              {brand.logo}
            </div>
            <div>
              <h1 className="text-xl font-bold">Masuk {brand.name}</h1>
              <p className="text-xs text-gray-400">Ini adalah halaman login tiruan untuk keperluan demo</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-primary-300/90 mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Proses aman & hanya simulasi, tidak terhubung ke {brand.name} asli</span>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder={`email@${provider === 'linkedin' ? 'linkedin' : 'gmail'}.com`}
                className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-white/10 focus:border-primary-500 outline-none"
              />
            </div>
            {provider === 'linkedin' ? (
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-white/10 focus:border-primary-500 outline-none"
                />
              </div>
            ) : null}

            <p className="text-xs text-gray-400 -mt-1">{brand.hint}</p>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: '#ffffff', color: '#111827' }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Mengalihkan…' : `Lanjutkan dengan ${brand.name}`}
            </motion.button>
          </form>

          <div className="mt-4 text-xs text-amber-300/90 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>Kami tidak menyimpan kredensial Anda. Halaman ini hanya meniru alur autentikasi {brand.name} agar terasa seperti nyata.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthMock;
