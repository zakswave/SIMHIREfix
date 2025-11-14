import { v4 as uuidv4 } from 'uuid';
import {
  getSimulasiResults,
  getSimulasiResultById,
  createSimulasiResult,
  getUsers,
} from '../utils/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
const SIMULASI_CATEGORIES = {
  'ui-ux-design': { name: 'UI/UX Design', difficulty: 'intermediate' },
  'frontend-dev': { name: 'Frontend Development', difficulty: 'intermediate' },
  'backend-dev': { name: 'Backend Development', difficulty: 'advanced' },
  'data-analysis': { name: 'Data Analysis', difficulty: 'intermediate' },
  'digital-marketing': { name: 'Digital Marketing', difficulty: 'beginner' },
  'project-management': { name: 'Project Management', difficulty: 'intermediate' },
  'customer-service': { name: 'Customer Service', difficulty: 'beginner' },
  'sales': { name: 'Sales & Business Development', difficulty: 'intermediate' },
};
export async function submitSimulasiResult(req, res) {
  try {
    const candidateId = req.userId;
    const { categoryId, taskResults, breakdown } = req.body;
    if (!SIMULASI_CATEGORIES[categoryId]) {
      return sendError(res, 'Invalid category ID.', 400, null, 'INVALID_CATEGORY');
    }
    const totalScore = taskResults.reduce((sum, task) => {
      const hasAnswer = task.answer && (
        (task.answer.text && task.answer.text.trim().length > 0) ||
        (task.answer.code && task.answer.code.trim().length > 0) ||
        (task.answer.files && task.answer.files.length > 0)
      );
      return sum + (hasAnswer ? 100 / taskResults.length : 0);
    }, 0);
    const avgBreakdown = Object.values(breakdown).reduce((sum, val) => sum + val, 0) / Object.keys(breakdown).length;
    const finalPercentage = Math.round((totalScore * 0.6) + (avgBreakdown * 0.4));
    let rank = 'D';
    if (finalPercentage >= 90) rank = 'S';
    else if (finalPercentage >= 80) rank = 'A';
    else if (finalPercentage >= 70) rank = 'B';
    else if (finalPercentage >= 60) rank = 'C';
    const totalTime = taskResults.reduce((sum, task) => sum + task.timeSpent, 0);

    const resultData = {
      id: uuidv4(),
      candidateId,
      categoryId,
      categoryName: SIMULASI_CATEGORIES[categoryId].name,
      completedAt: new Date().toISOString(),
      percentage: finalPercentage,
      rank,
      breakdown,
      totalTime,
      taskResults: taskResults.map(task => ({
        taskId: task.taskId,
        completed: !!task.answer,
        timeSpent: task.timeSpent,
      })),
      badge: finalPercentage >= 80 ? `${categoryId}-expert` : null,
    };

    const result = await createSimulasiResult(resultData);

    return sendSuccess(res, { result }, 'Simulasi result saved successfully!', 201);
  } catch (error) {
    console.error('Submit simulasi error:', error);
    return sendError(res, 'Failed to submit simulasi result.', 500, null, 'SUBMIT_FAILED');
  }
}
export async function getMySimulasiResults(req, res) {
  try {
    const candidateId = req.userId;

    const results = await getSimulasiResults();
    const myResults = results.filter(r => r.candidateId === candidateId);
    myResults.sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    return res.status(200).json({
      success: true,
      data: {
        results: myResults,
        total: myResults.length,
      },
    });
  } catch (error) {
    console.error('Get my simulasi results error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get simulasi results.',
    });
  }
}
export async function getSimulasiResult(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await getSimulasiResultById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found.',
      });
    }
    if (req.userRole === 'candidate' && result.candidateId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { result },
    });
  } catch (error) {
    console.error('Get simulasi result error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get result.',
    });
  }
}
export async function getLeaderboard(req, res) {
  try {
    const { categoryId } = req.params;
    const { limit = 100 } = req.query;

    const results = await getSimulasiResults();
    let categoryResults = results.filter(r => r.categoryId === categoryId);
    categoryResults.sort((a, b) => b.percentage - a.percentage);
    categoryResults = categoryResults.slice(0, parseInt(limit));
    const leaderboard = categoryResults.map((result, index) => ({
      ...result,
      position: index + 1,
    }));

    return res.status(200).json({
      success: true,
      data: {
        leaderboard,
        category: SIMULASI_CATEGORIES[categoryId],
      },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard.',
    });
  }
}
export async function getAllLeaderboards(req, res) {
  try {
    const results = await getSimulasiResults();

    const leaderboards = {};
    for (const categoryId in SIMULASI_CATEGORIES) {
      let categoryResults = results.filter(r => r.categoryId === categoryId);
      categoryResults.sort((a, b) => b.percentage - a.percentage);
      leaderboards[categoryId] = {
        category: SIMULASI_CATEGORIES[categoryId],
        topResults: categoryResults.slice(0, 10).map((result, index) => ({
          ...result,
          position: index + 1,
        })),
      };
    }

    return res.status(200).json({
      success: true,
      data: { leaderboards },
    });
  } catch (error) {
    console.error('Get all leaderboards error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get leaderboards.',
    });
  }
}
export async function getSimulasiStats(req, res) {
  try {
    const candidateId = req.userId;

    const results = await getSimulasiResults();
    const myResults = results.filter(r => r.candidateId === candidateId);
    const totalCompleted = myResults.length;
    const averageScore = myResults.length > 0
      ? Math.round(myResults.reduce((sum, r) => sum + r.percentage, 0) / myResults.length)
      : 0;

    const badges = myResults
      .filter(r => r.badge)
      .map(r => r.badge);

    const rankCounts = myResults.reduce((counts, r) => {
      counts[r.rank] = (counts[r.rank] || 0) + 1;
      return counts;
    }, {});

    const categoryScores = myResults.reduce((scores, r) => {
      scores[r.categoryId] = r.percentage;
      return scores;
    }, {});

    const stats = {
      totalCompleted,
      averageScore,
      badges: [...new Set(badges)],
      rankCounts,
      categoryScores,
      strongestCategory: myResults.length > 0
        ? Object.keys(categoryScores).reduce((a, b) => 
            categoryScores[a] > categoryScores[b] ? a : b
          )
        : null,
    };

    return res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    console.error('Get simulasi stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get statistics.',
    });
  }
}
export async function getAllSimulasiResultsForCompany(req, res) {
  try {
    const results = await getSimulasiResults();
    const users = await getUsers();
    const enrichedResults = results.map(result => {
      const candidate = users.find(u => u.id === result.candidateId);

      return {
        ...result,
        candidateName: candidate?.name || 'Unknown Candidate',
        candidateEmail: candidate?.email || '-',
        candidatePhone: candidate?.phone || '-',
        candidateUniversity: candidate?.university || '-',
      };
    });
    enrichedResults.sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    return res.status(200).json({
      success: true,
      data: {
        results: enrichedResults,
        total: enrichedResults.length,
      },
    });
  } catch (error) {
    console.error('Get all simulasi results error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get simulasi results.',
    });
  }
}

export default {
  submitSimulasiResult,
  getMySimulasiResults,
  getSimulasiResult,
  getLeaderboard,
  getAllLeaderboards,
  getSimulasiStats,
  getAllSimulasiResultsForCompany,
};
