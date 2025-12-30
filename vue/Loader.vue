<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="pixel-window">
        <div class="window-header">
          <span class="window-title">SYSTEM_LOADER.EXE</span>
          <div class="window-controls">
            <span class="control">_</span>
            <span class="control">□</span>
            <span class="control">×</span>
          </div>
        </div>
        
        <div class="window-content">
          <h1 class="pixel-title">{{ $t('message.title') }}</h1>
          
          <div class="pixel-scene">
            <div class="pixel-ground"></div>
            <div class="pixel-hero" :style="{ left: totalProgress + '%' }">
              👾
            </div>
          </div>

          <div class="pixel-progress-container">
            <div class="pixel-progress-bar" :class="progressClass" :style="{ width: totalProgress + '%' }"></div>
          </div>

          <div class="pixel-stages">
            <div 
              v-for="stage in stages" 
              :key="stage.id" 
              class="pixel-stage-item" 
              :class="{ active: progress[stage.id] === 100 }"
            >
              <span class="check-box">[{{ progress[stage.id] === 100 ? '✓' : ' ' }}]</span>
              {{ stage.label }}
            </div>
          </div>

          <div class="pixel-status" :class="{ 'has-error': hasError }">
            > {{ currentAction }}
            <span v-if="!hasError" class="blink">_</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
