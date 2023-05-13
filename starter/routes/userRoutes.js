const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

router.use('/:userId/reviews', reviewRouter);
router.use('/:userId/bookings', bookingRoutes);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.uploadUserPhotoToCloudinary,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// Grants access to belowed actions only to admin
router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
