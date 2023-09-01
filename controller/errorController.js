const AppError = require('../utils/appError');

const handleErrorDb = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDupErrorDb = (err) => {
  const message = `The field Value: "${err.keyValue.name}", is already existed please use other name`;

  return new AppError(message, 409);
};

const handleInvalidErrorDb = (err) => {
  const errorss = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid field value: ${errorss.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      stack: err.stack,
      error: err,
      message: err.message,
    });
  }
  // RENDERED WEBSITE
  return res.status(res.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorPro = (err, req, res) => {
  //  a.) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOptional) {
      //Operational, Trusted Erro: Send message to the client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //Programming or other unknow error: Dont show to the clients
    }

    // UNKNOW ERROR
    console.error('ERROR🤔', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // b.) RENDERED WEBSITE
  if (err.isOptional) {
    //Operational, Trusted Erro: Send message to the client
    return res.status(res.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
    //Programming or other unknow error: Dont show to the clients
  }

  // UNKNOW ERROR

  console.error('ERROR🤔', err);

  return res.status(500).json({
    status: 'error',
    msg: 'Something went worng, pls try again later',
  });
};

const handlejwtError = (err) => {
  const message = 'The JsonWebToken is wrong!!';

  return new AppError(message, 401);
};

const handlejwtExpError = (err) =>
  new AppError('The JWT-TOKEN is expired', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    error.message = err.message;
    if (error.name === 'CastError') error = handleErrorDb(error);
    if (error.code === 11000) error = handleDupErrorDb(error);
    if (error.name === 'ValidationError') error = handleInvalidErrorDb(error);
    if (error.name === 'JsonWebTokenError') error = handlejwtError(error);
    if (error.name === 'TokenExpiredError') error = handlejwtExpError(error);

    sendErrorPro(error, req, res);
  }

  next();
};
