import errorHandler from "./errorHandler";

const checkVersion = () => {
  try {
    const defaultVersion = '0.1.0';
    const localVersion = localStorage.getItem('version') || defaultVersion;

    const packageJson = require('../../package.json');
    const remoteVersion = packageJson?.version || defaultVersion;

    if (remoteVersion !== localVersion) {
      localStorage.setItem('version', remoteVersion);
      localStorage.setItem('whatsNewExists', 'true');

      // Clear service worker's caches
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
      window.location.reload();
    }
  } catch (e) {
    errorHandler(e);
  }
}

export default checkVersion;
