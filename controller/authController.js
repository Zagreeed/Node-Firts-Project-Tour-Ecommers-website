const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const sendEmail = require('../utils/email');
//////////////

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const creatSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // CODE BELOW SHOULD REMOVE THE PASSWORD FROM THE OUTPUT ON SIGNUP/CREAT USER
  user.password = undefined;

  res.status(statusCode).json({
    message: 'Success',
    token,
    data: {
      user: user,
    },
  });
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    message: 'Success',
  });
};

//////////////

exports.signUp = catchAsync(async (req, res, next) => {
  const newUsers = await Users.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  creatSendToken(newUsers, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError(`Pls provide email and password`, 400));
  }

  const user = await Users.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Incorect email or password', 401));
  }

  creatSendToken(user, 200, res);
});

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

exports.protection = catchAsync(async (req, res, next) => {
  // /// GETING THE TOKEN
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new appError(
        'You are not logged in Please log-in first to get access',
        401
      )
    );
  }

  // /// CHECKING IF TOKEN IS NOT ALTERED BY SOMEONE/VERIFYING IF NOT EXPIRED
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //this will return the id , iat, exp
  // console.log(decoded);

  // /// CHECK IF THE USER STILL EXISTS

  const currentUser = await Users.findById(decoded.id);

  if (!currentUser) {
    return next(
      new appError('The USER belong to this TOKEN no longer exist!'),
      401
    );
  }

  // /// CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN WAS ISSUED
  console.log(currentUser);

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new appError('User recently changed the password!', 401));
  }

  ////AFTER ALL THAT THHE NEXT() WILL NOW GRANT THE ACCESS TO THE NEXT MIDLEWARE
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  //KONG WALA IMO ROLE  DIRI SA ..ROLES FALSE KA IF NAA NEXT()
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You don't have permission to perform this action"),
        403
      );
    }
    next();
  };
};

// ONLY FOR RENDERED PAGES AND THERE WILL BE NO ERROR

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await Users.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  //KONG WALA IMO ROLE  DIRI SA ..ROLES FALSE KA IF NAA NEXT()
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You don't have permission to perform this action"),
        403
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  ///GET THE EMAIL OF THE USER SO THAT WE CAN SEND RESET EMAIL IN HIS/HER EMAIL
  const user = await Users.findOne({ email: req.body.email });

  if (!user) {
    return next(new appError('There is no user with this email address', 404));
  }

  // GENERATE RANDOM RESET TOKEN
  const resetToken = user.CreatPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  console.log(resetUrl);

  const message = `Forget your? password? Submit a patch request with your new password and passwordConfirm to:${resetUrl}.\nif your didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token is (valid for 10 mins)',
      message: message,
    });

    res.status(200).json({
      status: 'Success',
      message: 'token send to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError('there was an error sending the email, try again later'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. GET THE USER TOKEN!!!!
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // console.log(user);

  //2. CHECK IF TOKEN HAS NOT EXPIRED AND IF USER EXITS THEN SET NEW PASWORD

  if (!user) {
    return next(new appError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3.UPDATE "passwordChangedAt" PROPERTY FOR THE USER

  //4. LOGIN THE USER IN AND SEND THE NEW JWT TOKEN
  creatSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. get user collection

  const user = await Users.findById(req.user.id).select('+password');

  //2. check if POSTED current password is correct

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError('Passord is not the same', 401));
  }

  //3. if so update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4. log user in , send jwt token
  creatSendToken(user, 200, res);
});
