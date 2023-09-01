const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeaturs = require('../utils/apiFeatures');
const { model } = require('mongoose');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndRemove(req.params.id);

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No Document found with that ID', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: document,
    });
  });

exports.creatOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = Model.findById(req.params.id).populate(popOptions);

    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: document,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // THE LINE 67 AND 68 IS TO ALLOWE NESTED GET REVIEWS ON TOUR
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    console.log(filter);

    const features = new APIFeaturs(Model.find(filter), req.query)
      .filter()
      .sorting()
      .fieldLimit()
      .pagenation();

    const document = await features.query;
    res.status(200).json({
      status: 'Success',
      results: document.length,
      data: document,
    });
  });
