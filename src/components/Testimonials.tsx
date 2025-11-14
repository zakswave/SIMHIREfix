import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const navigate = useNavigate();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            testimonials.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 250);
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

  const testimonials = [
    {
      name: "Sarah Wijaya",
      role: "Software Developer",
      company: "Tech Startup Jakarta",
      image: "https://example.com",
      content: "Platform ini benar-benar game changer! Simulasi kerjanya sangat realistic dan fitur persiapan interview membantu saya lolos interview di 3 perusahaan sekaligus.",
      rating: 5,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      name: "Ahmad Rizky",
      role: "Digital Marketing Specialist",
      company: "E-commerce Unicorn",
      image: "https://example.com",
      content: "Simulasi kerjanya realistic banget! Dari hasil simulasi dan portfolio saya, langsung ditawarin magang dan akhirnya full-time. Auto-CV generator juga sangat membantu!",
      rating: 5,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Rina Sari",
      role: "HR Manager",
      company: "Multinational Corp",
      image: "https://example.com",
      content: "Sebagai recruiter, dashboard evaluasinya sangat membantu. Kandidat yang datang sudah terfilter dengan baik dan sesuai kebutuhan kami.",
      rating: 5,
      color: "from-emerald-600 to-emerald-700"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #10B981 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, #10B981 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, #065F46 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Apa Kata Mereka?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Ribuan kandidat dan ratusan perusahaan telah merasakan manfaat platform kami
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 relative shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 border border-gray-100 hover:border-emerald-200 overflow-hidden ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}
              style={{ transitionDelay: `${index * 250}ms` }}
            >
              {}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-6 md:right-6 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-300 pointer-events-none">
                <Quote className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              </div>

              <div className="flex items-center mb-8 relative z-10">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-20 h-20 lg:w-16 lg:h-16 rounded-full object-cover mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg lg:text-base group-hover:text-emerald-600 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-1">{testimonial.role}</p>
                  <p className={`bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent text-sm font-medium`}>
                    {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="flex mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-125 transition-all duration-300`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed italic text-lg lg:text-base group-hover:text-gray-800 transition-colors duration-300 relative z-10">
                "{testimonial.content}"
              </p>

              {}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${testimonial.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
            </div>
          ))}
        </div>

        {}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="tap-target w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-emerald-500/25"
            >
              Bergabung Sekarang
            </button>
            <button 
              onClick={() => {
                const testimonialsElement = sectionRef.current;
                if (testimonialsElement) {
                  testimonialsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="tap-target w-full sm:w-auto border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-500 transform hover:scale-105"
            >
              Lihat Semua Testimoni
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
