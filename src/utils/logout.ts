export default (): void => {
  if (window.confirm('برای خروج اطمینان دارید؟')) {
    localStorage.clear();
    window.location.href = '#/login';
  }
};
