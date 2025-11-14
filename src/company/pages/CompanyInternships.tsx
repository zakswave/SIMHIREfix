import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Users,
  Calendar,
  MapPin,
  DollarSign,
  GraduationCap,
  Target,
  CheckCircle,
  Award,
  BookOpen
} from 'lucide-react';
import { api } from '@/services/api';
import { Internship } from '@/lib/internship';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GradientCard } from '@/components/ui/gradient-card';
import { handleError } from '@/lib/errors';

type InternshipStatus = 'active' | 'closed' | 'draft';

const CompanyInternships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InternshipStatus[]>([]);
  const [isPaidFilter, setIsPaidFilter] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  useEffect(() => {
    loadInternships();
  }, []);
  useEffect(() => {
    loadInternships();
  }, [searchQuery, statusFilter, isPaidFilter]);

  const loadInternships = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[CompanyInternships] Loading company internships from backend...');

      const response = await api.getCompanyInternships();

      console.log('[CompanyInternships] API Response:', response);

      if (response.success && response.data?.internships) {
        let fetchedInternships = response.data.internships;

        console.log(`[CompanyInternships] Loaded ${fetchedInternships.length} internships from backend`, fetchedInternships);
        if (statusFilter.length > 0) {
          fetchedInternships = fetchedInternships.filter((internship: Internship) => 
            statusFilter.includes(internship.status as InternshipStatus)
          );
          console.log(`[CompanyInternships] After status filter: ${fetchedInternships.length} internships`);
        }
        if (isPaidFilter !== null) {
          fetchedInternships = fetchedInternships.filter((internship: Internship) => 
            internship.isPaid === isPaidFilter
          );
          console.log(`[CompanyInternships] After isPaid filter: ${fetchedInternships.length} internships`);
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          fetchedInternships = fetchedInternships.filter((internship: Internship) =>
            internship.position?.toLowerCase().includes(query) ||
            internship.description?.toLowerCase().includes(query) ||
            internship.location?.toLowerCase().includes(query)
          );
          console.log(`[CompanyInternships] After search filter: ${fetchedInternships.length} internships`);
        }

        console.log('[CompanyInternships] Final internships to display:', fetchedInternships.length);
        setInternships(fetchedInternships);
      } else {
        console.warn('[CompanyInternships] No internships found or invalid response', response);
        setInternships([]);
      }
    } catch (error: any) {
      console.error('[CompanyInternships] Error loading company internships:', error);
      handleError(error, 'loadInternships');
      toast.error('Gagal memuat lowongan magang', {
        description: error.response?.data?.message || error.message
      });
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, isPaidFilter]);

  const handleStatusToggle = async (internshipId: string, currentStatus: InternshipStatus) => {
    const newStatus: InternshipStatus = currentStatus === 'active' ? 'closed' : 'active';

    try {
      const response = await api.updateInternship(internshipId, { status: newStatus });

      if (response.success) {
        loadInternships();
        toast.success(`Lowongan magang ${newStatus === 'active' ? 'diaktifkan' : 'ditutup'}`);
      }
    } catch (error) {
      handleError(error, 'handleStatusToggle');
      toast.error('Gagal mengubah status lowongan magang');
    }
  };

  const handleDelete = async (internshipId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan magang ini? Semua aplikasi terkait juga akan dihapus.')) {
      return;
    }

    try {
      const response = await api.deleteInternship(internshipId);

      if (response.success) {
        await loadInternships();
        toast.success('Lowongan magang berhasil dihapus', {
          description: 'Semua aplikasi terkait telah dihapus.'
        });
      }
    } catch (error) {
      handleError(error, 'handleDelete');
      toast.error('Gagal menghapus lowongan magang');
    }
  };
  const stats = {
    total: internships.length,
    active: internships.filter(i => i.status === 'active').length,
    paid: internships.filter(i => i.isPaid).length,
    totalApplicants: internships.reduce((sum, i) => sum + (i.applicationCount || 0), 0)
  };

  const getStatusBadge = (status: InternshipStatus) => {
    const variants: Record<InternshipStatus, { variant: any; text: string }> = {
      active: { variant: 'success', text: 'Aktif' },
      closed: { variant: 'secondary', text: 'Ditutup' },
      draft: { variant: 'outline', text: 'Draft' }
    };

    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lowongan Magang</h1>
        <p className="text-gray-600 mt-1">Kelola lowongan magang perusahaan Anda</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GradientCard
          gradient="from-green-500 to-emerald-600"
          icon={GraduationCap}
          title="Total Magang"
          value={stats.total.toString()}
        />
        <GradientCard
          gradient="from-blue-500 to-blue-600"
          icon={CheckCircle}
          title="Aktif"
          value={stats.active.toString()}
        />
        <GradientCard
          gradient="from-purple-500 to-purple-600"
          icon={DollarSign}
          title="Berbayar"
          value={stats.paid.toString()}
        />
        <GradientCard
          gradient="from-orange-500 to-orange-600"
          icon={Users}
          title="Total Pendaftar"
          value={stats.totalApplicants.toString()}
        />
      </div>

      {}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari lowongan magang..."
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
                {(statusFilter.length > 0 || isPaidFilter !== null) && (
                  <Badge variant="default" className="ml-1">
                    {statusFilter.length + (isPaidFilter !== null ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              <Link to="/company/internships/new">
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4" />
                  Buat Lowongan Magang
                </Button>
              </Link>
            </div>
          </div>

          {}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {(['active', 'closed', 'draft'] as InternshipStatus[]).map((status) => (
                      <label key={status} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStatusFilter([...statusFilter, status]);
                            } else {
                              setStatusFilter(statusFilter.filter(s => s !== status));
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {status === 'active' ? 'Aktif' : status === 'closed' ? 'Ditutup' : 'Draft'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Magang
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={isPaidFilter === null}
                        onChange={() => setIsPaidFilter(null)}
                        className="border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Semua</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={isPaidFilter === true}
                        onChange={() => setIsPaidFilter(true)}
                        className="border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Berbayar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={isPaidFilter === false}
                        onChange={() => setIsPaidFilter(false)}
                        className="border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Tidak Berbayar</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter([]);
                      setIsPaidFilter(null);
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
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Memuat lowongan magang...</p>
        </div>
      ) : internships.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter.length > 0 || isPaidFilter !== null
                ? 'Tidak ada lowongan magang yang sesuai'
                : 'Belum ada lowongan magang'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter.length > 0 || isPaidFilter !== null
                ? 'Coba ubah filter pencarian Anda'
                : 'Mulai buat lowongan magang pertama Anda'}
            </p>
            {!searchQuery && statusFilter.length === 0 && isPaidFilter === null && (
              <Link to="/company/internships/new">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Lowongan Magang
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {internships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {internship.position}
                          </h3>
                          {getStatusBadge(internship.status as InternshipStatus)}
                          {internship.isPaid && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <DollarSign className="w-3 h-3 mr-1" />
                              Berbayar
                            </Badge>
                          )}
                          {internship.mentorshipProvided && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Mentorship
                            </Badge>
                          )}
                          {internship.certificateProvided && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Award className="w-3 h-3 mr-1" />
                              Sertifikat
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {internship.location}
                            {internship.remote && (
                              <Badge variant="secondary" className="ml-1">Remote</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {internship.duration}
                          </div>
                          {internship.isPaid && internship.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {internship.salary}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {internship.applicationCount || 0} pendaftar
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {internship.description}
                        </p>

                        {internship.tags && internship.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {internship.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === internship.id ? null : internship.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {openDropdown === internship.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <Link
                          to={`/company/internships/${internship.id}/applicants`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Users className="w-4 h-4" />
                          Lihat Pendaftar ({internship.applicationCount || 0})
                        </Link>
                        <Link
                          to={`/company/internships/${internship.id}/edit`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            handleStatusToggle(internship.id, internship.status as InternshipStatus);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          <Target className="w-4 h-4" />
                          {internship.status === 'active' ? 'Tutup' : 'Aktifkan'}
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            handleDelete(internship.id);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyInternships;
