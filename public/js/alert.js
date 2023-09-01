// TYPE IS EITHER SUCCESS OR ERROR

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// ONLY SUCCESS OR ERROR
export const showAlert = (type, messg) => {
  hideAlert();
  const markUp = `<div class="alert alert--${type}">${messg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
  window.setTimeout(hideAlert, 5000);
};
