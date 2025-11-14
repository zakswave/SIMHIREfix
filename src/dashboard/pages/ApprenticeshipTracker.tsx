import { useState, useEffect } from 'react';
import { StatsCard } from '../components/StatsCard';
import { ProgressChart } from '../components/ProgressChart';
import { Grid, List, Bookmark, Briefcase, Target, MapPin, Clock, DollarSign, Search, Calendar, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import ApplyInternshipModal from '../components/modals/ApplyInternshipModal';
import { Internship, InternshipApplication } from '@/lib/internship';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface InternshipCardProps {
  internship: Internship;
  onApply: (internship: Internship) => void;
  onBookmark: (id: string) => void;
  hasApplied?: boolean;
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  onApply,
  onBookmark,
  hasApplied = false,
}) => {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return '1 hari lalu';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return `${Math.floor(diffDays / 30)} bulan lalu`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-green-300 transition-all group">
      {}
      <div className="flex items-start gap-3 mb-4">
        {}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
          {internship.company.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                {internship.position}
              </h3>
              <p className="text-sm text-gray-600 font-medium line-clamp-1">{internship.company.name}</p>
            </div>
            <button
              onClick={() => onBookmark(internship.id)}
              className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                internship.isBookmarked
                  ? 'text-yellow-500 bg-yellow-50'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${internship.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{internship.location}</span>
            {internship.remote && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Remote</span>}
          </div>
        </div>
      </div>

      {}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
        {internship.description}
      </p>

      {}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {internship.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md"
          >
            {tag}
          </span>
        ))}
        {internship.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
            +{internship.tags.length - 3}
          </span>
        )}
      </div>

      {}
      <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Gaji</p>
          <p className="text-xs font-semibold text-gray-900 line-clamp-1">
            {internship.isPaid && internship.salary ? internship.salary : 'Unpaid'}
          </p>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Durasi</p>
          <p className="text-xs font-semibold text-gray-900">{internship.duration}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Posted</p>
          <p className="text-xs font-semibold text-gray-900">{getTimeAgo(internship.postedDate)}</p>
        </div>
      </div>

      {}
      <div className="flex items-center gap-2 mb-3">
        {internship.certificateProvided && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md flex items-center gap-1">
            <Award className="w-3 h-3" />
            Sertifikat
          </span>
        )}
        {internship.mentorshipProvided && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
            Mentorship
          </span>
        )}
      </div>

      {}
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-md flex-shrink-0 ${
          internship.isPaid 
            ? 'bg-green-100 text-green-700'
            : 'bg-orange-100 text-orange-700'
        }`}>
          {internship.isPaid ? 'Berbayar' : 'Unpaid'}
        </span>

        {hasApplied ? (
          <div className="flex-1 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <CheckCircle className="w-4 h-4" />
            Sudah Mendaftar
          </div>
        ) : (
          <button
            onClick={() => onApply(internship)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white text-sm rounded-lg font-medium transition-all hover:shadow-lg"
          >
            Daftar Sekarang
          </button>
        )}
      </div>
    </div>
  );
};

const ApprenticeshipTracker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appliedInternshipIds, setAppliedInternshipIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    loadInternships();
    loadUserApplications();
  }, []);

  const loadUserApplications = async () => {
    try {
      console.log('[ApprenticeshipTracker] Loading user applications...');

      const response = await api.getCandidateInternshipApplications();

      if (response.success && response.data?.applications) {
        const appliedIds = new Set<string>(
          response.data.applications.map((app: any) => app.internshipId as string)
        );
        console.log('[ApprenticeshipTracker] User has applied to:', appliedIds.size, 'internships');
        setAppliedInternshipIds(appliedIds);
      } else {
        console.warn('[ApprenticeshipTracker] No applications found');
        setAppliedInternshipIds(new Set());
      }
    } catch (error) {
      console.error('[ApprenticeshipTracker] Error loading user applications:', error);
      setAppliedInternshipIds(new Set());
    }
  };

  const loadInternships = async () => {
    try {
      setLoading(true);
      console.log('[ApprenticeshipTracker] Loading internships from backend...');

      const response = await api.getInternships({});

      if (response.success && response.data?.internships) {
        const activeInternships = response.data.internships.filter(
          (internship: Internship) => internship.status === 'active'
        );
        console.log('[ApprenticeshipTracker] Loaded internships:', activeInternships.length);
        setInternships(activeInternships);
      } else {
        console.warn('[ApprenticeshipTracker] No internships found');
        setInternships([]);
      }
    } catch (error) {
      console.error('[ApprenticeshipTracker] Error loading internships:', error);
      toast.error('Gagal memuat lowongan magang');
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (internship: Internship) => {
    if (appliedInternshipIds.has(internship.id)) {
      toast.info('Anda sudah mendaftar', {
        description: 'Anda sudah mendaftar untuk posisi ini sebelumnya.'
      });
      return;
    }
    if (internship.applicationDeadline) {
      const deadline = new Date(internship.applicationDeadline);
      if (deadline < new Date()) {
        toast.error('Pendaftaran Ditutup', {
          description: 'Batas waktu pendaftaran untuk posisi ini sudah berakhir.'
        });
        return;
      }
    }

    setSelectedInternship(internship);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (application: Partial<InternshipApplication>) => {
    if (!selectedInternship || isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log('[ApprenticeshipTracker] Submitting application:', application);
      const response = await api.applyForInternship({
        internshipId: selectedInternship.id,
        candidateName: application.candidateName!,
        email: application.email!,
        phone: application.phone!,
        university: application.university!,
        major: application.major!,
        semester: application.semester!,
        gpa: application.gpa!,
        resume: application.resume!,
        portfolio: application.portfolio,
        coverLetter: application.coverLetter,
        motivation: application.motivation!,
        availability: application.availability!
      });

      if (response.success) {
        console.log('[ApprenticeshipTracker] Application success:', response.data);
        toast.success('Pendaftaran Berhasil!', {
          description: `Anda telah mendaftar untuk posisi ${selectedInternship.position}. Kami akan menghubungi Anda segera.`,
        });
        await loadUserApplications();
        await loadInternships();
        setShowApplyModal(false);
        setSelectedInternship(null);
      } else {
        throw new Error('Gagal mendaftar magang');
      }
    } catch (error: any) {
      console.error('[ApprenticeshipTracker] Application error:', error);
      if (error.response?.data?.error?.includes('already applied')) {
        toast.info('Anda Sudah Mendaftar', {
          description: 'Anda sudah mendaftar untuk posisi ini sebelumnya.',
        });
        await loadUserApplications();
        setShowApplyModal(false);
        setSelectedInternship(null);
        return;
      }
      if (error.response?.status === 404) {
        toast.error('Magang Tidak Tersedia', {
          description: 'Magang ini tidak lagi tersedia atau sudah ditutup.',
        });
        await loadInternships();
        setShowApplyModal(false);
        setSelectedInternship(null);
        return;
      }

      const errorMessage = error.response?.data?.error || error.message || 'Gagal mendaftar magang';
      toast.error('Gagal Mendaftar', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookmark = (id: string) => {
    setInternships(prev => 
      prev.map(internship => 
        internship.id === id 
          ? { ...internship, isBookmarked: !internship.isBookmarked }
          : internship
      )
    );

    const internship = internships.find(i => i.id === id);
    if (internship?.isBookmarked) {
      toast.success("Bookmark Dihapus", {
        description: "Magang dihapus dari bookmark",
      });
    } else {
      toast.success("Bookmark Ditambahkan", {
        description: "Magang ditambahkan ke bookmark",
      });
    }
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBookmark = showBookmarked ? internship.isBookmarked : true;

    return matchesSearch && matchesBookmark;
  });

  const stats = [
    { label: 'Total Magang', value: internships.length, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Berbayar', value: internships.filter(i => i.isPaid).length, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Disimpan', value: internships.filter(i => i.isBookmarked).length, icon: Bookmark, color: 'bg-purple-500' },
    { label: 'Tersedia', value: internships.filter(i => i.status === 'active').length, icon: Target, color: 'bg-orange-500' }
  ];

  const locationCounts = internships.reduce((acc, internship) => {
    const location = internship.location.split(' ')[0];
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationData = Object.entries(locationCounts).map(([label, value], index) => ({
    label,
    value,
    color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index % 5]
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Magang</h1>
          <p className="text-gray-600">Temukan dan daftar program magang yang sesuai dengan minat Anda</p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Distribusi Lokasi</h3>
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <ProgressChart data={locationData} maxValue={Math.max(...locationData.map(d => d.value))} />
        </div>

        {}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Cari magang, perusahaan, atau skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="salary-high">Highest Salary</SelectItem>
                  <SelectItem value="salary-low">Lowest Salary</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showBookmarked ? "default" : "outline"}
                onClick={() => setShowBookmarked(!showBookmarked)}
                className="flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Bookmarked
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="mb-4">
          <p className="text-gray-600">
            Menampilkan {filteredInternships.length} magang{filteredInternships.length !== 1 ? '' : ''}
            {showBookmarked && ' (hanya yang di-bookmark)'}
          </p>
        </div>

        {}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data magang...</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onApply={handleApply}
                  onBookmark={handleBookmark}
                  hasApplied={appliedInternshipIds.has(internship.id)}
                />
              ))}
            </div>

            {filteredInternships.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada magang ditemukan</h3>
                <p className="text-gray-600">
                  {showBookmarked 
                    ? "Anda belum mem-bookmark magang apapun." 
                    : internships.length === 0
                    ? "Belum ada magang yang tersedia saat ini."
                    : "Coba sesuaikan pencarian atau filter Anda."}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {}
      {selectedInternship && (
        <ApplyInternshipModal
          isOpen={showApplyModal}
          onClose={() => {
            if (!isSubmitting) {
              setShowApplyModal(false);
              setSelectedInternship(null);
            }
          }}
          internship={selectedInternship}
          onSubmit={handleSubmitApplication}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ApprenticeshipTracker;
