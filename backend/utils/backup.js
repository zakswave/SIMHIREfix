
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const BACKUP_DIR = path.join(__dirname, '../backups');
const MAX_BACKUPS = 10;

async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    logger.info('Created backup directory');
  }
}

function generateBackupFilename(filename) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  return `${name}_${timestamp}${ext}`;
}

export async function backupFile(filename) {
  try {
    await ensureBackupDir();

    const sourcePath = path.join(DATA_DIR, filename);
    const backupFilename = generateBackupFilename(filename);
    const backupPath = path.join(BACKUP_DIR, backupFilename);
    const data = await fs.readFile(sourcePath, 'utf-8');
    await fs.writeFile(backupPath, data);

    logger.info(`Backup created: ${backupFilename}`);
    await cleanOldBackups(filename);

    return backupPath;
  } catch (error) {
    logger.error(`Failed to backup ${filename}`, error);
    throw error;
  }
}

export async function backupAll() {
  try {
    await ensureBackupDir();

    const dbFiles = ['users.json', 'jobs.json', 'applications.json'];
    const backups = [];

    for (const file of dbFiles) {
      try {
        const backupPath = await backupFile(file);
        backups.push(backupPath);
      } catch (error) {
        logger.error(`Failed to backup ${file}`, error);
      }
    }

    logger.info(`Created ${backups.length} backups`);
    return backups;
  } catch (error) {
    logger.error('Failed to backup all databases', error);
    throw error;
  }
}

async function cleanOldBackups(filename) {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const name = path.basename(filename, path.extname(filename));
    const fileBackups = files
      .filter(f => f.startsWith(name + '_'))
      .map(f => ({
        name: f,
        path: path.join(BACKUP_DIR, f),
      }))
      .sort((a, b) => b.name.localeCompare(a.name));
    if (fileBackups.length > MAX_BACKUPS) {
      const toDelete = fileBackups.slice(MAX_BACKUPS);

      for (const backup of toDelete) {
        await fs.unlink(backup.path);
        logger.debug(`Deleted old backup: ${backup.name}`);
      }

      logger.info(`Cleaned ${toDelete.length} old backups for ${filename}`);
    }
  } catch (error) {
    logger.error('Failed to clean old backups', error);
  }
}

export async function listBackups(filename = null) {
  try {
    await ensureBackupDir();

    const files = await fs.readdir(BACKUP_DIR);

    let backups = files.map(f => ({
      name: f,
      path: path.join(BACKUP_DIR, f),
    }));
    if (filename) {
      const name = path.basename(filename, path.extname(filename));
      backups = backups.filter(b => b.name.startsWith(name + '_'));
    }
    const backupDetails = await Promise.all(
      backups.map(async (backup) => {
        const stats = await fs.stat(backup.path);
        return {
          name: backup.name,
          path: backup.path,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        };
      })
    );
    return backupDetails.sort((a, b) => b.created - a.created);
  } catch (error) {
    logger.error('Failed to list backups', error);
    throw error;
  }
}

export async function restoreBackup(backupFilename) {
  try {
    const backupPath = path.join(BACKUP_DIR, backupFilename);
    const originalName = backupFilename.split('_')[0] + '.json';
    const targetPath = path.join(DATA_DIR, originalName);
    await backupFile(originalName);
    const backupData = await fs.readFile(backupPath, 'utf-8');
    await fs.writeFile(targetPath, backupData);

    logger.info(`Restored ${originalName} from backup: ${backupFilename}`);

    return { success: true, restored: originalName };
  } catch (error) {
    logger.error(`Failed to restore backup: ${backupFilename}`, error);
    throw error;
  }
}

export async function getBackupStats() {
  try {
    const backups = await listBackups();

    const stats = {
      total: backups.length,
      totalSize: backups.reduce((sum, b) => sum + b.size, 0),
      byFile: {},
    };
    for (const backup of backups) {
      const originalName = backup.name.split('_')[0] + '.json';

      if (!stats.byFile[originalName]) {
        stats.byFile[originalName] = {
          count: 0,
          size: 0,
          latest: null,
        };
      }

      stats.byFile[originalName].count++;
      stats.byFile[originalName].size += backup.size;

      if (!stats.byFile[originalName].latest || backup.created > stats.byFile[originalName].latest) {
        stats.byFile[originalName].latest = backup.created;
      }
    }

    return stats;
  } catch (error) {
    logger.error('Failed to get backup stats', error);
    throw error;
  }
}

export function startAutoBackup(intervalHours = 24) {
  const intervalMs = intervalHours * 60 * 60 * 1000;

  logger.info(`Starting auto-backup every ${intervalHours} hours`);
  backupAll().catch(err => logger.error('Auto-backup failed', err));
  setInterval(() => {
    backupAll().catch(err => logger.error('Auto-backup failed', err));
  }, intervalMs);
}
