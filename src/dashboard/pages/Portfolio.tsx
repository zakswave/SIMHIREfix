import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ProgressChart } from '../components/ProgressChart';
import { Plus, Search, LayoutGrid, List, Filter, RefreshCw, FolderOpen, Star, Code, Eye, Briefcase, Target, Loader2 } from 'lucide-react';
import { PortfolioProject, createEmptyProject } from '@/lib/portfolio';
import ProjectCard from '../components/portfolio/ProjectCard';
import EditProjectDialog from '../components/portfolio/EditProjectDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GradientCard } from '@/components/ui/gradient-card';
import { api } from '@/services/api';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [techFilter, setTechFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Silakan login terlebih dahulu');
        setProjects([]);
        setLoading(false);
        return;
      }

      const response = await api.getMyPortfolios();

      if (response.success && response.data?.portfolios) {
        const mappedProjects: PortfolioProject[] = response.data.portfolios.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          coverImage: p.coverImage || '',
          tech: p.technologies || [],
          highlights: p.highlights || [],
          liveUrl: p.liveUrl || '',
          githubUrl: p.githubUrl || '',
          featured: p.featured || false,
          sortOrder: p.sortOrder || 0,
        }));

        setProjects(mappedProjects.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      } else {
        setProjects([]);
      }
    } catch (err: any) {
      console.error('Error loading portfolios:', err);
      if (err.message?.includes('login') || err.message?.includes('token')) {
        setError('Silakan login terlebih dahulu');
      } else if (err.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        setError(err.response?.data?.message || 'Gagal memuat portfolio');
      }

      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const allTech = useMemo(()=>{
    const set = new Set<string>();
    projects.forEach(p => p.tech.forEach(t=>set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = projects.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch = !term || p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || p.tech.some(t=>t.toLowerCase().includes(term));
    const matchesTech = !techFilter || p.tech.includes(techFilter);
    return matchesSearch && matchesTech;
  });

  const stats = [
    { title: 'Total Project', value: projects.length.toString(), subtitle: `${projects.length} projects`, icon: FolderOpen, gradient: 'from-blue-500 to-cyan-500' },
    { title: 'Featured', value: projects.filter(p => p.featured).length.toString(), subtitle: 'Unggulan', icon: Star, gradient: 'from-yellow-500 to-orange-500' },
    { title: 'Teknologi', value: allTech.length.toString(), subtitle: 'Tech stack', icon: Code, gradient: 'from-purple-500 to-pink-500' },
    { title: 'Total Views', value: '1.2K', subtitle: 'Profile views', icon: Eye, gradient: 'from-green-500 to-emerald-500' }
  ];

  const techStackData = useMemo(() => {
    const techCount: { [key: string]: number } = {};
    projects.forEach(p => {
      p.tech.forEach(t => {
        techCount[t] = (techCount[t] || 0) + 1;
      });
    });

    return Object.entries(techCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count], index) => ({
        label: name,
        value: count,
        color: ['bg-blue-500', 'bg-primary-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index]
      }));
  }, [projects]);

  const handleSave = async (proj: PortfolioProject) => {
    try {
      const isEditing = projects.some(p => p.id === proj.id);
      const formData = new FormData();
      formData.append('title', proj.title);
      formData.append('description', proj.description);
      formData.append('technologies', JSON.stringify(proj.tech));
      formData.append('highlights', JSON.stringify(proj.highlights));

      if (proj.liveUrl) formData.append('liveUrl', proj.liveUrl);
      if (proj.githubUrl) formData.append('githubUrl', proj.githubUrl);
      if (proj.featured) formData.append('featured', 'true');
      if (proj.coverImage && typeof proj.coverImage !== 'string') {
        formData.append('coverImage', proj.coverImage);
      }

      let response;
      if (isEditing) {
        response = await api.updatePortfolio(proj.id, formData);
      } else {
        response = await api.createPortfolio(formData);
      }

      if (response.success) {
        await loadPortfolios();
        setShowDialog(false);
        setEditing(null);
        toast.success(isEditing ? 'Project berhasil diupdate' : 'Project baru berhasil ditambahkan');
      }
    } catch (err: any) {
      console.error('Error saving portfolio:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan portfolio');
    }
  };

  const handleDelete = async (proj: PortfolioProject) => {
    if (!confirm('Hapus project ini?')) return;

    try {
      const response = await api.deletePortfolio(proj.id);

      if (response.success) {
        setProjects(prev => prev.filter(p => p.id !== proj.id));
        toast.success('Project berhasil dihapus');
      }
    } catch (err: any) {
      console.error('Error deleting portfolio:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus portfolio');
    }
  };

  const handleToggleFeatured = async (proj: PortfolioProject) => {
    try {
      const response = await api.togglePortfolioFeatured(proj.id);

      if (response.success) {
        setProjects(prev => prev.map(p => 
          p.id === proj.id ? { ...p, featured: !p.featured } : p
        ));
        toast.success(proj.featured ? 'Project tidak lagi unggulan' : 'Project ditandai sebagai unggulan');
      }
    } catch (err: any) {
      console.error('Error toggling featured:', err);
      toast.error(err.response?.data?.message || 'Gagal mengubah status unggulan');
    }
  };

  const handleAdd = () => {
    setEditing(createEmptyProject());
    setShowDialog(true);
  };

  const handleEdit = (p: PortfolioProject) => {
    setEditing(p);
    setShowDialog(true);
  };

  const handleReorder = () => {
    const ordered = [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.title.localeCompare(b.title);
    });
    setProjects(ordered);
    toast.success('Project berhasil disusun ulang');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Portofolio</h1>
          </div>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Kelola dan tampilkan project terbaik Anda untuk rekruter
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReorder} title="Reorder otomatis">
            <RefreshCw size={16} className="mr-2"/> Susun Ulang
          </Button>
          <Button onClick={handleAdd}>
            <Plus size={16} className="mr-2"/> Tambah Project
          </Button>
        </div>
      </motion.div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <GradientCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            gradient={stat.gradient}
            delay={index * 0.1}
          />
        ))}
      </div>

      {}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-3 text-gray-600">Memuat portfolio...</span>
        </div>
      )}

      {}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <Button onClick={loadPortfolios} variant="outline">
            Coba Lagi
          </Button>
        </div>
      )}

      {}
      {!loading && !error && techStackData.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tech Stack Teratas</h3>
            <Code className="w-5 h-5 text-primary-600" />
          </div>
          <ProgressChart data={techStackData} />
        </div>
      )}

      {!loading && !error && (
      <Card>
        <CardContent className="p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari project..." className="w-full pl-9 pr-3 py-2 border rounded-lg bg-white text-sm" />
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant={viewMode==='grid'? 'default':'outline'} onClick={()=>setViewMode('grid')}><LayoutGrid size={16} /></Button>
              <Button size="icon" variant={viewMode==='list'? 'default':'outline'} onClick={()=>setViewMode('list')}><List size={16} /></Button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={techFilter===null? 'default':'secondary'} className="cursor-pointer" onClick={()=>setTechFilter(null)}>Semua</Badge>
            {allTech.map(t => (
              <Badge key={t} variant={techFilter===t? 'default':'secondary'} className="cursor-pointer" onClick={()=>setTechFilter(t)}>{t}</Badge>
            ))}
            {allTech.length===0 && <span className="text-xs text-gray-500 flex items-center gap-1"><Filter size={12}/> Tidak ada tag</span>}
          </div>
        </CardContent>
      </Card>
      )}

      {!loading && !error && filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-card">
          <p className="text-gray-500 mb-4">Belum ada project yang cocok.</p>
          <Button onClick={handleAdd}><Plus size={16} className="mr-2"/> Tambah Project Pertama</Button>
        </div>
      ) : null}

      {!loading && !error && filtered.length > 0 && viewMode==='grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} onEdit={handleEdit} onDelete={handleDelete} onToggleFeatured={handleToggleFeatured} />
          ))}
        </div>
      ) : null}

      {!loading && !error && filtered.length > 0 && viewMode==='list' ? (
        <div className="space-y-4">
          {filtered.map(p => (
            <div key={p.id} className="p-4 rounded-lg border bg-white flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">{p.title} {p.featured && <span className="inline-flex items-center gap-1 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-md"><Plus size={10}/> Unggulan</span>}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">{p.tech.map(t=><Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
                {p.highlights.length>0 && <ul className="list-disc ml-5 text-xs text-gray-600 space-y-0.5">{p.highlights.slice(0,3).map((h,i)=><li key={i}>{h}</li>)}</ul>}
              </div>
              <div className="flex items-start gap-2">
                <Button size="sm" variant="outline" onClick={()=>handleEdit(p)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={()=>handleToggleFeatured(p)}>{p.featured? 'Unfeature':'Feature'}</Button>
                <Button size="sm" variant="destructive" onClick={()=>handleDelete(p)}>Hapus</Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <EditProjectDialog open={showDialog} onClose={()=>{setShowDialog(false); setEditing(null);}} project={editing} onSave={handleSave} />
    </div>
    </div>
  );
};

export default Portfolio;
