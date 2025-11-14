import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Award, MapPin, DollarSign, Filter, X, ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    workSchedule: string[];
    experienceLevel: string[];
    workStyle: string[];
    salaryRange: [number, number];
    remote: boolean | null;
  };
  onFiltersChange: (filters: any) => void;
  jobCount: number;
}

const LABELS = {
  workSchedule: { 
    'full-time': 'Penuh Waktu', 
    'part-time': 'Paruh Waktu', 
    'contract': 'Kontrak', 
    'internship': 'Magang' 
  } as const,
  experienceLevel: { 
    'entry': 'Entry Level', 
    'mid': 'Mid Level', 
    'senior': 'Senior Level' 
  } as const,
  workStyle: { 
    'remote': 'Remote', 
    'hybrid': 'Hibrida', 
    'on-site': 'Di lokasi' 
  } as const
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFiltersChange, jobCount }) => {
  const [salaryValues, setSalaryValues] = useState<number[]>(filters.salaryRange);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    workSchedule: true,
    experience: true,
    workStyle: true,
    salary: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleWorkScheduleChange = (type: string, checked: boolean) => {
    const newSchedules = checked
      ? [...filters.workSchedule, type]
      : filters.workSchedule.filter(s => s !== type);

    onFiltersChange({
      ...filters,
      workSchedule: newSchedules
    });
  };

  const handleExperienceChange = (level: string, checked: boolean) => {
    const newLevels = checked
      ? [...filters.experienceLevel, level]
      : filters.experienceLevel.filter(l => l !== level);

    onFiltersChange({
      ...filters,
      experienceLevel: newLevels
    });
  };

  const handleWorkStyleChange = (style: string, checked: boolean) => {
    const newStyles = checked
      ? [...filters.workStyle, style]
      : filters.workStyle.filter(s => s !== style);

    onFiltersChange({
      ...filters,
      workStyle: newStyles
    });
  };

  const handleSalaryChange = (values: number[]) => {
    setSalaryValues(values);
    onFiltersChange({
      ...filters,
      salaryRange: [values[0], values[1]] as [number, number]
    });
  };

  const clearAllFilters = () => {
    setSalaryValues([0, 50]);
    onFiltersChange({
      workSchedule: [],
      experienceLevel: [],
      workStyle: [],
      salaryRange: [0, 50] as [number, number],
      remote: null
    });
  };

  const formatSalary = (amount: number) => {
    if (amount >= 50) return '50+ Juta';
    return `${amount} Juta`;
  };

  const activeFiltersCount = 
    filters.workSchedule.length + 
    filters.experienceLevel.length + 
    filters.workStyle.length + 
    (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 50 ? 1 : 0) + 
    (filters.remote !== null ? 1 : 0);
  const MobileFilterButton = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="lg:hidden fixed bottom-6 right-6 z-50 tap-target bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
    >
      <Filter className="w-5 h-5" />
      <span className="font-semibold">Filter</span>
      {activeFiltersCount > 0 && (
        <Badge className="bg-white text-primary-600 font-bold">{activeFiltersCount}</Badge>
      )}
    </button>
  );
  const MobileOverlay = () => (
    <>
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );

  const FilterContent = () => (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] sm:max-h-none">

        {}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 shadow-lg sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">Filter Pencarian</h3>
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-white hover:bg-white/20 h-8 text-xs sm:text-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden tap-target w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {}
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-xs sm:text-sm font-medium">{jobCount} lowongan tersedia</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                {activeFiltersCount} aktif
              </Badge>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <button
            onClick={() => toggleSection('workSchedule')}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Tipe Pekerjaan</h4>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.workSchedule ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.workSchedule && (
            <div className="space-y-2">
              {Object.entries(LABELS.workSchedule).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Checkbox
                    id={`work-schedule-${key}`}
                    checked={filters.workSchedule.includes(key)}
                    onCheckedChange={(checked) => handleWorkScheduleChange(key, checked as boolean)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label htmlFor={`work-schedule-${key}`} className="text-xs sm:text-sm text-gray-700 cursor-pointer flex-1">
                    {label}
                  </label>
                  {filters.workSchedule.includes(key) && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">✓</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <button
            onClick={() => toggleSection('experience')}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Tingkat Pengalaman</h4>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.experience ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.experience && (
            <div className="space-y-2">
              {Object.entries(LABELS.experienceLevel).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                  <Checkbox
                    id={`experience-${key}`}
                    checked={filters.experienceLevel.includes(key)}
                    onCheckedChange={(checked) => handleExperienceChange(key, checked as boolean)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label htmlFor={`experience-${key}`} className="text-xs sm:text-sm text-gray-700 cursor-pointer flex-1">
                    {label}
                  </label>
                  {filters.experienceLevel.includes(key) && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">✓</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <button
            onClick={() => toggleSection('workStyle')}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Gaya Kerja</h4>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.workStyle ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.workStyle && (
            <div className="space-y-2">
              {Object.entries(LABELS.workStyle).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors">
                  <Checkbox
                    id={`work-style-${key}`}
                    checked={filters.workStyle.includes(key)}
                    onCheckedChange={(checked) => handleWorkStyleChange(key, checked as boolean)}
                    className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <label htmlFor={`work-style-${key}`} className="text-xs sm:text-sm text-gray-700 cursor-pointer flex-1">
                    {label}
                  </label>
                  {filters.workStyle.includes(key) && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">✓</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <button
            onClick={() => toggleSection('salary')}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Rentang Gaji</h4>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.salary ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.salary && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                  <span className="text-green-700">Rp {formatSalary(salaryValues[0])}</span>
                  <span className="text-green-500">→</span>
                  <span className="text-green-700">Rp {formatSalary(salaryValues[1])}</span>
                </div>
              </div>

              <Slider
                value={salaryValues}
                onValueChange={handleSalaryChange}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />

              {}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSalaryChange([0, 10])}
                  className="text-xs border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                >
                  &lt; 10jt
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSalaryChange([10, 25])}
                  className="text-xs border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                >
                  10-25jt
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSalaryChange([25, 40])}
                  className="text-xs border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                >
                  25-40jt
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSalaryChange([40, 50])}
                  className="text-xs border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                >
                  &gt; 40jt
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
  );

  return (
    <>
      <MobileFilterButton />
      <MobileOverlay />

      {}
      <div className="hidden lg:block w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 overflow-y-auto sticky top-0 h-screen">
        <FilterContent />
      </div>

      {}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-full sm:w-96 bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <FilterContent />
      </div>
    </>
  );
};

export default FilterSidebar;
