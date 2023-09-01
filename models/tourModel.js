const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
// const User = require('./userModel');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The Tour must have a name'],
      unique: true,
      maxlength: [40, 'The Tour name should be less or equal to 40 characters'],
      minlength: [10, 'The Tour name should be more or equal to 10 characters'],
      // validate: [validator.isAlpha, 'Tour name should only contain characters '],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'The Tour Must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'The Tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'The Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The difficulty has to be either easy, medium, difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'The Tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //// THIS WILL ONLY WORKS ON NEW CREATED/POST DOCUMENTS/DATA
        validator: function (val) {
          return val < this.price;
        },
        message:
          'The Discount price ({VALUE}) is greater than the original price',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'The rating should be above 1.0'],
      max: [5, 'The rating should be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Image Cover is required'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTours: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 1 MEANS ITS ASCENDING ORDER IF MINUS 1 IT MEANS DESCENDING ORDER
toursSchema.index({ price: 1, ratingsAverage: -1 });
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: '2dsphere' });

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration;
});

//VIRTUAL POPULATE
toursSchema.virtual('reviews', {
  ref: 'Reviews',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs bbefore .save() and .creat()
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//EMBEDED VERSION
// toursSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

//QUERY MIDDLEWARE
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTours: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

toursSchema.post(/^find/, function (docs, next) {
  console.log(`The time it took ${Date.now() - this.start} miliseconds`);
  next();
});

// toursSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTours: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
