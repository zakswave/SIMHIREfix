import React, { useState } from 'react';
import { X, Upload, Briefcase, GraduationCap } from 'lucide-react';
import { Internship, InternshipApplication } from '@/lib/internship';

interface ApplyInternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: Internship;
  onSubmit: (application: Partial<InternshipApplication>) => void;
  isSubmitting?: boolean;
}

const ApplyInternshipModal: React.FC<ApplyInternshipModalProps> = ({
  isOpen,
  onClose,
  internship,
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    semester: '',
    gpa: '',
    resume: null as File | null,
    portfolio: '',
    coverLetter: '',
    motivation: '',
    availability: 'full-time' as 'full-time' | 'part-time'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.candidateName.trim()) {
      newErrors.candidateName = 'Nama lengkap wajib diisi';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'No. telepon wajib diisi';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Format no. telepon tidak valid';
    }

    if (!formData.university.trim()) {
      newErrors.university = 'Universitas wajib diisi';
    }

    if (!formData.major.trim()) {
      newErrors.major = 'Jurusan wajib diisi';
    }

    const semester = parseInt(formData.semester);
    if (!formData.semester || isNaN(semester) || semester < 1 || semester > 14) {
      newErrors.semester = 'Semester harus antara 1-14';
    }

    const gpa = parseFloat(formData.gpa);
    if (!formData.gpa || isNaN(gpa) || gpa < 0 || gpa > 4) {
      newErrors.gpa = 'IPK harus antara 0.00-4.00';
    }

    if (!formData.resume) {
      newErrors.resume = 'CV/Resume wajib diunggah';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Motivasi wajib diisi';
    } else if (formData.motivation.length < 50) {
      newErrors.motivation = 'Motivasi minimal 50 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const applicationData: Partial<InternshipApplication> = {
      internshipId: internship.id,
      candidateName: formData.candidateName,
      email: formData.email,
      phone: formData.phone,
      university: formData.university,
      major: formData.major,
      semester: parseInt(formData.semester),
      gpa: parseFloat(formData.gpa),
      resume: formData.resume ? URL.createObjectURL(formData.resume) : '',
      portfolio: formData.portfolio || undefined,
      coverLetter: formData.coverLetter || undefined,
      motivation: formData.motivation,
      availability: formData.availability,
      status: 'applied',
      appliedAt: new Date().toISOString()
    };

    onSubmit(applicationData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'Ukuran file maksimal 5MB' }));
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: 'Format file harus PDF, DOC, atau DOCX' }));
        return;
      }

      setFormData(prev => ({ ...prev, resume: file }));
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daftar Magang</h2>
            <p className="text-sm text-gray-600 mt-1">
              Pastikan data Anda lengkap untuk meningkatkan peluang diterima
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={24} />
          </button>
        </div>

        {}
        <div className="bg-green-50 px-6 py-4 border-b">
          <div className="flex items-start gap-3">
            <Briefcase className="text-green-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900">{internship.position}</h3>
              <p className="text-sm text-gray-600">{internship.company.name} • {internship.location}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>📅 {internship.duration}</span>
                {internship.isPaid && <span>💰 {internship.salary}</span>}
                {internship.certificateProvided && <span>🏆 Sertifikat</span>}
              </div>
            </div>
          </div>
        </div>

        {}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap size={20} className="text-blue-600" />
              Data Pribadi
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.candidateName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap Anda"
                />
                {errors.candidateName && <p className="text-red-500 text-sm mt-1">{errors.candidateName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="08xxxxxxxxxx"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap size={20} className="text-purple-600" />
              Data Pendidikan
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Universitas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.university ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Universitas Indonesia"
                />
                {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.major ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Teknik Informatika"
                />
                {errors.major && <p className="text-red-500 text-sm mt-1">{errors.major}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.semester ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1-14"
                  />
                  {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IPK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.gpa ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00 - 4.00"
                  />
                  {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload size={20} className="text-orange-600" />
              Dokumen
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload CV/Resume <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <label className="cursor-pointer">
                    <span className="text-green-600 hover:text-green-700 font-medium">
                      Pilih File
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: PDF, DOC, DOCX (Max 5MB)
                  </p>
                  {formData.resume && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.resume.name}
                    </p>
                  )}
                </div>
                {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio/LinkedIn (Opsional)
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivasi & Alasan Melamar <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                  errors.motivation ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Ceritakan mengapa Anda tertarik dengan posisi magang ini dan apa yang ingin Anda pelajari... (min. 50 karakter)"
              />
              <div className="flex justify-between mt-1">
                {errors.motivation && <p className="text-red-500 text-sm">{errors.motivation}</p>}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.motivation.length} karakter
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ketersediaan <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="availability"
                    value="full-time"
                    checked={formData.availability === 'full-time'}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'full-time' | 'part-time' })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Full-time (40 jam/minggu)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="availability"
                    value="part-time"
                    checked={formData.availability === 'part-time'}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'full-time' | 'part-time' })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Part-time (20 jam/minggu)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter (Opsional)
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Tambahkan cover letter jika diperlukan..."
              />
            </div>
          </div>

          {}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim Lamaran...
                </>
              ) : (
                'Kirim Lamaran'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyInternshipModal;
