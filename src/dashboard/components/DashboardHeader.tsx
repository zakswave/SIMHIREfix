import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Settings, User, LogOut, Menu, X, Home, Briefcase, Zap, GraduationCap, FileText, FileCode, Folder } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const DashboardHeader: React.FC = () => {
  const { user, logout, mockLogin } = useUser();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatar = (
    <button
      onClick={() => setOpen(o => !o)}
      className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm shadow ${user?.avatarColor || 'bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
      aria-haspopup="true"
      aria-expanded={open}
    >
      {user ? user.name.charAt(0) : <User size={16} />}
    </button>
  );

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 relative z-40 transition-colors">
      <div className="flex items-center justify-between">
        {}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <img 
              src="/logo.png" 
              alt="SimHire Logo" 
              className="h-8 w-auto group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-semibold text-gray-900 hidden sm:block">SimHire</span>
          </Link>
        </div>

        {}
        <nav className="hidden lg:flex items-center space-x-2">
          <NavLink to="/dashboard" end className={({ isActive }) => `px-3 py-2 rounded-button font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
            Beranda
          </NavLink>
          <NavLink to="/dashboard/job-finder" className={({ isActive }) => `px-3 py-2 rounded-button font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
            Pekerjaan
          </NavLink>
          <NavLink to="/dashboard/simulasi-kerja" className={({ isActive }) => `px-3 py-2 rounded-button font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
            Simulasi
          </NavLink>
          <NavLink to="/dashboard/apprenticeship-tracker" className={({ isActive }) => `px-3 py-2 rounded-button font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
            Daftar Magang
          </NavLink>
          <NavLink to="/dashboard/application-tracker" className={({ isActive }) => `px-3 py-2 rounded-button font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
            Status Lamaran
          </NavLink>
          <NavLink to="/dashboard/auto-cv" className={({ isActive }) => `px-3 py-2 rounded-button font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
            CV
          </NavLink>
          <NavLink to="/dashboard/portfolio" className={({ isActive }) => `px-3 py-2 rounded-button font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
            Portofolio
          </NavLink>
        </nav>

        {}
        <div className="flex items-center space-x-2" ref={dropdownRef}>
          <NavLink to="/dashboard/settings" className={({ isActive }) => `p-2 rounded-button transition-all hidden sm:block ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
            <Settings size={18} />
          </NavLink>
          <button className="p-2 rounded-button text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all relative hidden sm:block">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>
          {avatar}

          {}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {}
          {open && (
            <div className="absolute top-14 right-4 md:right-6 w-60 bg-white border border-gray-200 rounded-card shadow-card-hover py-2 animate-in fade-in zoom-in" role="menu">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    {user.headline && <p className="text-xs text-gray-500 line-clamp-1">{user.headline}</p>}
                  </div>
                  <button onClick={()=>{navigate('/dashboard/profile'); setOpen(false);}} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Profil
                  </button>
                  <button onClick={()=>{navigate('/dashboard/settings'); setOpen(false);}} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Pengaturan
                  </button>
                  <div className="my-1 border-t border-gray-100" />
                  <button onClick={()=>{logout(); setOpen(false);}} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors">
                    <LogOut size={14} /> <span>Keluar</span>
                  </button>
                </>
              ) : (
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-600 mb-3">Anda belum login.</p>
                  <button onClick={()=>{mockLogin(); setOpen(false);}} className="w-full px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Login Demo</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <img 
                src="/logo.png" 
                alt="SimHire Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-bold text-gray-900">
                SimHire
              </span>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {}
          {user && (
            <div className="p-6 border-b border-gray-200">
              <Link 
                to="/dashboard/profile" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white shadow-lg ${user.avatarColor||'bg-gray-400'}`}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{user.name}</p>
                  <p className="text-primary-600 text-sm">Lihat Profil</p>
                </div>
              </Link>
            </div>
          )}

          {}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-1">
              <NavLink 
                to="/dashboard" 
                end
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 mr-3" />
                <span className="font-medium">Beranda</span>
              </NavLink>

              <NavLink 
                to="/dashboard/job-finder" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase className="w-5 h-5 mr-3" />
                <span className="font-medium">Pekerjaan</span>
              </NavLink>

              <NavLink 
                to="/dashboard/simulasi-kerja" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Zap className="w-5 h-5 mr-3" />
                <span className="font-medium">Simulasi</span>
              </NavLink>

              <NavLink 
                to="/dashboard/apprenticeship-tracker" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                <span className="font-medium">Daftar Magang</span>
              </NavLink>

              <NavLink 
                to="/dashboard/application-tracker" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-5 h-5 mr-3" />
                <span className="font-medium">Status Lamaran</span>
              </NavLink>

              <NavLink 
                to="/dashboard/auto-cv" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileCode className="w-5 h-5 mr-3" />
                <span className="font-medium">CV</span>
              </NavLink>

              <NavLink 
                to="/dashboard/portfolio" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Folder className="w-5 h-5 mr-3" />
                <span className="font-medium">Portofolio</span>
              </NavLink>

              <div className="my-2 border-t border-gray-200" />

              <NavLink 
                to="/dashboard/settings" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Pengaturan</span>
              </NavLink>

              <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                <Bell className="w-5 h-5 mr-3" />
                <span className="font-medium">Notifikasi</span>
                <span className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>
            </div>
          </nav>

          {}
          {user && (
            <div className="p-6 border-t border-gray-200">
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }} 
                className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Keluar
              </button>
            </div>
          )}

          {!user && (
            <div className="p-6 border-t border-gray-200">
              <button 
                onClick={() => { mockLogin(); setMobileMenuOpen(false); }} 
                className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                Login Demo
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
