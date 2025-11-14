import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Award, Star, ArrowLeft, Users, TrendingUp, Zap,
  Crown, Target, Clock, Filter
} from 'lucide-react';
import { SIMULASI_CATEGORIES, getRankColor } from '@/lib/simulasiData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/context/UserContext';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface SavedSimulasiResult {
  id: string;
  userId: string;
  candidateName: string;
  categoryId: string;
  categoryName: string;
  completedAt: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: {
    technical: number;
    creativity: number;
    efficiency: number;
    communication: number;
  };
  badge?: string;
  certificate?: string;
  rank?: number;
}

const SimulasiLeaderboard: React.FC = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all-time');
  const [realResults, setRealResults] = useState<SavedSimulasiResult[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        const response = selectedCategory === 'all'
          ? await api.getLeaderboards()
          : await api.getLeaderboard(selectedCategory);
        setRealResults(response.data.leaderboard || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        toast.error('Gagal memuat leaderboard');
        setRealResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedCategory]);
  const filteredResults = realResults;

  const getRankIcon = (rank: number | undefined) => {
    if (!rank) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-500" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {}
        <div className="mb-6">
          <Link to="/dashboard/simulasi-kerja" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Simulasi</span>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-gray-600">
                Top performers di simulasi kerja SimHire
              </p>
            </div>
          </div>

          {}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8" />
                <span className="text-2xl font-bold">#1</span>
              </div>
              <p className="text-sm text-white/90">Top Rank</p>
              <p className="font-semibold truncate">{filteredResults[0]?.categoryName || '-'}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8" />
                <span className="text-2xl font-bold">{filteredResults.length}</span>
              </div>
              <p className="text-sm text-white/90">Total Peserta</p>
              <p className="font-semibold">Active Candidates</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8" />
                <span className="text-2xl font-bold">
                  {filteredResults.length > 0 ? Math.round(filteredResults.reduce((sum, r) => sum + r.percentage, 0) / filteredResults.length) : 0}
                </span>
              </div>
              <p className="text-sm text-white/90">Avg Score</p>
              <p className="font-semibold">Community Average</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8" />
                <span className="text-2xl font-bold">{filteredResults.filter(r => r.badge).length}</span>
              </div>
              <p className="text-sm text-white/90">Badges Earned</p>
              <p className="font-semibold">Certified</p>
            </div>
          </div>
          )}

          {}
          <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {SIMULASI_CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="thisweek">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {}
        {!loading && filteredResults.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-1"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 text-center border-2 border-gray-300">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl">
                  {filteredResults[1]?.candidateName.charAt(0)}
                </div>
                <Medal className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-1">{filteredResults[1]?.candidateName}</h3>
                <p className="text-sm text-gray-600 mb-2">{filteredResults[1]?.categoryName}</p>
                <div className="text-2xl font-bold text-gray-700">{filteredResults[1]?.percentage}%</div>
                <Badge className="mt-2 bg-gray-200 text-gray-700">#2</Badge>
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="order-2"
            >
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-6 text-center border-2 border-yellow-400 relative -mt-4">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                  {filteredResults[0]?.candidateName.charAt(0)}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-1">{filteredResults[0]?.candidateName}</h3>
                <p className="text-sm text-gray-600 mb-2">{filteredResults[0]?.categoryName}</p>
                <div className="text-3xl font-bold text-yellow-600">{filteredResults[0]?.percentage}%</div>
                <Badge className="mt-2 bg-yellow-500 text-white">#1 Champion</Badge>
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-3"
            >
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6 text-center border-2 border-orange-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl">
                  {filteredResults[2]?.candidateName.charAt(0)}
                </div>
                <Medal className="w-10 h-10 text-orange-500 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-1">{filteredResults[2]?.candidateName}</h3>
                <p className="text-sm text-gray-600 mb-2">{filteredResults[2]?.categoryName}</p>
                <div className="text-2xl font-bold text-orange-600">{filteredResults[2]?.percentage}%</div>
                <Badge className="mt-2 bg-orange-200 text-orange-700">#3</Badge>
              </div>
            </motion.div>
          </div>
        )}

        {}
        {!loading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">All Rankings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Breakdown
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result, index) => (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRankIcon(result.rank)}
                        <span className={`font-bold ${getRankColor(result.rank || 0)}`}>
                          {result.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                          {result.candidateName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{result.candidateName}</div>
                          <div className="text-xs text-gray-500">
                            {result.completedAt && new Date(result.completedAt).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{result.categoryName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-900">{result.percentage}%</div>
                        <div className="text-xs text-gray-500">
                          {result.totalScore}/{result.maxScore}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <div className="text-xs">
                          <span className="text-gray-500">Tech:</span>
                          <span className="font-semibold text-blue-600 ml-1">{result.breakdown.technical}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="text-xs">
                          <span className="text-gray-500">Creat:</span>
                          <span className="font-semibold text-purple-600 ml-1">{result.breakdown.creativity}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="text-xs">
                          <span className="text-gray-500">Eff:</span>
                          <span className="font-semibold text-green-600 ml-1">{result.breakdown.efficiency}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.badge && (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                          <Award className="w-3 h-3 mr-1" />
                          {result.badge}
                        </Badge>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {}
        {!loading && filteredResults.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Belum Ada Data Leaderboard
            </h3>
            <p className="text-gray-600 mb-6">
              Jadilah yang pertama menyelesaikan simulasi!
            </p>
            <Link to="/dashboard/simulasi-kerja">
              <Button>
                Mulai Simulasi
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulasiLeaderboard;
