import { useEffect, useState, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Briefcase, 
  BarChart3, 
  UserSearch, 
  FileText, 
  Settings, 
  LogOut,
  Activity,
  Menu,
  X,
  Trophy,
  GraduationCap
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { initializeCompanyData } from '@/lib/company/data';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const CompanyLayout: React.FC = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasCheckedAuth = useRef(false);
  useEffect(() => {
    initializeCompanyData();
  }, []);
  const handleLogout = () => {
    logout();
  };
  useEffect(() => {
    if (hasCheckedAuth.current) return;

    if (user) {
      hasCheckedAuth.current = true;

      if (user.role !== 'company') {
        console.log('[CompanyLayout] Not a company user, redirecting to dashboard');
        window.location.href = '/dashboard';
      }
    } else if (user === null) {
      hasCheckedAuth.current = true;
      console.log('[CompanyLayout] No user, redirecting to login');
      window.location.href = '/login';
    }
  }, [user]);

  const navigation = [
    { name: 'Overview', href: '/company', icon: BarChart3, exact: true },
    { name: 'Lowongan Kerja', href: '/company/jobs', icon: Briefcase },
    { name: 'Lowongan Magang', href: '/company/internships', icon: GraduationCap },
    { name: 'Simulasi Kerja', href: '/company/simulasi', icon: Trophy },
    { name: 'Pelamar', href: '/company/applicants', icon: Users },
    { name: 'Pencarian Talenta', href: '/company/talent', icon: UserSearch },
    { name: 'Template Evaluasi', href: '/company/evaluation-templates', icon: FileText },
    { name: 'Tim', href: '/company/team', icon: Users },
    { name: 'Aktivitas', href: '/company/activity', icon: Activity }
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  if (!user || user.role !== 'company') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Memuat dashboard perusahaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
      {}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transition-colors transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>

        {}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="SimHire Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="font-semibold text-gray-900 text-sm">SimHire Company</h1>
              <p className="text-xs text-gray-600 truncate max-w-[120px]">{user.name}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-button text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/company/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-button transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            Pengaturan
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-button transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Keluar
          </button>

          {}
          <div className="pt-2">
            <Badge variant="secondary" className="w-full justify-center text-xs">
              Demo Mode
            </Badge>
          </div>
        </div>
      </div>

      {}
      <div className="lg:ml-64">
        {}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-button text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href, item.exact))?.name || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-full ${user.avatarColor || 'bg-gradient-to-br from-primary-500 to-primary-700'} flex items-center justify-center`}>
                    <span className="text-sm font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">Company</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/company/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Pengaturan Akun
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
