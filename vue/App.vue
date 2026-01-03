<template>
  <div class="main-app">
    <header>
      <div class="header-top">
        <img src="https://vuejs.org/images/logo.png" alt="Vue Logo" height="60" />
        <div class="titles">
          <h1>{{ $t('message.title') }}</h1>
          <h2 class='subtitle'>{{ $t('message.app.subtitle') }}</h2>
        </div>
        <div class="lang-switcher">
          <label>{{ $t('message.app.language') }}: </label>
          <select :value="locale" @change="changeLanguage" :disabled="isLoading">
            <option v-for="lang in supportedLanguages" :key="lang.code" :value="lang.code">
              {{ lang.label }}
            </option>
          </select>
        </div>
      </div>
      <p class="description">{{ $t('message.app.description') }}</p>
    </header>
    <div v-if="isLoading" class="progress-container">
      <div class="progress-bar"></div>
    </div>
    <main>
      <div class="card">
        <h3>{{ $t('message.store.store_state') }}</h3>
        <p>Message: {{ $t(store.message) }}</p>
        <p>{{ $t('message.store.count') }}: {{ store.count }}</p>
        <p>{{ $t('message.store.loaded_at') }}: {{ store.loadedAt }}</p>
        <button @click="store.increment">{{ $t('message.store.increment') }}</button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMainStore } from '/assets/js/stores/main.js';
import { useI18n } from 'vue-i18n';
import { loadLanguageAsync, SUPPORTED_LANGUAGES } from '/assets/js/i18n.js';

export default {
  setup() {
    const store = useMainStore();
    const { locale } = useI18n({ useScope: 'global' });
    const isLoading = ref(false);
    const supportedLanguages = SUPPORTED_LANGUAGES;

    onMounted(() => {
      store.setLoadedAt();
    });

    const changeLanguage = async (event) => {
      const newLang = event.target.value;
      isLoading.value = true;
      try {
        await loadLanguageAsync(newLang);
        localStorage.setItem('user-locale', newLang);
      } catch (e) {
        console.error(e);
        alert('Failed to load language');
      } finally {
        isLoading.value = false;
      }
    };

    return {
      store,
      changeLanguage,
      isLoading,
      locale,
      supportedLanguages
    };
  }
}
</script>
