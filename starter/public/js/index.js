/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';
import { sendResetPasswordLink, resetPassword } from './forgotPassword';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const bookBtn = document.getElementById('book-tour');
const loginForm = document.querySelector('.form--login');
const forgotPasswordForm = document.querySelector('.form--forgot-password');
const resetPasswordForm = document.querySelector('.form--reset-password');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const alertMessage = document.querySelector('body').dataset.alert;
// const fileInput = document.querySelector('.form-user-data .form__upload');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    sendResetPasswordLink(email);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--reset-password').textContent = 'Resetting...';
    const URL = window.location.href.toString();
    const resetToken = URL.substring(URL.lastIndexOf('/') + 1);

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await resetPassword(password, passwordConfirm, resetToken);

    document.querySelector('.btn--reset-password').textContent = 'Submit';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (alertMessage) showAlert('success', alertMessage, 20);
// if (fileInput) {
//     fileInput.addEventListener('change', function(e) {
//         const img = document.querySelector('.form-user-data .form__upload');
//         const { 0: file, length } = this.files;
//         if (length == 0) return
//         img.src = URL.createObjectURL(file);

//         const form = new FormData();
//         form.append('photo', document.querySelector('photo').files[0]);
//         img.onload = function() {
//             URL.revokeObjectURL(this.src);
//         }
//     })
// }

// if (fileInput) {
//     fileInput.addEventListener('change', async(e) => {

//         const form = new FormData();
//         form.append('photo', document.querySelector('photo').files[0]);

//         const newImage = await updateSettings(form, 'photo');
//         if (newImage) {
//             document.querySelector('.nav__user-img').setAttribute('src', `/img/users/${newImage}`);
//             document.querySelector('.form__user-photo').setAttribute('src', `/img/users/${newImage}`);
//         }
//     })
// }
