const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const multer = require('multer');

const cloudinary = require('cloudinary').v2;

dotenv.config({ path: './starter/config.env' });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Db connected successfully!'));

// READ JSAON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// DELETE ALL DATA FROM BD
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data delete successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// IMPORT DATA TO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data loaded successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const cloudinaryUserOptions = {
  folder: 'Natours/Users',
  public_id: `user-leo-${Date.now()}`,
  format: 'jpeg',
  width: 1000,
  height: 1000,
  gravity: 'faces',
  crop: 'fill',
};

const cloudinaryTourOptions = {
  folder: 'Natours/Tours',
  public_id: `tour-hiking-${Date.now()}`,
  format: 'jpeg',
  width: 2000,
  height: 1333,
  gravity: 'auto',
  crop: 'fill',
};

const uploadTourPhoto = async () => {
  try {
    await cloudinary.uploader.upload(
      'starter/dev-data/img/new-tour-2.jpg',
      cloudinaryTourOptions
    );
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const uploadUserPhoto = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      'starter/dev-data/img/leo.jpg',
      cloudinaryUserOptions
    );
    console.log(result.secure_url);
    console.log(result.public_id);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--uploadTour') {
  uploadTourPhoto();
} else if (process.argv[2] === '--uploadUser') {
  uploadUserPhoto();
}

console.log(process.argv);
