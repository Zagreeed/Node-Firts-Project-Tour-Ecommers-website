import axios from 'axios';
import { showAlert } from './alert';

// NOTE THAT "TYPE" IS EITHER 'PASSWORD' OR 'DATA'
export const updateSettings = async (data, type) => {
  try {
    const url = `${
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe'
    }`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    console.log(res);

    if (res.data.status === 'Success' || res.data.message) {
      showAlert(
        'success',
        `${
          type === 'password' ? 'Password' : 'Settings'
        } changed Succcessfully! `
      );
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message.split(':')[2]);
  }
};
