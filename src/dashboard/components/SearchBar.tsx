import React, { useState } from 'react';
import { Search, X, MapPin, Briefcase } from 'lucide-react';
import { JOB_LOCATIONS, JOB_SKILLS } from '@/lib/jobsData';

interface SearchBarProps {
  onSearch: (query: string) => void;
  activeFilters: string[];
  onAddFilter: (filter: string) => void;
  onRemoveFilter: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  searchQuery,
  onSearchChange
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  const handleAddFilter = (type: 'location' | 'skill', value: string) => {
    const filterKey = type === 'location' ? `location:${value}` : `skill:${value}`;
    if (!activeFilters.includes(filterKey)) {
      onAddFilter(filterKey);
    }
    setShowLocationDropdown(false);
    setShowSkillDropdown(false);
  };

  const getFilterDisplay = (filter: string) => {
    if (filter.startsWith('location:')) {
      return filter.replace('location:', '');
    }
    if (filter.startsWith('skill:')) {
      return filter.replace('skill:', '');
    }
    return filter;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
      <form onSubmit={handleSearch}>
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Cari berdasarkan peran, perusahaan, atau skill..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button 
            type="submit"
            className="ml-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Cari
          </button>
        </div>
      </form>

      {}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-sm text-gray-600">Filter cepat:</span>

        {}
        <div className="relative">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="inline-flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
          >
            <MapPin size={12} />
            Lokasi
          </button>
          {showLocationDropdown && (
            <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 max-h-48 overflow-y-auto">
              {JOB_LOCATIONS.map((location) => (
                <button
                  key={location}
                  onClick={() => handleAddFilter('location', location)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {}
        <div className="relative">
          <button
            onClick={() => setShowSkillDropdown(!showSkillDropdown)}
            className="inline-flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
          >
            <Briefcase size={12} />
            Skill
          </button>
          {showSkillDropdown && (
            <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 max-h-48 overflow-y-auto">
              {JOB_SKILLS.slice(0, 20).map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleAddFilter('skill', skill)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm text-gray-600">Filter aktif:</span>
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1 text-sm bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full"
            >
              {getFilterDisplay(filter)}
              <button 
                onClick={() => onRemoveFilter(filter)}
                className="hover:text-purple-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <button
            onClick={() => activeFilters.forEach(onRemoveFilter)}
            className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
          >
            Hapus semua
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
