<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="scan-line"></div>
      <div class="loader-container">
        <div class="hud-corner top-left"></div>
        <div class="hud-corner top-right"></div>
        <div class="hud-corner bottom-left"></div>
        <div class="hud-corner bottom-right"></div>
        
        <h1 class="loader-title">
          <span class="prefix">></span> {{ $t('message.title') }}<span class="cursor">_</span>
        </h1>
        
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
            [{{ progress[stage.id] === 100 ? 'X' : ' ' }}] {{ stage.label }}
          </div>
        </div>

        <div class="status-text" :class="{ 'has-error': hasError }">
          <div class="status-header">
            <span class="system-msg">{{ $t('message.loader.system_status') }}</span>
            <span v-if="!hasError" class="percentage">[{{ Math.round(totalProgress) }}%]</span>
          </div>
          <div class="status-detail">{{ currentAction }}</div>
        </div>
        <!-- Hidden spinner for this theme, or styled differently -->
        <img src="/assets/img/loader.gif" class="loader-spinner" onerror="this.style.display='none'" />
      </div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
