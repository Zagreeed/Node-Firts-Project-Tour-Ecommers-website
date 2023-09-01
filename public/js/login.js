import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alert';
import { assign } from 'nodemailer/lib/shared';

export const login = async (pass, email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email: email,
        password: pass,
      },
    });

    if (res.data.message === 'Success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.message === 'Success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Logged Out! try again');
  }
};
