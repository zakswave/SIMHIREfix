import { useState } from 'react';
import { PlayCircle, Award, Code, PenTool, Database, Brain, Shield, Layers, Rocket, CheckCircle } from 'lucide-react';

interface Simulation {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skills: string[];
  completed?: boolean;
}

const JobSimulation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [completed, setCompleted] = useState<string[]>(['1']);

  const categories = [
    { name: 'All', icon: Layers },
    { name: 'Frontend', icon: Code },
    { name: 'UI/UX', icon: PenTool },
    { name: 'Data', icon: Database },
    { name: 'AI/ML', icon: Brain },
    { name: 'Security', icon: Shield },
  ];

  const simulations: Simulation[] = [
    {
      id: '1',
      title: 'Membangun Dasbor Responsif',
      category: 'Frontend',
      difficulty: 'Intermediate',
      duration: '2 hours',
      skills: ['React', 'Tailwind', 'API Integration'],
      completed: true,
    },
    {
      id: '2',
      title: 'Merancang Alur Aplikasi Mobile',
      category: 'UI/UX',
      difficulty: 'Beginner',
      duration: '1.5 hours',
      skills: ['Wireframing', 'Prototyping', 'User Flow'],
    },
    {
      id: '3',
      title: 'Membangun Sistem Rekomendasi',
      category: 'AI/ML',
      difficulty: 'Advanced',
      duration: '3 hours',
      skills: ['Python', 'ML', 'NLP'],
    },
    {
      id: '4',
      title: 'Mengamankan Aplikasi Web',
      category: 'Security',
      difficulty: 'Advanced',
      duration: '2.5 hours',
      skills: ['OWASP', 'Pentesting', 'Auth'],
    },
  ];

  const filteredSimulations = simulations.filter(sim => {
    if (selectedCategory !== 'all' && sim.category.toLowerCase() !== selectedCategory) return false;
    if (selectedLevel !== 'all' && sim.difficulty.toLowerCase() !== selectedLevel) return false;
    return true;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const labelCategory = (name: string) => {
    switch (name) {
      case 'All': return 'Semua';
      case 'Frontend': return 'Frontend';
      case 'UI/UX': return 'UI/UX';
      case 'Data': return 'Data';
      case 'AI/ML': return 'AI/ML';
      case 'Security': return 'Keamanan';
      default: return name;
    }
  };

  const labelLevel = (level: string) => ({ All: 'Semua', Beginner: 'Pemula', Intermediate: 'Menengah', Advanced: 'Lanjutan' }[level] || level);
  const toggleComplete = (id: string) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
  <div className="min-h-screen bg-gray-50 p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulasi Kerja</h1>
          <p className="text-gray-600">Latih kemampuan Anda melalui simulasi kerja nyata dan dapatkan sertifikat</p>
        </div>

        {}
  <div className="bg-white rounded-lg p-6 mb-6 border border-transparent">
          <div className="flex flex-wrap gap-3 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name.toLowerCase())}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.name.toLowerCase() ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <cat.icon size={18} />
                {labelCategory(cat.name)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedLevel === level.toLowerCase() ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {labelLevel(level)}
              </button>
            ))}
          </div>
        </div>

        {}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map((sim) => (
            <div key={sim.id} className="bg-white rounded-card p-6 hover:shadow-lg transition-shadow border border-transparent">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(sim.difficulty)}`}>
-                  {sim.difficulty}
+                  {labelLevel(sim.difficulty)}
                </span>
                {completed.includes(sim.id) && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle size={16} /> Selesai
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{sim.title}</h3>
              <div className="space-y-2 mb-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <Layers size={16} className="mr-2" />
-                  {sim.category}
+                  {labelCategory(sim.category)}
                </div>
                <div className="flex items-center">
                  <PlayCircle size={16} className="mr-2" />
                  {sim.duration.replace('hours','jam')}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {sim.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Mulai Simulasi
                </button>
                <button
                  onClick={() => toggleComplete(sim.id)}
                  className={`px-4 py-2 rounded-lg font-semibold border ${completed.includes(sim.id) ? 'border-green-600 text-green-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {completed.includes(sim.id) ? 'Selesaikan' : 'Tandai'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="mt-12 bg-white rounded-card p-8 border border-transparent">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Manfaat Simulasi Kerja</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peningkatan Skill</h3>
              <p className="text-gray-600 text-sm">Latih kemampuan pada skenario nyata sesuai kebutuhan industri</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sertifikat</h3>
              <p className="text-gray-600 text-sm">Dapatkan sertifikat penyelesaian untuk memperkuat portofolio Anda</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="text-accent-blue" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Akses Fleksibel</h3>
              <p className="text-gray-600 text-sm">Kerjakan simulasi kapan saja dan di mana saja sesuai kecepatan Anda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSimulation;
