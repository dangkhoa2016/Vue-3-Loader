import { reactive, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { sleep } from '/assets/js/helper.js';

export default {
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const currentAction = ref(t('message.loader.initializing'));
    const currentStage = ref('');
    const completed = ref(false);
    const hasError = ref(false);

    // Helper functions
    const safeFetch = async (url) => {
      currentAction.value = t('message.loader.loading', { item: url });
      const res = await fetch(url);
      if (!res.ok) {
        const msg = res.status === 404 ? t('message.errors.not_found') : (res.statusText || t('message.errors.something_went_wrong'));
        throw new Error(t('message.errors.failed_to_load', { item: url, message: msg }));
      }
      return res;
    };

    const safeImport = async (url) => {
      currentAction.value = t('message.loader.loading', { item: url });
      try {
        return await import(url);
      } catch (e) {
        let msg = e.message;
        try {
          const res = await fetch(url);
          if (!res.ok) {
            msg = res.status === 404 ? t('message.errors.not_found') : t('message.errors.something_went_wrong');
          }
        } catch (_) {}
        throw new Error(t('message.errors.failed_to_load', { item: url, message: msg }));
      }
    };

    const loadStyle = (href) => {
      currentAction.value = t('message.loader.loading', { item: href });
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = async () => {
          let msg = t('message.errors.network_error');
          try {
            const res = await fetch(href);
            if (!res.ok) {
              msg = res.status === 404 ? t('message.errors.not_found') : (res.statusText || t('message.errors.something_went_wrong'));
            }
          } catch (_) {}
          reject(new Error(t('message.errors.failed_to_load', { item: href, message: msg })));
        };
        document.head.appendChild(link);
      });
    };

    // Configuration for stages
    const stages = computed(() => [
      {
        id: 'assets',
        label: t('message.loader.assets') || 'Assets',
        action: async () => {
          await loadStyle('/assets/css/styles.css');
          await sleep(500);
        }
      },
      {
        id: 'libraries',
        label: t('message.loader.libraries') || 'Libraries',
        action: async () => {
          const arrLibs = [
            // Vue Demi (for Vue 2/3 compatibility libraries)
            'https://unpkg.com/vue-demi',
            // Pinia - State Management
            'https://cdn.jsdelivr.net/npm/pinia@3.0.4/dist/pinia.iife.prod.js',
          ];

          for (const libUrl of arrLibs) {
            currentAction.value = t('message.loader.loading', { item: libUrl });
            await loadJs(libUrl);
          }

          await sleep(500);
        }
      },
      {
        id: 'components',
        label: t('message.loader.components') || 'Components',
        action: async () => {
          await safeFetch('/vue/App.vue');
          await sleep(500);
        }
      },
      {
        id: 'store',
        label: t('message.loader.store') || 'Store',
        action: async () => {
          await safeImport('/assets/js/stores/main.js');
          await sleep(500);
        }
      },
      {
        id: 'app',
        label: t('message.loader.app') || 'App',
        action: async () => {
          currentAction.value = t('message.loader.starting_app');
          if (window.initMainApp) {
            const result = await window.initMainApp();
            if (result === false)
              throw new Error(t('message.errors.init_failed'));
          } else {
            throw new Error(t('message.errors.init_undefined'));
          }

          await sleep(500);
        }
      }, {
        id: 'finalizing',
        label: t('message.loader.finalizing') || 'Finalizing',
        action: async () => {
          currentAction.value = t('message.loader.finalizing') + '...';
          await sleep(1500);
        }
      }
    ]);

    // Initialize progress
    const progress = reactive({});
    // Note: stages is now a computed, so we need to watch it or init differently
    // But for simplicity, we can just init all potential IDs or init on start
    // Let's just init based on the first value
    stages.value.forEach(s => progress[s.id] = 0);

    const totalProgress = computed(() => {
      const total = stages.value.length * 100;
      const current = stages.value.reduce((acc, stage) => acc + (progress[stage.id] || 0), 0);
      return (current / total) * 100;
    });

    const progressClass = computed(() => {
      const p = totalProgress.value;
      const stageCount = stages.value.length;
      const epsilon = 1e-6; // avoid floating point rounding down one bucket

      const bucketSize = 100 / stageCount;
      // Map progress into 0...(stageCount-1)
      let index = Math.min(Math.floor((p + epsilon) / bucketSize), stageCount - 1);

      // Show success only when we are actually done (or essentially done)
      if (completed.value || p >= 99.9) return 'bg-success';

      const colors = ['bg-info', 'bg-warning', 'bg-purple', 'bg-pink', 'bg-brown', 'bg-gray'];
      return colors[index % colors.length];
    });

    // Precomputed squid drift data for stable, natural motion
    const squidSources = [
      'https://cdn-icons-png.freepik.com/128/11355/11355124.png',
      'https://cdn-icons-png.freepik.com/128/16449/16449601.png',
      'https://cdn-icons-png.freepik.com/128/170/170462.png',
      'https://cdn-icons-png.freepik.com/128/7593/7593170.png',
      'https://cdn-icons-png.freepik.com/128/5559/5559826.png',
      'https://cdn-icons-png.freepik.com/128/3608/3608554.png',
      'https://cdn-icons-png.freepik.com/128/8708/8708475.png',
      'https://cdn-icons-png.freepik.com/128/468/468391.png',
      'https://cdn-icons-png.freepik.com/128/8710/8710232.png'
    ];

    const makeSquid = (idx, src) => {
      const durNum = 12 + Math.random() * 6; // 12s - 18s
      return {
        id: `squid-${idx}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        src,
        x: `${5 + Math.random() * 90}%`,
        dur: `${durNum}s`,
        delay: `${Math.random() * 1.8}s`,
        xWiggle: `${4 + Math.random() * 10}px`
      };
    };

    const driftSquids = ref(squidSources.map((src, idx) => makeSquid(idx, src)));

    const reshuffleSquid = (idx) => {
      const src = squidSources[idx % squidSources.length];
      const next = makeSquid(idx, src);
      driftSquids.value.splice(idx, 1, next);
    };

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
        for (const stage of stages.value) {
          currentStage.value = stage.label;
          await stage.action();
          progress[stage.id] = 100;
          await sleep(2000); // Delay between stages
        }
      } catch (e) {
        console.log('Error during loading stages:', e);
        hasError.value = true;
        const msg = e instanceof Error ? e.message : (typeof e === 'string' ? e : t('message.errors.unknown_error'));
        currentAction.value = t('message.loader.error_loading', { stage: currentStage.value, message: msg });
        console.error(e);
      }

      if (!hasError.value)
        finishLoadApp();
    };

    const loadJs = async (src) => {
      let finalUrl = src;
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(t('message.errors.failed_to_load', { item: src, message: `${res.status} ${res.statusText}` }));
        finalUrl = res.url;
      } catch (e) {
        throw new Error(t('message.errors.network_error_checking', { item: src, message: e.message }));
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = "anonymous";

        const errorHandler = (event) => {
          if (event.filename === finalUrl || event.filename === src) {
            cleanup();
            reject(new Error(t('message.errors.script_execution_failed', { message: event.message })));
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
          reject(new Error(t('message.errors.failed_to_load_script', { item: src })));
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
      hasError,
      driftSquids,
      reshuffleSquid
    };
  },
  mounted() {
    this.startLoading();
  }
}
