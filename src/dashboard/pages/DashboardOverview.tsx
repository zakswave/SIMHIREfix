import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  FileText, 
  Award, 
  Calendar,
  MapPin,
  ArrowRight,
  BarChart3,
  Target,
  Trophy,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDashboardStats, getUpcomingInterviews, loadSimulasiResults } from '@/lib/storage';
import { GradientCard } from '@/components/ui/gradient-card';

const DashboardOverview = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [dashboardData, setDashboardData] = useState({
    applications: { total: 0, applied: 0, screening: 0, interview: 0, offer: 0 },
    interviews: { total: 0, upcoming: 0 },
    savedJobs: 0,
    simulasiCompleted: 0,
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [simulasiResults, setSimulasiResults] = useState<any[]>([]);
  useEffect(() => {
    const stats = getDashboardStats();
    setDashboardData(stats);

    const interviews = getUpcomingInterviews();
    setUpcomingInterviews(interviews.slice(0, 3));

    const simulasi = loadSimulasiResults();
    setSimulasiResults(simulasi);
  }, []);
  const stats = [
    {
      title: 'Lamaran Aktif',
      value: dashboardData.applications.total.toString(),
      subtitle: dashboardData.applications.total > 0 ? `${dashboardData.applications.applied + dashboardData.applications.screening} baru` : 'Belum ada',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Interview Terjadwal',
      value: dashboardData.interviews.upcoming.toString(),
      subtitle: dashboardData.interviews.upcoming > 0 ? `${dashboardData.interviews.upcoming} mendatang` : 'Belum ada',
      icon: Calendar,
      gradient: 'from-primary-500 to-blue-600',
    },
    {
      title: 'Pekerjaan Disimpan',
      value: dashboardData.savedJobs.toString(),
      subtitle: dashboardData.savedJobs > 0 ? `${dashboardData.savedJobs} tersimpan` : 'Belum ada',
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Simulasi Selesai',
      value: dashboardData.simulasiCompleted.toString(),
      subtitle: simulasiResults.length > 0 ? `Avg ${Math.round(simulasiResults.reduce((sum, r) => sum + r.percentage, 0) / simulasiResults.length)}%` : 'Belum ada',
      icon: Trophy,
      gradient: 'from-orange-500 to-red-500',
    },
  ];
  const getApplicationActivity = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    const data = monthNames.map((month, idx) => ({
      month,
      applications: Math.max(0, dashboardData.applications.total - idx * 2),
      interviews: Math.max(0, dashboardData.interviews.total - idx),
      offers: Math.max(0, dashboardData.applications.offer - Math.floor(idx / 2)),
    }));
    return data.reverse();
  };

  const applicationActivity = getApplicationActivity();
  const skillsMatch = [
    { skill: 'React', match: 95, color: 'bg-blue-500' },
    { skill: 'TypeScript', match: 88, color: 'bg-primary-500' },
    { skill: 'Node.js', match: 75, color: 'bg-green-500' },
    { skill: 'UI/UX', match: 82, color: 'bg-purple-500' },
    { skill: 'Figma', match: 90, color: 'bg-pink-500' },
  ];
  const hasData = dashboardData.applications.total > 0 || dashboardData.savedJobs > 0 || simulasiResults.length > 0;

  const maxValue = Math.max(...applicationActivity.map(d => d.applications));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
      {}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 flex items-center gap-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            Pantau progress karir Anda
          </p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-button text-xs sm:text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'week' ? 'Minggu' : range === 'month' ? 'Bulan' : 'Tahun'}
            </button>
          ))}
        </div>
      </motion.div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <GradientCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            gradient={stat.gradient}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 bg-white rounded-card p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Aktivitas Lamaran
              </h3>
              <p className="text-sm text-gray-600">
                6 bulan terakhir
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          {}
          <div className="space-y-4">
            {applicationActivity.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 w-12">
                    {data.month}
                  </span>
                  <div className="flex-1 mx-4 flex gap-1 items-center">
                    {}
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative group">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.applications / maxValue) * 100}%` }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-end pr-2"
                      >
                        <span className="text-white text-xs font-medium">
                          {data.applications}
                        </span>
                      </motion.div>
                      <div className="absolute inset-0 pointer-events-none group-hover:bg-white/10 transition-colors" />
                    </div>

                    {}
                    <div className="w-16 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-medium">
                        {data.interviews}
                      </span>
                    </div>

                    {}
                    <div className="w-16 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xs font-medium">
                        {data.offers}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-sm text-gray-600">Lamaran</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Interview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Offer</span>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-card p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Skills Match
              </h3>
              <p className="text-sm text-gray-600">
                Top skills Anda
              </p>
            </div>
            <Target className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {skillsMatch.map((skill, index) => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">
                    {skill.skill}
                  </span>
                  <span className="text-gray-600">
                    {skill.match}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.match}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                    className={`h-full ${skill.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <Link
            to="/dashboard/profile"
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-button transition-all text-sm font-medium"
          >
            Update Skills
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="bg-white rounded-card p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {hasData ? 'Aktivitas Terbaru' : 'Mulai Karir Anda'}
            </h3>
            {hasData && (
              <Link
                to="/dashboard/application-tracker"
                className="text-sm text-primary-600 hover:underline flex items-center gap-1"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {hasData ? (
            <div className="space-y-4">
              {}
              {simulasiResults.slice(0, 2).map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-200 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {result.categoryName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Simulasi Selesai • Score {result.percentage}%
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {result.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        {result.badge}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {}
              {upcomingInterviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (simulasiResults.length + index) * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-200 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {interview.jobTitle}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {interview.companyName} • {new Date(interview.scheduledAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                    {interview.type}
                  </span>
                </motion.div>
              ))}

              {}
              {simulasiResults.length === 0 && upcomingInterviews.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Aktivitas terbaru akan muncul di sini
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Mulai Perjalanan Karir Anda!
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Lengkapi profil, lamar pekerjaan, dan ikuti simulasi untuk memulai
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/dashboard/simulasi-kerja">
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all">
                    Coba Simulasi
                  </button>
                </Link>
                <Link to="/dashboard/job-finder">
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all">
                    Cari Pekerjaan
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="bg-white rounded-card p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/dashboard/job-finder"
              className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <Briefcase className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 mb-1">
                Cari Pekerjaan
              </h4>
              <p className="text-xs text-gray-600">
                Browse lowongan baru
              </p>
            </Link>

            <Link
              to="/dashboard/auto-cv"
              className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <FileText className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 mb-1">
                Buat CV
              </h4>
              <p className="text-xs text-gray-600">
                Generate CV otomatis
              </p>
            </Link>

            <Link
              to="/dashboard/portfolio"
              className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <Award className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 mb-1">
                Portfolio
              </h4>
              <p className="text-xs text-gray-600">
                Kelola project Anda
              </p>
            </Link>

            <Link
              to="/dashboard/apprenticeship-tracker"
              className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <MapPin className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 mb-1">
                Magang
              </h4>
              <p className="text-xs text-gray-600">
                Cari program magang
              </p>
            </Link>
          </div>

          {}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
            <h4 className="font-medium text-primary-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tips Hari Ini
            </h4>
            <p className="text-sm text-primary-800">
              Update portfolio Anda dengan project terbaru untuk meningkatkan peluang dilihat recruiter hingga 45%!
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DashboardOverview;
