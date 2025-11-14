import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Award,
  FileText,
  ExternalLink,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  User,
  Briefcase,
  Star
} from 'lucide-react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type ApplicationStatus = 'applied' | 'reviewed' | 'interview' | 'accepted' | 'rejected';

interface InternshipApplicationDetail {
  id: string;
  internshipId: string;
  internship?: {
    position: string;
    company: {
      name: string;
      logo: string;
    };
    location: string;
  };
  candidateId: string;
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
  notes?: string;
}

const InternshipApplicantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<InternshipApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadApplicationDetail();
    }
  }, [id]);

  const loadApplicationDetail = async () => {
    try {
      setLoading(true);
      const response = await api.getInternshipApplicationById(id!);

      if (response.success && response.data?.application) {
        setApplication(response.data.application);
        setStatusNotes(response.data.application.notes || '');
      } else {
        toast.error('Aplikasi tidak ditemukan');
        navigate('/company/internships');
      }
    } catch (error: any) {
      console.error('Error loading application:', error);
      toast.error('Gagal memuat detail pelamar');
      navigate('/company/internships');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!application) return;

    const confirmMessages: Record<ApplicationStatus, string> = {
      applied: 'Ubah status kembali ke "Baru Daftar"?',
      reviewed: 'Tandai pelamar ini sebagai "Direview"?',
      interview: 'Jadwalkan interview untuk pelamar ini?',
      accepted: 'Terima pelamar ini untuk posisi magang?',
      rejected: 'Tolak aplikasi pelamar ini?'
    };

    if (!confirm(confirmMessages[newStatus])) return;

    try {
      setIsUpdating(true);

      const response = await api.updateInternshipApplicationStatus(application.id, {
        status: newStatus,
        notes: statusNotes.trim() || undefined
      });

      if (response.success) {
        toast.success(`Status berhasil diubah menjadi "${newStatus}"`);
        loadApplicationDetail();
      } else {
        toast.error('Gagal mengubah status');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Gagal mengubah status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadResume = () => {
    if (application?.resume) {
      window.open(application.resume, '_blank');
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const variants: Record<ApplicationStatus, { text: string; color: string; icon: any }> = {
      applied: { text: 'Baru Daftar', color: 'bg-blue-100 text-blue-700', icon: Clock },
      reviewed: { text: 'Direview', color: 'bg-yellow-100 text-yellow-700', icon: FileText },
      interview: { text: 'Interview', color: 'bg-purple-100 text-purple-700', icon: MessageSquare },
      accepted: { text: 'Diterima', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      rejected: { text: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle }
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-2 px-3 py-1.5 text-sm`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </Badge>
    );
  };

  const getStatusTimeline = () => {
    if (!application) return [];

    const timeline: { status: ApplicationStatus; date: string; active: boolean }[] = [
      { status: 'applied', date: application.appliedAt, active: true },
      { status: 'reviewed', date: application.reviewedAt || '', active: !!application.reviewedAt },
      { status: 'interview', date: '', active: application.status === 'interview' || application.status === 'accepted' },
      { status: 'accepted', date: '', active: application.status === 'accepted' }
    ];

    return timeline;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Memuat detail pelamar...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Data tidak ditemukan</h3>
          <Button onClick={() => navigate('/company/internships')} className="mt-4">
            Kembali ke Daftar Magang
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/company/internships/${application.internshipId}/applicants`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Detail Pelamar</h1>
          <p className="text-gray-600 mt-1">
            {application.internship?.position} • {application.internship?.company.name}
          </p>
        </div>
        <div>{getStatusBadge(application.status)}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {application.candidateName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{application.candidateName}</h3>
                  <p className="text-gray-600">{application.major}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${application.email}`} className="text-green-600 hover:underline">
                      {application.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    <a href={`tel:${application.phone}`} className="text-green-600 hover:underline">
                      {application.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Universitas</p>
                    <p className="font-medium text-gray-900">{application.university}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Program Studi</p>
                    <p className="font-medium text-gray-900">{application.major}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Semester</p>
                    <p className="font-medium text-gray-900">Semester {application.semester}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">IPK</p>
                    <Badge
                      className={
                        application.gpa >= 3.5
                          ? 'bg-green-100 text-green-700'
                          : application.gpa >= 3.0
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {application.gpa.toFixed(2)} / 4.00
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Ketersediaan</p>
                    <p className="font-medium text-gray-900">{application.availability}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Mendaftar</p>
                    <p className="font-medium text-gray-900">
                      {new Date(application.appliedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Resume / CV</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleDownloadResume}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" onClick={handleDownloadResume}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Lihat
                  </Button>
                </div>
              </div>

              {application.portfolio && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Portfolio</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{application.portfolio}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(application.portfolio, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buka Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Surat Lamaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Motivasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{application.motivation}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="space-y-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                onClick={() => handleStatusUpdate('reviewed')}
                disabled={isUpdating || application.status === 'reviewed'}
              >
                <FileText className="w-4 h-4 mr-2" />
                Tandai Direview
              </Button>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => handleStatusUpdate('interview')}
                disabled={isUpdating || application.status === 'interview'}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Jadwalkan Interview
              </Button>

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate('accepted')}
                disabled={isUpdating || application.status === 'accepted'}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Terima Pelamar
              </Button>

              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating || application.status === 'rejected'}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Tolak Pelamar
              </Button>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Catatan Internal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Tambahkan catatan untuk aplikasi ini..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
              <Button
                className="w-full"
                onClick={() => handleStatusUpdate(application.status)}
                disabled={isUpdating}
              >
                Simpan Catatan
              </Button>

              {application.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline Aplikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getStatusTimeline().map((item, index) => {
                  const isLast = index === getStatusTimeline().length - 1;
                  const statusConfig: Record<ApplicationStatus, { text: string; color: string }> = {
                    applied: { text: 'Mendaftar', color: 'blue' },
                    reviewed: { text: 'Direview', color: 'yellow' },
                    interview: { text: 'Interview', color: 'purple' },
                    accepted: { text: 'Diterima', color: 'green' },
                    rejected: { text: 'Ditolak', color: 'red' }
                  };
                  const config = statusConfig[item.status];

                  return (
                    <div key={item.status} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.active
                              ? `bg-${config.color}-600`
                              : 'bg-gray-300'
                          }`}
                        />
                        {!isLast && (
                          <div
                            className={`w-0.5 h-12 ${
                              item.active ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p
                          className={`font-medium ${
                            item.active ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {config.text}
                        </p>
                        {item.date && (
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(item.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Kontak Pelamar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = `mailto:${application.email}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Kirim Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = `tel:${application.phone}`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Hubungi via Telepon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InternshipApplicantDetail;
