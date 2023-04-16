const multer = require('multer');
const path = require('path');
const AppError = require('./appError');

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          'uploaded file is not an image! Please upload only images.',
          400
        ),
        false
      );
    }
  },
});
