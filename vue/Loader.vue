<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="stars"></div>
      <div class="twinkling"></div>
      
      <div class="loader-container">
        <h1 class="mission-title">{{ $t('message.title') }}</h1>
        
        <div class="progress-track">
          <div class="progress-fill" :class="progressClass" :style="{ width: totalProgress + '%' }">
            <div class="rocket-ship">🚀</div>
            <div class="flame-trail"></div>
          </div>
        </div>

        <div class="stage-indicators">
          <div 
            v-for="stage in stages" 
            :key="stage.id" 
            class="stage-item" 
            :class="{ active: progress[stage.id] === 100 }"
          >
            <span class="planet-icon" v-if="progress[stage.id] === 100">🪐</span>
            <span class="planet-icon" v-else>🌑</span>
            {{ stage.label }}
          </div>
        </div>

        <div class="status-panel" :class="{ 'has-error': hasError }">
          <div class="status-line">
            <span class="label">{{ $t('message.loader.status_label') }}</span> 
            <span class="value">{{ currentAction }}</span>
          </div>
          <div class="status-line">
            <span class="label">{{ $t('message.loader.velocity_label') }}</span> 
            <span class="value" v-if="!hasError">{{ Math.round(totalProgress * 10) }} km/s</span>
            <span class="value error" v-else>{{ $t('message.loader.critical_failure') }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
