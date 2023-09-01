const express = require('express');

const router = express.Router();
const toursController = require('../controller/toursController');
const authController = require('../controller/authController');
const reviewRouter = require('./reviewsRouter');
// router.param('id', toursController.checkId);
//when /:tourId/reviews  is called it will use the reviewRouter insted of this router
router.use('/:tourId/reviews', reviewRouter);
  
router
  .route('/top-5-tours')
  .get(toursController.aliasTopTours, toursController.getAlltours);

router.route('/tours-stats').get(toursController.getToursStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protection,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    toursController.getMonthlyPlan
  );
////////////////////////

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(toursController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(toursController.getDistances);

router
  .route('/')
  .get(toursController.getAlltours)
  .post(
    authController.protection,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.uploadTours
  );

router
  .route('/:id')
  .patch(
    authController.protection,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.patchTours
  )
  .delete(
    authController.protection,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTours
  )
  .get(toursController.getSpecificTour);

module.exports = router;
