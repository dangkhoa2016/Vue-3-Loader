<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="tech-interface">
        <!-- Left: Hexagon Visual -->
        <div class="hex-scanner">
          <svg class="hex-svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f260" />
                <stop offset="100%" stop-color="#0575e6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- Background Hex -->
            <polygon class="hex-bg" points="190,100 145,177.9 55,177.9 10,100 55,22.1 145,22.1" />
            
            <!-- Progress Hex -->
            <polygon 
              class="hex-progress" 
              points="190,100 145,177.9 55,177.9 10,100 55,22.1 145,22.1"
              :stroke-dasharray="540"
              :stroke-dashoffset="540 - (totalProgress / 100 * 540)"
            />
          </svg>
          
          <div class="hex-content">
            <div class="scan-line"></div>
            <div class="percentage">{{ Math.round(totalProgress) }}<span class="small">%</span></div>
            <div class="status-text">{{ $t('message.loader.system_loading') }}</div>
          </div>
        </div>

        <!-- Right: System Panel -->
        <div class="system-panel">
          <div class="panel-header">
            <span class="blink">></span> {{ $t('message.loader.system_diagnostic') }}
          </div>
          <div class="stage-list">
            <div 
              v-for="stage in stages" 
              :key="stage.id" 
              class="stage-item"
              :class="{ 
                'active': progress[stage.id] > 0 && progress[stage.id] < 100,
                'completed': progress[stage.id] === 100,
                'pending': progress[stage.id] === 0
              }"
            >
              <div class="stage-status-icon">
                <span v-if="progress[stage.id] === 100">[OK]</span>
                <span v-else-if="progress[stage.id] > 0">[..]</span>
                <span v-else>[  ]</span>
              </div>
              <div class="stage-info">
                <div class="stage-name">{{ stage.label }}</div>
                <div class="stage-bar-container">
                  <div class="stage-bar-fill" :style="{ width: progress[stage.id] + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="current-action-log">
            <span class="log-prefix">root@system:~$</span> {{ currentAction }}<span class="cursor">_</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
