import { reactive, ref, computed } from 'vue';

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default {
  setup() {
    const currentAction = ref('Initializing...');
    const currentStage = ref('');
    const completed = ref(false);
    const hasError = ref(false);

    // Helper functions
    const safeFetch = async (url) => {
      currentAction.value = `Loading ${url}...`;
      const res = await fetch(url);
      if (!res.ok) {
        const msg = res.status === 404 ? 'Not Found' : (res.statusText || 'Something went wrong');
        throw new Error(`Failed to load ${url}: ${msg}`);
      }
      return res;
    };

    const safeImport = async (url) => {
      currentAction.value = `Loading ${url}...`;
      try {
        return await import(url);
      } catch (e) {
        let msg = e.message;
        try {
          const res = await fetch(url);
          if (!res.ok) {
            msg = res.status === 404 ? 'Not Found' : 'Something went wrong';
          }
        } catch (_) {}
        throw new Error(`Failed to load ${url}: ${msg}`);
      }
    };

    const loadStyle = (href) => {
      currentAction.value = `Loading ${href}...`;
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = async () => {
          let msg = 'Network Error';
          try {
            const res = await fetch(href);
            if (!res.ok) {
              msg = res.status === 404 ? 'Not Found' : (res.statusText || 'Something went wrong');
            }
          } catch (_) {}
          reject(new Error(`Failed to load ${href}: ${msg}`));
        };
        document.head.appendChild(link);
      });
    };

    // Configuration for stages
    const stages = [
      {
        id: 'assets',
        label: 'Assets',
        action: async () => {
          await loadStyle('./assets/css/styles.css');
          await sleep(500);
        }
      },
      {
        id: 'libraries',
        label: 'Libraries',
        action: async () => {
          const arrLibs = [
            // Vue Demi (for Vue 2/3 compatibility libraries)
            'https://unpkg.com/vue-demi',
            // Pinia - State Management
            'https://cdn.jsdelivr.net/npm/pinia@3.0.4/dist/pinia.iife.prod.js',
          ];

          for (const libUrl of arrLibs) {
            currentAction.value = `Loading ${libUrl}...`;
            await loadJs(libUrl);
          }

          await sleep(500);
        }
      },
      {
        id: 'components',
        label: 'Components',
        action: async () => {
          await safeFetch('./vue/App.vue');
          await sleep(500);
        }
      },
      {
        id: 'store',
        label: 'Store',
        action: async () => {
          await safeImport('../assets/js/stores/main.js');
          await sleep(500);
        }
      },
      {
        id: 'app',
        label: 'App',
        action: async () => {
          currentAction.value = 'Starting Main App...';
          if (window.initMainApp) {
            const result = await window.initMainApp();
            if (result === false)
              throw new Error("initMainApp reported failure");
          } else {
            throw new Error("initMainApp is not defined");
          }

          await sleep(500);
        }
      }, {
        id: 'finalizing',
        label: 'Finalizing',
        action: async () => {
          currentAction.value = 'Finalizing...';
          await sleep(1500);
        }
      }
    ];

    // Initialize progress
    const progress = reactive({});
    stages.forEach(s => progress[s.id] = 0);

    const totalProgress = computed(() => {
      const total = stages.length * 100;
      const current = stages.reduce((acc, stage) => acc + (progress[stage.id] || 0), 0);
      return (current / total) * 100;
    });

    const progressClass = computed(() => {
      const p = totalProgress.value;
      const stageCount = stages.length;
      
      // Calculate current stage index (0 to stageCount-1)
      let index = Math.floor((p / 100) * stageCount);
      // Clamp index for 100% case
      if (index >= stageCount) index = stageCount - 1;

      // Last stage is always success
      if (index === stageCount - 1) return 'bg-success';

      // Cycle through other colors for intermediate stages
      const colors = ['bg-info', 'bg-warning', 'bg-purple', 'bg-emerald', 'bg-pink', 'bg-gray'];
      return colors[index % colors.length];
    });

    const finishLoadApp = () => {
      // Mark as completed
      completed.value = true;

      const timeToShow = 1000; // ms, see `.fade-leave-active { transition: opacity 0.8s ease; }` in loader.css
      document.getElementById('app').classList.add('visible');

      // Hide loader container completely after transition
      setTimeout(() => {
        const loaderEl = document.getElementById('loader');
        if (loaderEl) loaderEl.style.display = 'none';
        
        const loaderCss = document.getElementById('loader-css');
        if (loaderCss) loaderCss.remove();
      }, timeToShow);
    };

    const startLoading = async () => {
      try {
        for (const stage of stages) {
          currentStage.value = stage.label;
          await stage.action();
          progress[stage.id] = 100;
          // await sleep(1000); // Delay between stages
        }
      } catch (e) {
        console.log('Error during loading stages:', e);
        hasError.value = true;
        const msg = e instanceof Error ? e.message : (typeof e === 'string' ? e : 'Unknown error');
        currentAction.value = `Error loading ${currentStage.value}: ${msg}`;
        console.error(e);
      }

      if (!hasError.value)
        finishLoadApp();
    };

    const loadJs = async (src) => {
      let finalUrl = src;
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`Failed to load ${src}: ${res.status} ${res.statusText}`);
        finalUrl = res.url;
      } catch (e) {
        throw new Error(`Network error checking ${src}: ${e.message}`);
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = "anonymous";

        const errorHandler = (event) => {
          if (event.filename === finalUrl || event.filename === src) {
            cleanup();
            reject(new Error(`Script execution failed: ${event.message}`));
          }
        };

        const cleanup = () => {
          window.removeEventListener('error', errorHandler);
          script.onload = null;
          script.onerror = null;
        };

        window.addEventListener('error', errorHandler);

        script.onload = () => {
          cleanup();
          resolve();
        };

        script.onerror = () => {
          cleanup();
          reject(new Error(`Failed to load script tag: ${src}`));
        };

        document.head.appendChild(script);
      });
    };

    return {
      progress,
      stages,
      currentAction,
      currentStage,
      completed,
      totalProgress,
      progressClass,
      startLoading,
      hasError
    };
  },
  mounted() {
    this.startLoading();
  }
}
