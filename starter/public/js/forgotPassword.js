/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const sendResetPasswordLink = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Reset password link sent successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm, resetURL) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${resetURL}`,
      data: {
        password,
        passwordConfirm,
      },
    });
    if ((res.data.status = 'success')) {
      showAlert('success', 'Password reset successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 5500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
