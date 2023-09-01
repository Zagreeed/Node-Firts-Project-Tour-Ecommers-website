const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Reviews = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

(async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      autoIndex: true,
      useUnifiedTopology: true,
    });

    console.log('DATABASE CONNECTED');
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
})();

const tours = JSON.parse(fs.readFileSync('dev-data/data/tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('dev-data/data/users.json', 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync('dev-data/data/reviews.json', 'utf-8')
);

const importData = async () => {
  try {
    // await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Reviews.create(reviews);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Reviews.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
