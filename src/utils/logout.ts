import { Impersonation } from './';

export default (): void => {
  if (window.confirm('برای خروج اطمینان دارید؟')) {
    const impersonation = new Impersonation();
    if (impersonation.currentToken === impersonation.mainToken) {
      debugger
      const version = localStorage.getItem('version')
      localStorage.clear();
      if (version) localStorage.setItem('version', version)
      window.location.href = '#/login';
      window.location.reload();
    } else {
      impersonation.changeTokenToMain();
      window.location.reload();
    }
  }
};
