import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Calendar, Clock,
  Eye, CheckCircle, MessageSquare,
  Search, ChevronLeft,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { getJobPostById } from '../../lib/company/data';
import { type JobPost } from '../../lib/company/types';
import { loadApplications, updateApplicationStatus, type Application } from '../../lib/storage';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

interface ApplicationWithCandidate extends Application {
  simulasiScores?: Record<string, number>;
  candidateEmail?: string;
  candidatePhone?: string;
}

const JobApplicants: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobPost | null>(null);
  const [applications, setApplications] = useState<ApplicationWithCandidate[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [selectedApp, setSelectedApp] = useState<ApplicationWithCandidate | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  useEffect(() => {
    if (!jobId) {
      navigate('/company/jobs');
      return;
    }

    const jobData = getJobPostById(jobId);
    if (!jobData) {
      toast.error('Lowongan tidak ditemukan');
      navigate('/company/jobs');
      return;
    }

    setJob(jobData);
    const allApps = loadApplications();
    const jobApps = allApps.filter(app => app.jobId === jobId);
    setApplications(jobApps);
  }, [jobId, navigate]);
  useEffect(() => {
    let filtered = [...applications];
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.company.toLowerCase().includes(term) ||
        app.jobTitle.toLowerCase().includes(term) ||
        app.candidateEmail?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      } else {
        return a.company.localeCompare(b.company);
      }
    });

    setFilteredApplications(filtered);
  }, [applications, debouncedSearchTerm, statusFilter, sortBy]);
  const handleStatusUpdate = (appId: string, newStatus: Application['status']) => {
    const statusMessages = {
      applied: 'Dikembalikan ke status "Melamar"',
      screening: 'Kandidat dipindahkan ke tahap Screening',
      interview: 'Kandidat diundang untuk Interview! 📅',
      offer: 'Penawaran kerja dikirim ke kandidat! 🎉',
      accepted: 'Kandidat diterima! Selamat! 🎊',
      rejected: 'Kandidat ditolak'
    };

    const success = updateApplicationStatus(
      appId, 
      newStatus,
      undefined,
      undefined
    );

    if (success) {
      setApplications(prev =>
        prev.map(app =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );

      toast.success(statusMessages[newStatus], {
        description: 'Kandidat akan menerima notifikasi otomatis via email',
        duration: 3000,
      });
    } else {
      toast.error('Gagal memperbarui status');
    }
  };
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'applied').length,
      screening: applications.filter(a => a.status === 'screening').length,
      interview: applications.filter(a => a.status === 'interview').length,
      offered: applications.filter(a => a.status === 'offer').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
  }, [applications]);

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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: Application['status']) => {
    switch (status) {
      case 'applied': return 'Baru Melamar';
      case 'screening': return 'Dalam Seleksi';
      case 'interview': return 'Interview';
      case 'offer': return 'Ditawarkan';
      case 'accepted': return 'Diterima';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  if (!job) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/company/jobs')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Lowongan
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm sm:text-base text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Dibuka {new Date(job.publishedAt || job.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{stats.total} Pelamar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Pelamar', value: stats.total, icon: User, color: 'primary' },
          { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'blue' },
          { label: 'Interview', value: stats.interview, icon: MessageSquare, color: 'purple' },
          { label: 'Diterima', value: stats.accepted, icon: CheckCircle, color: 'green' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-4 sm:p-6 rounded-card border border-gray-200 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {}
      <div className="bg-white p-4 rounded-card border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pelamar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="applied">Baru Melamar</option>
            <option value="screening">Dalam Seleksi</option>
            <option value="interview">Interview</option>
            <option value="offer">Ditawarkan</option>
            <option value="accepted">Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>

          {}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="name">Nama A-Z</option>
          </select>
        </div>
      </div>

      {}
      <div className="bg-white rounded-card border border-gray-200 overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tidak ada hasil yang cocok'
                : 'Belum ada pelamar'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Coba ubah filter pencarian Anda'
                : 'Lowongan ini belum menerima lamaran'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedApp(app);
                  setShowDetailModal(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                        {app.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.company}</h3>
                        {app.candidateEmail && (
                          <p className="text-sm text-gray-600">{app.candidateEmail}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Melamar {new Date(app.appliedAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      {app.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{app.location}</span>
                        </div>
                      )}
                      {app.simulasiScores && Object.keys(app.simulasiScores).length > 0 && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <div className="flex gap-1">
                            {Object.entries(app.simulasiScores).slice(0, 3).map(([category, score]) => {
                              const avgScore = score;
                              const badgeColor = avgScore >= 80 ? 'bg-green-100 text-green-800 border-green-300' :
                                                avgScore >= 60 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                                'bg-yellow-100 text-yellow-800 border-yellow-300';
                              return (
                                <span
                                  key={category}
                                  className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}
                                  title={`${category}: ${avgScore}/100`}
                                >
                                  {category.substring(0, 8)}: {Math.round(avgScore)}
                                </span>
                              );
                            })}
                            {Object.keys(app.simulasiScores).length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{Object.keys(app.simulasiScores).length - 3} lainnya
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApp(app);
                          setShowDetailModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Detail Lamaran</DialogTitle>
                <DialogDescription>
                  Melamar untuk posisi {selectedApp.jobTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Informasi Kandidat</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span>{selectedApp.company}</span>
                    </div>
                    {selectedApp.candidateEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span>{selectedApp.candidateEmail}</span>
                      </div>
                    )}
                    {selectedApp.candidatePhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span>{selectedApp.candidatePhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span>Melamar {new Date(selectedApp.appliedAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>

                {}
                {selectedApp.simulasiScores && Object.keys(selectedApp.simulasiScores).length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Hasil Simulasi Kerja
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(selectedApp.simulasiScores).map(([category, score]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{category.replace('-', ' ')}</span>
                          <span className="font-semibold text-blue-600">{Math.round(score)}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {}
                <div>
                  <h3 className="font-semibold mb-3">Update Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(['screening', 'interview', 'offer', 'accepted', 'rejected'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={selectedApp.status === status ? 'default' : 'outline'}
                        onClick={() => {
                          handleStatusUpdate(selectedApp.id, status);
                          setShowDetailModal(false);
                        }}
                        className="justify-start"
                      >
                        {getStatusLabel(status)}
                      </Button>
                    ))}
                  </div>
                </div>

                {}
                {selectedApp.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Catatan</h3>
                    <p className="text-gray-600">{selectedApp.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobApplicants;
