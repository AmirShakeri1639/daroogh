import { Impersonation } from './';

export default (): void => {
  if (window.confirm('برای خروج اطمینان دارید؟')) {
    const impersonation = new Impersonation();
    if (impersonation.currentToken === impersonation.mainToken) {
      localStorage.clear();
      window.location.href = '#/login';
      window.location.reload();

    } else {
      impersonation.changeTokenToMain();
      window.location.reload();
    }
  }
};
