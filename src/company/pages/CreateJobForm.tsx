import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Clock } from 'lucide-react';
import { api } from '@/services/api';
import { EmploymentType, ExperienceLevel, LocationMode, JobStatus } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CreateJobForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const DRAFT_KEY = 'simhire_job_draft';
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    employmentType: 'full-time' as EmploymentType,
    experienceLevel: 'mid' as ExperienceLevel,
    locationMode: 'hybrid' as LocationMode,
    location: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'IDR',
    description: '',
    requirements: [''],
    benefits: [''],
    skills: [] as string[],
    isUrgent: false,
    isFeatured: false,
    status: 'draft' as JobStatus
  });

  const [skillInput, setSkillInput] = useState('');
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
      if (formData.title || formData.description) {
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

  const handleArrayChange = (field: 'requirements' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title.trim() || !formData.department.trim() || !formData.description.trim()) {
        toast.error('Harap lengkapi field yang wajib diisi');
        setLoading(false);
        return;
      }
      const cleanRequirements = formData.requirements.filter(req => req.trim());
      const cleanBenefits = formData.benefits.filter(benefit => benefit.trim());
      const backendFormData = new FormData();

      backendFormData.append('title', formData.title.trim());
      backendFormData.append('description', formData.description.trim());
      backendFormData.append('location', formData.location.trim() || 'Remote');
      backendFormData.append('employmentType', formData.employmentType);
      backendFormData.append('experienceLevel', formData.experienceLevel);
      backendFormData.append('locationMode', formData.locationMode);
      backendFormData.append('status', formData.status);
      if (formData.salaryMin) {
        backendFormData.append('salaryMin', formData.salaryMin.toString());
      }
      if (formData.salaryMax) {
        backendFormData.append('salaryMax', formData.salaryMax.toString());
      }
      backendFormData.append('requirements', JSON.stringify(cleanRequirements));
      backendFormData.append('responsibilities', JSON.stringify(cleanRequirements));
      backendFormData.append('benefits', JSON.stringify(cleanBenefits));
      backendFormData.append('skills', JSON.stringify(formData.skills));

      console.log('Submitting job data to backend...');
      const response = await api.createJob(backendFormData);

      if (response.success) {
        clearDraft();

        toast.success('Lowongan berhasil dibuat!', {
          description: 'Lowongan Anda sudah dipublikasikan'
        });
        navigate('/company/jobs');
      } else {
        throw new Error(response.message || 'Gagal membuat lowongan');
      }

    } catch (error: any) {
      console.error('Error creating job:', error);
      toast.error('Gagal membuat lowongan', {
        description: error.response?.data?.message || error.message || 'Terjadi kesalahan'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    setFormData(prev => ({ ...prev, status: 'draft' }));
  };

  const handlePublish = () => {
    setFormData(prev => ({ ...prev, status: 'open' }));
  };

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/company/jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buat Lowongan Baru</h1>
            <p className="text-gray-600">Buat lowongan kerja untuk menarik kandidat terbaik</p>
          </div>
        </div>

        {}
        {lastSaved && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm">
              <Clock className="w-4 h-4" />
              <span>Tersimpan otomatis {lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearDraft}
              className="text-red-600 hover:text-red-700"
            >
              Hapus Draft
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Lowongan *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="contoh: Senior Frontend Developer"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departemen *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="contoh: Engineering, Design, Marketing"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Pekerjaan
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Kontrak</option>
                    <option value="internship">Magang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level Pengalaman
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode Lokasi
                  </label>
                  <select
                    value={formData.locationMode}
                    onChange={(e) => handleInputChange('locationMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="contoh: Jakarta, Indonesia"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Gaji</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gaji Minimum
                  </label>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                    placeholder="15000000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gaji Maksimum
                  </label>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                    placeholder="25000000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Uang
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  >
                    <option value="IDR">IDR (Rupiah)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Pekerjaan</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Jelaskan tanggung jawab, tugas, dan ekspektasi untuk posisi ini..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                required
              />
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
                    placeholder="contoh: Minimal 3 tahun pengalaman..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('requirements', index)}
                    disabled={formData.requirements.length <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('requirements')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Persyaratan
              </Button>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Benefit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    placeholder="contoh: Asuransi kesehatan..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('benefits', index)}
                    disabled={formData.benefits.length <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('benefits')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Benefit
              </Button>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Skills yang Dibutuhkan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="contoh: React, TypeScript..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="space-y-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle>Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                  />
                  <span className="text-sm">Lowongan Urgent</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  />
                  <span className="text-sm">Featured (Prioritas Tinggi)</span>
                </label>
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  onClick={handleSaveAsDraft}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan sebagai Draft
                </Button>

                <Button
                  type="submit"
                  onClick={handlePublish}
                  className="w-full"
                  disabled={loading}
                >
                  Publikasikan Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreateJobForm;
