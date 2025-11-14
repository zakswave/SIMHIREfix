import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Server, TrendingUp, Palette, BarChart3, PenTool, 
  Star, Users, Clock, Trophy, Target, Award, Search,
  Filter, ChevronRight, Play
} from 'lucide-react';
import { SIMULASI_CATEGORIES, type SimulasiCategory, getDifficultyColor } from '@/lib/simulasiData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { StatsCard } from '../components/StatsCard';

const getIcon = (iconName: string) => {
  const icons: any = {
    Code, Server, TrendingUp, Palette, BarChart3, PenTool
  };
  return icons[iconName] || Code;
};

const SimulasiKerja: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const filteredCategories = SIMULASI_CATEGORIES.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty = selectedDifficulty === 'all' || category.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  const stats = [
    { 
      label: 'Total Simulasi', 
      value: SIMULASI_CATEGORIES.length, 
      icon: Target, 
      color: 'bg-blue-500', 
      trend: `${SIMULASI_CATEGORIES.reduce((sum, cat) => sum + cat.totalTasks, 0)} tasks` 
    },
    { 
      label: 'Total Peserta', 
      value: SIMULASI_CATEGORIES.reduce((sum, cat) => sum + cat.participants, 0).toLocaleString(), 
      icon: Users, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Avg Rating', 
      value: (SIMULASI_CATEGORIES.reduce((sum, cat) => sum + cat.rating, 0) / SIMULASI_CATEGORIES.length).toFixed(1), 
      icon: Star, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Badges Earned', 
      value: '247', 
      icon: Award, 
      color: 'bg-green-500',
      trend: '+32 minggu ini' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Simulasi Kerja
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Uji kemampuan Anda dengan simulasi pekerjaan real-world dan dapatkan sertifikat
              </p>
            </div>
            <Link to="/dashboard/simulasi-kerja/leaderboard" className="self-start sm:self-auto">
              <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 w-full sm:w-auto">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
          </div>

          {}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari simulasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
              <Button
                variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty('all')}
                size="sm"
                className="flex-shrink-0"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Semua</span>
              </Button>
              <Button
                variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty('beginner')}
                size="sm"
                className="flex-shrink-0 border-green-200 hover:bg-green-50"
              >
                <span className="text-xs sm:text-sm">Beginner</span>
              </Button>
              <Button
                variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty('intermediate')}
                size="sm"
                className="flex-shrink-0 border-yellow-200 hover:bg-yellow-50"
              >
                <span className="text-xs sm:text-sm">Intermediate</span>
              </Button>
              <Button
                variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty('advanced')}
                size="sm"
                className="flex-shrink-0 border-red-200 hover:bg-red-50"
              >
                <span className="text-xs sm:text-sm">Advanced</span>
              </Button>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategories.map((category, index) => (
            <SimulasiCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada simulasi ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
interface SimulasiCardProps {
  category: SimulasiCategory;
  index: number;
}

const SimulasiCard: React.FC<SimulasiCardProps> = ({ category, index }) => {
  const Icon = getIcon(category.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/dashboard/simulasi-kerja/${category.id}`}>
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-2xl hover:border-primary-300 transition-all h-full">

          {}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <Badge className={`${getDifficultyColor(category.difficulty)} border`}>
              {category.difficulty.charAt(0).toUpperCase() + category.difficulty.slice(1)}
            </Badge>
          </div>

          {}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {category.description}
          </p>

          {}
          <div className="flex flex-wrap gap-2 mb-4">
            {category.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
              >
                {skill}
              </span>
            ))}
            {category.skills.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
                +{category.skills.length - 3}
              </span>
            )}
          </div>

          {}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-gray-100 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mb-0.5">Tasks</p>
              <p className="text-sm font-semibold text-gray-900">{category.totalTasks}</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mb-0.5">Duration</p>
              <p className="text-sm font-semibold text-gray-900">{category.duration}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mb-0.5">Peserta</p>
              <p className="text-sm font-semibold text-gray-900">{category.participants}</p>
            </div>
          </div>

          {}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-900">{category.rating}</span>
              <span className="text-xs text-gray-500">({category.participants} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
              <Play className="w-4 h-4" />
              <span>Mulai</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {}
          {category.badge && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Award className="w-4 h-4 text-yellow-600" />
                <span>Dapatkan badge: <span className="font-semibold text-gray-900">{category.badge}</span></span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default SimulasiKerja;
