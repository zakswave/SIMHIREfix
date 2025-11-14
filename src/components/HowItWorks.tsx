import { useEffect, useRef, useState } from 'react';
import { Play, Trophy, Briefcase, MessageCircle, Send } from 'lucide-react';

const HowItWorks = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          steps.forEach((_, index) => {
            setTimeout(() => {
              setVisibleSteps((prev) => [...prev, index]);
            }, index * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: <Play className="w-8 h-8" />,
      title: 'Simulasi',
      description: 'Latihan gratis dengan skenario kerja nyata untuk mengasah skill',
      color: 'bg-gradient-to-br from-primary-500 to-primary-600',
      shadowColor: 'shadow-primary-500/25',
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Portfolio & CV',
      description: 'Buat portfolio profesional dan CV ATS-friendly otomatis',
      color: 'bg-gradient-to-br from-primary-400 to-primary-500',
      shadowColor: 'shadow-primary-400/25',
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Magang',
      description: 'Program magang singkat dengan mentoring dan evaluasi',
      color: 'bg-gradient-to-br from-primary-600 to-primary-700',
      shadowColor: 'shadow-primary-600/25',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Interview',
      description: 'Wawancara dan persiapan interview nyata',
      color: 'bg-gradient-to-br from-accent-orange to-accent-pink',
      shadowColor: 'shadow-accent-orange/25',
    },
    {
      icon: <Send className="w-8 h-8" />,
      title: 'Apply',
      description: 'Lamar pekerjaan dengan CV otomatis dan tracking aplikasi',
      color: 'bg-gradient-to-br from-accent-blue to-accent-purple',
      shadowColor: 'shadow-accent-blue/25',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-20 lg:py-32 bg-white relative overflow-hidden transition-colors"
    >
      {}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-100 rounded-full blur-2xl opacity-40 animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
            Proses komprehensif dari persiapan hingga mendapatkan pekerjaan impian Anda
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-4 mt-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-center relative group transition-all duration-700 ${
                  visibleSteps.includes(index)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-10 scale-95'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div
                  className={`${step.color} ${step.shadowColor} w-16 h-16 sm:w-18 sm:h-18 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white shadow-xl relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 hover:shadow-2xl`}
                >
                  {step.icon}
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-base sm:text-lg lg:text-base font-semibold mb-2 sm:mb-3 text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 px-2">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
