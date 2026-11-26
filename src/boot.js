// Service worker registration. A new version waits until the user taps "Actualizar" on the Hoy tab.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      const watch = (w) => w.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) setWaitingWorker(w);
      });
      if (reg.waiting && navigator.serviceWorker.controller) setWaitingWorker(reg.waiting);
      reg.addEventListener('updatefound', () => reg.installing && watch(reg.installing));
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
    } catch (e) { /* offline support unavailable; app still works online */ }
  });
}
