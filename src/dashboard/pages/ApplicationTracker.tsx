import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, Building2, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { ProgressChart } from '../components/ProgressChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ViewApplicationModal from '../components/modals/ViewApplicationModal';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  company: {
    name: string;
    logo?: string;
  };
  position: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted';
  progress: number;
  nextStep?: string;
  interviewDate?: string;
  location?: string;
  salary?: string;
  jobId?: string;
}

const getStatusIcon = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return <Clock className="w-4 h-4" />;
    case 'screening':
      return <FileText className="w-4 h-4" />;
    case 'interview':
      return <AlertCircle className="w-4 h-4" />;
    case 'offer':
      return <TrendingUp className="w-4 h-4" />;
    case 'accepted':
      return <CheckCircle className="w-4 h-4" />;
    case 'rejected':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'screening':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'interview':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'offer':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getProgressColor = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-500';
    case 'screening':
      return 'bg-yellow-500';
    case 'interview':
      return 'bg-purple-500';
    case 'offer':
      return 'bg-green-500';
    case 'accepted':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const ApplicationTracker: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships'>('jobs');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [internshipApplications, setInternshipApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadApplications();
    loadInternshipApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getMyApplications();

      if (response.success && response.data.applications) {
        const mappedApps: Application[] = response.data.applications.map((app: any) => {
          const progressMap: Record<string, number> = {
            applied: 20,
            screening: 40,
            interview: 70,
            offer: 90,
            accepted: 100,
            rejected: 50,
          };

          const nextStepMap: Record<string, string> = {
            applied: 'Waiting for Review',
            screening: 'Application Screening',
            interview: 'Interview Schedule',
            offer: 'Offer Review',
            accepted: 'Onboarding',
            rejected: 'Application Closed',
          };

          return {
            id: app.id,
            company: {
              name: app.companyName || app.job?.companyName || 'Company',
              logo: app.companyLogo,
            },
            position: app.jobTitle || app.job?.title || 'Position',
            appliedDate: app.appliedAt,
            status: app.status,
            progress: progressMap[app.status] || 0,
            nextStep: nextStepMap[app.status] || 'Pending',
            interviewDate: app.interviewDate,
            location: app.job?.location,
            salary: app.job?.salary ? `Rp ${app.job.salary.min / 1000000}jt - ${app.job.salary.max / 1000000}jt` : undefined,
            jobId: app.jobId,
          };
        });

        setApplications(mappedApps);
      }
    } catch (err: any) {
      console.error('Error loading applications:', err);
      setError(err.response?.data?.message || 'Gagal memuat data lamaran');
      if (err.response?.status !== 401) {
        toast.error('Gagal memuat data lamaran');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadInternshipApplications = async () => {
    try {
      const response = await api.getCandidateInternshipApplications();

      if (response.success && response.data.applications) {
        setInternshipApplications(response.data.applications);
      }
    } catch (err: any) {
      console.error('Error loading internship applications:', err);
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };
  const currentApplications = activeTab === 'jobs' ? applications : internshipApplications;

  const stats = [
    { 
      label: activeTab === 'jobs' ? 'Total Lamaran' : 'Total Pendaftaran', 
      value: currentApplications.length, 
      icon: FileText, 
      color: 'bg-blue-500', 
      trend: currentApplications.length > 0 ? `${currentApplications.length} total` : activeTab === 'jobs' ? 'No applications yet' : 'No internship applications yet' 
    },
    { 
      label: activeTab === 'jobs' ? 'Under Review' : 'Reviewed', 
      value: activeTab === 'jobs' 
        ? applications.filter(a => a.status === 'applied' || a.status === 'screening').length
        : internshipApplications.filter((a: any) => a.status === 'reviewed').length, 
      icon: Clock, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Interview', 
      value: activeTab === 'jobs'
        ? applications.filter(a => a.status === 'interview').length
        : internshipApplications.filter((a: any) => a.status === 'interview').length, 
      icon: AlertCircle, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Success', 
      value: activeTab === 'jobs'
        ? applications.filter(a => a.status === 'accepted' || a.status === 'offer').length
        : internshipApplications.filter((a: any) => a.status === 'accepted').length, 
      icon: TrendingUp, 
      color: 'bg-green-500' 
    }
  ];
  const getActivityData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { month: d.getMonth(), year: d.getFullYear() };
    });

    return last6Months.map(({ month, year }) => {
      const count = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate.getMonth() === month && appDate.getFullYear() === year;
      }).length;

      return {
        label: monthNames[month],
        value: count,
        color: 'bg-primary-500'
      };
    });
  };

  const activityData = getActivityData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto mobile-container mobile-section space-y-6 sm:space-y-8">
        {}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {activeTab === 'jobs' ? 'Status Lamaran Pekerjaan' : 'Status Pendaftaran Magang'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {activeTab === 'jobs' 
              ? 'Lacak progress lamaran pekerjaan Anda' 
              : 'Lacak progress pendaftaran magang Anda'}
          </p>
        </div>

        {}
        <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'jobs'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            💼 Lamaran Pekerjaan ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('internships')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'internships'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🎓 Pendaftaran Magang ({internshipApplications.length})
          </button>
        </div>

        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Aktivitas Lamaran (6 Bulan Terakhir)
          </h3>
          <ProgressChart data={activityData} />
        </div>

        {}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Memuat data lamaran...</span>
          </div>
        )}

        {}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 mb-3">{error}</p>
            <Button onClick={loadApplications} variant="outline">
              Coba Lagi
            </Button>
          </div>
        )}

        {}
        {!loading && !error && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {activeTab === 'jobs' 
                ? `${applications.length} Lamaran Aktif`
                : `${internshipApplications.length} Pendaftaran Magang`
              }
            </h2>
            <span className="px-2 sm:px-3 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded-full">
              Tracked
            </span>
          </div>

          {activeTab === 'jobs' && applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-xl hover:border-primary-300 transition-all group"
            >
              {}
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
                  {application.company.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row items-start xs:justify-between gap-2">
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 xs:line-clamp-1">
                        {application.position}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium line-clamp-1">{application.company.name}</p>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} border text-xs flex-shrink-0 self-start xs:self-center`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        <span className="hidden xs:inline">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                        <span className="xs:hidden">{application.status.charAt(0).toUpperCase() + application.status.slice(1, 3)}</span>
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>

              {}
              <div className="mb-3 sm:mb-4">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-semibold text-gray-900">{application.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div 
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${getProgressColor(application.status)}`}
                    style={{ width: `${application.progress}%` }}
                  ></div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 py-2 sm:py-3 border-y border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Applied</p>
                  <p className="text-xs font-semibold text-gray-900">
                    {new Date(application.appliedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                    {application.interviewDate ? (
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Interview</p>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {application.interviewDate 
                      ? new Date(application.interviewDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                      : 'Pending'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Next Step</p>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {application.nextStep || 'Wait for response'}
                  </p>
                </div>
              </div>

              {}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                {application.status === 'interview' && (
                  <button
                    className="tap-target px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-lg flex-shrink-0"
                  >
                    Prepare Interview
                  </button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="tap-target flex-1 text-xs sm:text-sm"
                  onClick={() => handleViewDetails(application)}
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}

          {}
          {activeTab === 'internships' && internshipApplications.map((application: any, index: number) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-xl hover:border-green-300 transition-all group"
            >
              {}
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
                  🎓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row items-start xs:justify-between gap-2">
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 xs:line-clamp-1">
                        {application.internship?.position || 'Internship Position'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium line-clamp-1">
                        {application.internship?.company?.name || 'Company'}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(application.status as any)} border text-xs flex-shrink-0 self-start xs:self-center`}>
                      {application.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 py-2 sm:py-3 border-y border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Daftar</p>
                  <p className="text-xs font-semibold text-gray-900">
                    {new Date(application.appliedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {application.internship?.duration || '3 bulan'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Status</p>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1 capitalize">
                    {application.status}
                  </p>
                </div>
              </div>

              {}
              <div className="text-xs text-gray-600 mb-3">
                <p><strong>Email:</strong> {application.email}</p>
                <p><strong>University:</strong> {application.university}</p>
                <p><strong>GPA:</strong> {application.gpa}</p>
              </div>

              {}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => {
                    toast.info('Internship application details');
                  }}
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {!loading && !error && currentApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building2 className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'jobs' ? 'Belum ada lamaran pekerjaan' : 'Belum ada pendaftaran magang'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'jobs' 
                ? 'Mulai melamar pekerjaan untuk melacak progres Anda di sini.'
                : 'Mulai mendaftar magang untuk melacak progres Anda di sini.'
              }
            </p>
            <Button 
              className={`${activeTab === 'jobs' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={() => navigate(activeTab === 'jobs' ? '/dashboard' : '/dashboard/apprenticeship-tracker')}
            >
              {activeTab === 'jobs' ? 'Cari Lowongan Pekerjaan' : 'Cari Lowongan Magang'}
            </Button>
          </div>
        )}
      </div>

      {}
      <ViewApplicationModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication as any}
      />
    </div>
  );
};

export default ApplicationTracker;
