const { defineStore } = Pinia;

export const useMainStore = defineStore('main', {
  state: () => ({
    message: 'Hello from Pinia Store!',
    count: 0,
    loadedAt: null
  }),
  actions: {
    increment() {
      this.count++;
    },
    setLoadedAt() {
      this.loadedAt = new Date().toLocaleString();
    }
  }
});
