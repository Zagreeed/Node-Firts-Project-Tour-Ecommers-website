const Reviews = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

exports.getAllreviews = factory.getAll(Reviews);

exports.setTourUserIds = (req, res, next) => {
  //ALLOWED NESTED ROUTES
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getSpecifivReview = factory.getOne(Reviews);

exports.creatReviews = factory.creatOne(Reviews);

exports.updateReview = factory.updateOne(Reviews);

exports.deleteReview = factory.deleteOne(Reviews);
