import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface Application {
  id: string;
  company: {
    name: string;
    logo?: string;
  };
  position: string;
  appliedDate: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  progress: number;
  nextStep?: string;
  interviewDate?: string;
}

const applications: Application[] = [
  {
    id: '1',
    company: { name: 'TechCorp', logo: '/api/placeholder/40/40' },
    position: 'Frontend Developer Intern',
    appliedDate: '2024-01-15',
    status: 'interview',
    progress: 75,
    nextStep: 'Technical Interview',
    interviewDate: '2024-01-20',
  },
  {
    id: '2',
    company: { name: 'DesignStudio', logo: '/api/placeholder/40/40' },
    position: 'UI/UX Design Intern',
    appliedDate: '2024-01-12',
    status: 'pending',
    progress: 25,
    nextStep: 'CV Review',
  },
  {
    id: '3',
    company: { name: 'MarketPro', logo: '/api/placeholder/40/40' },
    position: 'Digital Marketing Intern',
    appliedDate: '2024-01-10',
    status: 'accepted',
    progress: 100,
  },
  {
    id: '4',
    company: { name: 'DataCorp', logo: '/api/placeholder/40/40' },
    position: 'Data Analyst Intern',
    appliedDate: '2024-01-08',
    status: 'rejected',
    progress: 50,
  },
];

const ApplicationTracker = () => {
  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'interview':
        return <AlertCircle className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'interview':
        return 'Interview';
      case 'accepted':
        return 'Diterima';
      case 'rejected':
        return 'Ditolak';
    }
  };

  const getStatusVariant = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'interview':
        return 'status-interview';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
    }
  };

  return (
    <Card className="h-fit sticky top-24 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Building2 className="w-5 h-5 mr-2 text-primary" />
          Pelacak Aplikasi
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {applications.length} aplikasi dalam proses
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="border border-border rounded-lg p-4 space-y-3">
            {}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={app.company.logo} alt={app.company.name} />
                  <AvatarFallback className="text-xs">
                    {app.company.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {app.position}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {app.company.name}
                  </p>
                </div>
              </div>

              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 text-xs ${getStatusVariant(app.status)}`}
              >
                {getStatusIcon(app.status)}
                {getStatusText(app.status)}
              </Badge>
            </div>

            {}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium">{app.progress}%</span>
              </div>
              <Progress value={app.progress} className="h-2" />
            </div>

            {}
            {app.nextStep && (
              <div className="bg-accent/50 rounded-md p-2">
                <p className="text-xs text-accent-foreground">
                  <span className="font-medium">Langkah Selanjutnya:</span> {app.nextStep}
                </p>
                {app.interviewDate && (
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(app.interviewDate).toLocaleDateString('id-ID')}
                  </div>
                )}
              </div>
            )}

            {}
            {app.status === 'interview' && (
              <Button size="sm" variant="outline" className="w-full text-xs">
                Lihat Detail Interview
              </Button>
            )}

            {app.status === 'accepted' && (
              <Button size="sm" className="w-full text-xs btn-gradient">
                Konfirmasi Penerimaan
              </Button>
            )}
          </div>
        ))}

        {}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-accent/30 rounded-lg p-3">
              <div className="text-lg font-bold text-primary">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-xs text-muted-foreground">Diterima</div>
            </div>
            <div className="bg-warning/10 rounded-lg p-3">
              <div className="text-lg font-bold text-warning">
                {applications.filter(app => app.status === 'pending' || app.status === 'interview').length}
              </div>
              <div className="text-xs text-muted-foreground">Proses</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTracker;
