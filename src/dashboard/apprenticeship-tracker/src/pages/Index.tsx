import React, { useState } from 'react';
import { SortAsc, Grid, List, Bookmark } from 'lucide-react';
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import InternshipCard from '@/components/InternshipCard';
import ApplicationTracker from '@/components/ApplicationTracker';
import FilterSidebar from '@/components/FilterSidebar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
const mockInternships = [
  {
    id: '1',
    company: {
      name: 'TechCorp Indonesia',
      logo: '/api/placeholder/60/60',
      location: 'Jakarta Selatan'
    },
    position: 'Frontend Developer Intern',
    duration: '6 bulan',
    salary: 'Rp 3.500.000',
    isPaid: true,
    description: 'Bergabunglah dengan tim developer kami untuk mengembangkan aplikasi web modern menggunakan React, TypeScript, dan teknologi frontend terdepan.',
    tags: ['React', 'TypeScript', 'UI/UX', 'Fulltime'],
    postedDate: '2 hari lalu',
    isBookmarked: false
  },
  {
    id: '2',
    company: {
      name: 'MarketPro Agency',
      logo: '/api/placeholder/60/60',
      location: 'Bandung'
    },
    position: 'Digital Marketing Intern',
    duration: '4 bulan',
    salary: 'Rp 2.800.000',
    isPaid: true,
    description: 'Pelajari strategi digital marketing modern, social media management, dan campaign optimization dari tim marketing berpengalaman.',
    tags: ['Social Media', 'SEO', 'Content Marketing', 'Analytics'],
    postedDate: '1 hari lalu',
    isBookmarked: true
  },
  {
    id: '3',
    company: {
      name: 'FinanceHub',
      logo: '/api/placeholder/60/60',
      location: 'Jakarta Pusat'
    },
    position: 'Financial Analyst Intern',
    duration: '3 bulan',
    isPaid: false,
    description: 'Dapatkan pengalaman dalam analisis keuangan, pemodelan finansial, dan penelitian investasi di industri fintech terdepan.',
    tags: ['Excel', 'Financial Modeling', 'Analysis', 'Research'],
    postedDate: '3 hari lalu',
    isBookmarked: false
  },
  {
    id: '4',
    company: {
      name: 'DesignStudio Creative',
      logo: '/api/placeholder/60/60',
      location: 'Yogyakarta'
    },
    position: 'UI/UX Designer Intern',
    duration: '5 bulan',
    salary: 'Rp 3.000.000',
    isPaid: true,
    description: 'Belajar design thinking, user research, prototyping, dan visual design untuk menciptakan pengalaman pengguna yang luar biasa.',
    tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    postedDate: '1 minggu lalu',
    isBookmarked: false
  },
  {
    id: '5',
    company: {
      name: 'DataCorp Analytics',
      logo: '/api/placeholder/60/60',
      location: 'Surabaya'
    },
    position: 'Data Science Intern',
    duration: '6 bulan',
    salary: 'Rp 4.000.000',
    isPaid: true,
    description: 'Terlibat dalam proyek machine learning, data visualization, dan analisis big data untuk memberikan insights bisnis yang valuable.',
    tags: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    postedDate: '4 hari lalu',
    isBookmarked: true
  },
  {
    id: '6',
    company: {
      name: 'StartupXYZ',
      logo: '/api/placeholder/60/60',
      location: 'Jakarta Barat'
    },
    position: 'Content Writer Intern',
    duration: '3 bulan',
    isPaid: false,
    description: 'Ciptakan konten yang menarik untuk blog, social media, dan marketing materials. Kembangkan skill copywriting dan storytelling.',
    tags: ['Content Writing', 'SEO Writing', 'Social Media', 'Copywriting'],
    postedDate: '5 hari lalu',
    isBookmarked: false
  }
];

const Index = () => {
  const [internships, setInternships] = useState(mockInternships);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();

  const handleApply = (id: string) => {
    const internship = internships.find(item => item.id === id);
    toast({
      title: 'Aplikasi Berhasil Dikirim!',
      description: `Anda telah melamar untuk posisi ${internship?.position} di ${internship?.company.name}`,
    });
  };

  const handleBookmark = (id: string) => {
    setInternships(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isBookmarked: !item.isBookmarked }
          : item
      )
    );

    const internship = internships.find(item => item.id === id);
    const action = internship?.isBookmarked ? 'dihapus dari' : 'ditambahkan ke';

    toast({
      title: 'Bookmark Updated',
      description: `${internship?.position} ${action} daftar bookmark Anda`,
    });
  };

  const sortedInternships = [...internships].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'salary-high':
        return (b.isPaid ? parseInt(b.salary?.replace(/\D/g, '') || '0') : 0) - 
               (a.isPaid ? parseInt(a.salary?.replace(/\D/g, '') || '0') : 0);
      case 'company':
        return a.company.name.localeCompare(b.company.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {}
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>

          {}
          <div className="lg:col-span-2 space-y-6">
            {}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Posisi Magang Tersedia
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-muted-foreground">
                    Menampilkan {sortedInternships.length} dari 1,234 posisi
                  </p>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    {internships.filter(item => item.isBookmarked).length} Tersimpan
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {}
                <div className="flex border border-border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SortAsc className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="salary-high">Gaji Tertinggi</SelectItem>
                    <SelectItem value="company">Nama Perusahaan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                : 'space-y-4'
            }>
              {sortedInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  {...internship}
                  onApply={handleApply}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>

            {}
            <div className="text-center pt-8">
              <Button variant="outline" size="lg">
                Lihat Lebih Banyak Posisi
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Masih ada 1,200+ posisi lainnya
              </p>
            </div>
          </div>

          {}
          <div className="lg:col-span-1">
            <ApplicationTracker />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
