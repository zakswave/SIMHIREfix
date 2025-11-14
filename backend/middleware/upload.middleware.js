import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
async function ensureUploadDirs() {
  const dirs = [
    UPLOAD_DIR,
    path.join(UPLOAD_DIR, 'documents'),
    path.join(UPLOAD_DIR, 'avatars'),
    path.join(UPLOAD_DIR, 'portfolios'),
    path.join(UPLOAD_DIR, 'logos'),
    path.join(UPLOAD_DIR, 'simulasi'),
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

ensureUploadDirs();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(UPLOAD_DIR, 'documents');
    if (file.fieldname === 'avatar') {
      uploadPath = path.join(UPLOAD_DIR, 'avatars');
    } else if (file.fieldname === 'logo') {
      uploadPath = path.join(UPLOAD_DIR, 'logos');
    } else if (file.fieldname.includes('portfolio')) {
      uploadPath = path.join(UPLOAD_DIR, 'portfolios');
    } else if (file.fieldname.includes('simulasi')) {
      uploadPath = path.join(UPLOAD_DIR, 'simulasi');
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});
const FILE_SIZE_LIMITS = {
  avatar: 2 * 1024 * 1024,
  logo: 2 * 1024 * 1024,
  document: 5 * 1024 * 1024,
  portfolio: 10 * 1024 * 1024,
  simulasi: 5 * 1024 * 1024,
  default: 5 * 1024 * 1024,
};
function getFileSizeLimit(fieldname) {
  if (fieldname === 'avatar') return FILE_SIZE_LIMITS.avatar;
  if (fieldname === 'logo') return FILE_SIZE_LIMITS.logo;
  if (fieldname.includes('portfolio')) return FILE_SIZE_LIMITS.portfolio;
  if (fieldname.includes('simulasi')) return FILE_SIZE_LIMITS.simulasi;
  if (fieldname.includes('ktp') || fieldname.includes('npwp') || fieldname.includes('cv')) {
    return FILE_SIZE_LIMITS.document;
  }
  return FILE_SIZE_LIMITS.default;
}
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx/;
  const allowedAllTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|zip|rar/;

  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  const mimetype = file.mimetype;
  if (file.fieldname === 'avatar' || file.fieldname === 'logo') {
    if (allowedImageTypes.test(ext) && mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed for avatar/logo'));
  }

  if (file.fieldname.includes('ktp') || file.fieldname.includes('npwp')) {
    if (allowedImageTypes.test(ext) || allowedDocTypes.test(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only image or PDF files are allowed for documents'));
  }
  if (allowedAllTypes.test(ext)) {
    return cb(null, true);
  }

  cb(new Error(`Invalid file type: ${ext}. Allowed types: JPEG, PNG, PDF, DOC, DOCX, ZIP, RAR`));
};
const createUpload = (fieldname) => multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: getFileSizeLimit(fieldname),
    files: 10,
  }
});
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.default,
    files: 10,
  }
});
export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
export const uploadFields = (fields) => upload.fields(fields);
export function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const fieldname = req.file?.fieldname || 'file';
      const limit = getFileSizeLimit(fieldname);
      const limitMB = (limit / (1024 * 1024)).toFixed(0);

      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size for ${fieldname} is ${limitMB}MB.`,
        code: 'FILE_TOO_LARGE',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded. Maximum is 10 files per request.',
        code: 'TOO_MANY_FILES',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field in upload.',
        code: 'UNEXPECTED_FIELD',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
      code: 'UPLOAD_ERROR',
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed.',
      code: 'UPLOAD_FAILED',
    });
  }

  next();
}

export default {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError,
};
