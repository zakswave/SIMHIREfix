import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Copy, 
  Trash2, 
  Users,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  Briefcase,
  Target,
  FileText,
  CheckCircle
} from 'lucide-react';
import { api } from '@/services/api';
import { JobPost, JobStatus } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GradientCard } from '@/components/ui/gradient-card';
import { handleError } from '@/lib/errors';

const CompanyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadJobs();
  }, []);
  useEffect(() => {
    loadJobs();
  }, [searchQuery, statusFilter]);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading company jobs from backend...');
      const response = await api.getCompanyJobs();

      if (response.success && response.data?.jobs) {
        let fetchedJobs = response.data.jobs;

        console.log(`Loaded ${fetchedJobs.length} jobs from backend`);
        if (statusFilter.length > 0) {
          fetchedJobs = fetchedJobs.filter((job: any) => 
            statusFilter.includes(job.status as JobStatus)
          );
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          fetchedJobs = fetchedJobs.filter((job: any) =>
            job.title?.toLowerCase().includes(query) ||
            job.description?.toLowerCase().includes(query) ||
            job.location?.toLowerCase().includes(query)
          );
        }
        const mappedJobs: JobPost[] = fetchedJobs.map((job: any) => ({
          id: job.id,
          companyId: job.companyId,
          title: job.title,
          department: job.department || 'General',
          employmentType: job.employmentType || job.type || 'full-time',
          experienceLevel: job.experienceLevel || 'mid',
          locationMode: job.locationMode || 'hybrid',
          location: job.location,
          salaryMin: job.salaryMin || job.salary?.min,
          salaryMax: job.salaryMax || job.salary?.max,
          currency: job.currency || job.salary?.currency || 'IDR',
          description: job.description,
          requirements: Array.isArray(job.requirements) ? job.requirements : [],
          benefits: Array.isArray(job.benefits) ? job.benefits : [],
          skills: Array.isArray(job.skills) ? job.skills : [],
          isUrgent: job.isUrgent || false,
          isFeatured: job.isFeatured || false,
          status: job.status as JobStatus,
          createdAt: job.createdAt || job.postedAt || new Date().toISOString(),
          publishedAt: job.publishedAt,
          applicationCount: job.applicationCount || job.applicantsCount || 0,
          viewCount: job.viewCount || 0,
        }));

        setJobs(mappedJobs);
      } else {
        console.warn('No jobs found or invalid response');
        setJobs([]);
      }
    } catch (error: any) {
      console.error('Error loading company jobs:', error);
      handleError(error, 'loadJobs');
      toast.error('Gagal memuat lowongan pekerjaan', {
        description: error.response?.data?.message || error.message
      });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  const handleStatusToggle = async (jobId: string, currentStatus: JobStatus) => {
    const newStatus: JobStatus = currentStatus === 'open' ? 'paused' : 'open';

    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const response = await api.updateJob(jobId, formData);

      if (response.success) {
        loadJobs();
        toast.success(`Lowongan ${newStatus === 'open' ? 'diaktifkan' : 'dijeda'}`);
      }
    } catch (error) {
      handleError(error, 'handleStatusToggle');
      toast.error('Gagal mengubah status lowongan');
    }
  };

  const handleDuplicate = async (jobId: string) => {
    try {
      toast.info('Fitur duplikasi akan segera tersedia');
    } catch (error) {
      handleError(error, 'handleDuplicate');
      toast.error('Gagal menduplikasi lowongan');
    }
  };

  const handleDelete = async (jobId: string, jobTitle: string) => {
    if (confirm(`Hapus lowongan "${jobTitle}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        const response = await api.deleteJob(jobId);

        if (response.success) {
          loadJobs();
          toast.success('Lowongan berhasil dihapus');
        }
      } catch (error) {
        handleError(error, 'handleDelete');
        toast.error('Gagal menghapus lowongan');
      }
    }
  };

  const handleStatusFilterToggle = (status: JobStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const getStatusColor = (status: JobStatus) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: JobStatus) => {
    const labels = {
      open: 'Aktif',
      draft: 'Draft',
      paused: 'Dijeda',
      closed: 'Tutup'
    };
    return labels[status];
  };

  const formatSalary = (min?: number, max?: number, currency: string = 'IDR') => {
    if (!min && !max) return 'Gaji tidak disebutkan';

    if (currency === 'IDR') {
      const formatIDR = (amount: number) => `${(amount / 1000000).toFixed(0)}jt`;
      if (min && max) return `Rp ${formatIDR(min)} - ${formatIDR(max)}`;
      if (min) return `Rp ${formatIDR(min)}+`;
      if (max) return `Rp hingga ${formatIDR(max)}`;
    }

    return `${currency} ${min || 0} - ${max || 0}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'open').length;
  const draftJobs = jobs.filter(j => j.status === 'draft').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
    <div className="max-w-7xl mx-auto mobile-container mobile-section space-y-6 sm:space-y-8">
      {}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl shadow-lg">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Manajemen Lowongan
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 flex items-center gap-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            Kelola lowongan kerja perusahaan Anda
          </p>
        </div>
        <Link to="/company/jobs/new" className="w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="tap-target w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm sm:text-base font-medium shadow-xl hover:shadow-2xl transition-all"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Buat Lowongan Baru
          </motion.button>
        </Link>
      </motion.div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <GradientCard
          title="Total Lowongan"
          value={totalJobs.toString()}
          subtitle={`${totalJobs} lowongan`}
          icon={Briefcase}
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />
        <GradientCard
          title="Lowongan Aktif"
          value={activeJobs.toString()}
          subtitle="Sedang dibuka"
          icon={CheckCircle}
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
        />
        <GradientCard
          title="Draft"
          value={draftJobs.toString()}
          subtitle="Belum dipublikasi"
          icon={FileText}
          gradient="from-orange-500 to-red-500"
          delay={0.2}
        />
        <GradientCard
          title="Total Pelamar"
          value={totalApplicants.toString()}
          subtitle="Semua lowongan"
          icon={Users}
          gradient="from-purple-500 to-pink-500"
          delay={0.3}
        />
      </div>

      {}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari lowongan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              />
            </div>

            {}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`tap-target w-full sm:w-auto ${showFilters ? 'bg-blue-50' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {statusFilter.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                  {statusFilter.length}
                </Badge>
              )}
            </Button>
          </div>

          {}
          {showFilters && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-medium text-gray-900">Status Lowongan</h4>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {(['open', 'draft', 'paused', 'closed'] as JobStatus[]).map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter.includes(status) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusFilterToggle(status)}
                      className="tap-target text-xs sm:text-sm"
                    >
                      {getStatusLabel(status)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">�</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter.length > 0 
                  ? 'Tidak ada hasil yang cocok'
                  : 'Belum ada lowongan'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter.length > 0
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Mulai dengan membuat lowongan kerja pertama Anda'
                }
              </p>
              {!searchQuery && statusFilter.length === 0 && (
                <Link to="/company/jobs/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Lowongan Pertama
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {}
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {job.title}
                        {job.isUrgent && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        {job.isFeatured && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                      </h3>
                      <Badge className={`${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </Badge>
                    </div>

                    {}
                    <p className="text-gray-600 mb-3">{job.department}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location} ({job.locationMode})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{job.applicationCount} pelamar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                    </div>

                    {}
                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {job.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 5 && (
                          <Badge variant="secondary" className="text-xs text-gray-500">
                            +{job.skills.length - 5} lainnya
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {}
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/company/jobs/${job.id}/applicants`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Link>
                    </Button>

                    <div className="relative group">
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>

                      <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleStatusToggle(job.id, job.status)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {job.status === 'open' ? 'Jeda Lowongan' : 'Aktifkan Lowongan'}
                          </button>

                          <Link
                            to={`/company/jobs/${job.id}/edit`}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Lowongan
                          </Link>

                          <button
                            onClick={() => handleDuplicate(job.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplikasi
                          </button>

                          <div className="border-t border-gray-100 my-1"></div>

                          <button
                            onClick={() => handleDelete(job.id, job.title)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
    </div>
  );
};

export default CompanyJobs;
