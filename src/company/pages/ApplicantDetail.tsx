import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Star, Download, MessageSquare, CheckCircle, XCircle, Clock, Calendar, StarOff } from 'lucide-react';
import { getApplication, updateApplicationStage, addApplicationNote } from '@/lib/company/data';
import { JobApplication, ApplicationStage } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
const scoringCriteria = [
  { id: 'skills', label: 'Keterampilan Teknis', description: 'Kemampuan teknis sesuai posisi' },
  { id: 'experience', label: 'Pengalaman Relevan', description: 'Pengalaman kerja yang sesuai' },
  { id: 'education', label: 'Pendidikan', description: 'Latar belakang pendidikan' },
  { id: 'communication', label: 'Komunikasi', description: 'Kemampuan komunikasi tertulis' },
  { id: 'cultural_fit', label: 'Cultural Fit', description: 'Kesesuaian dengan budaya perusahaan' },
];

const stageLabels: Record<ApplicationStage, string> = {
  'applied': 'Melamar',
  'screening': 'Screening',
  'interview': 'Interview',
  'offer': 'Penawaran',
  'accepted': 'Diterima',
  'rejected': 'Ditolak'
};

const stageColors: Record<ApplicationStage, string> = {
  'applied': 'bg-blue-100 text-blue-800',
  'screening': 'bg-yellow-100 text-yellow-800',
  'interview': 'bg-purple-100 text-purple-800',
  'offer': 'bg-green-100 text-green-800',
  'accepted': 'bg-primary-100 text-primary-800',
  'rejected': 'bg-red-100 text-red-800'
};

