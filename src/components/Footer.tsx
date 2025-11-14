import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white relative overflow-hidden">
      {}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/90 to-primary-900/90"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent">
            Siap Memulai Karir Impian Anda?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Bergabung dengan ribuan kandidat yang telah berhasil mendapatkan pekerjaan melalui platform kami
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center px-4">
            <button 
              onClick={() => navigate('/register')}
              className="tap-target group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-button text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-primary-500/25 flex items-center justify-center space-x-2 sm:space-x-3 relative overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 bg-white/15 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-400 ease-out will-change-transform"></div>
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="tap-target group border-2 border-gray-600 text-gray-300 hover:border-primary-500 hover:text-primary-400 px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-button text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 bg-primary-500/10 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-400 ease-out will-change-transform"></div>
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center space-x-3 mb-6 group">
              <img 
                src="/logo.png" 
                alt="SimHire Logo" 
                className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                SimHire
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Platform kerja terdepan yang menghubungkan talenta berkualitas dengan perusahaan terbaik di Indonesia.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-400">Platform</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('candidate-features');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      navigate('/#candidate-features');
                    }
                  }}
                  className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group text-left"
                  onMouseEnter={() => setHoveredLink('Untuk Kandidat')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Untuk Kandidat
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === 'Untuk Kandidat' ? 'w-full' : ''}`}></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('company-features');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      navigate('/#company-features');
                    }
                  }}
                  className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group text-left"
                  onMouseEnter={() => setHoveredLink('Untuk Perusahaan')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Untuk Perusahaan
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === 'Untuk Perusahaan' ? 'w-full' : ''}`}></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const user = localStorage.getItem('simhire_user');
                    if (user) {
                      navigate('/dashboard/simulasi-kerja');
                    } else {
                      navigate('/login', { state: { returnUrl: '/dashboard/simulasi-kerja' } });
                    }
                  }}
                  className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group text-left"
                  onMouseEnter={() => setHoveredLink('Simulasi Gratis')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Simulasi Gratis
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === 'Simulasi Gratis' ? 'w-full' : ''}`}></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const user = localStorage.getItem('simhire_user');
                    if (user) {
                      navigate('/dashboard/job-finder');
                    } else {
                      navigate('/login', { state: { returnUrl: '/dashboard/job-finder' } });
                    }
                  }}
                  className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group text-left"
                  onMouseEnter={() => setHoveredLink('Job Finder')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Job Finder
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === 'Job Finder' ? 'w-full' : ''}`}></span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-emerald-400">Resources</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group text-left"
                  onMouseEnter={() => setHoveredLink('Blog')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Blog
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === 'Blog' ? 'w-full' : ''}`}></span>
                </button>
              </li>
              <li>
                <a 
                  href="#how-it-works"
                  className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group"
                  onMouseEnter={() => setHoveredLink('Career Guide')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Career Guide
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === 'Career Guide' ? 'w-full' : ''}`}></span>
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials"
                  className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group"
                  onMouseEnter={() => setHoveredLink('Success Stories')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Success Stories
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === 'Success Stories' ? 'w-full' : ''}`}></span>
                </a>
              </li>
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group text-left"
                  onMouseEnter={() => setHoveredLink('FAQ')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  FAQ
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === 'FAQ' ? 'w-full' : ''}`}></span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-emerald-400">Kontak</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center space-x-3 group hover:text-emerald-400 transition-colors duration-300">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>hello@jobhub.id</span>
              </div>
              <div className="flex items-center space-x-3 group hover:text-emerald-400 transition-colors duration-300">
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3 group hover:text-emerald-400 transition-colors duration-300">
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              &copy; 2025 SimHire. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-400">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-emerald-400 transition-colors duration-300 text-sm"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-emerald-400 transition-colors duration-300 text-sm"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-emerald-400 transition-colors duration-300 text-sm"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
