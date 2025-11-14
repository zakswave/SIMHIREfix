import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, Mail, Plus, Trophy, X, Send, BookmarkPlus, Target, Users, CheckCircle } from 'lucide-react';
import { CandidateProfile } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_SIMULASI_RESULTS } from '@/lib/simulasiData';
import { toast } from 'sonner';
import { GradientCard } from '@/components/ui/gradient-card';
import { useDebounce } from '@/hooks/useDebounce';
const MOCK_TALENT_CANDIDATES: CandidateProfile[] = [
  {
    id: 'cand-1',
    name: 'Budi Santoso',
    email: 'budi@email.com',
    phone: '+6281234567890',
    location: 'Jakarta',
    title: 'Senior Frontend Developer',
    experience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Redux', 'Next.js'],
    availability: 'available',
    salaryExpectation: 22000000,
    portfolio: 'https://example.com',
about: 'Passionate frontend developer with 5+ years experience building scalable web applications',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-09-25T10:30:00Z',
    portfolioShared: true,
    profileCompleteness: 90,
    lastActive: '2024-09-24T10:30:00Z',
    applicationHistory: []
  },
  {
    id: 'cand-2',
    name: 'Siti Nurhaliza',
    email: 'siti@email.com',
    phone: '+6281234567891',
    location: 'Bandung',
    title: 'UX/UI Designer',
    experience: 3,
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
    availability: 'available',
    salaryExpectation: 15000000,
    portfolio: 'https://example.com',
about: 'Creative designer focused on user-centered design solutions',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-09-20T10:30:00Z',
    portfolioShared: false,
    profileCompleteness: 85,
    lastActive: '2024-09-24T14:20:00Z',
    applicationHistory: []
  },
  {
    id: 'cand-3',
    name: 'Ahmad Rahman',
    email: 'ahmad@email.com',
    phone: '+6281234567892',
    location: 'Surabaya',
    title: 'Full Stack Developer',
    experience: 4,
    skills: ['Python', 'Django', 'PostgreSQL', 'React', 'Docker', 'AWS'],
    availability: 'open_to_offers',
    salaryExpectation: 20000000,
    portfolio: 'https://example.com',
about: 'Full-stack developer specializing in Python and modern web technologies',
    createdAt: '2024-03-05T08:00:00Z',
    updatedAt: '2024-09-22T10:30:00Z',
    portfolioShared: true,
    profileCompleteness: 88,
    lastActive: '2024-09-22T10:30:00Z',
    applicationHistory: []
  },
  {
    id: 'cand-4',
    name: 'Dewi Sartika',
    email: 'dewi@email.com',
    phone: '+6281234567893',
    location: 'Yogyakarta',
    title: 'Data Scientist',
    experience: 6,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Tableau', 'Statistics'],
    availability: 'not_looking',
    salaryExpectation: 25000000,
    portfolio: 'https://example.com',
about: 'Experienced data scientist with expertise in machine learning and analytics',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-09-18T10:30:00Z',
    portfolioShared: true,
    profileCompleteness: 92,
    lastActive: '2024-09-18T10:30:00Z',
    applicationHistory: []
  },
  {
    id: 'cand-5',
    name: 'Rizky Pratama',
    email: 'rizky@email.com',
    phone: '+6281234567894',
    location: 'Jakarta',
    title: 'DevOps Engineer',
    experience: 4,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'Monitoring'],
    availability: 'available',
    salaryExpectation: 24000000,
    portfolio: 'https://example.com',
about: 'DevOps engineer passionate about automation and cloud infrastructure',
    createdAt: '2024-02-28T08:00:00Z',
    updatedAt: '2024-09-24T10:30:00Z',
    portfolioShared: false,
    profileCompleteness: 80,
    lastActive: '2024-09-24T10:30:00Z',
    applicationHistory: []
  }
];

const TalentSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [simulasiScoreFilter, setSimulasiScoreFilter] = useState('');
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<string[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateProfile[]>([]);
  const getSimulasiScore = (candidateName: string) => {
    return MOCK_SIMULASI_RESULTS.find(result => result.candidateName === candidateName);
  };

  useEffect(() => {
    setCandidates(MOCK_TALENT_CANDIDATES);
    setFilteredCandidates(MOCK_TALENT_CANDIDATES);
  }, []);

  useEffect(() => {
    let filtered = candidates;
    if (debouncedSearchTerm) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (candidate.title || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
    }
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(candidate =>
        selectedSkills.some(skill => candidate.skills.includes(skill))
      );
    }
    if (locationFilter) {
      filtered = filtered.filter(candidate => 
        candidate.location && candidate.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    if (experienceFilter) {
      const expValue = parseInt(experienceFilter);
      filtered = filtered.filter(candidate => candidate.experience && candidate.experience >= expValue);
    }
    if (availabilityFilter) {
      filtered = filtered.filter(candidate => candidate.availability === availabilityFilter);
    }
    if (simulasiScoreFilter) {
      const minScore = parseInt(simulasiScoreFilter);
      filtered = filtered.filter(candidate => {
        const simulasi = getSimulasiScore(candidate.name);
        return simulasi && simulasi.percentage >= minScore;
      });
    }

    setFilteredCandidates(filtered);
  }, [debouncedSearchTerm, selectedSkills, locationFilter, experienceFilter, availabilityFilter, simulasiScoreFilter, candidates]);

  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills))).sort();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const getAvailabilityLabel = (availability: CandidateProfile['availability'] | undefined) => {
    switch (availability) {
      case 'available': return 'Tersedia';
      case 'open_to_offers': return 'Terbuka untuk Tawaran';
      case 'not_looking': return 'Tidak Mencari';
      default: return '-';
    }
  };

  const getAvailabilityColor = (availability: CandidateProfile['availability'] | undefined) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'open_to_offers': return 'bg-yellow-100 text-yellow-800';
      case 'not_looking': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleContactClick = (candidate: CandidateProfile) => {
    setSelectedCandidate(candidate);
    setShowContactModal(true);
  };

  const handleSaveClick = (candidate: CandidateProfile) => {
    setSelectedCandidate(candidate);
    setShowSaveModal(true);
  };

  const handleSendContact = () => {
    toast.success(`Email berhasil dikirim ke ${selectedCandidate?.name}!`, {
      description: 'Kandidat akan menerima pesan Anda',
      icon: '📧'
    });
    setShowContactModal(false);
  };

  const handleSaveCandidate = () => {
    if (selectedCandidate) {
      setSavedCandidates(prev => [...prev, selectedCandidate.id]);
      toast.success(`${selectedCandidate.name} berhasil disimpan!`, {
        description: 'Kandidat ditambahkan ke daftar tersimpan',
        icon: '⭐'
      });
      setShowSaveModal(false);
    }
  };

  const isSaved = (candidateId: string) => savedCandidates.includes(candidateId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pencarian Talenta
            </h1>
          </div>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Temukan kandidat terbaik berdasarkan skill dan kriteria
          </p>
        </div>
      </motion.div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GradientCard
          title="Total Kandidat"
          value={candidates.length.toString()}
          subtitle="Terdaftar"
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />
        <GradientCard
          title="Tersedia"
          value={candidates.filter(c => c.availability === 'available').length.toString()}
          subtitle="Siap bekerja"
          icon={CheckCircle}
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
        />
        <GradientCard
          title="Tersimpan"
          value={savedCandidates.length.toString()}
          subtitle="Kandidat favorit"
          icon={BookmarkPlus}
          gradient="from-yellow-500 to-orange-500"
          delay={0.2}
        />
        <GradientCard
          title="Hasil Filter"
          value={filteredCandidates.length.toString()}
          subtitle="Cocok dengan kriteria"
          icon={Filter}
          gradient="from-purple-500 to-pink-500"
          delay={0.3}
        />
      </div>

      {}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {}
            <div className="lg:col-span-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berdasarkan nama, posisi, atau skill..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                />
              </div>
            </div>

            {}
            <div className="lg:col-span-2">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
              >
                <option value="">Semua Lokasi</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Yogyakarta">Yogyakarta</option>
              </select>
            </div>

            {}
            <div className="lg:col-span-2">
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
              >
                <option value="">Semua Pengalaman</option>
                <option value="1">1+ tahun</option>
                <option value="3">3+ tahun</option>
                <option value="5">5+ tahun</option>
                <option value="7">7+ tahun</option>
              </select>
            </div>

            {}
            <div className="lg:col-span-2">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
              >
                <option value="">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="open_to_offers">Terbuka untuk Tawaran</option>
                <option value="not_looking">Tidak Mencari</option>
              </select>
            </div>

            {}
            <div className="lg:col-span-2">
              <select
                value={simulasiScoreFilter}
                onChange={(e) => setSimulasiScoreFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
              >
                <option value="">Semua Simulasi</option>
                <option value="80">Score 80%+</option>
                <option value="90">Score 90%+</option>
                <option value="95">Score 95%+</option>
              </select>
            </div>

            {}
            <div className="lg:col-span-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkills([]);
                  setLocationFilter('');
                  setExperienceFilter('');
                  setAvailabilityFilter('');
                  setSimulasiScoreFilter('');
                }}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Reset Filter
              </Button>
            </div>
          </div>

          {}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Filter berdasarkan Skills:</p>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                  {selectedSkills.includes(skill) && <span className="ml-1">✓</span>}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Menampilkan {filteredCandidates.length} dari {candidates.length} kandidat
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCandidates.map(candidate => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                  <p className="text-gray-600 font-medium">{candidate.title}</p>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {candidate.experience} tahun
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Badge className={getAvailabilityColor(candidate.availability)}>
                    {getAvailabilityLabel(candidate.availability)}
                  </Badge>
                  {(() => {
                    const simulasi = getSimulasiScore(candidate.name);
                    if (simulasi) {
                      return (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                          <Trophy className="w-3 h-3 mr-1" />
                          {simulasi.percentage}%
                        </Badge>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 6).map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 6} lainnya
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">{candidate.about}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm">
                  <p className="text-gray-500">Ekspektasi Gaji:</p>
                  <p className="font-medium">Rp {typeof candidate.salaryExpectation === 'number' ? candidate.salaryExpectation.toLocaleString('id-ID') : typeof candidate.salaryExpectation === 'object' ? candidate.salaryExpectation.min.toLocaleString('id-ID') + ' - ' + candidate.salaryExpectation.max.toLocaleString('id-ID') : '-'}</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContactClick(candidate)}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Kontak
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleSaveClick(candidate)}
                    disabled={isSaved(candidate.id)}
                    className={isSaved(candidate.id) ? 'bg-green-600' : ''}
                  >
                    {isSaved(candidate.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Tersimpan
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Simpan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Kandidat Ditemukan</h3>
              <p className="text-gray-600">Coba ubah kriteria pencarian atau filter Anda</p>
            </div>
          </CardContent>
        </Card>
      )}

      {}
      <AnimatePresence>
        {showContactModal && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Hubungi Kandidat</h2>
                  </div>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {selectedCandidate.name}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedCandidate.title}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjek Email
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Peluang Karir di Perusahaan Kami"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={5}
                      placeholder={`Halo ${selectedCandidate.name},\n\nKami tertarik dengan profil Anda dan ingin mendiskusikan peluang karir di perusahaan kami.`}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowContactModal(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 gap-2"
                    onClick={handleSendContact}
                  >
                    <Send className="w-4 h-4" />
                    Kirim Email
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showSaveModal && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <BookmarkPlus className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Simpan Kandidat</h2>
                  </div>
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {selectedCandidate.name}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedCandidate.title}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-700">
                    Simpan kandidat ini ke daftar favorit Anda untuk akses cepat di kemudian hari.
                  </p>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Kandidat akan tersimpan di daftar tersimpan Anda</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowSaveModal(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 gap-2"
                    onClick={handleSaveCandidate}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    Simpan
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
};

export default TalentSearch;
