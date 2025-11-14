import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Clock,
  User,
  Award,
  FileText
} from 'lucide-react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GradientCard } from '@/components/ui/gradient-card';

type ApplicationStatus = 'applied' | 'reviewed' | 'interview' | 'accepted' | 'rejected';

interface InternshipApplicationWithDetails {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  semester: number;
  gpa: number;
  resume: string;
  portfolio?: string;
  coverLetter?: string;
  motivation: string;
  availability: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
}

const InternshipApplicants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<any>(null);
  const [applications, setApplications] = useState<InternshipApplicationWithDetails[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<InternshipApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [gpaFilter, setGpaFilter] = useState<number>(0);
  const [universityFilter, setUniversityFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      loadInternshipAndApplications();
    }
  }, [id]);

  useEffect(() => {
    applyFilters();
  }, [applications, searchQuery, statusFilter, gpaFilter, universityFilter]);

  const loadInternshipAndApplications = async () => {
    try {
      setLoading(true);
      const internshipResponse = await api.getInternshipById(id!);
      if (internshipResponse.success && internshipResponse.data?.internship) {
        setInternship(internshipResponse.data.internship);
      }
      const applicationsResponse = await api.getCompanyInternshipApplications({ internshipId: id });
      if (applicationsResponse.success && applicationsResponse.data?.applications) {
        setApplications(applicationsResponse.data.applications);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuat data pelamar');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.candidateName.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.university.toLowerCase().includes(query) ||
        app.major.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    if (gpaFilter > 0) {
      filtered = filtered.filter(app => app.gpa >= gpaFilter);
    }
    if (universityFilter.trim()) {
      filtered = filtered.filter(app =>
        app.university.toLowerCase().includes(universityFilter.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const handleBulkStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (selectedApplications.size === 0) {
      toast.error('Pilih minimal 1 pelamar');
      return;
    }

    const confirmMessage = `Apakah Anda yakin ingin mengubah status ${selectedApplications.size} pelamar menjadi "${newStatus}"?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const promises = Array.from(selectedApplications).map(appId =>
        api.updateInternshipApplicationStatus(appId, { status: newStatus })
      );

      await Promise.all(promises);
      toast.success(`Berhasil mengubah status ${selectedApplications.size} pelamar`);
      setSelectedApplications(new Set());
      loadInternshipAndApplications();
    } catch (error) {
      console.error('Error updating statuses:', error);
      toast.error('Gagal mengubah status pelamar');
    }
  };

  const toggleSelectApplication = (appId: string) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(appId)) {
      newSelected.delete(appId);
    } else {
      newSelected.add(appId);
    }
    setSelectedApplications(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedApplications.size === filteredApplications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const variants: Record<ApplicationStatus, { variant: any; text: string; color: string }> = {
      applied: { variant: 'secondary', text: 'Baru Daftar', color: 'bg-blue-100 text-blue-700' },
      reviewed: { variant: 'default', text: 'Direview', color: 'bg-yellow-100 text-yellow-700' },
      interview: { variant: 'default', text: 'Interview', color: 'bg-purple-100 text-purple-700' },
      accepted: { variant: 'success', text: 'Diterima', color: 'bg-green-100 text-green-700' },
      rejected: { variant: 'destructive', text: 'Ditolak', color: 'bg-red-100 text-red-700' }
    };
    const config = variants[status];
    return <Badge className={config.color}>{config.text}</Badge>;
  };
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    avgGPA: applications.length > 0
      ? (applications.reduce((sum, app) => sum + app.gpa, 0) / applications.length).toFixed(2)
      : '0.00'
  };

  const uniqueUniversities = Array.from(new Set(applications.map(app => app.university)));

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Memuat data pelamar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/company/internships')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Pelamar Magang: {internship?.position || 'Loading...'}
          </h1>
          <p className="text-gray-600 mt-1">
            {internship?.company?.name} • {internship?.location}
          </p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <GradientCard
          gradient="from-blue-500 to-blue-600"
          icon={User}
          title="Total Pelamar"
          value={stats.total.toString()}
        />
        <GradientCard
          gradient="from-gray-500 to-gray-600"
          icon={Clock}
          title="Baru Daftar"
          value={stats.applied.toString()}
        />
        <GradientCard
          gradient="from-yellow-500 to-yellow-600"
          icon={FileText}
          title="Direview"
          value={stats.reviewed.toString()}
        />
        <GradientCard
          gradient="from-purple-500 to-purple-600"
          icon={User}
          title="Interview"
          value={stats.interview.toString()}
        />
        <GradientCard
          gradient="from-green-500 to-green-600"
          icon={CheckCircle}
          title="Diterima"
          value={stats.accepted.toString()}
        />
        <GradientCard
          gradient="from-orange-500 to-orange-600"
          icon={Award}
          title="Avg GPA"
          value={stats.avgGPA}
        />
      </div>

      {}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, email, universitas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>

              {selectedApplications.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBulkStatusUpdate('reviewed')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-xs"
                  >
                    Review ({selectedApplications.size})
                  </Button>
                  <Button
                    onClick={() => handleBulkStatusUpdate('interview')}
                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                  >
                    Interview ({selectedApplications.size})
                  </Button>
                  <Button
                    onClick={() => handleBulkStatusUpdate('accepted')}
                    className="bg-green-600 hover:bg-green-700 text-xs"
                  >
                    Terima ({selectedApplications.size})
                  </Button>
                  <Button
                    onClick={() => handleBulkStatusUpdate('rejected')}
                    className="bg-red-600 hover:bg-red-700 text-xs"
                  >
                    Tolak ({selectedApplications.size})
                  </Button>
                </div>
              )}
            </div>
          </div>

          {}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="applied">Baru Daftar</option>
                    <option value="reviewed">Direview</option>
                    <option value="interview">Interview</option>
                    <option value="accepted">Diterima</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min GPA</label>
                  <select
                    value={gpaFilter}
                    onChange={(e) => setGpaFilter(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="0">Semua GPA</option>
                    <option value="3.0">≥ 3.0</option>
                    <option value="3.25">≥ 3.25</option>
                    <option value="3.5">≥ 3.5</option>
                    <option value="3.75">≥ 3.75</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Universitas</label>
                  <select
                    value={universityFilter}
                    onChange={(e) => setUniversityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Semua Universitas</option>
                    {uniqueUniversities.map((uni, index) => (
                      <option key={index} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter('all');
                      setGpaFilter(0);
                      setUniversityFilter('');
                      setSearchQuery('');
                    }}
                    className="w-full"
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada pelamar yang sesuai
            </h3>
            <p className="text-gray-600">
              Coba ubah filter pencarian Anda
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedApplications.size === filteredApplications.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pelamar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Universitas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      GPA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Semester
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tanggal Daftar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedApplications.has(application.id)}
                          onChange={() => toggleSelectApplication(application.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{application.candidateName}</p>
                          <p className="text-sm text-gray-600">{application.email}</p>
                          <p className="text-sm text-gray-500">{application.major}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{application.university}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          className={
                            application.gpa >= 3.5
                              ? 'bg-green-100 text-green-700'
                              : application.gpa >= 3.0
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {application.gpa.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{application.semester}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">
                          {new Date(application.appliedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(application.status)}</td>
                      <td className="px-4 py-4">
                        <Link to={`/company/internships/applicants/${application.id}`}>
                          <Button size="sm" variant="outline">
                            Lihat Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InternshipApplicants;
