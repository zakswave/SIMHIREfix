import { useState, useEffect } from 'react';
import { getTopProjects, PortfolioProject } from '@/lib/portfolio';
import { loadSimulasiResults } from '@/lib/storage';
import { useUser } from '../../context/UserContext';
import { Pencil, Save, User, Mail, Key, ShieldCheck, X, CheckCircle2, Award, Briefcase, MapPin, Globe, Github, Linkedin, Trophy, Star, Palette, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile: React.FC = () => {
  const { user, updateProfile } = useUser();
  const [topProjects, setTopProjects] = useState<PortfolioProject[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: user?.email || '', passwordConfirm: '' });
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [feedback, setFeedback] = useState<{type:'success'|'error'; msg:string}|null>(null);
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [local, setLocal] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    skills: (user?.skills || []).join(', '),
    linkedin: user?.social?.linkedin || '',
    github: user?.social?.github || '',
    dribbble: user?.social?.dribbble || ''
  });

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="p-6 bg-white rounded-card border border-gray-200 text-center space-y-4">
          <User className="w-10 h-10 mx-auto text-gray-400" />
          <h2 className="text-xl font-semibold">Belum Masuk</h2>
          <p className="text-gray-600">Silakan login untuk melihat profil.</p>
        </div>
      </div>
    );
  }

  const pushFeedback = (type:'success'|'error', msg:string) => {
    setFeedback({type,msg});
    setTimeout(()=> setFeedback(null), 3000);
  };

  const onSave = () => {
    updateProfile({
      name: local.name,
      headline: local.headline,
      bio: local.bio,
      location: local.location,
      website: local.website,
      skills: local.skills.split(',').map(s => s.trim()).filter(Boolean),
      social: {
        linkedin: local.linkedin,
        github: local.github,
        dribbble: local.dribbble,
      }
    });
    setIsEditing(false);
    pushFeedback('success','Profil berhasil diperbarui');
  };
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      pushFeedback('error', 'Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setResumeFile(base64);
      localStorage.setItem('simhire_user_resume', base64);
      localStorage.setItem('simhire_user_resume_name', file.name);
      pushFeedback('success', `Resume "${file.name}" berhasil diupload`);
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    const savedResume = localStorage.getItem('simhire_user_resume');
    if (savedResume) {
      setResumeFile(savedResume);
    }
  }, []);
  const avatarColors = [
    'bg-gradient-to-br from-blue-500 to-cyan-600',
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-green-500 to-emerald-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-indigo-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-rose-600',
    'bg-gradient-to-br from-teal-500 to-cyan-600',
    'bg-gradient-to-br from-yellow-500 to-orange-600',
  ];

  const changeAvatarColor = (color: string) => {
    updateProfile({ avatarColor: color });
    setShowAvatarPicker(false);
    pushFeedback('success', 'Warna avatar diperbarui');
  };

  useEffect(()=>{
    try { setTopProjects(getTopProjects()); } catch {  }
  }, [isEditing]);

  const submitEmailChange = () => {
    if(!emailForm.email.includes('@')) {
      return pushFeedback('error','Email tidak valid');
    }
    if(emailForm.passwordConfirm.length < 4) {
      return pushFeedback('error','Password konfirmasi terlalu pendek (mock)');
    }
    updateProfile({ email: emailForm.email });
    pushFeedback('success','Email berhasil diganti (mock)');
    setEmailForm(f=>({...f,passwordConfirm:''}));
  };

  const submitPasswordChange = () => {
    if(pwdForm.next.length < 6) return pushFeedback('error','Password baru minimal 6 karakter');
    if(pwdForm.next !== pwdForm.confirm) return pushFeedback('error','Konfirmasi password tidak cocok');
    pushFeedback('success','Password berhasil diperbarui (mock)');
    setPwdForm({current:'', next:'', confirm:''});
  };

  const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white ${props.className||''}`} />
  );

  const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white resize-none ${props.className||''}`} />
  );
  const [simulasiResults, setSimulasiResults] = useState<any[]>([]);

  useEffect(() => {
    const results = loadSimulasiResults();
    setSimulasiResults(results);
  }, []);

  const avgSimulasiScore = simulasiResults.length > 0 
    ? Math.round(simulasiResults.reduce((sum, r) => sum + r.percentage, 0) / simulasiResults.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      <AnimatePresence>{feedback && (
        <motion.div
          initial={{ y:-20, opacity:0, scale:.95 }}
          animate={{ y:0, opacity:1, scale:1 }}
          exit={{ y:-10, opacity:0, scale:.97 }}
          className={`flex items-center space-x-3 px-4 py-3 rounded-card shadow text-sm font-medium border ${feedback.type==='success'? 'bg-primary-50 border-primary-200 text-primary-700':'bg-red-50 border-red-200 text-red-700'}`}
        >
          {feedback.type==='success'? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span>{feedback.msg}</span>
        </motion.div>
      )}</AnimatePresence>
      {}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        {}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 opacity-10 rounded-xl sm:rounded-2xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-primary-200 p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 lg:gap-8">
            {}
            <div className="relative mx-auto md:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-purple-500 rounded-xl sm:rounded-2xl blur-xl opacity-50"></div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={() => !isEditing && setShowAvatarPicker(true)}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl ${user.avatarColor||'bg-gradient-to-br from-primary-500 to-blue-600'} flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl border-4 border-white cursor-pointer group`}
              >
                {user.name.charAt(0)}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors flex items-center justify-center">
                  <Palette className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>

              {}
              {showAvatarPicker && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarPicker(false)}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Pilih Warna Avatar
                    </h3>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {avatarColors.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => changeAvatarColor(color)}
                          className={`w-full aspect-square rounded-xl ${color} hover:scale-110 transition-transform shadow-lg hover:shadow-xl border-2 ${user.avatarColor === color ? 'border-gray-900' : 'border-white'}`}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowAvatarPicker(false)}
                      className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      Tutup
                    </button>
                  </motion.div>
                </div>
              )}
            </div>

            {}
            <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left w-full">
              <div>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
                  <div className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </div>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                  {user.headline}
                </p>
              </div>

              {}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg sm:rounded-xl">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-blue-900">
                    {topProjects.length} Projects
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg sm:rounded-xl">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  <span className="text-xs sm:text-sm font-medium text-purple-900">
                    {simulasiResults.length} Simulasi
                  </span>
                </div>
                {avgSimulasiScore > 0 && (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg sm:rounded-xl">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                    <span className="text-xs sm:text-sm font-medium text-yellow-900">
                      {avgSimulasiScore}% Avg Score
                    </span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      {user.location}
                    </span>
                  </div>
                )}
              </div>

              {!isEditing && (
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              )}

              {}
              {!isEditing && (
                <div className="flex flex-wrap gap-2">
                  {user.social?.linkedin && (
                    <a href={user.social.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {user.social?.github && (
                    <a href={user.social.github} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-all">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {user.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all">
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>

            {}
            <div className="flex md:flex-col gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={()=> setShowSecurity(s=>!s)} 
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 text-gray-700 font-medium hover:shadow-lg transition-all"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Security</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={()=> isEditing ? onSave() : setIsEditing(true)} 
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium shadow-xl hover:shadow-2xl transition-all"
              >
                {isEditing ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                <span>{isEditing ? 'Save' : 'Edit'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
      {isEditing && (
        <motion.div
          key="edit-panel"
          initial={{ opacity:0, y:20, scale:.98 }}
          animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:-15, scale:.98 }}
          transition={{ type:'spring', stiffness:180, damping:22 }}
          className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-card border border-gray-200 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <Input value={local.name} onChange={e=>setLocal({...local, name:e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <Input value={local.headline} onChange={e=>setLocal({...local, headline:e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lokasi</label>
              <Input value={local.location} onChange={e=>setLocal({...local, location:e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <Input value={local.website} onChange={e=>setLocal({...local, website:e.target.value})} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <TextArea rows={6} value={local.bio} onChange={e=>setLocal({...local, bio:e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills (pisahkan dengan koma)</label>
              <Input value={local.skills} onChange={e=>setLocal({...local, skills:e.target.value})} />
            </div>
          </div>
          <div className="md:col-span-2 border-t border-gray-200 pt-6 grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <Input value={local.linkedin} onChange={e=>setLocal({...local, linkedin:e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub</label>
              <Input value={local.github} onChange={e=>setLocal({...local, github:e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dribbble</label>
              <Input value={local.dribbble} onChange={e=>setLocal({...local, dribbble:e.target.value})} />
            </div>

            {}
            <div className="md:col-span-3 border-t border-gray-200 pt-6">
              <label className="text-sm font-medium mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Upload Resume/CV
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="resume-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white rounded-lg cursor-pointer transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  {resumeFile ? 'Ganti Resume' : 'Upload Resume'}
                </label>
                {resumeFile && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{localStorage.getItem('simhire_user_resume_name') || 'resume.pdf'}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setResumeFile(null);
                        localStorage.removeItem('simhire_user_resume');
                        localStorage.removeItem('simhire_user_resume_name');
                        pushFeedback('success', 'Resume dihapus');
                      }}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Format: PDF, DOC, DOCX (Maksimal 5MB)</p>
            </div>

            <div className="md:col-span-3 flex justify-end gap-2">
              <button onClick={()=> setIsEditing(false)} className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">Batal</button>
              <button onClick={onSave} className="px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition shadow">Simpan</button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {}
      {!isEditing && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-card border border-gray-200 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Tentang</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-3">Skill</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium border border-primary-200">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center justify-between">Portofolio Singkat
                <a href="/dashboard/portfolio" className="text-xs font-medium text-primary-600 hover:underline">Lihat Semua</a>
              </h2>
              {topProjects.length === 0 && (
                <p className="text-sm text-gray-500">Belum ada project portofolio.</p>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {topProjects.map(p => (
                  <div key={p.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm line-clamp-1">{p.title}</h3>
                      {p.featured && <span className="text-[10px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded font-semibold">★</span>}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 mb-2">{p.description || 'Tanpa deskripsi'}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.tech.slice(0,3).map(t => <span key={t} className="text-[10px] bg-white/70 px-2 py-0.5 rounded border border-gray-200">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-card border border-gray-200 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Info Kontak</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Email: {user.email}</li>
                {user.location && <li>Lokasi: {user.location}</li>}
                {user.website && <li>Website: <a href={user.website} className="text-primary-600 hover:underline" target="_blank" rel="noreferrer">{user.website}</a></li>}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Sosial</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {user.social?.linkedin && <li>LinkedIn: {user.social.linkedin}</li>}
                {user.social?.github && <li>GitHub: {user.social.github}</li>}
                {user.social?.dribbble && <li>Dribbble: {user.social.dribbble}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {}
      <AnimatePresence>
      {showSecurity && !isEditing && (
        <motion.div
          key="security"
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-20 }}
          transition={{ type:'spring', stiffness:190, damping:24 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white p-6 rounded-card border border-gray-200 space-y-5">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Ganti Email</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 text-xs font-medium uppercase tracking-wide">Email Baru</label>
                <Input type="email" value={emailForm.email} onChange={e=> setEmailForm({...emailForm, email:e.target.value})} />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium uppercase tracking-wide">Password Saat Ini</label>
                <Input type="password" value={emailForm.passwordConfirm} onChange={e=> setEmailForm({...emailForm, passwordConfirm:e.target.value})} />
              </div>
              <button onClick={submitEmailChange} className="w-full inline-flex justify-center px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition">Perbarui Email</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-card border border-gray-200 space-y-5">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Ganti Password</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 text-xs font-medium uppercase tracking-wide">Password Saat Ini</label>
                <Input type="password" value={pwdForm.current} onChange={e=> setPwdForm({...pwdForm, current:e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-xs font-medium uppercase tracking-wide">Password Baru</label>
                  <Input type="password" value={pwdForm.next} onChange={e=> setPwdForm({...pwdForm, next:e.target.value})} />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium uppercase tracking-wide">Konfirmasi</label>
                  <Input type="password" value={pwdForm.confirm} onChange={e=> setPwdForm({...pwdForm, confirm:e.target.value})} />
                </div>
              </div>
              <button onClick={submitPasswordChange} className="w-full inline-flex justify-center px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition">Perbarui Password</button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
    </div>
  );
};

export default Profile;
