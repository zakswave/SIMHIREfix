import React from 'react';
import { Bookmark, Building2, Calendar, MapPin, Users } from 'lucide-react';
import { Job } from '@/lib/jobsData';

interface JobCardProps {
  promo?: boolean;
  job?: Job;
}

const JobCard: React.FC<JobCardProps> = ({ promo, job }) => {
  if (promo) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold">Dipromosikan: SimHire Pro</h3>
        <p className="text-sm text-purple-100 mt-1">Dapatkan akses premium ke simulasi kerja dan persiapan wawancara</p>
        <button className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium">Pelajari Lebih Lanjut</button>
      </div>
    );
  }
  const title = job?.title || 'Posisi Profesional';
  const company = job?.company || 'Perusahaan XYZ';
  const location = job?.location || (job?.remote ? 'Remote' : 'Jakarta');
  const skills = job?.skills?.slice(0, 4) || ['Skill A', 'Skill B', 'Skill C', 'Skill D'];
  const applicants = job?.applicationCount ?? 0;
  const salaryText = job ?
    `Rp ${(job.salary.min/1_000_000).toFixed(0)} - ${(job.salary.max/1_000_000).toFixed(0)} Jt` :
    'Rp 10 - 15 Jt';
  const postedLabel = job?.posted ? 'Baru' : '2 hari lalu';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-gray-900 font-semibold line-clamp-1">{title}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 flex-wrap">
            <Building2 size={16} />
            <span>{company}</span>
            <span className="mx-1 hidden sm:inline">•</span>
            <MapPin size={16} className="hidden sm:block" />
            <span className="hidden sm:inline">{location}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-700"><Bookmark size={18} /></button>
      </div>
      <div className="mt-3 text-purple-700 font-semibold">{salaryText}</div>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1"><Calendar size={16} /> {postedLabel}</div>
        <div className="flex items-center gap-1"><Users size={16} /> {applicants} pelamar</div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((tag) => (
          <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{tag}</span>
        ))}
      </div>
      <button className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium">Lamar Sekarang</button>
    </div>
  );
};

export default JobCard;
