const reviewController = require('../controller/reviewController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../controller/authController');

//This is example
//Now we use mergeParams so that we can still acsess on the tourId
//This will make sense bacuse we can't get the tourId in this router because this router uses
// "/api/v1/reviews" as default but wen we use mergeParams the "/:tourId/reviews" can be  acess as well which
// use to get the tourId

//Both "/api/v1/reviews" and "/:tourId/reviews" can be used

//POST /tour/:tourId/reviews

router.use(authController.protection);

router
  .route('/')
  .get(reviewController.getAllreviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.creatReviews
  );

router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .get(reviewController.getSpecifivReview);
module.exports = router;
