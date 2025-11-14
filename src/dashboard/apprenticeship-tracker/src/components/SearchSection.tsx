import React, { useState } from 'react';
import { Search, MapPin, Filter, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SearchSection = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  return (
    <section className="bg-gradient-hero py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Temukan Magang Impianmu
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-2">
            Ribuan kesempatan magang dari perusahaan terpercaya di seluruh Indonesia
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
              ✨ 500+ Perusahaan Partner
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
              🚀 1000+ Posisi Tersedia
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
              💼 80% Tingkat Penempatan
            </Badge>
          </div>
        </div>

        {}
        <Card className="max-w-5xl mx-auto shadow-lg animate-slide-up">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Posisi atau kata kunci..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-12 h-12 text-base"
                  />
                </div>
              </div>

              {}
              <div>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Lokasi" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jakarta">Jakarta</SelectItem>
                    <SelectItem value="bandung">Bandung</SelectItem>
                    <SelectItem value="surabaya">Surabaya</SelectItem>
                    <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                    <SelectItem value="medan">Medan</SelectItem>
                    <SelectItem value="semarang">Semarang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {}
              <div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <Filter className="w-5 h-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Bidang" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">Teknologi</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Keuangan</SelectItem>
                    <SelectItem value="design">Desain</SelectItem>
                    <SelectItem value="hr">SDM</SelectItem>
                    <SelectItem value="sales">Penjualan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {}
              <div>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Durasi" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3 Bulan</SelectItem>
                    <SelectItem value="3-6">3-6 Bulan</SelectItem>
                    <SelectItem value="6-12">6-12 Bulan</SelectItem>
                    <SelectItem value="flexible">Fleksibel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {}
              <div>
                <Button className="w-full h-12 btn-gradient text-base font-medium">
                  <Search className="w-5 h-5 mr-2" />
                  Cari Magang
                </Button>
              </div>
            </div>

            {}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-foreground">Status Gaji:</span>
                <div className="flex space-x-2">
                  <Button
                    variant={paymentStatus === 'paid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentStatus(paymentStatus === 'paid' ? '' : 'paid')}
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Berbayar
                  </Button>
                  <Button
                    variant={paymentStatus === 'unpaid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentStatus(paymentStatus === 'unpaid' ? '' : 'unpaid')}
                  >
                    Tidak Berbayar
                  </Button>
                  <Button
                    variant={paymentStatus === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentStatus('')}
                  >
                    Semua
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <div className="text-center mt-8">
          <p className="text-primary-foreground/80 mb-3">Pencarian Populer:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['UI Designer', 'Data Analyst', 'Content Writer', 'Digital Marketing', 'Frontend Developer'].map((keyword) => (
              <Button
                key={keyword}
                variant="ghost"
                size="sm"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20 border border-white/30"
                onClick={() => setSearchKeyword(keyword)}
              >
                {keyword}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
