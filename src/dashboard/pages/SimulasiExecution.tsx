import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, AlertTriangle, ArrowRight,
  Trophy, Target, Code, FileText, Sparkles, Play, Pause, Star,
  Upload, File, X as XIcon, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { SIMULASI_CATEGORIES, getSimulasiByCategory, type SimulasiTask } from '@/lib/simulasiData';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { api } from '@/services/api';

interface TaskSubmission {
  taskId: string;
  answer: {
    text?: string;
    code?: string;
    files?: string[];
  };
  timeSpent: number;
  score: number;
}

const SimulasiExecution: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const category = SIMULASI_CATEGORIES.find(cat => cat.id === categoryId);
  const tasks = getSimulasiByCategory(categoryId || '');

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskStartTime, setTaskStartTime] = useState(Date.now());
  const [inputMode, setInputMode] = useState<'text' | 'code' | 'file'>('text');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  const currentTask = tasks[currentTaskIndex];
  const progress = ((currentTaskIndex + 1) / tasks.length) * 100;
  useEffect(() => {
    if (category) {
      const durationMatch = category.duration.match(/(\d+)/);
      const minutes = durationMatch ? parseInt(durationMatch[1]) * 60 : 120;
      setTimeRemaining(minutes * 60);
    }
  }, [category]);
  useEffect(() => {
    if (timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isPaused]);
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return hours + ':' + minutes.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
    }
    return minutes + ':' + secs.toString().padStart(2, '0');
  };
  const getTimerColor = () => {
    const percentage = (timeRemaining / (parseInt(category?.duration.match(/(\d+)/)?.[1] || '2') * 3600)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };
  const calculateTaskScore = (answerText: string, task: SimulasiTask): number => {
    const answerLength = answerText.trim().length;
    let score = 0;
    if (answerLength < 50) return Math.min(40, answerLength);
    score += Math.min(30, (answerLength / 500) * 30);
    const qualityKeywords = {
      coding: ['function', 'class', 'const', 'let', 'return', 'async', 'await'],
      design: ['user', 'experience', 'interface', 'visual', 'layout', 'color'],
      analysis: ['data', 'analysis', 'insight', 'trend', 'metric', 'report'],
      writing: ['audience', 'content', 'message', 'strategy', 'engagement'],
      presentation: ['slide', 'visual', 'present', 'audience', 'key point'],
      'problem-solving': ['solution', 'approach', 'strategy', 'optimize', 'improve']
    };

    const keywords = qualityKeywords[task.type] || [];
    const lowerAnswer = answerText.toLowerCase();
    const matchedKeywords = keywords.filter(keyword => lowerAnswer.includes(keyword)).length;

    score += (matchedKeywords / keywords.length) * 40;
    const paragraphs = answerText.split('\n\n').length;
    if (paragraphs > 1) score += 10;
    if (task.type === 'coding' && answerText.includes('```')) score += 10;
    if (answerText.includes('-') || answerText.includes('*')) score += 10;

    return Math.min(100, Math.round(score));
  };
  const handleSubmitTask = () => {
    if (!currentAnswer.trim() && uploadedFiles.length === 0) {
      toast.error('Jawaban tidak boleh kosong');
      return;
    }

    const timeSpent = Math.floor((Date.now() - taskStartTime) / 1000);
    const score = calculateTaskScore(currentAnswer, currentTask);
    const answerObject = {
      text: inputMode === 'text' ? currentAnswer : '',
      code: inputMode === 'code' ? currentAnswer : '',
      files: uploadedFiles.map(f => f.name)
    };

    const submission: TaskSubmission = {
      taskId: currentTask.id,
      answer: answerObject,
      timeSpent,
      score
    };

    setSubmissions([...submissions, submission]);

    toast.success('Task submitted!', {
      description: 'Score: ' + score + '/100',
      icon: score >= 80 ? '🎉' : score >= 60 ? '👍' : '📝'
    });
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setCurrentAnswer('');
      setTaskStartTime(Date.now());
    } else {
      handleFinishSimulasi();
    }
  };
  const handleSkipTask = () => {
    const submission: TaskSubmission = {
      taskId: currentTask.id,
      answer: {
        text: '',
        code: '',
        files: []
      },
      timeSpent: 0,
      score: 0
    };

    setSubmissions([...submissions, submission]);

    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setCurrentAnswer('');
      setTaskStartTime(Date.now());
      toast.info('Task skipped');
    } else {
      handleFinishSimulasi();
    }
  };
  const handleAutoSubmit = () => {
    toast.warning('Waktu habis!', {
      description: 'Simulasi akan diselesaikan otomatis'
    });
    if (currentTaskIndex < tasks.length) {
      const timeSpent = Math.floor((Date.now() - taskStartTime) / 1000);
      const score = currentAnswer ? calculateTaskScore(currentAnswer, currentTask) : 0;

      const answerObject = {
        text: inputMode === 'text' ? currentAnswer : '',
        code: inputMode === 'code' ? currentAnswer : '',
        files: uploadedFiles.map(f => f.name)
      };

      const submission: TaskSubmission = {
        taskId: currentTask.id,
        answer: answerObject,
        timeSpent,
        score
      };

      setSubmissions([...submissions, submission]);
    }

    setTimeout(() => handleFinishSimulasi(), 2000);
  };
  const handleFinishSimulasi = async () => {
    if (!user || !category) return;

    setIsSubmitting(true);

    try {
      const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
      const averageScore = Math.round(totalScore / tasks.length);

      const breakdown = {
        technical: Math.min(100, averageScore + Math.floor(Math.random() * 10)),
        creativity: Math.min(100, averageScore + Math.floor(Math.random() * 10) - 5),
        efficiency: Math.min(100, averageScore + Math.floor(Math.random() * 10) - 3),
        communication: Math.min(100, averageScore + Math.floor(Math.random() * 10) - 2)
      };
      const response = await api.submitSimulasi({
        categoryId: category.id,
        taskResults: submissions.map(sub => ({
          taskId: sub.taskId,
          answer: sub.answer,
          timeSpent: sub.timeSpent
        })),
        breakdown
      });

      toast.success('Hasil simulasi berhasil disimpan!', {
        description: 'Score: ' + response.data.result.percentage + '%'
      });
      navigate('/dashboard/simulasi-kerja/results/' + response.data.result.id, {
        state: { 
          result: response.data.result,
          submissions 
        }
      });
    } catch (error) {
      console.error('Failed to submit simulasi:', error);
      toast.error('Gagal menyimpan hasil simulasi', {
        description: 'Silakan coba lagi'
      });
      setIsSubmitting(false);
    }
  };

  if (!category || !currentTask) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
      {}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b-2 border-primary-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-br ${category.color} rounded-xl shadow-lg`}>
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h1>
                  <Badge className="bg-primary-100 text-primary-700">
                    Live Test
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Task {currentTaskIndex + 1} of {tasks.length}
                </p>
              </div>
            </div>

            {}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPaused(!isPaused)}
                className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all shadow-md"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <Play className="w-5 h-5 text-primary-600" />
                ) : (
                  <Pause className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>

              <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 ${
                timeRemaining < 600 ? 'bg-red-50 border-red-300' :
                timeRemaining < 1800 ? 'bg-yellow-50 border-yellow-300' :
                'bg-green-50 border-green-300'
              } shadow-lg`}>
                <Clock className={`w-6 h-6 ${getTimerColor()}`} />
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Time Left</div>
                  <span className={`text-3xl font-mono font-bold ${getTimerColor()}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progress)}% Complete</span>
              <span>{submissions.length} / {tasks.length} Tasks Submitted</span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTaskIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {}
            <div className="relative">
              {}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-blue-400 to-purple-400 rounded-2xl opacity-20 blur"></div>
              <div className="relative bg-white rounded-2xl border-2 border-primary-200 p-8 mb-6 shadow-2xl">
              {}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`${
                      currentTask.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      currentTask.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {currentTask.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {currentTask.type}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {currentTask.timeLimit} min
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentTask.title}
                  </h2>
                  <p className="text-gray-600">
                    {currentTask.description}
                  </p>
                </div>

                {}
                <div className="flex flex-col items-end">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-white mb-1">
                      <Star className="w-4 h-4 fill-white" />
                      <div className="text-xs font-medium">Max Score</div>
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {currentTask.maxScore}
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Instruksi
                </h3>
                <ul className="space-y-2">
                  {currentTask.instructions.map((instruction, idx) => (
                    <li key={idx} className="text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Kriteria Penilaian
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentTask.criteria.map((criterion, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-16 flex-shrink-0">
                        <Badge variant="outline" className="text-purple-700">
                          {criterion.weight}%
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium text-purple-900">
                          {criterion.name}
                        </div>
                        <div className="text-sm text-purple-700">
                          {criterion.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-gray-900">
                    Jawaban Anda:
                  </label>
                  <span className="text-sm text-gray-500">
                    {currentAnswer.length} characters | {uploadedFiles.length} files
                  </span>
                </div>

                {}
                <div className="border-b border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setInputMode('text')}
                      className={`px-4 py-2 font-medium text-sm transition-all ${
                        inputMode === 'text'
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Text Answer
                    </button>
                    <button
                      onClick={() => setInputMode('code')}
                      className={`px-4 py-2 font-medium text-sm transition-all ${
                        inputMode === 'code'
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Code className="w-4 h-4 inline mr-2" />
                      Code Editor
                    </button>
                    <button
                      onClick={() => setInputMode('file')}
                      className={`px-4 py-2 font-medium text-sm transition-all ${
                        inputMode === 'file'
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      File Upload
                    </button>
                  </div>
                </div>

                {}
                {inputMode === 'text' && (
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Tulis jawaban Anda di sini... Semakin detail dan terstruktur, semakin baik skor Anda!"
                    className="min-h-[300px] text-base resize-none font-mono"
                    disabled={isPaused}
                  />
                )}

                {}
                {inputMode === 'code' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Language:</label>
                      <select
                        value={codeLanguage}
                        onChange={(e) => setCodeLanguage(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="sql">SQL</option>
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(currentAnswer);
                          toast.success('Code copied!');
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Write your code here..."
                      className="min-h-[350px] text-base resize-none font-mono bg-gray-900 text-green-400 border-gray-700"
                      disabled={isPaused}
                    />
                  </div>
                )}

                {}
                {inputMode === 'file' && (
                  <div className="space-y-4">
                    {}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setUploadedFiles(prev => [...prev, ...files]);
                          setCurrentAnswer(prev => 
                            prev + '\n[Uploaded: ' + files.map(f => f.name).join(', ') + ']'
                          );
                          toast.success(files.length + ' file(s) uploaded');
                        }}
                        className="hidden"
                        id="file-upload"
                        disabled={isPaused}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <span className="text-sm font-medium text-gray-700">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PDF, ZIP, Images (max 10MB per file)
                        </span>
                      </label>
                    </div>

                    {}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Uploaded Files ({uploadedFiles.length}):
                        </p>
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <File className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                                toast.success('File removed');
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Additional Notes:
                      </label>
                      <Textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Add description or explanation for your files..."
                        className="min-h-[150px] text-base resize-none"
                        disabled={isPaused}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Tips untuk Score Maksimal:</p>
                    <ul className="text-xs space-y-1 text-blue-800">
                      <li>• Gunakan <strong>Text</strong> untuk penjelasan detail dengan struktur</li>
                      <li>• Gunakan <strong>Code Editor</strong> untuk implementasi teknis</li>
                      <li>• Gunakan <strong>File Upload</strong> untuk design, mockup, atau dokumentasi</li>
                      <li>• Kombinasi ketiga mode untuk jawaban terlengkap!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handleSkipTask}
                disabled={isPaused}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Skip Task
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Yakin ingin keluar? Progress tidak akan disimpan.')) {
                      navigate('/dashboard/simulasi-kerja/' + categoryId);
                    }
                  }}
                >
                  Keluar
                </Button>

                <Button
                  onClick={handleSubmitTask}
                  disabled={!currentAnswer.trim() || isPaused || isSubmitting}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : currentTaskIndex === tasks.length - 1 ? (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Submit & Finish
                    </>
                  ) : (
                    <>
                      Submit & Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md text-center border-4 border-primary-500"
          >
            <Pause className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Simulasi Dijeda
            </h2>
            <p className="text-gray-600 mb-6">
              Timer dihentikan sementara. Klik tombol di bawah untuk melanjutkan.
            </p>
            <Button
              onClick={() => setIsPaused(false)}
              size="lg"
              className="w-full"
            >
              <Play className="w-5 h-5 mr-2" />
              Lanjutkan Simulasi
            </Button>
          </motion.div>
        </div>
      )}

      {}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl"
          >
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Menyimpan Hasil...
            </h2>
            <p className="text-gray-600">
              Mohon tunggu, kami sedang memproses hasil simulasi Anda.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SimulasiExecution;
