import { useEffect, useState } from 'react';
import { Upload, FileEdit, Download, CheckCircle2, FolderOpen } from 'lucide-react';
import { loadProjects, PortfolioProject } from '@/lib/portfolio';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CVData {
  nama?: string;
  headline?: string;
  ringkasan?: string;
  email?: string;
  telepon?: string;
  pengalaman?: string;
  pendidikan?: string;
  keterampilan?: string;
  template?: string;
}

interface TemplateInfo { id: string; name: string; preview: string; }
const templates: TemplateInfo[] = [
  { id: 'modern', name: 'Modern', preview: 'https://example.com' },
  { id: 'minimal', name: 'Minimal', preview: 'https://example.com' },
  { id: 'creative', name: 'Kreatif', preview: 'https://example.com' },
  { id: 'formal', name: 'Formal', preview: 'https://example.com' },
];

const AutoCV: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload'|'edit'|'export'>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [cvData, setCvData] = useState<CVData>({ template: 'modern' });
  const [showImport, setShowImport] = useState(false);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);

  useEffect(()=>{
    try { setPortfolioProjects(loadProjects()); } catch {  }
  }, []);
  useEffect(() => {
    if (currentStep === 'edit') {
      const id = setTimeout(() => {
        toast.success('Perubahan tersimpan otomatis', {
          duration: 1200,
        });
      }, 1200);
      return () => clearTimeout(id);
    }
  }, [cvData, currentStep]);

  const goTo = (step: 'upload'|'edit'|'export', withLoading = false) => {
    if (withLoading) {
      setIsLoading(true);
      setTimeout(() => { setIsLoading(false); setCurrentStep(step); }, 600);
    } else {
      setCurrentStep(step);
    }
  };

  const onUploadMock = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCvData(prev => ({
        ...prev,
        nama: 'Alexandria Putri',
        headline: 'Product Designer | Menciptakan pengalaman yang bermakna',
        ringkasan: 'Desainer produk dengan 4+ tahun pengalaman pada fintech dan edtech, fokus pada riset dan desain sistem.',
        email: 'alex@example.com',
        telepon: '+62 812 3456 7890',
        pengalaman: '- Product Designer @ FinPay (2021 - Sekarang)\n- UI/UX Designer @ EduWave (2019 - 2021)',
        pendidikan: '- S.Kom, Informatika — Universitas Nusantara (2015 - 2019)',
        keterampilan: 'Figma, Design Systems, Prototyping, User Research'
      }));
      setIsLoading(false);
      setCurrentStep('edit');
    }, 900);
  };

  const handleDownload = () => {
    try {
      if (!cvData.nama || !cvData.email) {
        toast.error('Data CV tidak lengkap', {
          description: 'Pastikan nama dan email telah diisi.',
        });
        return;
      }
      const doc = new jsPDF();
      let yPos = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      doc.setFontSize(24);
      doc.setTextColor(41, 128, 185);
      doc.text(cvData.nama || 'Nama Tidak Tersedia', margin, yPos);
      yPos += 10;
      if (cvData.headline) {
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(cvData.headline, margin, yPos);
        yPos += 10;
      }
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const contactInfo = [];
      if (cvData.email) contactInfo.push(`📧 ${cvData.email}`);
      if (cvData.telepon) contactInfo.push(`📱 ${cvData.telepon}`);
      if (contactInfo.length > 0) {
        doc.text(contactInfo.join('  |  '), margin, yPos);
        yPos += 12;
      }
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
      yPos += 8;
      if (cvData.ringkasan) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('RINGKASAN PROFESIONAL', margin, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const summaryLines = doc.splitTextToSize(cvData.ringkasan, doc.internal.pageSize.width - 2 * margin);
        summaryLines.forEach((line: string) => {
          if (yPos > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 5;
      }
      if (cvData.pengalaman) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('PENGALAMAN KERJA', margin, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const expLines = cvData.pengalaman.split('\n');
        expLines.forEach((line: string) => {
          if (yPos > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 5;
      }
      if (cvData.pendidikan) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('PENDIDIKAN', margin, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const eduLines = cvData.pendidikan.split('\n');
        eduLines.forEach((line: string) => {
          if (yPos > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 5;
      }
      if (cvData.keterampilan) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('KETERAMPILAN', margin, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const skillsLines = doc.splitTextToSize(cvData.keterampilan, doc.internal.pageSize.width - 2 * margin);
        skillsLines.forEach((line: string) => {
          if (yPos > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(line, margin, yPos);
          yPos += 5;
        });
      }
      const fileName = `CV_${cvData.nama.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.success('CV berhasil diunduh!', {
        description: `File ${fileName} telah diunduh.`,
        icon: '📄',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Gagal mengunduh CV', {
        description: 'Terjadi kesalahan saat membuat PDF.',
      });
    }
  };

  return (
  <div className="min-h-[70vh] transition-colors">
      {}
      <div className="flex items-center justify-center gap-4 mb-6">
        {[
          { key: 'upload', label: 'Unggah' },
          { key: 'edit', label: 'Edit' },
          { key: 'export', label: 'Ekspor' },
        ].map((s, idx) => (
          <div key={s.key} className="flex items-center">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentStep===s.key? 'bg-primary-600 text-white':'bg-gray-200 text-gray-700'}`}>
              {s.label}
            </div>
            {idx<2 && <div className="w-8 h-[2px] bg-gray-300 mx-2" />}
          </div>
        ))}
      </div>

      {}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="w-8 h-8 rounded-full border-4 border-primary-600 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-gray-700 text-sm">Memproses...</p>
          </div>
        </div>
      )}

      {}
  <div className="bg-white rounded-card p-6 border border-gray-200 transition-colors">
        {currentStep === 'upload' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Upload size={20} className="text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Unggah Data</h2>
            </div>
            <p className="text-gray-600 mb-4">Unggah resume atau impor data LinkedIn untuk membuat CV secara otomatis.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onUploadMock} variant="primary" size="lg">
                Impor dari LinkedIn (Demo)
              </Button>
              <Button onClick={() => goTo('edit', true)} variant="subtle" size="lg">
                Lewati & Mulai dari Kosong
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'edit' && (
          <div className="grid lg:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileEdit size={20} className="text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Edit CV</h2>
            </div>
            <p className="text-gray-600 mb-4">Lengkapi informasi berikut. Perubahan akan tersimpan otomatis.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button onClick={()=>setShowImport(true)} variant="subtle" size="sm">
                <FolderOpen size={16} className="mr-2" />
                Impor dari Portofolio
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input value={cvData.nama || ''} onChange={e=>setCvData(d=>({...d, nama:e.target.value}))} className="w-full px-3 py-2 border rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                  <input value={cvData.headline || ''} onChange={e=>setCvData(d=>({...d, headline:e.target.value}))} className="w-full px-3 py-2 border rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan</label>
                  <textarea value={cvData.ringkasan || ''} onChange={e=>setCvData(d=>({...d, ringkasan:e.target.value}))} className="w-full px-3 py-2 border rounded-lg min-h-[88px] bg-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input value={cvData.email || ''} onChange={e=>setCvData(d=>({...d, email:e.target.value}))} className="w-full px-3 py-2 border rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                    <input value={cvData.telepon || ''} onChange={e=>setCvData(d=>({...d, telepon:e.target.value}))} className="w-full px-3 py-2 border rounded-lg bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pengalaman</label>
                  <textarea value={cvData.pengalaman || ''} onChange={e=>setCvData(d=>({...d, pengalaman:e.target.value}))} className="w-full px-3 py-2 border rounded-lg min-h-[88px] bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan</label>
                  <textarea value={cvData.pendidikan || ''} onChange={e=>setCvData(d=>({...d, pendidikan:e.target.value}))} className="w-full px-3 py-2 border rounded-lg min-h-[88px] bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterampilan</label>
                  <input value={cvData.keterampilan || ''} onChange={e=>setCvData(d=>({...d, keterampilan:e.target.value}))} className="w-full px-3 py-2 border rounded-lg bg-white" />
                </div>
              </div>
            </div>
            </div>
            {}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Pilih Template</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {templates.map((tpl)=>(
                  <button key={tpl.id} onClick={()=>setCvData(d=>({...d, template: tpl.id}))} className={`border-2 rounded-lg overflow-hidden group ${cvData.template===tpl.id?'border-primary-600 ring-2 ring-purple-200':'border-transparent hover:border-gray-300'}`}>
                    <img src={tpl.preview} alt={tpl.name} className="w-full h-24 object-cover" />
                    <div className="text-xs py-1 bg-gray-50 text-gray-700 font-medium">{tpl.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6 lg:col-span-3">
              <Button onClick={()=>goTo('upload')} variant="subtle">
                Kembali
              </Button>
              <Button onClick={()=>goTo('export', true)} variant="primary">
                Lanjut ke Ekspor
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'export' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={20} className="text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Ekspor</h2>
            </div>
            <p className="text-gray-600 mb-4">Pratinjau CV Anda, lalu unduh.</p>

            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-700 font-medium mb-2">Pratinjau</div>
              <div className="bg-white border rounded-lg p-4">
                <div className="text-lg font-semibold text-gray-900">{cvData.nama || 'Nama Anda'}</div>
                <div className="text-purple-700 font-medium">{cvData.headline || 'Headline profesional'}</div>
                <div className="mt-3 text-gray-700 whitespace-pre-wrap">{cvData.ringkasan || 'Ringkasan singkat Anda akan tampil di sini.'}</div>
                <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <div className="font-semibold mb-1">Kontak</div>
                    <div>Email: {cvData.email || '-'}</div>
                    <div>Telepon: {cvData.telepon || '-'}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Keterampilan</div>
                    <div>{cvData.keterampilan || '-'}</div>
                  </div>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <div className="font-semibold mb-1">Pengalaman</div>
                    <div className="whitespace-pre-wrap">{cvData.pengalaman || '-'}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Pendidikan</div>
                    <div className="whitespace-pre-wrap">{cvData.pendidikan || '-'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={()=>goTo('edit')} variant="subtle">
                Kembali ke Edit
              </Button>
              <Button onClick={handleDownload} className="bg-gray-900 hover:bg-gray-800 text-white">
                <Download size={18} className="mr-2" />
                Unduh PDF
              </Button>
            </div>
          </div>
        )}

        {}
        {showImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-3xl rounded-card border border-gray-200 shadow-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg">Impor dari Portofolio</h3>
                <Button onClick={()=>setShowImport(false)} variant="subtle" size="sm">
                  Tutup
                </Button>
              </div>
              <div className="p-4 space-y-4">
                {portfolioProjects.length===0 && (
                  <p className="text-sm text-gray-600">Belum ada project portofolio. Tambahkan di halaman Portofolio.</p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  {portfolioProjects.map(p=>{
                    const handleImport = () => {
                      setCvData(d=>({
                        ...d,
                        ringkasan: d.ringkasan ? d.ringkasan + '\n\n' + (p.description||'') : (p.description||''),
                        pengalaman: (d.pengalaman? d.pengalaman + '\n':'') + (p.highlights && p.highlights.length? '- ' + p.highlights.join('\n- '): ''),
                        keterampilan: Array.from(new Set((d.keterampilan||'').split(/,\s*/).filter(Boolean).concat(p.tech))).join(', ')
                      }));
                      toast.success('Berhasil diimpor dari ' + p.title, {
                        duration: 1400,
                      });
                      setShowImport(false);
                    };
                    return (
                      <div key={p.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex flex-col">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-3 mb-2">{p.description || 'Tanpa deskripsi'}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {p.tech.slice(0,4).map(t=> <span key={t} className="text-[10px] bg-white/70 px-2 py-0.5 rounded border border-gray-200">{t}</span>)}
                        </div>
                        <Button onClick={handleImport} variant="primary" size="sm" className="mt-auto">
                          Impor
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoCV;
