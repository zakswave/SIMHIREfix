import { v4 as uuidv4 } from 'uuid';
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../utils/db.js';
export async function getAllPortfolios(req, res) {
  try {
    const { userId, featured } = req.query;

    let portfolios = await getPortfolios();
    if (userId) {
      portfolios = portfolios.filter(p => p.userId === userId);
    }
    if (featured === 'true') {
      portfolios = portfolios.filter(p => p.featured === true);
    }
    portfolios.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.status(200).json({
      success: true,
      data: {
        portfolios,
        total: portfolios.length,
      },
    });
  } catch (error) {
    console.error('Get all portfolios error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get portfolios.',
    });
  }
}
export async function getMyPortfolios(req, res) {
  try {
    const userId = req.userId;

    let portfolios = await getPortfolios();
    portfolios = portfolios.filter(p => p.userId === userId);
    portfolios.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.status(200).json({
      success: true,
      data: {
        portfolios,
        total: portfolios.length,
      },
    });
  } catch (error) {
    console.error('Get my portfolios error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get portfolios.',
    });
  }
}
export async function getPortfolioDetails(req, res) {
  try {
    const { id } = req.params;

    const portfolio = await getPortfolioById(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { portfolio },
    });
  } catch (error) {
    console.error('Get portfolio details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get portfolio details.',
    });
  }
}
export async function createNewPortfolio(req, res) {
  try {
    const userId = req.userId;
    const portfolioData = req.body;
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(`/uploads/portfolios/${file.filename}`);
      });
    }

    const newPortfolio = {
      id: uuidv4(),
      userId,
      title: portfolioData.title,
      description: portfolioData.description,
      technologies: portfolioData.technologies || [],
      images,
      thumbnail: images[0] || null,
      liveUrl: portfolioData.liveUrl || null,
      githubUrl: portfolioData.githubUrl || null,
      featured: portfolioData.featured === 'true' || portfolioData.featured === true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const portfolio = await createPortfolio(newPortfolio);

    return res.status(201).json({
      success: true,
      message: 'Portfolio created successfully!',
      data: { portfolio },
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create portfolio.',
    });
  }
}
export async function updateExistingPortfolio(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updates = req.body;

    const portfolio = await getPortfolioById(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
    }
    if (portfolio.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }
    if (req.files && req.files.length > 0) {
      const newImages = [];
      req.files.forEach(file => {
        newImages.push(`/uploads/portfolios/${file.filename}`);
      });
      updates.images = [...(portfolio.images || []), ...newImages];
      updates.thumbnail = updates.images[0];
    }
    if (typeof updates.featured === 'string') {
      updates.featured = updates.featured === 'true';
    }

    const updatedPortfolio = await updatePortfolio(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully!',
      data: { portfolio: updatedPortfolio },
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update portfolio.',
    });
  }
}
export async function deleteExistingPortfolio(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const portfolio = await getPortfolioById(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
    }
    if (portfolio.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    await deletePortfolio(id);

    return res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully.',
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete portfolio.',
    });
  }
}
export async function toggleFeatured(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const portfolio = await getPortfolioById(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
    }
    if (portfolio.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    const updatedPortfolio = await updatePortfolio(id, {
      featured: !portfolio.featured,
    });

    return res.status(200).json({
      success: true,
      message: `Portfolio ${updatedPortfolio.featured ? 'featured' : 'unfeatured'} successfully!`,
      data: { portfolio: updatedPortfolio },
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update portfolio.',
    });
  }
}

export default {
  getAllPortfolios,
  getMyPortfolios,
  getPortfolioDetails,
  createNewPortfolio,
  updateExistingPortfolio,
  deleteExistingPortfolio,
  toggleFeatured,
};
