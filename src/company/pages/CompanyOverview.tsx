import { motion } from 'framer-motion';
import { Building2, Users, Briefcase, TrendingUp, Clock, Target, Calendar, Award, Trophy, Zap, ArrowRight } from 'lucide-react';
import { getCompanyMetrics, getJobPosts, getJobApplications } from '@/lib/company/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MOCK_SIMULASI_RESULTS } from '@/lib/simulasiData';

const CompanyOverview: React.FC = () => {
  const metrics = getCompanyMetrics();
  const recentJobs = getJobPosts().slice(0, 3);
  const recentApplications = getJobApplications().slice(0, 5);
  const topCandidates = MOCK_SIMULASI_RESULTS.slice(0, 3);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    gradient: string;
    trend?: { value: number; isPositive: boolean };
    delay?: number;
  }> = ({ title, value, subtitle, icon: Icon, gradient, trend, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        {trend && (
          <div className="flex items-center text-xs sm:text-sm">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold mb-1">{value}</div>
      <div className="text-white/90 text-xs sm:text-sm">{title}</div>
      {subtitle && <div className="text-white/70 text-xs mt-1">{subtitle}</div>}
    </motion.div>
  );

  const getStageColor = (stage: string) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      screening: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      hired: 'bg-primary-100 text-primary-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600">Ringkasan aktivitas rekrutmen perusahaan Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-accent-blue text-xs sm:text-sm">
            <Calendar className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="sm:hidden">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
          </Badge>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Total Lowongan"
          value={metrics.totalJobs}
          subtitle={`${metrics.activeJobs} aktif`}
          icon={Briefcase}
          gradient="from-blue-500 to-blue-600"
          delay={0}
        />
        <StatCard
          title="Total Aplikasi"
          value={metrics.totalApplications}
          subtitle={`${metrics.newApplicationsThisWeek} minggu ini`}
          icon={Users}
          gradient="from-green-500 to-green-600"
          trend={{ value: 12, isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Rata-rata Time to Hire"
          value={`${metrics.averageTimeToHire} hari`}
          icon={Clock}
          gradient="from-orange-500 to-red-500"
          delay={0.2}
        />
        <StatCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          subtitle="Applied to Hired"
          icon={Target}
          gradient="from-purple-500 to-pink-500"
          delay={0.3}
        />
      </div>

      {}
      <Card className="border-2 border-primary-200">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              Top Performers - Simulasi Kerja
            </CardTitle>
            <Link to="/company/simulasi">
              <Button variant="ghost" size="sm" className="gap-2 text-sm">
                Lihat Semua
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {topCandidates.map((candidate, idx) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200 hover:border-primary-400 transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                      {candidate.candidateName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                      #{idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{candidate.candidateName}</h3>
                    <p className="text-xs text-gray-600 truncate">{candidate.categoryName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl sm:text-2xl font-bold text-primary-600">{candidate.percentage}%</span>
                  {candidate.badge && (
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">{candidate.badge}</span>
                      <span className="sm:hidden">★</span>
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 bg-blue-100 rounded px-1.5 sm:px-2 py-1 text-center">
                    <div className="text-xs text-blue-600">Tech</div>
                    <div className="text-xs sm:text-sm font-bold text-blue-700">{candidate.breakdown.technical}</div>
                  </div>
                  <div className="flex-1 bg-purple-100 rounded px-1.5 sm:px-2 py-1 text-center">
                    <div className="text-xs text-purple-600">Create</div>
                    <div className="text-xs sm:text-sm font-bold text-purple-700">{candidate.breakdown.creativity}</div>
                  </div>
                  <div className="flex-1 bg-green-100 rounded px-1.5 sm:px-2 py-1 text-center">
                    <div className="text-xs text-green-600">Eff</div>
                    <div className="text-xs sm:text-sm font-bold text-green-700">{candidate.breakdown.efficiency}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              Lowongan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.department}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                        {job.status === 'open' ? 'Aktif' : job.status === 'draft' ? 'Draft' : 'Tutup'}
                      </Badge>
                      <span className="text-xs text-gray-500">{job.applicationCount} pelamar</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(job.createdAt)}</p>
                    {job.isUrgent && (
                      <Badge variant="destructive" className="mt-1 text-xs">Urgent</Badge>
                    )}
                  </div>
                </div>
              ))}
              {recentJobs.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Belum ada lowongan yang dibuat
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Aplikasi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{application.candidateName}</h3>
                    <p className="text-sm text-gray-600">{application.candidateLocation}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs ${getStageColor(application.stage)}`}>
                        {application.stage === 'applied' ? 'Melamar' :
                         application.stage === 'screening' ? 'Screening' :
                         application.stage === 'interview' ? 'Interview' :
                         application.stage === 'offer' ? 'Penawaran' :
                         application.stage === 'accepted' ? 'Diterima' :
                         application.stage === 'rejected' ? 'Ditolak' : 'Unknown'}
                      </Badge>
                      {application.scoreOverall && (
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{application.scoreOverall}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(application.appliedAt)}</p>
                  </div>
                </div>
              ))}
              {recentApplications.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Belum ada aplikasi masuk
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Skill Paling Dicari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {metrics.topSkillsInDemand.slice(0, 10).map((skill, index) => (
              <div key={skill.skill} className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-accent-blue">#{index + 1}</div>
                <div className="text-sm font-medium text-gray-900">{skill.skill}</div>
                <div className="text-xs text-gray-500">{skill.count} posisi</div>
              </div>
            ))}
          </div>
          {metrics.topSkillsInDemand.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Data skill akan muncul setelah ada lowongan</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyOverview;
