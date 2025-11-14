import { useState, useEffect } from 'react';
import { Save, Upload, Building2, Globe, Phone, Mail, Linkedin, Twitter } from 'lucide-react';
import { getCompanyProfile, updateCompanyProfile } from '@/lib/company/data';
import { CompanyProfile } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CompanySettings: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  interface CompanyFormState {
    name: string;
    industry: string;
    size: CompanyProfile['size'];
    location: string;
    description: string;
    website: string;
    phone: string;
    email: string;
    linkedin: string;
    twitter: string;
    hiringStatus: CompanyProfile['hiringStatus'];
  }

  const [formData, setFormData] = useState<CompanyFormState>({
    name: '',
    industry: '',
    size: '1-10',
    location: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    linkedin: '',
    twitter: '',
    hiringStatus: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const companyProfile = getCompanyProfile();
    if (companyProfile) {
      setProfile(companyProfile);
      setFormData({
        name: companyProfile.name,
        industry: companyProfile.industry,
        size: companyProfile.size as CompanyProfile['size'],
        location: companyProfile.location,
        description: companyProfile.description,
        website: companyProfile.website || '',
        phone: companyProfile.phone || '',
        email: companyProfile.email || '',
        linkedin: companyProfile.socialLinks?.linkedin || '',
        twitter: companyProfile.socialLinks?.twitter || '',
        hiringStatus: companyProfile.hiringStatus as CompanyProfile['hiringStatus']
      });
      if (companyProfile.logoUrl) {
        setLogoPreview(companyProfile.logoUrl);
      }
    }
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === 'size') {
      setFormData(prev => ({ ...prev, size: value as typeof prev.size }));
    } else if (field === 'hiringStatus') {
      setFormData(prev => ({ ...prev, hiringStatus: value as typeof prev.hiringStatus }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: Partial<CompanyProfile> = {
        name: formData.name,
        industry: formData.industry,
        size: formData.size,
        location: formData.location,
        description: formData.description,
        website: formData.website || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        logoUrl: logoPreview || undefined,
        socialLinks: {
          linkedin: formData.linkedin || undefined,
          twitter: formData.twitter || undefined
        },
        hiringStatus: formData.hiringStatus,
        updatedAt: new Date().toISOString()
      };

      const updatedProfile = updateCompanyProfile(updates);
      setProfile(updatedProfile);
      toast.success('Profil perusahaan berhasil diperbarui');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPG, PNG)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    setUploadingLogo(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
      setUploadingLogo(false);
      toast.success('Logo berhasil diupload! Jangan lupa klik Simpan Perubahan.');
    };
    reader.onerror = () => {
      setUploadingLogo(false);
      toast.error('Gagal membaca file');
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    toast.success('Logo dihapus. Klik Simpan Perubahan untuk konfirmasi.');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif Merekrut';
      case 'not_hiring': return 'Tidak Merekrut';
      case 'paused': return 'Dijeda Sementara';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'not_hiring': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Perusahaan</h1>
          <p className="text-gray-600">Memuat profil perusahaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Perusahaan</h1>
          <p className="text-gray-600">Kelola profil dan preferensi perusahaan</p>
        </div>

        <Badge className={getStatusColor(profile.hiringStatus)}>
          {getStatusLabel(profile.hiringStatus)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Informasi Perusahaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industri
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  >
                    <option value="Technology">Teknologi</option>
                    <option value="Finance">Keuangan</option>
                    <option value="Healthcare">Kesehatan</option>
                    <option value="Education">Pendidikan</option>
                    <option value="Manufacturing">Manufaktur</option>
                    <option value="Retail">Retail</option>
                    <option value="Consulting">Konsultan</option>
                    <option value="Media">Media</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ukuran Perusahaan
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  >
                    <option value="1-10">1-10 karyawan</option>
                    <option value="11-50">11-50 karyawan</option>
                    <option value="51-200">51-200 karyawan</option>
                    <option value="201-500">201-500 karyawan</option>
                    <option value="501-1000">501-1000 karyawan</option>
                    <option value="1000+">1000+ karyawan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Jakarta, Indonesia"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Perusahaan
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Ceritakan tentang perusahaan Anda..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                />
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+62 21 1234 5678"
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Perusahaan
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="hr@perusahaan.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Media Sosial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="nama-perusahaan"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Tanpa https://</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    placeholder="@perusahaan"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Tanpa @ di depan</p>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle>Logo Perusahaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">

                {logoPreview ? (
                  <div className="relative inline-block mb-4">
                    <img 
                      src={logoPreview} 
                      alt="Company Logo" 
                      className="w-24 h-24 rounded-lg object-cover mx-auto border-2 border-gray-200"
                    />
                    <button
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center text-xs"
                      title="Hapus logo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-accent-blue to-primary-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'CO'}
                  </div>
                )}

                <input
                  type="file"
                  id="logo-upload"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  disabled={uploadingLogo}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingLogo ? 'Uploading...' : logoPreview ? 'Ganti Logo' : 'Upload Logo'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG maksimal 2MB</p>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Status Perekrutan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hiringStatus"
                    value="active"
                    checked={formData.hiringStatus === 'active'}
                    onChange={(e) => handleInputChange('hiringStatus', e.target.value)}
                    className="w-4 h-4 text-accent-blue"
                  />
                  <div>
                    <p className="font-medium text-green-600">Aktif Merekrut</p>
                    <p className="text-xs text-gray-500">Terbuka untuk kandidat baru</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hiringStatus"
                    value="paused"
                    checked={formData.hiringStatus === 'paused'}
                    onChange={(e) => handleInputChange('hiringStatus', e.target.value)}
                    className="w-4 h-4 text-accent-blue"
                  />
                  <div>
                    <p className="font-medium text-yellow-600">Dijeda Sementara</p>
                    <p className="text-xs text-gray-500">Tidak menerima aplikasi baru</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hiringStatus"
                    value="not_hiring"
                    checked={formData.hiringStatus === 'not_hiring'}
                    onChange={(e) => handleInputChange('hiringStatus', e.target.value)}
                    className="w-4 h-4 text-accent-blue"
                  />
                  <div>
                    <p className="font-medium text-red-600">Tidak Merekrut</p>
                    <p className="text-xs text-gray-500">Semua lowongan ditutup</p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Kelengkapan Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress:</span>
                  <span className="font-medium">85%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-accent-blue h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Informasi dasar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Deskripsi perusahaan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Logo perusahaan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Media sosial</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          <Button onClick={handleSave} disabled={loading} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
