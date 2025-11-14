import { useState, useMemo, useEffect } from 'react';
import { Search, Users, MapPin, Building2, Bookmark, TrendingUp, Star, Clock, Briefcase, DollarSign, Target, Zap, Award, Grid3x3, List, BookmarkCheck, Share2 } from 'lucide-react';
import { type Job } from '../../lib/jobsData';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ApplyJobModal from '../components/modals/ApplyJobModal';
import { loadSavedJobs, toggleSaveJob as toggleSaveJobStorage, hasAppliedToJob, type SavedJob } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { useUser } from '@/context/UserContext';
import { api } from '@/services/api';

type ViewMode = 'grid' | 'list';

const JobFinder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    workSchedule: [] as string[],
    experienceLevel: [] as string[],
    workStyle: [] as string[],
    salaryRange: [0, 50] as [number, number],
    remote: null as boolean | null,
    location: '',
    skills: [] as string[]
  });
  useEffect(() => {
    const saved = loadSavedJobs();
    setSavedJobs(new Set(saved.map(j => j.jobId)));
  }, []);
  useEffect(() => {
    const loadAllJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getJobs({
          search: debouncedSearchTerm,
          location: filters.location || undefined,
          employmentType: filters.workSchedule.length > 0 ? filters.workSchedule.join(',') : undefined,
          experienceLevel: filters.experienceLevel.length > 0 ? filters.experienceLevel.join(',') : undefined,
          minSalary: filters.salaryRange[0] * 1000000,
          maxSalary: filters.salaryRange[1] * 1000000,
          skills: filters.skills.length > 0 ? filters.skills.join(',') : undefined,
          remote: filters.workStyle.includes('remote') ? true : filters.workStyle.includes('on-site') ? false : undefined,
        });
        if (response.success && response.data?.jobs) {
          const jobs: Job[] = response.data.jobs.map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.companyName || 'Company',
            companyLogo: job.companyLogo,
            location: job.location,
            salary: {
              min: job.salaryMin || 0,
              max: job.salaryMax || 0,
              currency: 'IDR' as const,
            },
            type: job.employmentType,
            skills: job.skills || [],
            description: job.description,
            requirements: Array.isArray(job.requirements) ? job.requirements : 
                         typeof job.requirements === 'string' ? [job.requirements] : [],
            benefits: job.benefits || [],
            posted: job.publishedAt || job.createdAt,
            deadline: job.deadline || '',
            remote: job.locationMode === 'remote',
            experienceLevel: job.experienceLevel || 'mid',
            applicants: job.applicationCount || 0,
            applicationCount: job.applicationCount || 0,
          }));

          setAllJobs(jobs);
        }
      } catch (err: any) {
        console.error('Error loading jobs:', err);
        setError(err.response?.data?.message || 'Gagal memuat lowongan pekerjaan');
        toast.error('Gagal memuat lowongan pekerjaan');
      } finally {
        setLoading(false);
      }
    };

    loadAllJobs();
  }, [debouncedSearchTerm, filters.location, filters.workSchedule, filters.experienceLevel, filters.salaryRange, filters.skills, filters.workStyle]);
  const toggleSaveJob = (job: Job) => {
    const savedJob: SavedJob = {
      id: crypto.randomUUID(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salary: `Rp ${job.salary.min / 1000000}jt - ${job.salary.max / 1000000}jt`,
      type: job.type,
      savedAt: new Date().toISOString(),
    };

    const wasAdded = toggleSaveJobStorage(savedJob);

    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (wasAdded) {
        newSet.add(job.id);
        toast.success(`"${job.title}" disimpan ke bookmark`, {
          icon: '⭐',
          action: {
            label: 'Lihat',
            onClick: () => navigate('/dashboard/application-tracker?tab=saved'),
          },
        });
      } else {
        newSet.delete(job.id);
        toast.success(`"${job.title}" dihapus dari bookmark`, {
          icon: '🔖'
        });
      }
      return newSet;
    });
  };
  const handleApply = (job: Job) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu untuk melamar pekerjaan');
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      toast.error('Hanya kandidat yang dapat melamar pekerjaan. Silakan login sebagai kandidat.');
      return;
    }

    setSelectedJob(job);
    setShowApplyModal(true);
  };
  const filteredJobs = useMemo(() => {
    let jobs = [...allJobs];
    if (sortBy === 'newest') {
      jobs = jobs.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
    } else if (sortBy === 'salary') {
      jobs = jobs.sort((a, b) => b.salary.max - a.salary.max);
    } else if (sortBy === 'company') {
      jobs = jobs.sort((a, b) => a.company.localeCompare(b.company));
    }

    return jobs;
  }, [allJobs, sortBy]);
  const getCompanyLogo = (company: string) => {
    const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-pink-500 to-pink-600', 'from-primary-500 to-primary-600', 'from-orange-500 to-orange-600'];
    const index = company.length % colors.length;
    return colors[index];
  };

  const stats = [
    { label: 'Total Lowongan', value: allJobs.length, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Lowongan Baru', value: allJobs.filter(j => {
      const posted = new Date(j.posted);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return posted > weekAgo;
    }).length, icon: Zap, color: 'bg-primary-500' },
    { label: 'Perusahaan', value: new Set(allJobs.map(j => j.company)).size, icon: Building2, color: 'bg-purple-500' },
    { label: 'Tersimpan', value: savedJobs.size, icon: Target, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {}
      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        jobCount={filteredJobs.length}
      />

      {}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto mobile-container mobile-section space-y-4 sm:space-y-6">
          {}
          <div>
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Pencari Pekerjaan</h1>
              <p className="text-sm sm:text-base text-gray-600">Temukan lowongan pekerjaan yang sesuai dengan keahlian dan minat Anda</p>
            </div>

            {}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`${stat.color} p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-600 leading-tight">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {}
          <SearchBar
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={(query) => setSearchTerm(query)}
            activeFilters={[...filters.workSchedule, ...filters.experienceLevel, ...filters.workStyle]}
            onAddFilter={() => {}}
            onRemoveFilter={() => {}}
          />

          {}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {loading ? 'Memuat...' : `${filteredJobs.length} Lowongan Ditemukan`}
              </h2>
              {filteredJobs.length > 0 && !loading && (
                <span className="px-2 sm:px-3 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded-full">
                  Tersedia
                </span>
              )}
              {savedJobs.size > 0 && (
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full flex items-center gap-1">
                  <BookmarkCheck className="w-3 h-3" />
                  {savedJobs.size} Disimpan
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {}
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all tap-target ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all tap-target ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              {}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none tap-target"
              >
                <option value="relevant">Paling Relevan</option>
                <option value="newest">Terbaru</option>
                <option value="salary">Gaji Tertinggi</option>
                <option value="company">Perusahaan A-Z</option>
              </select>
            </div>
          </div>

          {}
          {loading && (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Muat Ulang
              </button>
            </div>
          )}

          {}
          {!loading && !error && (
            <div className="grid gap-3 sm:gap-4">
              {filteredJobs.map((job: Job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-xl hover:border-primary-300 transition-all group"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {}
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br ${getCompanyLogo(job.company)} flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                      {job.company.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {}
                      <div className="flex flex-col xs:flex-row items-start xs:justify-between mb-2 sm:mb-3 gap-2">
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 xs:line-clamp-1">
                              {job.title}
                            </h3>
                            {index < 3 && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full flex items-center gap-1 flex-shrink-0">
                                <Star className="w-3 h-3 fill-current" />
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="font-medium line-clamp-1">{job.company}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="line-clamp-1">{job.location}</span>
                            </div>
                            {job.remote && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                                Remote
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.button
                          onClick={() => toggleSaveJob(job)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`tap-target p-2 rounded-lg transition-all flex-shrink-0 ${
                            savedJobs.has(job.id)
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
                          }`}
                        >
                          {savedJobs.has(job.id) ? (
                            <BookmarkCheck className="w-5 h-5 fill-current" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>

                      {}
                      <p className="hidden xs:block text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                        {job.description}
                      </p>

                      {}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto hide-scrollbar">
                          {job.skills.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full hover:bg-purple-200 transition-colors flex-shrink-0"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex-shrink-0">
                              +{job.skills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm overflow-x-auto hide-scrollbar pb-2 sm:pb-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <div className="p-1.5 bg-green-100 rounded-lg">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Gaji</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                Rp {(job.salary.min / 1000000).toFixed(0)} - {(job.salary.max / 1000000).toFixed(0)}jt
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Pelamar</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">{job.applicationCount}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <div className="p-1.5 bg-orange-100 rounded-lg">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Diposting</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {new Date(job.posted).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className={`px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg flex-shrink-0 ${
                            job.type === 'full-time' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.type === 'full-time' ? 'Penuh Waktu' : job.type === 'part-time' ? 'Paruh Waktu' : job.type}
                          </span>
                          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleApply(job)}
                              disabled={hasAppliedToJob(job.id)}
                              className={`tap-target flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                hasAppliedToJob(job.id)
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white hover:shadow-lg'
                              }`}
                            >
                              <span className="hidden xs:inline">{hasAppliedToJob(job.id) ? 'Sudah Dilamar' : 'Lamar Sekarang'}</span>
                              <span className="xs:hidden">{hasAppliedToJob(job.id) ? 'Sudah' : 'Lamar'}</span>
                              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                navigator.clipboard.writeText(`${job.title} di ${job.company}`);
                                toast.success('Link pekerjaan berhasil disalin!', { icon: '📋' });
                              }}
                              className="tap-target p-2 sm:p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all"
                            >
                              <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {}
          {!loading && !error && filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16 bg-white rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 px-4">Tidak ada lowongan ditemukan</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">Coba ubah filter atau kata kunci pencarian Anda</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    workSchedule: [],
                    experienceLevel: [],
                    workStyle: [],
                    salaryRange: [0, 50],
                    remote: null,
                    location: '',
                    skills: []
                  });
                }}
                className="tap-target px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm sm:text-base font-medium transition-all inline-flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Reset Filter
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {}
      {selectedJob && (
        <ApplyJobModal
          isOpen={showApplyModal}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedJob(null);
          }}
          jobData={{
            id: selectedJob.id,
            title: selectedJob.title,
            company: selectedJob.company,
            location: selectedJob.location,
            salary: `Rp ${selectedJob.salary.min / 1000000}jt - ${selectedJob.salary.max / 1000000}jt`,
            type: selectedJob.type,
            companyLogo: getCompanyLogo(selectedJob.company)
          }}
          onApplicationSubmitted={() => {
            setShowApplyModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default JobFinder;
