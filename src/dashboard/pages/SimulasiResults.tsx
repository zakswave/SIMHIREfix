import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, Award, Star, Target, Zap, TrendingUp, Download, Share2,
  CheckCircle2, XCircle, Clock, ArrowRight, Home, RotateCcw, Medal,
  Sparkles, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SIMULASI_CATEGORIES } from '@/lib/simulasiData';
import Confetti from 'react-confetti';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface SavedSimulasiResult {
  id: string;
  userId: string;
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
}

interface TaskSubmission {
  taskId: string;
  answer: string;
  timeSpent: number;
  score: number;
}

const SimulasiResults: React.FC = () => {
  const { categoryId, resultId } = useParams<{ categoryId?: string; resultId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState<SavedSimulasiResult | null>(
    (location.state as any)?.result || null
  );
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(
    (location.state as any)?.submissions || []
  );
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const category = SIMULASI_CATEGORIES.find(cat => cat.id === (categoryId || result?.categoryId));
  useEffect(() => {
    const fetchResult = async () => {
      if (resultId && !result) {
        try {
          setLoading(true);
          const response = await api.getSimulasiResult(resultId);
          setResult(response.data.result);
        } catch (error) {
          console.error('Failed to fetch result:', error);
          toast.error('Gagal memuat hasil simulasi');
          navigate('/dashboard/simulasi-kerja');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResult();
  }, [resultId, result, navigate]);

  useEffect(() => {
    if (result && result.percentage >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [result]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Memuat hasil...</h2>
        </div>
      </div>
    );
  }

  if (!result || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hasil tidak ditemukan
          </h2>
          <Link to="/dashboard/simulasi-kerja">
            <Button>Kembali ke Simulasi</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getRankInfo = () => {
    if (result.percentage >= 95) return { rank: 'S', color: 'from-yellow-400 to-orange-500', text: 'text-yellow-600' };
    if (result.percentage >= 90) return { rank: 'A+', color: 'from-green-400 to-emerald-500', text: 'text-green-600' };
    if (result.percentage >= 85) return { rank: 'A', color: 'from-blue-400 to-cyan-500', text: 'text-blue-600' };
    if (result.percentage >= 80) return { rank: 'B+', color: 'from-purple-400 to-pink-500', text: 'text-purple-600' };
    if (result.percentage >= 75) return { rank: 'B', color: 'from-indigo-400 to-purple-500', text: 'text-indigo-600' };
    if (result.percentage >= 70) return { rank: 'C+', color: 'from-gray-400 to-gray-500', text: 'text-gray-600' };
    return { rank: 'C', color: 'from-gray-300 to-gray-400', text: 'text-gray-500' };
  };

  const rankInfo = getRankInfo();

  const handleShare = () => {
    const text = `Saya baru saja menyelesaikan simulasi ${category.name} dengan score ${result.percentage}%! ${result.badge ? `🏆 Badge: ${result.badge}` : ''}`;

    if (navigator.share) {
      navigator.share({
        title: 'SimHire - Hasil Simulasi',
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Link berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50 py-12 px-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-8">

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${rankInfo.color} mb-6 shadow-2xl`}>
            <Trophy className="w-16 h-16 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Simulasi Selesai!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {category.name}
          </p>

          {}
          <div className="inline-block bg-white rounded-3xl px-8 py-6 shadow-xl border-4 border-primary-200">
            <div className="text-sm text-gray-500 mb-2">Score Anda</div>
            <div className={`text-7xl font-bold bg-gradient-to-r ${rankInfo.color} bg-clip-text text-transparent`}>
              {result.percentage}%
            </div>
            <div className="mt-3">
              <Badge className={`${rankInfo.text} text-lg px-4 py-1`}>
                Rank: {rankInfo.rank}
              </Badge>
            </div>
          </div>

          {}
          {result.badge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="mt-6 inline-block"
            >
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <Medal className="w-8 h-8 text-yellow-600" />
                  <div className="text-left">
                    <div className="text-sm text-yellow-700">Badge Earned!</div>
                    <div className="font-bold text-yellow-900">{result.badge}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            Breakdown Score
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Technical', value: result.breakdown.technical, icon: Zap, color: 'bg-blue-500' },
              { name: 'Creativity', value: result.breakdown.creativity, icon: Sparkles, color: 'bg-purple-500' },
              { name: 'Efficiency', value: result.breakdown.efficiency, icon: TrendingUp, color: 'bg-green-500' },
              { name: 'Communication', value: result.breakdown.communication, icon: Target, color: 'bg-orange-500' }
            ].map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 ${item.color} rounded-lg`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-3" />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-gray-900">Overall Score</span>
              <span className="text-2xl font-bold text-primary-600">
                {result.percentage}%
              </span>
            </div>
          </div>
        </motion.div>

        {}
        {submissions && submissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Task Performance
            </h2>

            <div className="space-y-4">
              {submissions.map((sub, idx) => (
                <motion.div
                  key={sub.taskId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {sub.score >= 80 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sub.score >= 60 ? (
                        <Star className="w-6 h-6 text-yellow-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Task {idx + 1}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {Math.floor(sub.timeSpent / 60)}:{(sub.timeSpent % 60).toString().padStart(2, '0')} min
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      sub.score >= 80 ? 'text-green-600' :
                      sub.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {sub.score}
                    </div>
                    <div className="text-xs text-gray-500">/ 100</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {}
        {result.certificate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200"
          >
            <div className="text-center">
              <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Certificate Earned!
              </h3>
              <p className="text-gray-600 mb-4">
                Selamat! Anda telah mendapatkan sertifikat untuk simulasi ini
              </p>
              <div className="inline-block bg-white px-6 py-3 rounded-lg border border-blue-300">
                <div className="text-sm text-gray-500 mb-1">Certificate ID</div>
                <div className="font-mono font-bold text-blue-600">
                  {result.certificate}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            onClick={handleShare}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Results
          </Button>

          <Link to="/dashboard/simulasi-kerja/leaderboard">
            <Button variant="outline" size="lg" className="gap-2">
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </Button>
          </Link>

          <Link to="/dashboard/simulasi-kerja">
            <Button size="lg" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              Try Another Simulasi
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-primary-600 to-primary-700">
              <Home className="w-5 h-5" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-600 text-lg">
            {result.percentage >= 90 ? "🎉 Outstanding performance! You're ready for the next challenge!" :
             result.percentage >= 80 ? "👏 Great job! Keep up the excellent work!" :
             result.percentage >= 70 ? "👍 Good effort! Practice makes perfect!" :
             "💪 Keep practicing! You'll improve with time!"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SimulasiResults;
