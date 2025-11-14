import { useState, useEffect } from 'react';
import { Target, TrendingUp, Award, BookOpen, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { loadSimulasiResults } from '@/lib/storage';
import { useUser } from '@/context/UserContext';

interface SkillData {
  category: string;
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  trend: 'up' | 'down' | 'stable';
  recommendations: string[];
}

const SkillSnapshot: React.FC = () => {
  const { user } = useUser();
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const results = loadSimulasiResults();
    const categoryScores: Record<string, number[]> = {};
    results.forEach(result => {
      const category = result.categoryName || result.categoryId;
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      if (result.percentage) {
        categoryScores[category].push(result.percentage);
      }
    });
    const skills: SkillData[] = Object.entries(categoryScores).map(([category, scores]) => {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      return {
        category,
        score: Math.round(avgScore),
        level: getSkillLevel(avgScore),
        trend: 'stable',
        recommendations: getRecommendations(category, avgScore),
      };
    });
    if (user?.skills) {
      user.skills.forEach(skill => {
        if (!skills.find(s => s.category === skill)) {
          skills.push({
            category: skill,
            score: 0,
            level: 'Beginner',
            trend: 'stable',
            recommendations: [`Mulai dengan simulasi ${skill} untuk menilai kemampuan Anda`],
          });
        }
      });
    }

    setSkillsData(skills.sort((a, b) => b.score - a.score));
    const totalScore = skills.length > 0
      ? Math.round(skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length)
      : 0;
    setOverallScore(totalScore);
  }, [user]);

  const getSkillLevel = (score: number): SkillData['level'] => {
    if (score >= 85) return 'Expert';
    if (score >= 70) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    return 'Beginner';
  };

  const getRecommendations = (category: string, score: number): string[] => {
    const recommendations: string[] = [];

    if (score < 50) {
      recommendations.push(`Ikuti simulasi dasar ${category}`);
      recommendations.push(`Pelajari fundamental ${category}`);
    } else if (score < 70) {
      recommendations.push(`Latihan soal lanjutan ${category}`);
      recommendations.push(`Ikuti bootcamp ${category}`);
    } else if (score < 85) {
      recommendations.push(`Challenge advanced ${category}`);
      recommendations.push(`Buat portfolio project ${category}`);
    } else {
      recommendations.push(`Mentoring untuk ${category}`);
      recommendations.push(`Sertifikasi profesional ${category}`);
    }

    return recommendations;
  };

  const getLevelColor = (level: SkillData['level']) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-purple-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ringkasan Keterampilan</h1>
        <p className="text-gray-600">
          Analisis komprehensif kemampuan Anda berdasarkan hasil simulasi dan profil
        </p>
      </div>

      {}
      <Card className="bg-gradient-to-br from-primary-500 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Skor Keseluruhan</h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{overallScore}</span>
                <span className="text-xl opacity-80">/100</span>
              </div>
              <p className="mt-2 text-sm opacity-90">
                {skillsData.length} kategori keterampilan terukur
              </p>
            </div>
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <Award className="w-12 h-12" />
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      {skillsData.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Data Keterampilan
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai dengan mengikuti simulasi kerja atau tambahkan skills di profil Anda
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/dashboard/simulasi-kerja"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Ikuti Simulasi
              </a>
              <a
                href="/dashboard/profile"
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
              >
                Update Profil
              </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {skillsData.map((skill, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{skill.category}</CardTitle>
                    <Badge className={getLevelColor(skill.level)}>{skill.level}</Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(skill.score)}`}>
                      {skill.score}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {skill.trend === 'up' && (
                        <span className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          Meningkat
                        </span>
                      )}
                      {skill.trend === 'down' && (
                        <span className="flex items-center gap-1 text-red-600">
                          <TrendingUp className="w-3 h-3 rotate-180" />
                          Menurun
                        </span>
                      )}
                      {skill.trend === 'stable' && (
                        <span className="text-gray-500">Stabil</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{skill.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        skill.score >= 85
                          ? 'bg-purple-600'
                          : skill.score >= 70
                          ? 'bg-green-600'
                          : skill.score >= 50
                          ? 'bg-blue-600'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>

                {}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-600" />
                    Rekomendasi
                  </h4>
                  <ul className="space-y-1">
                    {skill.recommendations.slice(0, 2).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        {skill.score > 0 ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {}
      {skillsData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Tingkatkan Keterampilan
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Ikuti lebih banyak simulasi untuk meningkatkan skor Anda
                  </p>
                  <a
                    href="/dashboard/simulasi-kerja"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Lihat Simulasi
                    <TrendingUp className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Bangun Portfolio
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Tunjukkan keahlian Anda dengan project portfolio
                  </p>
                  <a
                    href="/dashboard/portfolio"
                    className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    Kelola Portfolio
                    <Zap className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SkillSnapshot;
