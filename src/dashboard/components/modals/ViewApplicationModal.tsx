import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, DollarSign, Calendar, Clock, FileText, CheckCircle2, AlertCircle, XCircle, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ApplicationData {
  id: string;
  position: string;
  company: {
    name: string;
    logo?: string;
  };
  appliedDate: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  progress: number;
  nextStep?: string;
  interviewDate?: string;
}

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationData | null;
}

const ViewApplicationModal: React.FC<ViewApplicationModalProps> = ({ isOpen, onClose, application }) => {
  if (!application) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'interview':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'accepted':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'interview':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Sedang Ditinjau';
      case 'interview':
        return 'Tahap Interview';
      case 'accepted':
        return 'Diterima';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const timeline = [
    {
      date: application.appliedDate,
      title: 'Lamaran Dikirim',
      description: 'Anda telah mengirimkan lamaran untuk posisi ini',
      completed: true
    },
    {
      date: application.status !== 'pending' ? 'Dalam proses' : 'Menunggu',
      title: 'Review HRD',
      description: 'Tim HRD sedang meninjau lamaran Anda',
      completed: application.status !== 'pending'
    },
    {
      date: application.interviewDate || 'Akan dijadwalkan',
      title: 'Interview',
      description: application.interviewDate ? 'Interview telah dijadwalkan' : 'Menunggu jadwal interview',
      completed: application.status === 'interview' || application.status === 'accepted'
    },
    {
      date: application.status === 'accepted' || application.status === 'rejected' ? 'Selesai' : 'Menunggu',
      title: 'Keputusan Akhir',
      description: application.status === 'accepted' ? 'Selamat! Anda diterima' : application.status === 'rejected' ? 'Mohon maaf, lamaran ditolak' : 'Menunggu keputusan final',
      completed: application.status === 'accepted' || application.status === 'rejected'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detail Lamaran</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang status lamaran Anda
          </DialogDescription>
        </DialogHeader>

        {}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
              {application.company.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{application.position}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{application.company.name}</span>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                <span className="font-semibold">{getStatusText(application.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Progress Lamaran</h4>
            <span className="text-sm font-medium text-gray-600">{application.progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${application.progress}%` }}
            ></div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Timeline Proses
          </h4>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    item.completed
                      ? 'bg-primary-100 border-primary-500'
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 h-12 ${
                      item.completed ? 'bg-primary-300' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.title}
                    </h5>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        {application.nextStep && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Langkah Selanjutnya</h4>
                <p className="text-sm text-blue-700">{application.nextStep}</p>
                {application.interviewDate && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-blue-700">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      Interview: {new Date(application.interviewDate).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Dilamar pada {new Date(application.appliedDate).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
          <div className="flex gap-2">
            {application.status === 'interview' && (
              <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
                Persiapan Interview
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;
