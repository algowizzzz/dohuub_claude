import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure upload directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subdirectories based on type
    const type = (req.query.type as string) || 'general';
    const subDir = path.join(UPLOAD_DIR, type);

    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }

    cb(null, subDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// File filter for images
const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10, // Maximum 10 files per request
  },
});

// Upload single image
router.post('/image', authenticate, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const type = (req.query.type as string) || 'general';
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.API_PORT || 3001}`;

    const fileUrl = `${baseUrl}/uploads/${type}/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        id: req.file.filename.replace(/\.[^/.]+$/, ''), // UUID without extension
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        type,
      },
    });
  } catch (error: any) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

// Upload multiple images
router.post('/images', authenticate, upload.array('images', 10), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const type = (req.query.type as string) || 'general';
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.API_PORT || 3001}`;

    const uploadedFiles = files.map((file) => ({
      id: file.filename.replace(/\.[^/.]+$/, ''),
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${baseUrl}/uploads/${type}/${file.filename}`,
      type,
    }));

    res.json({
      success: true,
      data: uploadedFiles,
      count: uploadedFiles.length,
    });
  } catch (error: any) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload images' });
  }
});

// Delete file by ID or filename
router.delete('/:fileId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { fileId } = req.params;
    const { type = 'general' } = req.query;

    // Search for file with any extension
    const subDir = path.join(UPLOAD_DIR, type as string);

    if (!fs.existsSync(subDir)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const files = fs.readdirSync(subDir);
    const matchingFile = files.find(
      (f) => f === fileId || f.startsWith(`${fileId}.`)
    );

    if (!matchingFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(subDir, matchingFile);

    // Verify the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get file info
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { type = 'general' } = req.query;

    const subDir = path.join(UPLOAD_DIR, type as string);

    if (!fs.existsSync(subDir)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const files = fs.readdirSync(subDir);
    const matchingFile = files.find(
      (f) => f === fileId || f.startsWith(`${fileId}.`)
    );

    if (!matchingFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(subDir, matchingFile);
    const stats = fs.statSync(filePath);
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.API_PORT || 3001}`;

    res.json({
      success: true,
      data: {
        id: fileId,
        filename: matchingFile,
        size: stats.size,
        url: `${baseUrl}/uploads/${type}/${matchingFile}`,
        createdAt: stats.birthtime,
        type,
      },
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

export default router;
