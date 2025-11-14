import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, Target, Award, 
  Mail, Eye, Download, BarChart3, Clock, Zap,
  Search, Plus, X, Send, FileText, Calendar, Sparkles, Loader2
} from 'lucide-react';
import { SIMULASI_CATEGORIES, getRankColor } from '@/lib/simulasiData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { GradientCard } from '@/components/ui/gradient-card';
import { api } from '@/services/api';

const CompanySimulasi: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);

      const response = await api.getAllSimulasiResults();

      if (response.success && response.data.results) {
        setResults(response.data.results);
      }
    } catch (err: any) {
      console.error('Error loading simulasi results:', err);

      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || 'Gagal memuat data simulasi');
      }
    } finally {
      setLoading(false);
    }
  };
  const filteredResults = results.filter(result => {
    const matchesSearch = result.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || result.categoryId === selectedCategory;
    const matchesScore = result.percentage >= minScore;

    return matchesSearch && matchesCategory && matchesScore;
  });

  const handleViewDetail = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowDetailModal(true);
  };

  const handleInviteClick = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowInviteModal(true);
  };

  const handleSendInvite = () => {
    toast.success(`Undangan interview berhasil dikirim ke ${selectedCandidate?.candidateName}!`, {
      description: 'Kandidat akan menerima email notifikasi',
      icon: '📧'
    });
    setShowInviteModal(false);
  };

  const handleExportData = () => {
    const headers = ['Nama', 'Kategori', 'Skor (%)', 'Poin', 'Technical', 'Creativity', 'Efficiency', 'Communication', 'Badge', 'Tanggal'];
    const rows = filteredResults.map(r => [
      r.candidateName,
      r.categoryName,
      r.percentage,
      `${r.totalScore}/${r.maxScore}`,
      r.breakdown.technical,
      r.breakdown.creativity,
      r.breakdown.efficiency,
      r.breakdown.communication,
      r.badge || '-',
      r.completedAt ? new Date(r.completedAt).toLocaleDateString('id-ID') : '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `simulasi-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Data berhasil diexport!', {
      description: `${filteredResults.length} kandidat diexport ke CSV`,
      icon: '📥'
    });
  };

  const handleCreateCustom = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCustomSimulasi = () => {
    toast.success('Simulasi custom berhasil dibuat!', {
      description: 'Simulasi baru akan tersedia dalam beberapa saat',
      icon: '✨'
    });
    setShowCreateModal(false);
  };
  const totalCandidates = filteredResults.length;
  const avgScore = totalCandidates > 0 
    ? Math.round(filteredResults.reduce((sum, r) => sum + r.percentage, 0) / totalCandidates)
    : 0;
  const topPerformers = filteredResults.filter(r => r.percentage >= 90).length;
  const certifiedCandidates = filteredResults.filter(r => r.badge).length;
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Memuat data simulasi...</p>
        </div>
      </div>
    );
  }

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
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Hasil Simulasi Kerja
            </h1>
          </div>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Review kandidat yang telah menyelesaikan simulasi kerja
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-5 h-5" />
            Export Data
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateCustom}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium shadow-xl hover:shadow-2xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Buat Simulasi Custom
          </motion.button>
        </div>
      </motion.div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GradientCard
          title="Total Kandidat"
          value={totalCandidates.toString()}
          subtitle={`${totalCandidates} kandidat terdaftar`}
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />
        <GradientCard
          title="Rata-rata Skor"
          value={`${avgScore}%`}
          subtitle="Performa keseluruhan"
          icon={Target}
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
        />
        <GradientCard
          title="Top Performers"
          value={topPerformers.toString()}
          subtitle="Skor 90%+"
          icon={Trophy}
          gradient="from-yellow-500 to-orange-500"
          delay={0.2}
        />
        <GradientCard
          title="Tersertifikasi"
          value={certifiedCandidates.toString()}
          subtitle="Kandidat bersertifikat"
          icon={Award}
          gradient="from-purple-500 to-pink-500"
          delay={0.3}
        />
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama kandidat atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {SIMULASI_CATEGORIES.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={minScore.toString()} onValueChange={(val) => setMinScore(Number(val))}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Skor Minimum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Semua Skor</SelectItem>
              <SelectItem value="70">70%+</SelectItem>
              <SelectItem value="80">80%+</SelectItem>
              <SelectItem value="90">90%+ (Top Tier)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 gap-4">
        {filteredResults.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-6">
              {}
              <div className="flex-shrink-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2 shadow-lg">
                  {result.candidateName.charAt(0)}
                </div>
                {result.rank && (
                  <Badge className={`${getRankColor(result.rank)} text-xs`}>
                    #{result.rank}
                  </Badge>
                )}
              </div>

              {}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {result.candidateName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {result.categoryName}
                      </span>
                      {result.completedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(result.completedAt).toLocaleDateString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  {}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      {result.percentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.totalScore}/{result.maxScore} points
                    </div>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Technical</div>
                    <div className="text-lg font-bold text-blue-700">
                      {result.breakdown.technical}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1">Creativity</div>
                    <div className="text-lg font-bold text-purple-700">
                      {result.breakdown.creativity}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-xs text-green-600 mb-1">Efficiency</div>
                    <div className="text-lg font-bold text-green-700">
                      {result.breakdown.efficiency}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="text-xs text-orange-600 mb-1">Communication</div>
                    <div className="text-lg font-bold text-orange-700">
                      {result.breakdown.communication}
                    </div>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    {result.badge && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                        <Award className="w-3 h-3 mr-1" />
                        {result.badge}
                      </Badge>
                    )}
                    {result.percentage >= 90 && (
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        <Zap className="w-3 h-3 mr-1" />
                        Top Performer
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetail(result)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat Detail
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleInviteClick(result)}
                      className="gap-2 bg-gradient-to-r from-primary-600 to-primary-700"
                    >
                      <Mail className="w-4 h-4" />
                      Undang Interview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {}
      {filteredResults.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada kandidat ditemukan
          </h3>
          <p className="text-gray-600">
            Coba sesuaikan filter atau kata kunci pencarian
          </p>
        </div>
      )}

      {}
      <AnimatePresence>
        {showDetailModal && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {}
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {selectedCandidate.candidateName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedCandidate.candidateName}</h2>
                    <p className="text-primary-100 text-sm">{selectedCandidate.categoryName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {}
              <div className="p-6 space-y-6">
                {}
                <div className="text-center pb-6 border-b border-gray-200">
                  <div className="text-5xl font-bold text-primary-600 mb-2">
                    {selectedCandidate.percentage}%
                  </div>
                  <div className="text-gray-600">
                    {selectedCandidate.totalScore} dari {selectedCandidate.maxScore} poin
                  </div>
                  {selectedCandidate.badge && (
                    <Badge className="mt-3 bg-yellow-100 text-yellow-700 border-yellow-300">
                      <Award className="w-4 h-4 mr-1" />
                      {selectedCandidate.badge}
                    </Badge>
                  )}
                </div>

                {}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Breakdown Penilaian
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Technical Skills</div>
                      <div className="text-3xl font-bold text-blue-700">
                        {selectedCandidate.breakdown.technical}%
                      </div>
                      <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${selectedCandidate.breakdown.technical}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                      <div className="text-sm text-purple-600 mb-1">Creativity</div>
                      <div className="text-3xl font-bold text-purple-700">
                        {selectedCandidate.breakdown.creativity}%
                      </div>
                      <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${selectedCandidate.breakdown.creativity}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                      <div className="text-sm text-green-600 mb-1">Efficiency</div>
                      <div className="text-3xl font-bold text-green-700">
                        {selectedCandidate.breakdown.efficiency}%
                      </div>
                      <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${selectedCandidate.breakdown.efficiency}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                      <div className="text-sm text-orange-600 mb-1">Communication</div>
                      <div className="text-3xl font-bold text-orange-700">
                        {selectedCandidate.breakdown.communication}%
                      </div>
                      <div className="mt-2 h-2 bg-orange-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-600 rounded-full"
                          style={{ width: `${selectedCandidate.breakdown.communication}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Diselesaikan
                    </span>
                    <span className="font-medium text-gray-900">
                      {selectedCandidate.completedAt
                        ? new Date(selectedCandidate.completedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '-'}
                    </span>
                  </div>
                  {selectedCandidate.rank && (
                    <div className="flex items-center justify-between text-sm mt-3">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Peringkat
                      </span>
                      <Badge className={getRankColor(selectedCandidate.rank)}>
                        #{selectedCandidate.rank}
                      </Badge>
                    </div>
                  )}
                </div>

                {}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Tutup
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 gap-2"
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowInviteModal(true);
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    Undang Interview
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showInviteModal && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            >
              {}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Undang Interview</h2>
                  </div>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {}
              <div className="p-6 space-y-6">
                {}
                <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {selectedCandidate.candidateName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {selectedCandidate.candidateName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedCandidate.categoryName} • {selectedCandidate.percentage}%
                    </p>
                  </div>
                  {selectedCandidate.percentage >= 90 && (
                    <Badge className="bg-green-100 text-green-700">
                      <Zap className="w-3 h-3 mr-1" />
                      Top
                    </Badge>
                  )}
                </div>

                {}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Interview
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="date"
                        className="pl-10"
                        defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan (Opsional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={4}
                      placeholder="Tambahkan pesan personal untuk kandidat..."
                      defaultValue={`Halo ${selectedCandidate.candidateName},\n\nKami terkesan dengan hasil simulasi kerja Anda. Kami ingin mengundang Anda untuk interview lebih lanjut.`}
                    />
                  </div>
                </div>

                {}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Otomatis:</strong> Kandidat akan menerima email undangan interview dengan detail tanggal dan instruksi.
                    </div>
                  </div>
                </div>

                {}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 gap-2"
                    onClick={handleSendInvite}
                  >
                    <Send className="w-4 h-4" />
                    Kirim Undangan
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Buat Simulasi Custom</h2>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Simulasi
                    </label>
                    <Input
                      type="text"
                      placeholder="Contoh: Frontend Developer Challenge"
                      defaultValue=""
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <Select defaultValue="frontend">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIMULASI_CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durasi (menit)
                      </label>
                      <Input
                        type="number"
                        placeholder="60"
                        defaultValue="60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Soal
                      </label>
                      <Input
                        type="number"
                        placeholder="10"
                        defaultValue="10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={4}
                      placeholder="Jelaskan tujuan dan konten simulasi ini..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tingkat Kesulitan
                    </label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Mudah</SelectItem>
                        <SelectItem value="medium">Menengah</SelectItem>
                        <SelectItem value="hard">Sulit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-purple-800">
                      <strong>Info:</strong> Simulasi custom akan di-review oleh tim kami sebelum dipublikasikan. Proses review biasanya memakan waktu 1-2 hari kerja.
                    </div>
                  </div>
                </div>

                {}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 gap-2"
                    onClick={handleSubmitCustomSimulasi}
                  >
                    <Sparkles className="w-4 h-4" />
                    Buat Simulasi
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

export default CompanySimulasi;
