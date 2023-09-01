const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});

exports.getSpecificTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reviews, rating, user',
  });

  if (!tours) {
    return next(new AppError('This Tour does not Exist', 404));
  }

  res.status(200).render('tour', {
    title: tours.name,
    tours: tours,
  });
});

exports.getUser = (req, res) => {
  res.status(200).render('login_page', {
    title: 'login ',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account ',
  });
};

exports.updateUserDate = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // NOTE THAT THE CODE BELOW CHANGE THE USER SO THAT WHEN THE WEBSITE IS RELOAD THE UPDATED USER DATA WILL BE USED INSTEAD
  // THATS WHY WE CHANGE THE 'user: updatedUser'
  res.status(200).render('account', {
    title: 'Your account ',
    user: updatedUser,
  });
});