const ApplicantDetail: React.FC = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showInterviewSchedule, setShowInterviewSchedule] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  useEffect(() => {
    if (applicationId) {
      const savedScores = localStorage.getItem(`applicant_scores_${applicationId}`);
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    }
  }, [applicationId]);

  const saveScore = (criteriaId: string, score: number) => {
    const newScores = { ...scores, [criteriaId]: score };
    setScores(newScores);
    if (applicationId) {
      localStorage.setItem(`applicant_scores_${applicationId}`, JSON.stringify(newScores));
    }
    toast.success('Skor disimpan');
  };

  const getAverageScore = () => {
    const scoreValues = Object.values(scores);
    if (scoreValues.length === 0) return 0;
    const avg = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
    return Math.round(avg * 10) / 10;
  };

  const scheduleInterview = () => {
    if (!interviewDate || !interviewTime) {
      toast.error('Mohon isi tanggal dan waktu interview');
      return;
    }

    const interviewData = {
      date: interviewDate,
      time: interviewTime,
      notes: interviewNotes,
      scheduledAt: new Date().toISOString(),
    };

    localStorage.setItem(`interview_${applicationId}`, JSON.stringify(interviewData));
    handleStageChange('interview');

    toast.success('Interview berhasil dijadwalkan! 📅', {
      description: `${interviewDate} pukul ${interviewTime}`,
    });

    setShowInterviewSchedule(false);
    setInterviewDate('');
    setInterviewTime('');
    setInterviewNotes('');
  };

  useEffect(() => {
    const loadApplication = () => {
      if (!applicationId) return;

      try {
        const app = getApplication(applicationId);
        if (!app) {
          toast.error('Aplikasi tidak ditemukan');
          navigate('/company/applicants');
          return;
        }
        setApplication(app);
      } catch (error) {
        console.error('Error loading application:', error);
        toast.error('Gagal memuat data aplikasi');
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [applicationId, navigate]);

  const handleStageChange = (newStage: ApplicationStage) => {
    if (!applicationId) return;

    try {
      updateApplicationStage(applicationId, newStage);
      setApplication(prev => prev ? { ...prev, stage: newStage } : null);
      toast.success(`Status berhasil diubah ke ${stageLabels[newStage]}`);
    } catch (error) {
      console.error('Error updating stage:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleAddNote = async () => {
    if (!applicationId || !noteText.trim()) return;

    setAddingNote(true);
    try {
      const note = {
        id: Date.now().toString(),
        content: noteText.trim(),
        createdAt: new Date().toISOString(),
        author: 'HR Manager'
      };

      addApplicationNote(applicationId, note);

      setApplication(prev => prev ? {
        ...prev,
        reviewerNotes: [...prev.reviewerNotes, `[${note.author}] ${note.content}`]
      } : null);

      setNoteText('');
      toast.success('Catatan berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Gagal menambahkan catatan');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/company/applicants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Pelamar</h1>
            <p className="text-gray-600">Memuat data pelamar...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-card border border-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/company/applicants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Pelamar</h1>
            <p className="text-gray-600">Pelamar tidak ditemukan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/company/applicants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.candidateName}</h1>
            <p className="text-gray-600">Melamar untuk posisi ini</p>
          </div>
        </div>
        <Badge className={stageColors[application.stage]}>
          {stageLabels[application.stage]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kandidat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{application.candidateEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    <p className="font-medium">{application.candidatePhone || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-medium">{application.candidateLocation || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Skor Keseluruhan</p>
                    <p className="font-medium">{application.scoreOverall}/10</p>
                  </div>
                </div>
              </div>

              {application.candidateSkills && application.candidateSkills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {application.candidateSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Detail Aplikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tanggal Melamar</p>
                  <p className="font-medium">{new Date(application.appliedAt).toLocaleDateString('id-ID')}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Ekspektasi Gaji</p>
                  <p className="font-medium">
                    {application.salaryExpectation 
                      ? `Rp ${application.salaryExpectation.toLocaleString('id-ID')}`
                      : 'Tidak disebutkan'
                    }
                  </p>
                </div>
              </div>

              {application.coverLetter && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Cover Letter</p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{application.coverLetter}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">CV/Resume</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
              </div>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Catatan Internal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.reviewerNotes && application.reviewerNotes.length > 0 ? (
                <div className="space-y-3">
                  {application.reviewerNotes.map((note, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Belum ada catatan.</p>
              )}

              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Tambahkan catatan internal..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                />
                <Button 
                  onClick={handleAddNote} 
                  size="sm"
                  disabled={addingNote || !noteText.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {addingNote ? 'Menambahkan...' : 'Tambah Catatan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="space-y-6">
          {}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Penilaian Kandidat</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScoring(!showScoring)}
                >
                  {showScoring ? 'Tutup' : 'Buka'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showScoring ? (
                <div className="space-y-4">
                  {scoringCriteria.map((criteria) => (
                    <div key={criteria.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{criteria.label}</p>
                          <p className="text-xs text-gray-500">{criteria.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => saveScore(criteria.id, star)}
                            className="p-0.5 hover:scale-110 transition-transform"
                          >
                            {star <= (scores[criteria.id] || 0) ? (
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="w-5 h-5 text-gray-300" />
                            )}
                          </button>
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          {scores[criteria.id] || 0}/5
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Rata-rata Skor:</span>
                      <span className="text-lg font-bold text-primary-600">
                        {getAverageScore()}/5
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    {Object.keys(scores).length > 0 ? (
                      <>Skor rata-rata: <span className="font-bold text-primary-600">{getAverageScore()}/5</span></>
                    ) : (
                      'Belum ada penilaian'
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Tindakan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {}
              <Button
                onClick={() => setShowInterviewSchedule(true)}
                variant="default"
                size="sm"
                className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Jadwalkan Interview
              </Button>

              {}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Ubah Status</p>

                {application.stage !== 'screening' && application.stage !== 'accepted' && application.stage !== 'rejected' && (
                  <Button
                    onClick={() => handleStageChange('screening')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pindah ke Screening
                  </Button>
                )}

                {application.stage === 'screening' && (
                  <Button
                    onClick={() => handleStageChange('interview')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Undang Interview
                  </Button>
                )}

                {application.stage === 'interview' && (
                  <Button
                    onClick={() => handleStageChange('offer')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Buat Penawaran
                  </Button>
                )}

                {application.stage === 'offer' && (
                  <Button
                    onClick={() => handleStageChange('accepted')}
                    className="w-full justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Terima Kandidat
                  </Button>
                )}

                {application.stage !== 'accepted' && application.stage !== 'rejected' && (
                  <Button
                    onClick={() => handleStageChange('rejected')}
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak Kandidat
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                  <div>
                    <p className="font-medium">Melamar</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(application.appliedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {application.stage !== 'applied' && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Dalam Proses</p>
                      <p className="text-gray-500 text-xs">Status: {stageLabels[application.stage]}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {}
      {showInterviewSchedule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInterviewSchedule(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Jadwalkan Interview
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Waktu</label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Catatan (opsional)</label>
                <textarea
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Lokasi, platform video call, atau instruksi lainnya..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowInterviewSchedule(false)}
                variant="outline"
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={scheduleInterview}
                className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700"
              >
                Jadwalkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDetail;
