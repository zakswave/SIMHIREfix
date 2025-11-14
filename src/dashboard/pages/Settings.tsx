
import { useUser } from '../../context/UserContext';
import { Bell, Globe, Shield } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useUser();

  const Toggle: React.FC<{label:string; value:boolean; onChange:(v:boolean)=>void; description?:string; icon?:React.ReactNode}> = ({label, value, onChange, description, icon}) => (
    <div className="flex items-start justify-between py-4 border-b last:border-b-0">
      <div className="space-y-1 pr-6">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium text-gray-900 text-sm">{label}</span>
        </div>
        {description && <p className="text-xs text-gray-500 max-w-sm">{description}</p>}
      </div>
      <button
        onClick={()=>onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${value? 'bg-primary-600':'bg-gray-300'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${value? 'translate-x-5':'translate-x-1'}`}></span>
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan</h1>
        <p className="text-gray-600 text-sm">Kelola preferensi akun dan privasi Anda.</p>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-6 divide-y">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center space-x-2"><Bell size={16} /> <span>Notifikasi</span></h2>
        <Toggle
          label="Email Notifikasi"
          value={settings.emailNotifications}
          onChange={v=>updateSettings({emailNotifications:v})}
          description="Dapatkan update perkembangan simulasi dan peluang baru."
        />
        <Toggle
          label="Push Notifikasi"
          value={settings.pushNotifications}
          onChange={v=>updateSettings({pushNotifications:v})}
          description="Tampilkan notifikasi real-time di browser (mock)."
        />
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-6 divide-y">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center space-x-2"><Shield size={16} /> <span>Privasi & Data</span></h2>
        <Toggle
          label="Berbagi Data Anonim"
            value={settings.dataSharing}
            onChange={v=>updateSettings({dataSharing:v})}
            description="Izinkan penggunaan data anonim untuk peningkatan platform."
        />
        <div className="py-4 border-b last:border-b-0 flex items-center justify-between">
          <div className="space-y-1 pr-6">
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-gray-500" />
              <span className="font-medium text-gray-900 text-sm">Bahasa</span>
            </div>
            <p className="text-xs text-gray-500">Pilih bahasa utama aplikasi.</p>
          </div>
          <select
            value={settings.language}
            onChange={e=>updateSettings({language: e.target.value as any})}
            className="px-3 py-2 rounded-lg border bg-white text-sm focus:ring-primary-500 focus:outline-none"
          >
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="py-4 flex items-center justify-between">
          <div className="space-y-1 pr-6">
            <div className="flex items-center space-x-2">
              <Shield size={16} className="text-gray-500" />
              <span className="font-medium text-gray-900 text-sm">Visibilitas Profil</span>
            </div>
            <p className="text-xs text-gray-500">Atur siapa yang dapat melihat profil Anda.</p>
          </div>
          <select
            value={settings.profileVisibility}
            onChange={e=>updateSettings({profileVisibility: e.target.value as any})}
            className="px-3 py-2 rounded-lg border bg-white text-sm focus:ring-primary-500 focus:outline-none"
          >
            <option value="public">Publik</option>
            <option value="connections">Koneksi Saja</option>
            <option value="private">Privat</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Settings;
