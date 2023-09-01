const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The user must have a name'],
    unique: true,
  },
  email: {
    type: String,
    required: [
      true,
      'The user must have an email for log-in and verification purpose',
    ],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Pls provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'The user must have a password'],
    minlength: [10, 'The password must have a minimum of 10 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Pls put the confirmation password'],
    ///// THE CODE BELOW WILL ONLY WORK ON CREAT AND SAVE
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password doesn't mactch",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  /// THE CODE BELOW WILL ONLY FUN IF THE PASSWORD IS MODIFIED
  if (!this.isModified('password')) return next();
  // THE CODE BELOW HASH THE PASSWORD WITH COST OF 12 OR 8
  this.password = await bcrypt.hash(this.password, 8);
  // THEN THE CODE BELOW DELETE THE PASSWORD-CONFIRM FIELD
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    console.log(changeTimeStamp, jwtTimeStamp);

    return jwtTimeStamp < changeTimeStamp; ///100 200 ///TRUE OR FALSE IS THE RESULT
  }

  return false;
};

userSchema.methods.CreatPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(31).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
