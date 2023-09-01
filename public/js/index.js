import { login, logout } from './login';
import { updateSettings } from './updateSettings';
// WE SEPARATE THE FORM ELEMENT SO THAT WE CAN CHECK IF THE FORM EXIST IN THE HTML
// BECAUSE IF NOT LIKE FOR EXAMPLE WE ARE IN THE HOME PAGE, THE CODE WILL READ THE FORM.EVENTLISTENER
// WHICH DOES NOT EXIST THEREFOR THROWING A ERROR
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userFormSettings = document.querySelector('.form-user-data');
const userPassSettings = document.querySelector('.form-user-settings');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(password, email);
  });
}

if (logoutBtn)
  logoutBtn.addEventListener('click', () => {
    logout();
  });

if (userFormSettings) {
  userFormSettings.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });
}

if (userPassSettings) {
  userPassSettings.addEventListener('submit', async (e) => {
    e.preventDefault();
    const savePassBtn = (document.querySelector('.btn--save-pass').textContent =
      'Updating....');
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    savePassBtn = document.querySelector('.btn--save-pass').textContent =
      'Save Password';
    passwordCurrent = document.getElementById('password-current').value = '';
    password = document.getElementById('password').value = '';
    passwordConfirm = document.getElementById('password-confirm').value = '';
  });
}
