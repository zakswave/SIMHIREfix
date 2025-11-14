import { useState, useEffect } from 'react';
import { Calendar, Filter, User, Briefcase, UserCheck, FileText, Mail, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
const MOCK_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'job_created',
    title: 'Lowongan baru dibuat',
    description: 'Senior Frontend Developer di Engineering',
    actor: 'HR Manager',
    timestamp: '2024-09-25T14:30:00Z',
    details: {
      jobId: 'job-1',
      department: 'Engineering'
    }
  },
  {
    id: 'act-2',
    type: 'application_received',
    title: 'Aplikasi baru diterima',
    description: 'Budi Santoso melamar untuk Senior Frontend Developer',
    actor: 'System',
    timestamp: '2024-09-25T10:15:00Z',
    details: {
      candidateName: 'Budi Santoso',
      jobTitle: 'Senior Frontend Developer'
    }
  },
  {
    id: 'act-3',
    type: 'application_status_changed',
    title: 'Status aplikasi diubah',
    description: 'Budi Santoso dipindahkan ke tahap Interview',
    actor: 'HR Manager',
    timestamp: '2024-09-24T16:45:00Z',
    details: {
      candidateName: 'Budi Santoso',
      fromStage: 'screening',
      toStage: 'interview'
    }
  },
  {
    id: 'act-4',
    type: 'team_member_invited',
    title: 'Anggota tim diundang',
    description: 'Sarah Connor diundang sebagai Interviewer',
    actor: 'Admin',
    timestamp: '2024-09-24T09:20:00Z',
    details: {
      memberName: 'Sarah Connor',
      role: 'interviewer'
    }
  },
  {
    id: 'act-5',
    type: 'evaluation_completed',
    title: 'Evaluasi selesai',
    description: 'Interview evaluation untuk Ahmad Rahman',
    actor: 'Tech Lead',
    timestamp: '2024-09-23T14:00:00Z',
    details: {
      candidateName: 'Ahmad Rahman',
      score: 8.5
    }
  },
  {
    id: 'act-6',
    type: 'job_published',
    title: 'Lowongan dipublikasikan',
    description: 'UX/UI Designer berhasil dipublikasikan',
    actor: 'HR Manager',
    timestamp: '2024-09-23T11:30:00Z',
    details: {
      jobTitle: 'UX/UI Designer',
      department: 'Design'
    }
  },
  {
    id: 'act-7',
    type: 'contract_created',
    title: 'Kontrak escrow dibuat',
    description: 'Kontrak untuk Dewi Sartika sebagai Data Scientist',
    actor: 'HR Manager',
    timestamp: '2024-09-22T15:45:00Z',
    details: {
      candidateName: 'Dewi Sartika',
      jobTitle: 'Data Scientist',
      amount: 25000000
    }
  },
  {
    id: 'act-8',
    type: 'settings_updated',
    title: 'Pengaturan diperbarui',
    description: 'Profile perusahaan diperbarui',
    actor: 'Admin',
    timestamp: '2024-09-22T08:15:00Z',
    details: {
      section: 'company_profile'
    }
  }
];

