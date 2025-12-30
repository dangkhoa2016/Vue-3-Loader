<template>
  <div class="main-app">
    <header>
      <img src="https://vuejs.org/images/logo.png" alt="Vue Logo" height="50" />
      <h1>{{ $t('message.title') }}</h1>
      <div class="lang-switcher">
        <label>{{ $t('message.language') }}: </label>
        <select :value="locale" @change="changeLanguage" :disabled="isLoading">
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
          <option value="ko">한국어</option>
          <option value="ja">日本語</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </header>
    <div v-if="isLoading" class="progress-container">
      <div class="progress-bar"></div>
    </div>
    <main>
      <div class="card">
        <h2>{{ $t('message.store_state') }}</h2>
        <p>Message: {{ store.message }}</p>
        <p>{{ $t('message.count') }}: {{ store.count }}</p>
        <p>{{ $t('message.loaded_at') }}: {{ store.loadedAt }}</p>
        <button @click="store.increment">{{ $t('message.increment') }}</button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMainStore } from '../assets/js/stores/main.js';
import { useI18n } from 'vue-i18n';
import { loadLanguageAsync } from '../assets/js/i18n.js';

export default {
  setup() {
    const store = useMainStore();
    const { locale } = useI18n({ useScope: 'global' });
    const isLoading = ref(false);

    onMounted(() => {
      store.setLoadedAt();
    });

    const changeLanguage = async (event) => {
      const newLang = event.target.value;
      isLoading.value = true;
      try {
        await loadLanguageAsync(newLang);
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
      locale
    };
  }
}
</script>

<style scoped>
.main-app {
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
}
header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}
h1 {
  margin: 0;
  flex: 1;
  min-width: 0;
  line-height: 1.2;
}
.lang-switcher {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
@media (max-width: 600px) {
  header {
    flex-wrap: wrap;
  }
  h1 {
    width: 100%;
    margin-top: 10px;
  }
}
.lang-switcher select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.progress-container {
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  overflow: hidden;
  margin-bottom: 20px;
}
.progress-bar {
  height: 100%;
  background-color: #42b983;
  width: 100%;
  animation: indeterminate 1.5s infinite ease-in-out;
  transform-origin: 0% 50%;
}
@keyframes indeterminate {
  0% {
    transform: translateX(0) scaleX(0);
  }
  40% {
    transform: translateX(0) scaleX(0.4);
  }
  100% {
    transform: translateX(100%) scaleX(0.5);
  }
}
.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
button {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #3aa876;
}
</style>
