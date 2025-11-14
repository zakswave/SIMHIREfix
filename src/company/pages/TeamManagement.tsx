import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Crown, User, Plus, MoreVertical, Trash2, UserCog, X, Target, Users as UsersIcon, AlertTriangle } from 'lucide-react';
import { getTeamMembers, addTeamMember } from '@/lib/company/data';
import { TeamMember } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GradientCard } from '@/components/ui/gradient-card';

const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'recruiter' as 'owner' | 'recruiter' | 'interviewer' | 'viewer'
  });

  useEffect(() => {
    setTeamMembers(getTeamMembers());
  }, []);

  const handleInviteMember = () => {
    if (!inviteForm.email || !inviteForm.name) {
      toast.error('Harap lengkapi email dan nama');
      return;
    }

    try {
      const newMember = addTeamMember({
        userId: `user-${Date.now()}`,
        name: inviteForm.name,
        email: inviteForm.email,
        role: inviteForm.role,
        permissions: getRolePermissions(inviteForm.role)
      });

      setTeamMembers([...teamMembers, newMember]);
      setInviteForm({ email: '', name: '', role: 'recruiter' });
      setShowInviteModal(false);
      toast.success('Undangan berhasil dikirim');
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error('Gagal mengirim undangan');
    }
  };

  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['jobs.read', 'jobs.write', 'applications.read', 'applications.write', 'candidates.read', 'team.manage', 'settings.write'];
      case 'recruiter':
        return ['jobs.read', 'jobs.write', 'applications.read', 'applications.write', 'candidates.read'];
      case 'interviewer':
        return ['applications.read', 'evaluations.read', 'evaluations.write'];
      default:
        return [];
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'owner': return 'Administrator';
      case 'recruiter': return 'Recruiter';
      case 'interviewer': return 'Interviewer';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'owner':
        return <Crown className="w-4 h-4" />;
      case 'recruiter': return <Shield className="w-4 h-4" />;
      case 'interviewer': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'recruiter': return 'bg-blue-100 text-blue-800';
      case 'interviewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Menunggu';
      case 'inactive': return 'Tidak Aktif';
      default: return status;
    }
  };

  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (selectedMember) {
      setTeamMembers(teamMembers.filter(m => m.id !== selectedMember.id));
      toast.success(`${selectedMember.name} berhasil dihapus dari tim`);
      setShowDeleteModal(false);
      setSelectedMember(null);
    }
  };

  const handleChangeRole = (member: TeamMember, newRole: string) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === member.id ? { ...m, role: newRole as TeamMember['role'] } : m
    ));
    toast.success(`Role ${member.name} diubah menjadi ${getRoleLabel(newRole)}`);
    setOpenMenuId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Manajemen Tim
              </h1>
            </div>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Kelola anggota tim dan hak akses
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium shadow-xl hover:shadow-2xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Undang Anggota Tim
          </motion.button>
        </motion.div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GradientCard
            title="Administrator"
            value={teamMembers.filter(m => m.role === 'owner').length.toString()}
            subtitle="Full access"
            icon={Crown}
            gradient="from-purple-500 to-pink-500"
            delay={0}
          />
          <GradientCard
            title="Recruiter"
            value={teamMembers.filter(m => m.role === 'recruiter').length.toString()}
            subtitle="Manage jobs"
            icon={Shield}
            gradient="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <GradientCard
            title="Interviewer"
            value={teamMembers.filter(m => m.role === 'interviewer').length.toString()}
            subtitle="Conduct interviews"
            icon={User}
            gradient="from-green-500 to-emerald-500"
            delay={0.2}
          />
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Anggota Tim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1">{getRoleLabel(member.role)}</span>
                      </Badge>
                      <Badge className={getStatusColor(member.status)}>
                        {getStatusLabel(member.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Bergabung:</p>
                      <p className="text-sm font-medium">{new Date(member.invitedAt).toLocaleDateString('id-ID')}</p>
                    </div>

                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>

                      {}
                      {openMenuId === member.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
                          <div className="py-2">
                            <button
                              onClick={() => handleChangeRole(member, member.role === 'recruiter' ? 'interviewer' : 'recruiter')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <UserCog className="w-4 h-4" />
                              Ubah Role
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              onClick={() => handleDeleteMember(member)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus dari Tim
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {teamMembers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Anggota Tim</h3>
                  <p className="text-gray-600 mb-4">Undang anggota tim pertama Anda untuk berkolaborasi</p>
                  <Button onClick={() => setShowInviteModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Undang Anggota Pertama
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Referensi Hak Akses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-primary-600" />
                  <h4 className="font-semibold">Administrator</h4>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Akses penuh ke semua fitur</li>
                  <li>• Kelola tim dan pengaturan</li>
                  <li>• Kelola lowongan dan aplikasi</li>
                  <li>• Lihat semua kandidat</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-accent-blue" />
                  <h4 className="font-semibold">Recruiter</h4>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Kelola lowongan kerja</li>
                  <li>• Lihat dan kelola aplikasi</li>
                  <li>• Akses database kandidat</li>
                  <li>• Tidak bisa kelola tim</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold">Interviewer</h4>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Lihat aplikasi yang ditugaskan</li>
                  <li>• Buat evaluasi interview</li>
                  <li>• Akses terbatas ke kandidat</li>
                  <li>• Tidak bisa kelola lowongan</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <AnimatePresence>
          {showInviteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowInviteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Undang Anggota Tim</h2>
                    </div>
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({...inviteForm, role: e.target.value as TeamMember['role']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="recruiter">Recruiter</option>
                      <option value="interviewer">Interviewer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleInviteMember}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Kirim Undangan
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <AnimatePresence>
          {showDeleteModal && selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              >
                <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Hapus Anggota</h2>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Yakin ingin menghapus anggota ini?
                      </h3>
                      <p className="text-sm text-gray-600">
                        <strong>{selectedMember.name}</strong> akan dihapus dari tim dan kehilangan semua akses.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 gap-2"
                      onClick={confirmDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus Anggota
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamManagement;
