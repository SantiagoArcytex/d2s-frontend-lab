(() => {
  const defaultBaseUrl = (() => {
    try {
      const current = document.currentScript?.src ? new URL(document.currentScript.src) : new URL(window.location.href);
      return `${current.protocol}//${current.host}`;
    } catch {
      return window.location.origin;
    }
  })();

  function openPopup(url, name, features) {
    const popup = window.open(url, name, features);
    if (!popup) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }
    return popup;
  }

  function buildPopupUrl(baseUrl, appId, embedToken) {
    const url = new URL('/embed/auth', baseUrl);
    url.searchParams.set('appId', appId);
    url.searchParams.set('embedToken', embedToken);
    url.searchParams.set('pwaOrigin', window.location.origin);
    return url.toString();
  }

  async function authenticate({ appId, embedToken, baseUrl = defaultBaseUrl, popupFeatures = 'width=480,height=720' }) {
    if (!appId || !embedToken) {
      throw new Error('appId and embedToken are required');
    }

    const popupUrl = buildPopupUrl(baseUrl, appId, embedToken);
    openPopup(popupUrl, 'marketplace-embed-auth', popupFeatures);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Authentication timed out'));
      }, 2 * 60 * 1000);

      function cleanup() {
        clearTimeout(timeout);
        window.removeEventListener('message', onMessage);
      }

      function onMessage(event) {
        if (event.origin !== new URL(baseUrl).origin) {
          return;
        }
        const data = event.data || {};
        if (data.type !== 'EMBED_AUTH_RESULT') return;
        cleanup();
        resolve({ token: data.token, expiresAt: data.expiresAt, appId: data.appId });
      }

      window.addEventListener('message', onMessage);
    });
  }

  window.MarketplaceEmbed = {
    authenticate,
  };
})();
