const { createApp } = Vue;
const { loadModule } = window['vue3-sfc-loader'];
import * as I18nModule from '/assets/js/i18n.js';
const { loadLanguageAsync, detectBrowserLanguage } = I18nModule;

const options = {
  moduleCache: {
    vue: Vue,
    'vue-i18n': VueI18n,
    '/assets/js/i18n.js': I18nModule,
  },
  async getFile(url) {
    const res = await fetch(url);
    if (!res.ok)
      throw Object.assign(new Error(res.statusText + ' ' + url), { res });

    if (url.match(/\.(png|jpe?g|gif|svg|ico|webp)$/i)) {
      return {
        getContentData: (asBinary) => asBinary ? res.arrayBuffer() : `export default "${url}"`,
        type: '.mjs'
      }
    }

    return {
      getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
      type: url.endsWith('.js') ? '.mjs' : undefined
    }
  },
  addStyle(textContent) {
    const style = document.createElement('style');
    style.textContent = textContent;
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  }
};

// Main App Logic
async function initMainApp() {
  const { createPinia } = Pinia;

  try {
    const App = await loadModule('/vue/App.vue', options);
    const app = createApp(App);
    const pinia = createPinia();
    app.use(pinia);
    app.use(window.i18nInstance);

    // Language is already loaded by loaderApp, but we can ensure it here if needed
    // or just let it be. The i18n instance is shared.

    app.mount('#app');
    return true;
  } catch (err) {
    console.log("Failed to load main app:", err);
    const loaderEl = document.getElementById('loader');
    if (loaderEl) {
      loaderEl.innerHTML = `
        <div class="error-modal-overlay">
          <div class="error-modal-content">
            <h2 class="error-modal-title">Application Error</h2>
            <p class="error-modal-text">Failed to load the main application.</p>
            <div class="error-modal-details">
              ${err.message}
            </div>
            <button onclick="location.reload()" class="error-modal-button">Retry</button>
          </div>
        </div>
      `;
    }

    return false;
  }
}

// Expose initMainApp globally so Loader.vue can call it
window.initMainApp = initMainApp;

// Initialize Loader
(async () => {
  try {
    // Detect and load initial language BEFORE mounting loader
    const initialLang = detectBrowserLanguage();
    await loadLanguageAsync(initialLang);

    const Loader = await loadModule('/vue/Loader.vue', options);
    const loaderApp = createApp(Loader);

    // Use i18n in loaderApp
    loaderApp.use(window.i18nInstance);

    loaderApp.mount('#loader');
  } catch (err) {
    console.error("Failed to load loader component:", err);
    document.body.innerHTML = `
      <div class="error-modal-overlay">
        <div class="error-modal-content">
          <h2 class="error-modal-title">System Error</h2>
          <p class="error-modal-text">Failed to initialize application loader.</p>
          <div class="error-modal-details">
            ${err.message}
          </div>
          <button onclick="location.reload()" class="error-modal-button">Retry</button>
        </div>
      </div>
    `;
  }
})();
