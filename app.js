const path = require('path');
const express = require('express');
const { patch } = require('superagent');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const mongoSanitze = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const ErrorHandler = require('./controller/errorController');
const helmet = require('helmet');
const hpp = require('hpp');
const app = express();

// THE CODE BELOW IS DEFINE TO USE THE PUG TEMPLATE ENGINE AND TO LOCATE THE HTML FOLDER
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

console.log(process.env.NODE_ENV);

/////GLOBAL MIDDLEWARES
///SERVING STATIC FILES // NOTE THE PUBLIC FOLDER WILL AUTOMATICLY BE USE FOR THE VIEWS FOLDER
app.use(express.static(path.join(__dirname, 'public')));

//SET HTTP HEADERS

app.use(helmet({ contentSecurityPolicy: false }));
// app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: [],
//       connectSrc: [],
//       scriptSrc: [
//       https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js
//       ],
//       styleSrc: [],
//       workerSrc: [],
//       objectSrc: [],
//       imgSrc: [],
//       fontSrc: [],
//     },
//   })
// );

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//LIMIT REQUEST FROM SAME API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To much request from this IP, please try again later!',
});

app.use('/api', limiter);

//BODY PARESER / reading data form the body in to req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//DATA SANITIZAION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitze());

//DATA SANITIZATION AGAINST XSS
app.use(xss());

//PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//ROUTES

const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewsRouter');
const viewRouter = require('./routes/viewRoutes');

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} on this server`, 404));
});

app.use(ErrorHandler);

module.exports = app;
