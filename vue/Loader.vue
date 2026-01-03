<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="loader-container">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">{{ $t('message.title') }}</h1>
        
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

        <div style="margin-top: 15px;" :style="{ color: hasError ? '#dc3545' : '#555' }">
          {{ currentAction }} <span v-if="!hasError">({{ Math.round(totalProgress) }}%)</span>
        </div>
        <img src="/assets/img/loader.gif" style="width: 50px; margin-top: 20px;" onerror="this.style.display='none'" />
      </div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
