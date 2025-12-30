<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="loader-card">
        <div class="header-section">
          <h1 class="title">{{ $t('message.title') }}</h1>
          <div class="subtitle">{{ currentAction }}</div>
        </div>

        <div class="stepper-container">
          <div class="connector-track">
            <div class="connector-fill" :style="{ width: connectorFillPercent + '%' }"></div>
          </div>

          <div 
            v-for="(stage, index) in stages" 
            :key="stage.id" 
            class="step-item" 
            :class="{ 
              'active': progress[stage.id] > 0 && progress[stage.id] < 100,
              'completed': progress[stage.id] === 100 
            }"
          >
            <div class="circle-wrapper">
              <div class="circle-bg"></div>
              <div class="circle-content">
                <span v-if="progress[stage.id] === 100" class="check-icon">✓</span>
                <span v-else class="step-number">{{ index + 1 }}</span>
              </div>
              <!-- Ripple effect for active state -->
              <div class="ripple" v-if="progress[stage.id] > 0 && progress[stage.id] < 100"></div>
            </div>
            <div class="step-label">{{ stage.label }}</div>
          </div>
        </div>

        <div class="footer-status" :class="{ 'has-error': hasError }">
          <div class="percentage">{{ Math.round(totalProgress) }}%</div>
          <div class="mini-spinner" v-if="!hasError && totalProgress < 100"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
