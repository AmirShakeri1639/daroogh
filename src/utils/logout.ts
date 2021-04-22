import i18n from 'i18next'
import { Impersonation } from './';
import { confirmSweetAlert } from 'utils'

export default async (): Promise<any> => {
  const signout = await confirmSweetAlert(i18n.t('login.confirmSignOut'))
  if (signout) {
    const impersonation = new Impersonation();
    if (impersonation.currentToken === impersonation.mainToken) {
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
}
