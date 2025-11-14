import { useEffect, useState } from 'react';
import { User, Building2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600'
    }
  } as const;

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900/30 text-white min-h-screen flex items-center overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-36 scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-36">
      {}
      <div className="absolute inset-0">
        <div 
          className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x * 0.02 + '%',
            top: mousePosition.y * 0.02 + '%',
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-primary-400/5 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-primary-700/5 rounded-full blur-2xl animate-pulse"></div>
        {}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-7xl mx-auto mobile-container">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
            <span className="text-xs sm:text-sm font-medium text-primary-300">Platform Karir Terintegrasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] max-w-5xl mx-auto px-2">
             Temukan Karir Impian Anda dengan{' '}
             <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
               Platform Kerja Terdepan
             </span>
           </h1>
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Simulasi kerja gratis, portfolio builder, dan job finder terintegrasi. 
            Tingkatkan skill dan dapatkan pekerjaan impian Anda.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center px-2 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Link to="/register" className="tap-target group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-6 sm:px-8 py-3 sm:py-4 rounded-button font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-primary-500/25 flex items-center justify-center space-x-2 sm:space-x-3 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-white/15 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-400 ease-out will-change-transform"></div>
              <User className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="relative z-10">Daftar sebagai Kandidat</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </Link>
            <Link to="/register" className="tap-target group border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-button font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-primary-500/25 flex items-center justify-center space-x-2 sm:space-x-3 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-primary-500/20 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-400 ease-out will-change-transform"></div>
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="relative z-10">Daftar sebagai Perusahaan</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </Link>
          </div>
        </div>

        <div className={`relative max-w-6xl mx-auto px-2 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white/95 backdrop-blur-lg rounded-lg sm:rounded-xl lg:rounded-card shadow-card-hover p-6 sm:p-8 md:p-10 lg:p-12 text-gray-900 border border-gray-200/50 transition-all duration-500 transform hover:-translate-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 md:gap-8">
              {[
                { number: '1K+', title: 'Kandidat Aktif', desc: 'Talenta berkualitas siap kerja', color: 'emerald', delay: 0 },
                { number: '200+', title: 'Perusahaan Partner', desc: 'Dari startup hingga korporasi', color: 'blue', delay: 200 },
                { number: '85%', title: 'Success Rate', desc: 'Kandidat berhasil diterima kerja', color: 'emerald', delay: 400 }
              ].map((stat, index) => (
                <div key={index} className={`text-center group transition-all duration-500 delay-${stat.delay}`}>
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 ${colorClasses[stat.color as keyof typeof colorClasses].bg} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                    <span className={`text-xl sm:text-2xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses].text} group-hover:scale-110 transition-transform duration-300`}>
                      {stat.number}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-base sm:text-lg group-hover:text-emerald-600 transition-colors duration-300">
                    {stat.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
