import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollTo = (targetSelector: string) => {
    const target = document.querySelector(targetSelector) as HTMLElement | null;
    if (!target) return;
    const headerEl = document.querySelector('header') as HTMLElement | null;
    const headerOffset = headerEl ? headerEl.offsetHeight : 0;
    const extraGap = 8;
    const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - extraGap;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed w-full z-50 text-white transition-all duration-500 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 lg:py-6">
          <Link to="/" className="flex items-center transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/logo.png" 
              alt="SimHire Logo" 
              className="h-10 w-auto"
            />
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              SimHire
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {[
              { label: 'Beranda', href: '#home' },
              { label: 'Fitur', href: '#candidate-features' },
              { label: 'Cara Kerja', href: '#how-it-works' },
              { label: 'Dampak', href: '#impact' },
            ].map((item, index) => (
              <a 
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative group py-2 px-1 hover:text-emerald-400 transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Link to="/login" className="hidden lg:block px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-105">
                  Masuk
                </Link>
                <Link to="/register" className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-emerald-500/25 relative overflow-hidden">
                  <span className="relative z-10">Mulai</span>
                  <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-500 ease-out will-change-transform"></span>
                </Link>
              </>
            )}
            {user && (
              <Link to="/dashboard/profile" className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm shadow ${user.avatarColor||'bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}>
                {user.name.charAt(0)}
              </Link>
            )}
          </div>

          <button 
            className="lg:hidden transform hover:scale-110 transition-transform duration-300 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {}
        <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <img 
                  src="/logo.png" 
                  alt="SimHire Logo" 
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-lg font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  SimHire
                </span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {}
            {user && (
              <div className="p-6 border-b border-gray-700/50">
                <Link 
                  to="/dashboard/profile" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-500/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white shadow-lg ${user.avatarColor||'bg-gray-400'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    <p className="text-emerald-300 text-sm">Lihat Profil</p>
                  </div>
                </Link>
              </div>
            )}

            {}
            <nav className="flex-1 overflow-y-auto py-6">
              <div className="px-4 space-y-2">
                {[
                  { label: 'Beranda', href: '#home' },
                  { label: 'Fitur', href: '#candidate-features' },
                  { label: 'Cara Kerja', href: '#how-it-works' },
                  { label: 'Dampak', href: '#impact' },
                ].map((item, index) => (
                  <a 
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center px-4 py-3 text-white hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all duration-300 transform hover:translate-x-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </nav>

            {}
            {!user && (
              <div className="p-6 border-t border-gray-700/50 space-y-3">
                <Link 
                  to="/login" 
                  className="block w-full text-center px-4 py-3 text-white border border-emerald-500 rounded-lg font-medium hover:bg-emerald-500/10 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-4 py-3 rounded-lg font-medium text-white transition-all duration-300 shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mulai Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
