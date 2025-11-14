import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Award, Globe } from 'lucide-react';

const SDGImpact = () => {
  const [visibleStats, setVisibleStats] = useState<number[]>([]);
  const [animatedNumbers, setAnimatedNumbers] = useState<{[key: number]: number}>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            impacts.forEach((_, index) => {
              setTimeout(() => {
                setVisibleStats(prev => [...prev, index]);
                animateNumber(index, impacts[index].stat);
              }, index * 300);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateNumber = (index: number, target: string) => {
    const numericRaw = target.replace(/[^\d.]/g, '');
    let numericValue = parseFloat(numericRaw) || 0;
    if (/k/i.test(target)) {
      numericValue = numericValue * 1000;
    }
    let current = 0;
    const increment = numericValue / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      setAnimatedNumbers(prev => ({
        ...prev,
        [index]: Math.floor(current)
      }));
    }, 30);
  };

  const impacts = [
    {
      icon: <TrendingUp className="w-12 h-12" />,
      stat: "75%",
      title: "Peningkatan Employability",
      description: "Kandidat yang mengikuti program kami meningkat daya saing kerjanya hingga 75%",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Akses Kerja yang Merata",
      stat: "2.5K+",
      description: "Membuka akses pekerjaan layak untuk lebih dari 2.500 kandidat dari berbagai latar belakang",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Award className="w-12 h-12" />,
      stat: "90%",
      title: "Kualitas Tenaga Kerja",
      description: "Perusahaan melaporkan 90% kandidat kami memiliki skill sesuai kebutuhan industri",
      color: "from-emerald-500 to-emerald-700"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      stat: "15+",
      title: "Kota Terjangkau",
      description: "Menjangkau 15+ kota di Indonesia untuk pemerataan kesempatan kerja",
      color: "from-orange-400 to-orange-600"
    }
  ];

  return (
    <section ref={sectionRef} id="impact" className="py-20 lg:py-32 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white relative overflow-hidden">
      {}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/50 to-emerald-950/50"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-emerald-700/10 rounded-full blur-xl animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 text-white">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/50 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 border border-emerald-700/50 hover:scale-105 transition-transform duration-300">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs sm:text-sm font-medium">SDG 8: Decent Work and Economic Growth</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-white px-2">
            Dampak untuk Indonesia
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white max-w-4xl mx-auto leading-relaxed px-2">
            Berkontribusi pada Sustainable Development Goals melalui penciptaan pekerjaan layak dan pertumbuhan ekonomi yang inklusif
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 mb-12 sm:mb-20">
          {impacts.map((impact, index) => (
            <div 
              key={index} 
              className={`text-center group transition-all duration-700 ${
                visibleStats.includes(index) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              <div className={`bg-gradient-to-br ${impact.color} w-20 h-20 sm:w-22 sm:h-22 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative`}>
                {impact.icon}
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="text-3xl sm:text-4xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                {visibleStats.includes(index) ? (
                  impact.stat.includes('%') ? `${animatedNumbers[index] || 0}%` :
                  impact.stat.includes('K') ? `${(((animatedNumbers[index] || 0) / 1000).toFixed(1))}K+` :
                  impact.stat.includes('+') ? `${animatedNumbers[index] || 0}+` :
                  impact.stat
                ) : '0'}
              </div>

              <h3 className="text-base sm:text-lg lg:text-base font-semibold mb-2 sm:mb-3 group-hover:text-emerald-300 transition-colors duration-300 px-2">
                {impact.title}
              </h3>
              <p className="text-emerald-200 text-xs sm:text-sm lg:text-xs leading-relaxed group-hover:text-emerald-100 transition-colors duration-300 px-2">
                {impact.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-800/50 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-emerald-700/50 hover:bg-emerald-800/70 transition-all duration-500 transform hover:scale-105">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent px-2">
              Komitmen Kami
            </h3>
            <p className="text-emerald-200 max-w-3xl mx-auto text-lg leading-relaxed">
              Dengan memfokuskan pada pekerjaan yang layak dan berkualitas, kami berkomitmen untuk mengurangi tingkat pengangguran 
              dan meningkatkan produktivitas ekonomi Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'Target 2025', desc: '10K+ kandidat tersertifikasi', delay: 0 },
              { title: 'Kemitraan', desc: '500+ perusahaan partner', delay: 200 },
              { title: 'Jangkauan', desc: 'Seluruh Indonesia', delay: 400 }
            ].map((item, index) => (
              <div 
                key={index}
                className={`group transition-all duration-700 ${
                  visibleStats.length > 0 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${1000 + item.delay}ms` }}
              >
                <div className="text-2xl lg:text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {item.title}
                </div>
                <p className="text-sm text-emerald-200 group-hover:text-emerald-100 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SDGImpact;
