import React, { useEffect, useState } from 'react';
import { X, Plus, Save, Image as ImageIcon } from 'lucide-react';
import { PortfolioProject, generateSlug } from '@/lib/portfolio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EditProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: PortfolioProject | null;
  onSave: (project: PortfolioProject) => void;
}

const emptyArray: string[] = [];

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({ open, onClose, project, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [tech, setTech] = useState<string[]>(emptyArray);
  const [highlightsInput, setHighlightsInput] = useState('');
  const [highlights, setHighlights] = useState<string[]>(emptyArray);
  const [links, setLinks] = useState<PortfolioProject['links']>({});
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [featured, setFeatured] = useState(false);

  useEffect(()=>{
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setTech(project.tech);
      setHighlights(project.highlights);
      setLinks(project.links || {});
      setCoverImage(project.coverImage);
      setFeatured(!!project.featured);
    } else {
      setTitle('');
      setDescription('');
      setTech([]);
      setHighlights([]);
      setLinks({});
      setCoverImage(undefined);
      setFeatured(false);
    }
  }, [project, open]);

  if (!open) return null;

  const handleAddTech = () => {
    const val = techInput.trim();
    if (val && !tech.includes(val)) setTech(prev=>[...prev,val]);
    setTechInput('');
  };

  const handleAddHighlight = () => {
    const val = highlightsInput.trim();
    if (val) setHighlights(prev=>[...prev,val]);
    setHighlightsInput('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    const base = project ? project : {
      id: crypto.randomUUID(),
      createdAt: now,
    } as PortfolioProject;
    const updated: PortfolioProject = {
      ...base,
      title: title.trim(),
      slug: generateSlug(title),
      description: description.trim(),
      tech,
      highlights,
      links,
      coverImage,
      featured,
      updatedAt: now,
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{project? 'Edit Project':'Tambah Project'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul *</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white text-sm" placeholder="Contoh: Aplikasi Manajemen Tugas" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded-lg bg-white text-sm" placeholder="Ringkas mengenai tujuan dan hasil project" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teknologi</label>
                <div className="flex gap-2 mb-2">
                  <input value={techInput} onChange={e=>setTechInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();handleAddTech();}}} className="flex-1 px-3 py-2 border rounded-lg bg-white text-sm" placeholder="Tambah tech lalu Enter" />
                  <Button size="sm" onClick={handleAddTech}><Plus size={14} /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tech.map(t=>(
                    <Badge key={t} className="flex items-center gap-1">{t}<button onClick={()=>setTech(prev=>prev.filter(x=>x!==t))} className="ml-1 text-xs opacity-60 hover:opacity-100">×</button></Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sorotan (Highlights)</label>
                <div className="flex gap-2 mb-2">
                  <input value={highlightsInput} onChange={e=>setHighlightsInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();handleAddHighlight();}}} className="flex-1 px-3 py-2 border rounded-lg bg-white text-sm" placeholder="Tambahkan poin lalu Enter" />
                  <Button size="sm" onClick={handleAddHighlight}><Plus size={14} /></Button>
                </div>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  {highlights.map((h,i)=>(<li key={i}>{h} <button onClick={()=>setHighlights(prev=>prev.filter((_,idx)=>idx!==i))} className="ml-1 text-[10px] opacity-60 hover:opacity-100">hapus</button></li>))}
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tautan (Links)</label>
                <div className="space-y-2">
                  <input value={links?.demo||''} onChange={e=>setLinks(l=>({...l, demo:e.target.value}))} placeholder="Demo URL" className="w-full px-3 py-2 border rounded-lg bg-white text-sm" />
                  <input value={links?.repo||''} onChange={e=>setLinks(l=>({...l, repo:e.target.value}))} placeholder="Repository URL" className="w-full px-3 py-2 border rounded-lg bg-white text-sm" />
                  <input value={links?.video||''} onChange={e=>setLinks(l=>({...l, video:e.target.value}))} placeholder="Video Demo URL" className="w-full px-3 py-2 border rounded-lg bg-white text-sm" />
                  <input value={links?.design||''} onChange={e=>setLinks(l=>({...l, design:e.target.value}))} placeholder="Design / Figma URL" className="w-full px-3 py-2 border rounded-lg bg-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image</label>
                <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center bg-gray-50">
                  {coverImage ? (
                    <div className="relative w-full">
                      <img src={coverImage} alt="cover" className="w-full h-40 object-cover rounded-md" />
                      <button onClick={()=>setCoverImage(undefined)} className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Hapus</button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={40} className="text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 mb-2">Upload gambar (JPG/PNG)</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} id="featured" />
                <label htmlFor="featured" className="text-sm">Tandai sebagai unggulan</label>
              </div>
              <div className="pt-2">
                <Button onClick={handleSave} className="w-full"><Save size={16} className="mr-2"/> Simpan</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectDialog;
