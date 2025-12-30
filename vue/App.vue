<template>
  <div class="main-app">
    <header>
      <div class="header-top">
        <img src="https://vuejs.org/images/logo.png" alt="Vue Logo" height="60" />
        <div class="titles">
          <h1>{{ $t('message.title') }}</h1>
          <h2 class='subtitle'>{{ $t('message.subtitle') }}</h2>
        </div>
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
      </div>
      <p class="description">{{ $t('message.description') }}</p>
    </header>
    <div v-if="isLoading" class="progress-container">
      <div class="progress-bar"></div>
    </div>
    <main>
      <div class="card">
        <h3>{{ $t('message.store_state') }}</h3>
        <p>Message: {{ $t(store.message) }}</p>
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
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: white;
}
.header-top {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.titles {
  flex: 1;
  min-width: 0;
}
h1 {
  margin: 0 0 5px 0;
  line-height: 1.2;
  font-size: 1.8rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #ffffff;
}
h2.subtitle {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 400;
  opacity: 0.9;
  color: #b4e567
}
.description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 15px;
}
.lang-switcher {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.lang-switcher select {
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.2);
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: bold;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}
.lang-switcher select:hover {
  background-color: rgba(255, 255, 255, 0.25);
}
.lang-switcher select option {
  background-color: #35495e;
  color: white;
}
@media (max-width: 600px) {
  .header-top {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  .titles {
    width: 100%;
  }
  h1 {
    font-size: 1.5rem;
  }
  .lang-switcher {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
  .description {
    text-align: center;
    font-size: 0.9rem;
  }
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
