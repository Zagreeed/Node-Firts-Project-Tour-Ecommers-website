const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const viewController = require('../controller/viewController');

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get(
  '/tour/:slug',
  authController.isLoggedIn,
  viewController.getSpecificTour
);
router.get('/login', authController.isLoggedIn, viewController.getUser);
router.get('/me', authController.protection, viewController.getAccount);

router.post(
  '/submit-user-data',
  authController.protection,
  viewController.updateUserDate
);

module.exports = router;
