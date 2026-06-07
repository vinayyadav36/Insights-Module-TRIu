export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // In production built with Vite, the sw file will be moved to dist/
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);

          // Check for updates periodically
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Update available
                    console.log('New content is available; please refresh.');
                    // You can trigger an event or UI prompt here
                    window.dispatchEvent(new CustomEvent('pwa-update-available'));
                }
              });
            }
          });
        },
        (err) => {
          console.error('ServiceWorker registration failed: ', err);
        }
      );
    });
  }
}
