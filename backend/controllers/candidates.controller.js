import {
  getUsers,
  getUserById,
  getSimulasiResults,
  getPortfolios,
  getApplications,
} from '../utils/db.js';
export async function searchCandidates(req, res) {
  try {
    const {
      search,
      skills,
      location,
      experience,
      availability,
      simulasiCategory,
      minScore,
    } = req.query;
    let users = await getUsers();
    let candidates = users.filter(u => u.role === 'candidate');
    const simulasiResults = await getSimulasiResults();
    if (search) {
      const searchLower = search.toLowerCase();
      candidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        (c.profile?.bio && c.profile.bio.toLowerCase().includes(searchLower))
      );
    }
    if (skills) {
      const requiredSkills = skills.split(',').map(s => s.trim().toLowerCase());
      candidates = candidates.filter(c => {
        const candidateSkills = (c.profile?.skills || []).map(s => s.toLowerCase());
        return requiredSkills.some(skill => candidateSkills.includes(skill));
      });
    }
    if (location) {
      candidates = candidates.filter(c =>
        c.profile?.location && c.profile.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (experience) {
      const expLevel = parseInt(experience);
      candidates = candidates.filter(c =>
        c.profile?.experience >= expLevel
      );
    }
    if (availability) {
      candidates = candidates.filter(c =>
        c.profile?.availability === availability
      );
    }
    if (simulasiCategory || minScore) {
      candidates = candidates.filter(c => {
        const candidateSimulasi = simulasiResults.filter(r => r.candidateId === c.id);

        if (simulasiCategory) {
          const categoryResult = candidateSimulasi.find(r => r.categoryId === simulasiCategory);
          if (!categoryResult) return false;

          if (minScore) {
            return categoryResult.percentage >= parseInt(minScore);
          }
          return true;
        }

        if (minScore) {
          return candidateSimulasi.some(r => r.percentage >= parseInt(minScore));
        }

        return true;
      });
    }
    const enrichedCandidates = candidates.map(candidate => {
      const candidateSimulasi = simulasiResults.filter(r => r.candidateId === candidate.id);
      const simulasiScores = {};
      candidateSimulasi.forEach(result => {
        simulasiScores[result.categoryId] = {
          percentage: result.percentage,
          rank: result.rank,
          completedAt: result.completedAt,
        };
      });
      const { password, ...candidateWithoutPassword } = candidate;

      return {
        ...candidateWithoutPassword,
        simulasiScores,
        totalSimulasi: candidateSimulasi.length,
        averageScore: candidateSimulasi.length > 0
          ? Math.round(candidateSimulasi.reduce((sum, r) => sum + r.percentage, 0) / candidateSimulasi.length)
          : 0,
      };
    });
    enrichedCandidates.sort((a, b) => b.averageScore - a.averageScore);

    return res.status(200).json({
      success: true,
      data: {
        candidates: enrichedCandidates,
        total: enrichedCandidates.length,
      },
    });
  } catch (error) {
    console.error('Search candidates error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search candidates.',
    });
  }
}
export async function getCandidateProfile(req, res) {
  try {
    const { id } = req.params;

    const candidate = await getUserById(id);

    if (!candidate || candidate.role !== 'candidate') {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found.',
      });
    }
    const simulasiResults = await getSimulasiResults();
    const candidateSimulasi = simulasiResults.filter(r => r.candidateId === id);
    const portfolios = await getPortfolios();
    const candidatePortfolios = portfolios.filter(p => p.userId === id);
    const applications = await getApplications();
    const candidateApplications = applications
      .filter(app => app.candidateId === id)
      .map(app => ({
        jobTitle: app.jobData?.title,
        company: app.jobData?.company,
        status: app.status,
        appliedAt: app.appliedAt,
      }));
    const simulasiScores = {};
    candidateSimulasi.forEach(result => {
      simulasiScores[result.categoryId] = {
        percentage: result.percentage,
        rank: result.rank,
        breakdown: result.breakdown,
        completedAt: result.completedAt,
      };
    });
    const { password, ...candidateWithoutPassword } = candidate;

    const profile = {
      ...candidateWithoutPassword,
      simulasiResults: candidateSimulasi,
      simulasiScores,
      portfolios: candidatePortfolios,
      applicationHistory: candidateApplications,
      stats: {
        totalSimulasi: candidateSimulasi.length,
        totalPortfolios: candidatePortfolios.length,
        totalApplications: candidateApplications.length,
        averageSimulasiScore: candidateSimulasi.length > 0
          ? Math.round(candidateSimulasi.reduce((sum, r) => sum + r.percentage, 0) / candidateSimulasi.length)
          : 0,
      },
    };

    return res.status(200).json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    console.error('Get candidate profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get candidate profile.',
    });
  }
}
export async function getTopCandidates(req, res) {
  try {
    const { limit = 50, category } = req.query;

    const users = await getUsers();
    const candidates = users.filter(u => u.role === 'candidate');
    const simulasiResults = await getSimulasiResults();
    let relevantResults = category
      ? simulasiResults.filter(r => r.categoryId === category)
      : simulasiResults;
    const candidateScores = new Map();

    relevantResults.forEach(result => {
      if (!candidateScores.has(result.candidateId)) {
        candidateScores.set(result.candidateId, {
          scores: [],
          total: 0,
        });
      }
      const entry = candidateScores.get(result.candidateId);
      entry.scores.push(result.percentage);
      entry.total = entry.scores.reduce((sum, s) => sum + s, 0) / entry.scores.length;
    });
    const topCandidates = Array.from(candidateScores.entries())
      .map(([candidateId, data]) => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) return null;

        const { password, ...candidateWithoutPassword } = candidate;

        return {
          ...candidateWithoutPassword,
          averageScore: Math.round(data.total),
          totalSimulasi: data.scores.length,
        };
      })
      .filter(c => c !== null)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, parseInt(limit));

    return res.status(200).json({
      success: true,
      data: {
        candidates: topCandidates,
        total: topCandidates.length,
      },
    });
  } catch (error) {
    console.error('Get top candidates error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get top candidates.',
    });
  }
}
export async function getCandidateRecommendations(req, res) {
  try {
    const { jobId } = req.params;
    const companyId = req.userId;
    const { getJobById } = await import('../utils/db.js');
    const job = await getJobById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    if (job.companyId !== companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }
    const users = await getUsers();
    const candidates = users.filter(u => u.role === 'candidate');
    const simulasiResults = await getSimulasiResults();
    const applications = await getApplications();
    const appliedCandidateIds = applications
      .filter(app => app.jobId === jobId)
      .map(app => app.candidateId);

    const availableCandidates = candidates.filter(c => 
      !appliedCandidateIds.includes(c.id) &&
      c.profile?.availability === 'available'
    );
    const scoredCandidates = availableCandidates.map(candidate => {
      const { password, ...candidateWithoutPassword } = candidate;

      let matchScore = 0;
      if (candidate.profile?.location && 
          job.location.toLowerCase().includes(candidate.profile.location.toLowerCase())) {
        matchScore += 20;
      }
      const candidateSkills = (candidate.profile?.skills || []).map(s => s.toLowerCase());
      const jobRequirements = job.requirements.join(' ').toLowerCase();
      const matchingSkills = candidateSkills.filter(skill => 
        jobRequirements.includes(skill)
      );
      matchScore += Math.min(30, matchingSkills.length * 10);
      const candidateSimulasi = simulasiResults.filter(r => r.candidateId === candidate.id);
      if (candidateSimulasi.length > 0) {
        const avgScore = candidateSimulasi.reduce((sum, r) => sum + r.percentage, 0) / candidateSimulasi.length;
        matchScore += Math.round((avgScore / 100) * 50);
      }

      return {
        ...candidateWithoutPassword,
        matchScore: Math.round(matchScore),
        matchReasons: {
          locationMatch: candidate.profile?.location === job.location,
          skillsMatch: matchingSkills.length,
          averageSimulasiScore: candidateSimulasi.length > 0
            ? Math.round(candidateSimulasi.reduce((sum, r) => sum + r.percentage, 0) / candidateSimulasi.length)
            : 0,
        },
      };
    });
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);
    const recommendations = scoredCandidates.slice(0, 20);

    return res.status(200).json({
      success: true,
      data: {
        recommendations,
        total: recommendations.length,
        job: {
          id: job.id,
          title: job.title,
          location: job.location,
        },
      },
    });
  } catch (error) {
    console.error('Get candidate recommendations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get recommendations.',
    });
  }
}

export default {
  searchCandidates,
  getCandidateProfile,
  getTopCandidates,
  getCandidateRecommendations,
};
