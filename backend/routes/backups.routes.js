
import express from 'express';
import { 
  backupAll, 
  backupFile, 
  listBackups, 
  restoreBackup, 
  getBackupStats 
} from '../utils/backup.js';
import { ErrorTypes } from '../utils/errors.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/create-all', async (req, res, next) => {
  try {
    logger.info('Manual backup triggered');
    const backups = await backupAll();

    res.status(200).json({
      success: true,
      message: 'All databases backed up successfully',
      data: {
        backups,
        count: backups.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/create/:filename', async (req, res, next) => {
  try {
    const { filename } = req.params;
    const allowedFiles = ['users.json', 'jobs.json', 'applications.json'];
    if (!allowedFiles.includes(filename)) {
      throw ErrorTypes.INVALID_INPUT('filename');
    }

    logger.info(`Manual backup triggered for: ${filename}`);
    const backupPath = await backupFile(filename);

    res.status(200).json({
      success: true,
      message: `${filename} backed up successfully`,
      data: {
        backupPath,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const { filename } = req.query;
    const backups = await listBackups(filename);

    res.status(200).json({
      success: true,
      message: 'Backups retrieved successfully',
      data: {
        backups,
        count: backups.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getBackupStats();

    res.status(200).json({
      success: true,
      message: 'Backup stats retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/restore', async (req, res, next) => {
  try {
    const { backupFilename } = req.body;

    if (!backupFilename) {
      throw ErrorTypes.MISSING_FIELD('backupFilename');
    }

    logger.warn(`Database restore initiated: ${backupFilename}`);
    const result = await restoreBackup(backupFilename);

    res.status(200).json({
      success: true,
      message: 'Database restored successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
