import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Clock } from 'lucide-react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type InternshipStatus = 'active' | 'closed' | 'draft';

const CreateInternshipForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const DRAFT_KEY = 'simhire_internship_draft';
  const [formData, setFormData] = useState({
    position: '',
    duration: '3 bulan',
    isPaid: false,
    salary: '',
    location: '',
    remote: false,
    description: '',
    learningObjectives: [''],
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    tags: [] as string[],
    mentorshipProvided: false,
    certificateProvided: false,
    applicationDeadline: '',
    startDate: '',
    status: 'draft' as InternshipStatus
  });

  const [tagInput, setTagInput] = useState('');
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed.data);
        setLastSaved(new Date(parsed.timestamp));
        toast.info('Draft terakhir dimuat', {
          description: `Tersimpan ${new Date(parsed.timestamp).toLocaleString('id-ID')}`,
        });
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      if (formData.position || formData.description) {
        const draft = {
          data: formData,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setLastSaved(new Date());
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [formData]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setLastSaved(null);
    toast.success('Draft dihapus');
  };

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'learningObjectives' | 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'learningObjectives' | 'requirements' | 'responsibilities' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'learningObjectives' | 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.position.trim() || !formData.description.trim()) {
        toast.error('Harap lengkapi field yang wajib diisi');
        setLoading(false);
        return;
      }
      const cleanLearningObjectives = formData.learningObjectives.filter(obj => obj.trim());
      const cleanRequirements = formData.requirements.filter(req => req.trim());
      const cleanResponsibilities = formData.responsibilities.filter(resp => resp.trim());
      const cleanBenefits = formData.benefits.filter(benefit => benefit.trim());
      const internshipData = {
        position: formData.position.trim(),
        duration: formData.duration,
        isPaid: formData.isPaid,
        salary: formData.isPaid ? formData.salary : undefined,
        location: formData.location.trim() || 'Remote',
        remote: formData.remote,
        description: formData.description.trim(),
        learningObjectives: cleanLearningObjectives,
        requirements: cleanRequirements,
        responsibilities: cleanResponsibilities,
        benefits: cleanBenefits,
        tags: formData.tags,
        mentorshipProvided: formData.mentorshipProvided,
        certificateProvided: formData.certificateProvided,
        applicationDeadline: formData.applicationDeadline || undefined,
        startDate: formData.startDate || undefined,
        status: formData.status
      };

      console.log('Submitting internship data to backend...');
      const response = await api.createInternship(internshipData);

      if (response.success) {
        clearDraft();
        toast.success('Lowongan magang berhasil dibuat!', {
          description: 'Lowongan magang Anda sudah dipublikasikan'
        });
        navigate('/company/internships');
      } else {
        throw new Error(response.message || 'Gagal membuat lowongan magang');
      }

    } catch (error: any) {
      console.error('Error creating internship:', error);
      toast.error('Gagal membuat lowongan magang', {
        description: error.response?.data?.message || error.message || 'Terjadi kesalahan'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/company/internships')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buat Lowongan Magang Baru</h1>
            <p className="text-gray-600 mt-1">Isi formulir untuk membuat lowongan magang</p>
          </div>
        </div>

        {lastSaved && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Tersimpan {lastSaved.toLocaleTimeString('id-ID')}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi Magang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Contoh: Frontend Developer Intern"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="1 bulan">1 Bulan</option>
                  <option value="2 bulan">2 Bulan</option>
                  <option value="3 bulan">3 Bulan</option>
                  <option value="4 bulan">4 Bulan</option>
                  <option value="5 bulan">5 Bulan</option>
                  <option value="6 bulan">6 Bulan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Contoh: Jakarta Selatan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.remote}
                  onChange={(e) => handleInputChange('remote', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Remote/WFH</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={(e) => handleInputChange('isPaid', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Magang Berbayar</span>
              </label>
            </div>

            {formData.isPaid && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uang Saku/Bulan
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="Contoh: Rp 3.500.000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batas Pendaftaran
                </label>
                <input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Deskripsi Magang</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Jelaskan tentang program magang ini..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              required
            />
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Tujuan Pembelajaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.learningObjectives.map((obj, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => handleArrayChange('learningObjectives', index, e.target.value)}
                  placeholder="Apa yang akan dipelajari peserta..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.learningObjectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('learningObjectives', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('learningObjectives')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tujuan Pembelajaran
            </Button>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Persyaratan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  placeholder="Persyaratan peserta..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('requirements')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Persyaratan
            </Button>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Tanggung Jawab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                  placeholder="Apa yang akan dikerjakan..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('responsibilities', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('responsibilities')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tanggung Jawab
            </Button>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Benefit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.mentorshipProvided}
                  onChange={(e) => handleInputChange('mentorshipProvided', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Mentorship</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.certificateProvided}
                  onChange={(e) => handleInputChange('certificateProvided', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Sertifikat</span>
              </label>
            </div>

            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                  placeholder="Benefit lainnya..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('benefits')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Benefit
            </Button>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Tags Skill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Tambah tag (tekan Enter)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin membatalkan? Draft akan tetap tersimpan.')) {
                navigate('/company/internships');
              }
            }}
          >
            Batal
          </Button>

          <Button
            type="submit"
            onClick={() => handleInputChange('status', 'draft')}
            variant="outline"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan Draft
          </Button>

          <Button
            type="submit"
            onClick={() => handleInputChange('status', 'active')}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Memproses...' : 'Publikasikan'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInternshipForm;
