import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import { MOCK_JOBS, Job } from '@/lib/jobsData';
const DashboardJobsHome: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    workSchedule: [] as string[],
    experienceLevel: [] as string[],
    workStyle: [] as string[],
    salaryRange: [0, 50] as [number, number],
    remote: null as boolean | null
  });
  const handleSearch = (q: string) => setSearchQuery(q);
  const handleAddFilter = (f: string) => setActiveFilters(prev => prev.includes(f) ? prev : [...prev, f]);
  const handleRemoveFilter = (f: string) => setActiveFilters(prev => prev.filter(x => x !== f));
  const filteredJobs = useMemo(() => {
    let jobs = [...MOCK_JOBS];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    const locationFilters = activeFilters.filter(f => f.startsWith('location:')).map(f => f.replace('location:', ''));
    const skillFilters = activeFilters.filter(f => f.startsWith('skill:')).map(f => f.replace('skill:', ''));
    if (locationFilters.length) {
      jobs = jobs.filter(j => locationFilters.includes(j.location) || (locationFilters.includes('Remote') && j.remote));
    }
    if (skillFilters.length) {
      jobs = jobs.filter(j => skillFilters.every(sf => j.skills.includes(sf)));
    }
    if (filters.workSchedule.length) {
      jobs = jobs.filter(j => filters.workSchedule.includes(j.type));
    }
    if (filters.experienceLevel.length) {
      jobs = jobs.filter(j => filters.experienceLevel.includes(j.experienceLevel));
    }
    if (filters.workStyle.length) {
      jobs = jobs.filter(j => {
        const style = j.remote ? 'remote' : 'on-site';
        return filters.workStyle.includes(style);
      });
    }
    if (filters.remote !== null) {
      jobs = jobs.filter(j => j.remote === filters.remote);
    }
    if (filters.salaryRange) {
      const [minJuta, maxJuta] = filters.salaryRange;
      jobs = jobs.filter(j => {
        const jobMin = j.salary.min / 1_000_000;
        const jobMax = j.salary.max / 1_000_000;
        return jobMax >= minJuta && jobMin <= maxJuta;
      });
    }

    return jobs.slice(0, 8);
  }, [searchQuery, activeFilters, filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {}
      <div className="md:col-span-2 space-y-4">
        <SearchBar
          onSearch={handleSearch}
          activeFilters={activeFilters}
            onAddFilter={handleAddFilter}
            onRemoveFilter={handleRemoveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        />

        {}
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredJobs.map((job: Job, idx) => (
            <JobCard key={job.id} job={job} promo={idx === 2} />
          ))}
          {filteredJobs.length === 0 && (
            <div className="col-span-full text-center py-10 bg-white border border-gray-200 rounded-card">
              <p className="text-gray-600">Tidak ada hasil yang cocok dengan filter saat ini.</p>
              <button
                className="mt-4 text-sm text-primary-600 hover:underline"
                onClick={() => { setSearchQuery(''); setActiveFilters([]); setFilters({
                  workSchedule: [], experienceLevel: [], workStyle: [], salaryRange: [0,50], remote: null
                }); }}
              >Reset filter</button>
            </div>
          )}
        </div>
      </div>

      {}
      <div>
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          jobCount={filteredJobs.length}
        />
      </div>
    </div>
  );
};

export default DashboardJobsHome;
