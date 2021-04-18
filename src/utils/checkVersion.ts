import { sweetAlert } from "utils"
import errorHandler from "./errorHandler"

/// Clears the browser cache and reloads the page
export const clearMyCache = () => {
  // Clear service worker's caches
  if (caches) {
    // Service worker cache should be cleared with caches.delete()
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name)
      }
    })
  }
  window.location.reload()
}

export const showWhatsNew = async (versionNo: string | number) => {
  const whatsNewFile =
    await (await fetch(window.location.origin + '/whatsnew.json')).json()
  const whatsNewData =
    whatsNewFile[versionNo]
      ? whatsNewFile[versionNo].map(
        (i: any) => { return (`<li>${i}</li>`) }
      ).join('') : ''
  if (whatsNewData) {
    sweetAlert({
      type: 'info',
      html: `بروزرسانی به نسخه ${versionNo} انجام شد!` +
        (whatsNewData.length > 0
          ? `<br /><div style="text-align: right; white-space: pre-line;">` +
          '<h3>تازه‌ها</h3>' +
          `<ul>${whatsNewData}</ul></div>`
          : '')
    })
  }
}

const checkVersion = (): boolean => {
  try {
    const defaultVersion = '0.1.0'
    const localVersion = localStorage.getItem('version') || defaultVersion

    const packageJson = require('../../package.json')
    const remoteVersion = packageJson?.version || defaultVersion

    if (remoteVersion !== localVersion) {
      localStorage.setItem('version', remoteVersion)
      localStorage.setItem('whatsNewExists', 'true')
      // clear cache and reload will be done in another method
      return true
    }
  } catch (e) {
    errorHandler(e)
  }

  return false
}

export default checkVersion
