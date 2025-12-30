<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="loader-container">
        <h1 class="loader-title">{{ $t('message.title') }}</h1>
        
        <div class="progress-bar-container">
          <div class="progress-bar" :class="progressClass" :style="{ width: totalProgress + '%' }"></div>
        </div>

        <div class="stage-indicators">
          <div 
            v-for="stage in stages" 
            :key="stage.id" 
            class="stage-item" 
            :class="{ active: progress[stage.id] === 100 }"
          >
            {{ stage.label }}
          </div>
        </div>

        <div class="status-text" :class="{ 'has-error': hasError }">
          {{ currentAction }} <span v-if="!hasError">({{ Math.round(totalProgress) }}%)</span>
        </div>
        <img src="/assets/img/loader.gif" class="loader-spinner" onerror="this.style.display='none'" />
      </div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
