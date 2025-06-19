// File: middleware/uploadFile.js
import multer from 'multer';
import path from 'path';

// Configure storage for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path where files will be uploaded
  },
  filename: (req, file, cb) => {
    // File name will be unique, prefixed with timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only specific types of files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;
