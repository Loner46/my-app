const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('../utils/appError');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    reguired: [true, 'Booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });

  next();
});

// bookingSchema.pre('save', async function (next) {
//   const tour = await Tour.findById(this.tour);
//   const startDate = tour.startDates.id(this.date);

//   // If there is a maximum number of participants, throw an error.
//   if (startDate.participants >= startDate.maxParticipants)
//     return next(
//       new AppError(
//         'Sorry, selected tpur already is fulled. Please book a tour on another date!',
//         403
//       )
//     );

//   startDate.participants++;
//   await tour.save();
//   next();
// });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
