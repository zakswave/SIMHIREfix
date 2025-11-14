import { useEffect, useRef, useState } from 'react';
import { Camera, Play, Briefcase, FileText, FolderKanban, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Skill Snapshot",
    description: "Tes singkat untuk memetakan kekuatan dan kelemahan skill Anda dengan analisis mendalam",
    color: "bg-gradient-to-br from-primary-500 to-primary-600",
    hoverColor: "group-hover:from-primary-600 group-hover:to-primary-700",
    shadowColor: "shadow-primary-500/25"
  },
  {
    icon: <Play className="w-8 h-8" />,
    title: "Simulasi Kerja",
    description: "Latihan gratis dengan skenario nyata dan dapatkan sertifikat skill yang diakui industri",
    color: "bg-gradient-to-br from-primary-400 to-primary-500",
    hoverColor: "group-hover:from-primary-500 group-hover:to-primary-600",
    shadowColor: "shadow-primary-400/25"
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Job Finder",
    description: "Cari lowongan kerja dengan filter canggih, apply 1-klik, dan tracking lamaran real-time",
    color: "bg-gradient-to-br from-primary-600 to-primary-700",
    hoverColor: "group-hover:from-primary-700 group-hover:to-primary-800",
    shadowColor: "shadow-primary-600/25"
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Auto-CV",
    description: "Generate CV profesional ATS-friendly otomatis dari portfolio Anda dengan berbagai template",
    color: "bg-gradient-to-br from-accent-blue to-accent-purple",
    hoverColor: "group-hover:from-accent-purple group-hover:to-accent-blue",
    shadowColor: "shadow-accent-blue/25"
  },
  {
    icon: <FolderKanban className="w-8 h-8" />,
    title: "Portfolio Management",
    description: "Kelola proyek portfolio Anda dengan mudah, showcase karya terbaik ke perusahaan",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    hoverColor: "group-hover:from-purple-600 group-hover:to-purple-700",
    shadowColor: "shadow-purple-500/25"
  },
  {
    icon: <ClipboardCheck className="w-8 h-8" />,
    title: "Application Tracker",
    description: "Track semua lamaran Anda dalam satu dashboard, monitor status dan interview schedule",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    hoverColor: "group-hover:from-orange-600 group-hover:to-orange-700",
    shadowColor: "shadow-orange-500/25"
  }
];

const CandidateFeatures = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="candidate-features" className="py-20 lg:py-32 bg-white relative overflow-hidden transition-colors">
      {}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #10B981 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #3B82F6 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Fitur untuk Kandidat
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Tools lengkap untuk mempersiapkan dan meningkatkan peluang karir Anda
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group bg-white rounded-xl sm:rounded-card shadow-card p-6 sm:p-8 hover:shadow-card-hover transition-all duration-700 transform hover:-translate-y-4 border border-gray-200 hover:border-primary-200 relative overflow-hidden ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-primary-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className={`${feature.color} ${feature.hoverColor} ${feature.shadowColor} w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10`}>
                {feature.icon}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 group-hover:text-primary-600 transition-colors duration-300 relative z-10">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 relative z-10">
                {feature.description}
              </p>

              {}
              <div className="mt-5 sm:mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 relative z-10">
                <Link to="/register" className="text-primary-600 text-sm sm:text-base font-semibold hover:text-primary-700 flex items-center space-x-2 group/btn transition-colors">
                  <span>Mulai Sekarang</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 group-hover:bg-primary-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary-600 font-bold text-xs sm:text-sm transition-all duration-300">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="text-center mt-12 sm:mt-16">
          <Link to="/register" className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-button font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-primary-500/25">
            Daftar sebagai Kandidat
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CandidateFeatures;
