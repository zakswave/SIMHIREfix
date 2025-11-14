import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { getJobPost, updateJobPost } from '@/lib/company/data';
import { EmploymentType, ExperienceLevel, LocationMode, JobStatus } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const EditJobForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);
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
    const loadJob = async () => {
      if (!id) return;

      try {
        const job = getJobPost(id);
        if (!job) {
          toast.error('Lowongan tidak ditemukan');
          navigate('/company/jobs');
          return;
        }

        setFormData({
          title: job.title,
          department: job.department,
          employmentType: job.employmentType,
          experienceLevel: job.experienceLevel,
          locationMode: job.locationMode,
          location: job.location,
          salaryMin: job.salaryMin?.toString() || '',
          salaryMax: job.salaryMax?.toString() || '',
          currency: job.currency || 'IDR',
          description: job.description,
          requirements: job.requirements.length > 0 ? job.requirements : [''],
          benefits: (job.benefits && job.benefits.length > 0) ? job.benefits : [''],
          skills: job.skills || [],
          isUrgent: job.isUrgent || false,
          isFeatured: job.isFeatured || false,
          status: job.status
        });
      } catch (error) {
        console.error('Error loading job:', error);
        toast.error('Gagal memuat data lowongan');
      } finally {
        setJobLoading(false);
      }
    };

    loadJob();
  }, [id, navigate]);

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
    if (!id) return;

    setLoading(true);

    try {
      if (!formData.title.trim() || !formData.department.trim() || !formData.description.trim()) {
        toast.error('Harap lengkapi field yang wajib diisi');
        return;
      }
      const cleanRequirements = formData.requirements.filter(req => req.trim());
      const cleanBenefits = formData.benefits.filter(benefit => benefit.trim());
      const jobData = {
        title: formData.title.trim(),
        department: formData.department.trim(),
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        locationMode: formData.locationMode,
        location: formData.location.trim() || 'Remote',
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        currency: formData.currency as 'IDR' | 'USD',
        description: formData.description.trim(),
        requirements: cleanRequirements,
        benefits: cleanBenefits,
        skills: formData.skills,
        isUrgent: formData.isUrgent,
        isFeatured: formData.isFeatured,
        status: formData.status
      };
      updateJobPost(id, jobData);

      toast.success('Lowongan berhasil diperbarui!');
      navigate('/company/jobs');

    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Gagal memperbarui lowongan');
    } finally {
      setLoading(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/company/jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Lowongan</h1>
            <p className="text-gray-600">Memuat data lowongan...</p>
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

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/company/jobs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Lowongan</h1>
          <p className="text-gray-600">Ubah informasi lowongan kerja</p>
        </div>
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
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Lowongan
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Terbuka</option>
                  <option value="paused">Dijeda</option>
                  <option value="closed">Ditutup</option>
                </select>
              </div>

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

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default EditJobForm;
