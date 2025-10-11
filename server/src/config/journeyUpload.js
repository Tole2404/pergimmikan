const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for journey file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const year = req.body.year || new Date().getFullYear();
    const uploadPath = path.join(__dirname, `../../public/images/journey/${year}`);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const journeyUpload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB
  }
});

module.exports = journeyUpload;
