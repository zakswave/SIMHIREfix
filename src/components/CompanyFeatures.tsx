import { useEffect, useRef, useState } from 'react';
import { Layout, Users, BarChart3, Briefcase, FileCheck, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyFeatures = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 200);
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

  const features = [
    {
      icon: <Layout className="w-8 h-8" />,
      title: "Simulasi Management",
      description: "Kelola dan buat simulasi kerja custom untuk evaluasi kandidat sesuai kebutuhan posisi",
      color: "bg-gradient-to-br from-primary-600 to-primary-700",
      hoverColor: "group-hover:from-primary-700 group-hover:to-primary-800",
      shadowColor: "shadow-primary-600/25",
      benefits: ["Custom simulasi kerja", "Skill-based testing", "Analytics mendalam"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Talent Search",
      description: "Cari kandidat terbaik dengan filter skill, hasil simulasi, dan portofolio terintegrasi",
      color: "bg-gradient-to-br from-primary-500 to-primary-600",
      hoverColor: "group-hover:from-primary-600 group-hover:to-primary-700",
      shadowColor: "shadow-primary-500/25",
      benefits: ["Filter by skills", "Simulasi scores", "Portfolio view"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Dashboard Evaluasi",
      description: "Panel komprehensif untuk mengevaluasi kandidat dengan data analytics dan perbandingan",
      color: "bg-gradient-to-br from-primary-600 to-primary-700",
      hoverColor: "group-hover:from-primary-700 group-hover:to-primary-800",
      shadowColor: "shadow-primary-600/25",
      benefits: ["Real-time analytics", "Kandidat comparison", "Performance insights"]
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Job Management",
      description: "Kelola lowongan kerja dengan mudah, post jobs, review aplikasi, dan manage interview",
      color: "bg-gradient-to-br from-blue-600 to-blue-700",
      hoverColor: "group-hover:from-blue-700 group-hover:to-blue-800",
      shadowColor: "shadow-blue-600/25",
      benefits: ["Easy job posting", "Application review", "Interview scheduling"]
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Applicant Tracking",
      description: "Track semua pelamar dalam pipeline, dari aplikasi hingga hiring dengan status realtime",
      color: "bg-gradient-to-br from-purple-600 to-purple-700",
      hoverColor: "group-hover:from-purple-700 group-hover:to-purple-800",
      shadowColor: "shadow-purple-600/25",
      benefits: ["Pipeline management", "Status tracking", "Automated notifications"]
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Simulasi Analytics",
      description: "Analisis hasil simulasi kandidat, export data, dan buat custom assessment",
      color: "bg-gradient-to-br from-orange-600 to-orange-700",
      hoverColor: "group-hover:from-orange-700 group-hover:to-orange-800",
      shadowColor: "shadow-orange-600/25",
      benefits: ["Simulasi results", "Data export", "Custom tests"]
    }
  ];

  return (
    <section id="company-features" ref={sectionRef} className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden transition-colors">
      {}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary-100 rounded-full blur-2xl opacity-30 animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Solusi Rekrutmen untuk <span className="text-primary-600">Perusahaan</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Platform komprehensif untuk mengelola proses rekrutmen dari awal hingga akhir
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group bg-white rounded-xl sm:rounded-card shadow-card p-6 sm:p-8 lg:p-10 hover:shadow-card-hover transition-all duration-700 transform hover:-translate-y-6 border border-gray-200 hover:border-primary-200 relative overflow-hidden ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-primary-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className={`${feature.color} ${feature.hoverColor} ${feature.shadowColor} w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10`}>
                {feature.icon}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 group-hover:text-primary-600 transition-colors duration-300 relative z-10">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 relative z-10">
                {feature.description}
              </p>

              <ul className="space-y-3 relative z-10">
                {feature.benefits.map((benefit, idx) => (
                  <li 
                    key={idx} 
                    className={`flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-all duration-500 transform ${
                      visibleCards.includes(index) 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${(index * 200) + (idx * 100)}ms` }}
                  >
                    <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                    <span className="group-hover:font-medium transition-all duration-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              {}
              <div className="mt-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 relative z-10">
                <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center space-x-2 group/btn transition-colors">
                  <span>Mulai Sekarang</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/register" className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-10 py-4 rounded-button font-semibold text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-primary-600/25 relative overflow-hidden group">
            <div className="pointer-events-none absolute inset-0 bg-white/20 opacity-0 -translate-x-[120%] -skew-x-12 group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-400 ease-out will-change-transform"></div>
            <span className="relative z-10">Daftar sebagai Perusahaan</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompanyFeatures;
