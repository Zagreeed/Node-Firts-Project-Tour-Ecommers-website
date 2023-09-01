const dotenv = require('dotenv');

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT-EXECEPTION');
  console.error(err.name, err.message);
  process.exit(1);
  s;
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port:${port}`);
});

(async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      autoIndex: true,
      useUnifiedTopology: true,
    });

    console.log('DATABASE CONNECTED');
  } catch (error) {
    console.log('UNHANDLED-REJECTION');
    console.error(`ERROR: ${error.message} / ${error.name}`);
    server.close(() => {
      process.exit(1);
    });
  }
})();

// process.on('unhandledRejection', (err) => {
//   console.log(err.name, err.message);
// });