const CompanyActivity: React.FC = () => {
  const [activities] = useState(MOCK_ACTIVITIES);
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('7days');
  const [filteredActivities, setFilteredActivities] = useState(MOCK_ACTIVITIES);

  useEffect(() => {
    let filtered = activities;
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }
    const now = new Date();
    const filterDate = new Date();

    switch (dateFilter) {
      case '1day':
        filterDate.setDate(now.getDate() - 1);
        break;
      case '7days':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        filterDate.setDate(now.getDate() - 30);
        break;
      default:
        filterDate.setFullYear(2000);
    }

    filtered = filtered.filter(activity => new Date(activity.timestamp) >= filterDate);

    setFilteredActivities(filtered);
  }, [activities, filterType, dateFilter]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'job_created':
      case 'job_published':
        return <Briefcase className="w-4 h-4" />;
      case 'application_received':
      case 'application_status_changed':
        return <UserCheck className="w-4 h-4" />;
      case 'team_member_invited':
        return <User className="w-4 h-4" />;
      case 'evaluation_completed':
        return <FileText className="w-4 h-4" />;
      case 'contract_created':
        return <Mail className="w-4 h-4" />;
      case 'settings_updated':
        return <Settings className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'job_created':
      case 'job_published':
        return 'bg-blue-100 text-blue-800';
      case 'application_received':
        return 'bg-green-100 text-green-800';
      case 'application_status_changed':
        return 'bg-yellow-100 text-yellow-800';
      case 'team_member_invited':
        return 'bg-purple-100 text-purple-800';
      case 'evaluation_completed':
        return 'bg-indigo-100 text-indigo-800';
      case 'contract_created':
        return 'bg-primary-100 text-primary-800';
      case 'settings_updated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'job_created': return 'Lowongan Dibuat';
      case 'job_published': return 'Lowongan Dipublikasi';
      case 'application_received': return 'Aplikasi Baru';
      case 'application_status_changed': return 'Status Aplikasi';
      case 'team_member_invited': return 'Tim Diundang';
      case 'evaluation_completed': return 'Evaluasi Selesai';
      case 'contract_created': return 'Kontrak Dibuat';
      case 'settings_updated': return 'Pengaturan Diperbarui';
      default: return type;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return activityTime.toLocaleDateString('id-ID');
  };

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas</h1>
        <p className="text-gray-600">Timeline aktivitas rekrutmen dan audit trail</p>
      </div>

      {}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
            >
              <option value="all">Semua Aktivitas</option>
              <option value="job_created">Lowongan Dibuat</option>
              <option value="application_received">Aplikasi Baru</option>
              <option value="application_status_changed">Status Aplikasi</option>
              <option value="team_member_invited">Tim Diundang</option>
              <option value="evaluation_completed">Evaluasi</option>
              <option value="contract_created">Kontrak</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
            >
              <option value="1day">24 Jam Terakhir</option>
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="all">Semua Waktu</option>
            </select>

            <div className="flex-1"></div>

            <div className="text-sm text-gray-500">
              Menampilkan {filteredActivities.length} aktivitas
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {}
                {index < filteredActivities.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                )}

                <div className="flex gap-4">
                  {}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>

                  {}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getActivityTypeLabel(activity.type)}
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-2">{activity.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{activity.actor}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(activity.timestamp)}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {}
                    {activity.details && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">
                          {activity.type === 'application_status_changed' && (
                            <div>
                              <span className="font-medium">{activity.details.candidateName}</span> dipindahkan dari{' '}
                              <Badge variant="outline" className="mx-1">{activity.details.fromStage}</Badge> ke{' '}
                              <Badge variant="outline" className="mx-1">{activity.details.toStage}</Badge>
                            </div>
                          )}

                          {activity.type === 'evaluation_completed' && (
                            <div>
                              Skor: <span className="font-medium">{activity.details.score}/10</span> untuk{' '}
                              <span className="font-medium">{activity.details.candidateName}</span>
                            </div>
                          )}

                          {activity.type === 'contract_created' && (
                            <div>
                              Nilai kontrak: <span className="font-medium">Rp {activity.details.amount?.toLocaleString('id-ID')}</span>
                            </div>
                          )}

                          {(activity.type === 'job_created' || activity.type === 'job_published') && (
                            <div>
                              Departemen: <span className="font-medium">{activity.details.department}</span>
                            </div>
                          )}

                          {activity.type === 'team_member_invited' && (
                            <div>
                              Role: <span className="font-medium capitalize">{activity.details.role}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Aktivitas</h3>
                <p className="text-gray-600">
                  Tidak ada aktivitas yang sesuai dengan filter yang dipilih
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setFilterType('all');
                    setDateFilter('7days');
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-blue">
                {activities.filter(a => a.type.includes('job')).length}
              </p>
              <p className="text-sm text-gray-600">Aktivitas Lowongan</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.type.includes('application')).length}
              </p>
              <p className="text-sm text-gray-600">Aktivitas Aplikasi</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {activities.filter(a => a.type === 'team_member_invited').length}
              </p>
              <p className="text-sm text-gray-600">Tim Diundang</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {activities.filter(a => a.type === 'evaluation_completed').length}
              </p>
              <p className="text-sm text-gray-600">Evaluasi Selesai</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyActivity;
