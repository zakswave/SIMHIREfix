import React, { useState } from 'react';
import { X, Upload, FileText, User, Mail, Phone, Send, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: {
    id: string;
    position: string;
    company: {
      name: string;
      logo?: string;
    };
    location: string;
    salary?: string;
    isPaid: boolean;
  };
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  semester: string;
  gpa: string;
  coverLetter: string;
  resume: File | null;
  portfolio: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  internship
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    semester: '',
    gpa: '',
    coverLetter: '',
    resume: null,
    portfolio: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!formData.university.trim()) newErrors.university = 'Universitas wajib diisi';
    if (!formData.major.trim()) newErrors.major = 'Jurusan wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter wajib diisi';
    else if (formData.coverLetter.length < 100) newErrors.coverLetter = 'Cover letter minimal 100 karakter';

    if (!formData.resume) newErrors.resume = 'CV/Resume wajib diupload';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Format File Tidak Valid',
          description: 'Silakan upload file PDF atau Word (.doc/.docx)',
          variant: 'destructive'
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: 'File Terlalu Besar',
          description: 'Ukuran file maksimal 5MB',
          variant: 'destructive'
        });
        return;
      }

      setFormData(prev => ({ ...prev, resume: file }));
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: undefined }));
      }
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      setStep(3);

      toast({
        title: 'Aplikasi Berhasil Dikirim!',
        description: `Lamaran Anda untuk posisi ${internship.position} telah diterima`,
      });
    } catch (error) {
      toast({
        title: 'Gagal Mengirim Aplikasi',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      university: '',
      major: '',
      semester: '',
      gpa: '',
      coverLetter: '',
      resume: null,
      portfolio: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  const getStepProgress = () => {
    if (step === 3) return 100;
    return (step / 2) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={internship.company.logo} alt={internship.company.name} />
                <AvatarFallback>
                  {internship.company.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{internship.position}</h3>
                <p className="text-sm text-muted-foreground">{internship.company.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="ml-auto"
              aria-label="Tutup modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress Aplikasi</span>
            <span>{step === 3 ? 'Selesai' : `Langkah ${step} dari 2`}</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        {}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center py-4">
              <User className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold">Informasi Pribadi</h3>
              <p className="text-sm text-muted-foreground">
                Lengkapi data pribadi dan akademik Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={errors.fullName ? 'border-destructive' : ''}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-sm text-destructive">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input
                  id="phone"
                  placeholder="+62 812 3456 7890"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-destructive' : ''}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">Universitas *</Label>
                <Input
                  id="university"
                  placeholder="Nama universitas"
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  className={errors.university ? 'border-destructive' : ''}
                  aria-describedby={errors.university ? 'university-error' : undefined}
                />
                {errors.university && (
                  <p id="university-error" className="text-sm text-destructive">
                    {errors.university}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Jurusan *</Label>
                <Input
                  id="major"
                  placeholder="Nama jurusan"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  className={errors.major ? 'border-destructive' : ''}
                  aria-describedby={errors.major ? 'major-error' : undefined}
                />
                {errors.major && (
                  <p id="major-error" className="text-sm text-destructive">
                    {errors.major}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  placeholder="Semester saat ini"
                  value={formData.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpa">IPK/GPA</Label>
                <Input
                  id="gpa"
                  placeholder="3.50"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio (Opsional)</Label>
                <Input
                  id="portfolio"
                  placeholder="https://example.com",`n      value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNextStep} className="btn-gradient">
                Lanjut ke Cover Letter
              </Button>
            </div>
          </div>
        )}

        {}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center py-4">
              <FileText className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold">Dokumen & Cover Letter</h3>
              <p className="text-sm text-muted-foreground">
                Upload CV dan tulis cover letter Anda
              </p>
            </div>

            {}
            <div className="space-y-3">
              <Label>CV/Resume *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload CV Anda</p>
                  <p className="text-xs text-muted-foreground">
                    Format: PDF, DOC, DOCX (Maks. 5MB)
                  </p>
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    Pilih File
                  </Button>
                </div>
              </div>

              {formData.resume && (
                <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                  <FileText className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">{formData.resume.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(formData.resume.size / 1024 / 1024).toFixed(1)} MB
                  </Badge>
                </div>
              )}

              {errors.resume && (
                <p className="text-sm text-destructive">{errors.resume}</p>
              )}
            </div>

            {}
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                placeholder="Ceritakan mengapa Anda tertarik dengan posisi ini dan apa yang membuat Anda kandidat yang tepat..."
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                className={`min-h-32 ${errors.coverLetter ? 'border-destructive' : ''}`}
                aria-describedby={errors.coverLetter ? 'coverLetter-error' : undefined}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formData.coverLetter.length} karakter (minimal 100)</span>
                {errors.coverLetter && (
                  <span id="coverLetter-error" className="text-destructive">
                    {errors.coverLetter}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Kembali
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-gradient"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Aplikasi
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {}
        {step === 3 && (
          <div className="text-center py-12 space-y-6 animate-scale-in">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                Aplikasi Berhasil Dikirim!
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Terima kasih telah melamar untuk posisi <strong>{internship.position}</strong> 
                di <strong>{internship.company.name}</strong>. Tim HR akan menghubungi Anda dalam 1-3 hari kerja.
              </p>
            </div>

            <div className="bg-accent/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Langkah Selanjutnya:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Periksa email Anda untuk konfirmasi aplikasi</li>
                <li>• Pantau status aplikasi di dashboard</li>
                <li>• Siapkan diri untuk tahap interview</li>
              </ul>
            </div>

            <Button onClick={handleClose} className="btn-gradient">
              Kembali ke Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
