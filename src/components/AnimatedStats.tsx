import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const AnimatedStats = () => {
  const [visibleStats, setVisibleStats] = useState<number[]>([]);
  const [animatedNumbers, setAnimatedNumbers] = useState<{[key: number]: number}>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => [
    {
      stat: "1K+",
      title: "Kandidat Aktif",
      description: "Talenta berkualitas siap kerja"
    },
    {
      stat: "200+",
      title: "Perusahaan Partner",
      description: "Dari startup hingga korporasi"
    },
    {
      stat: "85%",
      title: "Success Rate",
      description: "Kandidat berhasil diterima kerja"
    }
  ], []);

  const animateNumber = useCallback((index: number, target: string) => {
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
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((_, index) => {
              setTimeout(() => {
                setVisibleStats(prev => [...prev, index]);
                animateNumber(index, stats[index].stat);
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
  }, [stats, animateNumber]);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 text-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`transition-all duration-700 ${
              visibleStats.includes(index) 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95'
            }`}
            style={{ transitionDelay: `${index * 300}ms` }}
          >
            <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">
              {visibleStats.includes(index) ? (
                stat.stat.includes('%') ? `${animatedNumbers[index] || 0}%` :
                stat.stat.includes('K') ? `${(((animatedNumbers[index] || 0) / 1000).toFixed(1))}K+` :
                stat.stat.includes('+') ? `${animatedNumbers[index] || 0}+` :
                stat.stat
              ) : '0'}
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              {stat.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimatedStats;
