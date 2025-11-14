
import { Zap, Clock, Rocket, AlertCircle } from 'lucide-react';

interface FeaturePlaceholderProps {
  title: string;
  description?: string;
}

const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-card border border-gray-200 p-10 text-center transition-colors">
      <div className="w-16 h-16 rounded-card bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
        <Zap className="text-white" size={34} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 mb-6 max-w-xl mx-auto">
        {description || 'Fitur ini sedang dalam pengembangan. Kami sedang membangun sesuatu yang luar biasa untuk membantu proses karir Anda.'}
      </p>
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-card bg-purple-100 text-primary-600 flex items-center justify-center mb-2">
            <Clock size={22} />
          </div>
          <div className="text-sm font-medium text-gray-700">Proses</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-card bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
            <Rocket size={22} />
          </div>
          <div className="text-sm font-medium text-gray-700">Segera Hadir</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-card bg-pink-100 text-pink-600 flex items-center justify-center mb-2">
            <AlertCircle size={22} />
          </div>
          <div className="text-sm font-medium text-gray-700">Notifikasi</div>
        </div>
      </div>
      <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/30 transition-all">
        <Rocket size={18} />
        Daftarkan Saya ke Beta
      </button>
    </div>
  );
};

export default FeaturePlaceholder;
