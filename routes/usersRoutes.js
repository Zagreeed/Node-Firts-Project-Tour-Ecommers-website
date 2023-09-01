const express = require('express');
const fs = require('fs');
const router = express.Router();
const usersController = require('../controller/userController');
const authController = require('../controller/authController');

router.param('id', usersController.checkId);

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// ALL ROUTES BELOW THIS MIDDLEWARE OR THIS CODE LINE 15 WILL BE PROTECTED BY authController.protection
router.use(authController.protection);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', usersController.getMe, usersController.getSpecificUser);

router.patch(
  '/updateMe',
  usersController.uploadUserPhoto,
  usersController.updateMe
);
router.delete('/deleteMe', usersController.deleteMe);

///  THE CODE OR ROUTES BELOW CAN BE ONLY ACCESS BY ADMIN
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(usersController.getallUsers)
  .post(usersController.uploadUsers);
router
  .route('/:id')
  .patch(usersController.patchUsers)
  .delete(usersController.deleteUser)
  .get(usersController.getSpecificUser);

module.exports = router;
