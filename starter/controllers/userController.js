const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const cloudinary = require('../utils/cloudinary');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'starter/public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })
// const multerStorage = multer.memoryStorage();
const multerStorage = multer.diskStorage({});

const multerFilter = (req, file, cb) => {
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
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
// exports.uploadMulterUserPhoto = multerUpload.single('image');

exports.uploadUserPhotoToCloudinary = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const cloudinaryUserOptions = {
    folder: 'Natours/Users',
    public_id: `user-${req.user.id}-${Date.now()}`,
    format: 'jpeg',
    width: 1000,
    height: 1000,
    gravity: 'faces',
    crop: 'fill',
  };

  result = await cloudinary.uploader.upload(
    req.file.path,
    cloudinaryUserOptions
  );
  // console.log(JSON.stringify(result, null, 4));
  req.file.filename = result.secure_url;

  next();
});

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(1000, 1000)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`starter/public/img/users/${req.file.filename}`);

//   next();
// });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please /updateMyPassword',
        400
      )
    );
  }

  // 2. Filtered out unnecessary fields.
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  } else {
    // filteredBody.photo = 'default.jpg';
    filteredBody.photo =
      'https://res.cloudinary.com/dwu4a8awx/image/upload/v1681223292/Natours/Users/default_vb6b7p.jpg';
  }

  // 3. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
    message: 'Your account was deleted!',
  });
});

exports.createUser = catchAsync(async (req, res) => {
  res.status(500).json({
    status: 'error',
    data: null,
    message: 'This route is not defined! Please access to /signup instead!',
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
