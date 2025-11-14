import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Play, Clock, Target, Award, Users, Star, CheckCircle2,
  FileText, Download, ExternalLink, AlertCircle, Trophy, Zap
} from 'lucide-react';
import { SIMULASI_CATEGORIES, getSimulasiByCategory, getDifficultyColor } from '@/lib/simulasiData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { saveSimulasiResult, getSimulasiResultByCategory, type SavedSimulasiResult } from '@/lib/storage';
import { useUser } from '@/context/UserContext';

const SimulasiDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tasks' | 'leaderboard'>('overview');
  const [existingResult, setExistingResult] = useState<SavedSimulasiResult | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const category = SIMULASI_CATEGORIES.find(cat => cat.id === categoryId);
  const tasks = getSimulasiByCategory(categoryId || '');
  useEffect(() => {
    if (categoryId) {
      const result = getSimulasiResultByCategory(categoryId);
      setExistingResult(result);
    }
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Simulasi tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">Kategori simulasi yang Anda cari tidak tersedia</p>
          <Link to="/dashboard/simulasi-kerja">
            <Button>Kembali ke Simulasi</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleStartSimulasi = () => {
    if (!user || !category || existingResult) return;
    toast.success('Memulai simulasi!', {
      description: `Anda memiliki ${category.duration} untuk menyelesaikan ${category.totalTasks} tasks`,
      icon: '🚀'
    });

    navigate(`/dashboard/simulasi-kerja/${categoryId}/execute`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {}
        <Link to="/dashboard/simulasi-kerja" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Simulasi</span>
        </Link>

        {}
        <div className={`bg-gradient-to-r ${category.color} rounded-2xl p-8 mb-6 text-white shadow-2xl`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                {category.difficulty.charAt(0).toUpperCase() + category.difficulty.slice(1)}
              </Badge>
              <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
              <p className="text-white/90 text-lg mb-6 max-w-2xl">{category.description}</p>

              {}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{category.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">{category.totalTasks} Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{category.participants} Peserta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-white" />
                  <span className="font-medium">{category.rating} Rating</span>
                </div>
                {category.badge && (
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="font-medium">{category.badge}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleStartSimulasi}
              size="lg"
              disabled={isStarting || !!existingResult}
              className={`font-bold px-8 shadow-xl ${
                existingResult
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-white text-primary-600 hover:bg-white/90'
              }`}
            >
              {isStarting ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : existingResult ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Selesai ({existingResult.percentage}%)
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Mulai Simulasi
                </>
              )}
            </Button>
          </div>

          {}
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium border border-white/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              selectedTab === 'overview'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('tasks')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              selectedTab === 'tasks'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setSelectedTab('leaderboard')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              selectedTab === 'leaderboard'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {}
            <div className="lg:col-span-2 space-y-6">
              {}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-600" />
                  Apa yang Akan Anda Pelajari
                </h3>
                <ul className="space-y-3">
                  {category.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{skill} implementation dan best practices</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Real-world problem solving</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Industry standard practices</span>
                  </li>
                </ul>
              </div>

              {}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Requirements
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Basic understanding of {category.skills[0]}</li>
                  <li>• Laptop/computer dengan koneksi internet stabil</li>
                  <li>• Text editor atau IDE favorit</li>
                  <li>• Waktu {category.duration} untuk menyelesaikan</li>
                </ul>
              </div>
            </div>

            {}
            <div className="space-y-6">
              {}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Assessment Criteria</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Technical Skills</span>
                    <span className="text-sm font-semibold text-primary-600">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Creativity</span>
                    <span className="text-sm font-semibold text-primary-600">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Efficiency</span>
                    <span className="text-sm font-semibold text-primary-600">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Communication</span>
                    <span className="text-sm font-semibold text-primary-600">15%</span>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{category.badge}</h3>
                    <p className="text-xs text-gray-600">Sertifikat Digital</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Selesaikan simulasi dengan score 80%+ untuk mendapatkan badge dan sertifikat
                </p>
              </div>

              {}
              <Button
                onClick={handleStartSimulasi}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Mulai Sekarang
              </Button>
            </div>
          </div>
        )}

        {selectedTab === 'tasks' && (
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{task.description}</p>

                    {}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Instructions:</h4>
                      <ul className="space-y-1">
                        {task.instructions.map((instruction, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-primary-600 font-medium">{i + 1}.</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <Badge className={getDifficultyColor(task.difficulty)}>{task.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{task.timeLimit} menit</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>Max Score: {task.maxScore}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{task.type}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedTab === 'leaderboard' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Leaderboard - {category?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Peringkat 10 besar peserta simulasi
                </p>
              </div>
            </div>

            {(() => {
              const allResults = JSON.parse(localStorage.getItem('simhire_simulasi_results') || '[]') as SavedSimulasiResult[];
              const categoryResults = allResults
                .filter(r => r.categoryId === categoryId)
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 10);

              if (categoryResults.length === 0) {
                return (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum Ada Peserta
                    </h3>
                    <p className="text-gray-600">
                      Jadilah yang pertama menyelesaikan simulasi ini!
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {categoryResults.map((result, index) => (
                    <motion.div
                      key={`${result.userId}-${result.completedAt}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        index === 0
                          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-400 to-slate-500 text-white shadow-lg'
                          : index === 2
                          ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-300 text-gray-700'
                      }`}>
                        {index < 3 ? <Trophy className="w-6 h-6" /> : `#${index + 1}`}
                      </div>

                      {}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {result.userId === user?.id ? 'Anda' : `Peserta ${result.userId.slice(0, 8)}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(result.completedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          result.percentage >= 85
                            ? 'text-green-600'
                            : result.percentage >= 70
                            ? 'text-blue-600'
                            : result.percentage >= 50
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                        }`}>
                          {result.percentage}%
                        </div>
                        <p className="text-xs text-gray-500">
                          {result.totalScore}/{result.maxScore} poin
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulasiDetail;
