import React, { useState } from 'react';
import { Filter, X, MapPin, Building2, Clock, DollarSign, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const FilterSidebar = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([0, 5000000]);
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    category: true,
    duration: true,
    salary: true,
    company: false,
    level: false,
  });

  const locations = [
    { id: 'jakarta', label: 'Jakarta', count: 245 },
    { id: 'bandung', label: 'Bandung', count: 89 },
    { id: 'surabaya', label: 'Surabaya', count: 67 },
    { id: 'yogyakarta', label: 'Yogyakarta', count: 54 },
    { id: 'medan', label: 'Medan', count: 32 },
    { id: 'semarang', label: 'Semarang', count: 28 },
  ];

  const categories = [
    { id: 'tech', label: 'Teknologi', count: 156, icon: '💻' },
    { id: 'marketing', label: 'Marketing', count: 98, icon: '📈' },
    { id: 'design', label: 'Desain', count: 76, icon: '🎨' },
    { id: 'finance', label: 'Keuangan', count: 54, icon: '💰' },
    { id: 'hr', label: 'SDM', count: 43, icon: '👥' },
    { id: 'sales', label: 'Penjualan', count: 38, icon: '🛍️' },
  ];

  const durations = [
    { id: '1-3', label: '1-3 Bulan', count: 123 },
    { id: '3-6', label: '3-6 Bulan', count: 198 },
    { id: '6-12', label: '6-12 Bulan', count: 87 },
    { id: 'flexible', label: 'Fleksibel', count: 45 },
  ];

  const companies = [
    { id: 'startup', label: 'Startup', count: 234 },
    { id: 'corporate', label: 'Korporasi', count: 189 },
    { id: 'government', label: 'Pemerintah', count: 45 },
    { id: 'ngo', label: 'NGO', count: 23 },
  ];

  const levels = [
    { id: 'fresh', label: 'Fresh Graduate', count: 287 },
    { id: 'student', label: 'Mahasiswa', count: 198 },
    { id: 'experienced', label: 'Berpengalaman', count: 76 },
  ];

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSalaryRange([0, 5000000]);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="h-fit sticky top-24 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="w-5 h-5 mr-2 text-primary" />
            Filter Magang
          </CardTitle>
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilters.map(filterId => {
              const allOptions = [...locations, ...categories, ...durations, ...companies, ...levels];
              const option = allOptions.find(opt => opt.id === filterId);
              return option ? (
                <Badge 
                  key={filterId} 
                  variant="secondary" 
                  className="flex items-center gap-1"
                >
                  {option.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => toggleFilter(filterId)}
                  />
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
        {}
        <Collapsible open={expandedSections.location} onOpenChange={() => toggleSection('location')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Lokasi</span>
              </div>
              {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {locations.map(location => (
              <div key={location.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={location.id}
                    checked={activeFilters.includes(location.id)}
                    onCheckedChange={() => toggleFilter(location.id)}
                  />
                  <label 
                    htmlFor={location.id} 
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {location.label}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">{location.count}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {}
        <Collapsible open={expandedSections.category} onOpenChange={() => toggleSection('category')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Bidang</span>
              </div>
              {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {categories.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={activeFilters.includes(category.id)}
                    onCheckedChange={() => toggleFilter(category.id)}
                  />
                  <label 
                    htmlFor={category.id} 
                    className="text-sm text-foreground cursor-pointer flex items-center"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {}
        <Collapsible open={expandedSections.duration} onOpenChange={() => toggleSection('duration')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Durasi</span>
              </div>
              {expandedSections.duration ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {durations.map(duration => (
              <div key={duration.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={duration.id}
                    checked={activeFilters.includes(duration.id)}
                    onCheckedChange={() => toggleFilter(duration.id)}
                  />
                  <label 
                    htmlFor={duration.id} 
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {duration.label}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">{duration.count}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {}
        <Collapsible open={expandedSections.salary} onOpenChange={() => toggleSection('salary')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Range Gaji</span>
              </div>
              {expandedSections.salary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-3">
            <div className="px-2">
              <Slider
                value={salaryRange}
                onValueChange={setSalaryRange}
                max={5000000}
                min={0}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{formatCurrency(salaryRange[0])}</span>
                <span>{formatCurrency(salaryRange[1])}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {}
        <Collapsible open={expandedSections.company} onOpenChange={() => toggleSection('company')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Tipe Perusahaan</span>
              </div>
              {expandedSections.company ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {companies.map(company => (
              <div key={company.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={company.id}
                    checked={activeFilters.includes(company.id)}
                    onCheckedChange={() => toggleFilter(company.id)}
                  />
                  <label 
                    htmlFor={company.id} 
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {company.label}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">{company.count}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
