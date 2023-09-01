const fs = require('fs');
const Users = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];

    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload  only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.checkId = (req, res, next, val) => {
  console.log(`your id ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid id',
    });
  }
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Users.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    message: 'Succesfully deleted',
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1. creat error if there is passowrd or confirmpassword in the req.body

  if (req.body.password || req.body.confirmpassword) {
    return next(
      new AppError(
        'this route is not for password updates, pls use upatePassword',
        400
      )
    );
  }

  //2. filterd out unwanted fields names that are not allowed to be updated/change
  const filteredBody = filterObj(req.body, 'name', 'email');

  if (req.file) filteredBody.photo = req.file.filename;

  //3. update user document

  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.uploadUsers = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'This route is not  defined pls use /signup instead',
  });
};

// DO NOT UPDATE USERS WITH THIS!!!
exports.getallUsers = factory.getAll(Users);
exports.getSpecificUser = factory.getOne(Users);
exports.patchUsers = factory.updateOne(Users);
exports.deleteUser = factory.deleteOne(Users);
