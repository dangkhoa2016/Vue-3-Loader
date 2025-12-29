<template>
  <div class="main-app">
    <header>
      <img src="https://vuejs.org/images/logo.png" alt="Vue Logo" height="50" />
      <h1>{{ title }}</h1>
    </header>
    <main>
      <div class="card">
        <h2>Store State</h2>
        <p>Message: {{ store.message }}</p>
        <p>Count: {{ store.count }}</p>
        <p>Loaded At: {{ store.loadedAt }}</p>
        <button @click="store.increment">Increment</button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMainStore } from '../assets/js/stores/main.js';

export default {
  setup() {
    const store = useMainStore();
    const title = ref('Vue 3 Loader with Pinia and Vue Demi');

    onMounted(() => {
      store.setLoadedAt();
    });

    return {
      title,
      store
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
