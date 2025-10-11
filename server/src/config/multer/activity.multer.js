const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for activity image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine if it's a gallery image or main activity image
    const isGallery = req.path.includes('/gallery');
    const uploadPath = path.join(
      __dirname,
      '../../../public/images',
      isGallery ? 'activities/gallery' : 'activities'
    );

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = req.path.includes('/gallery') ? 'gallery-' : 'activity-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

const activityUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = activityUpload;
