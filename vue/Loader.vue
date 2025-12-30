<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="bio-world">
        
        <!-- Starry Background -->
        <div class="stars"></div>
        <div class="stars-2"></div>

        <!-- The Moon (Progress Indicator) -->
        <div class="moon-container">
          <div class="moon">
            <div class="crater c1"></div>
            <div class="crater c2"></div>
            <div class="crater c3"></div>
          </div>
          <div class="moon-glow" :style="{ opacity: totalProgress / 100 }"></div>
        </div>

        <!-- Floating Crystal Castle (Goal) -->
        <div class="crystal-castle">
          <svg viewBox="0 0 200 200" class="castle-svg">
            <defs>
              <linearGradient id="citadel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e0e7ff" />
                <stop offset="50%" stop-color="#818cf8" />
                <stop offset="100%" stop-color="#4338ca" />
              </linearGradient>
              <filter id="citadel-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Main Tower Body -->
            <path d="M80,160 L80,80 L100,40 L120,80 L120,160 Z" fill="url(#citadel-grad)" filter="url(#citadel-glow)" />
            
            <!-- Side Towers -->
            <path d="M50,140 L50,100 L65,80 L80,100 L80,140 Z" fill="url(#citadel-grad)" opacity="0.8" />
            <path d="M150,140 L150,100 L135,80 L120,100 L120,140 Z" fill="url(#citadel-grad)" opacity="0.8" />

            <!-- Floating Rings -->
            <ellipse cx="100" cy="60" rx="40" ry="10" fill="none" stroke="#a5b4fc" stroke-width="2" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 100 60" to="360 100 60" dur="10s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="100" cy="60" rx="50" ry="5" fill="none" stroke="#c7d2fe" stroke-width="1" opacity="0.4">
              <animateTransform attributeName="transform" type="rotate" from="360 100 60" to="0 100 60" dur="15s" repeatCount="indefinite"/>
            </ellipse>

            <!-- Top Crystal -->
            <path d="M100,20 L110,40 L100,50 L90,40 Z" fill="#fff">
              <animate attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="3s" repeatCount="indefinite"/>
            </path>

            <!-- Base -->
            <path d="M40,160 Q100,190 160,160 L120,160 L80,160 Z" fill="#312e81" opacity="0.8" />
          </svg>
          <div class="energy-ring"></div>
        </div>

        <!-- The Bioluminescent Beanstalk -->
        <div class="beanstalk-system">
          <!-- The Glowing Vine -->
          <svg class="vine-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="vine-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#064e3b" /> <!-- Dark Emerald -->
                <stop offset="50%" stop-color="#10b981" /> <!-- Emerald -->
                <stop offset="100%" stop-color="#34d399" /> <!-- Light Emerald -->
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- Growth Path - Ends at 20% from top (approx castle base) -->
            <path 
              class="vine-core" 
              d="M50,100 Q45,90 50,80 T50,60 T50,40 T50,25" 
              fill="none" 
              stroke="url(#vine-gradient)" 
              stroke-width="4"
              stroke-linecap="round"
              filter="url(#glow)"
              :stroke-dasharray="100"
              :stroke-dashoffset="100 - (totalProgress * 0.85)"
            />
          </svg>

          <!-- Glowing Leaf Nodes -->
          <div 
            v-for="(stage, index) in stages" 
            :key="stage.id"
            class="bio-node"
            :class="{ 
              'active': progress[stage.id] > 0,
              'completed': progress[stage.id] === 100,
              'left': index % 2 === 0,
              'right': index % 2 !== 0
            }"
            :style="{ bottom: ((index + 1) * (75 / stages.length)) + '%' }"
          >
            <div class="node-connector"></div>
            <div class="glowing-leaf">
              <div class="leaf-veins"></div>
            </div>
            <div class="node-label">
              <span class="label-text">{{ stage.label }}</span>
              <div class="mini-progress" v-if="progress[stage.id] > 0 && progress[stage.id] < 100">
                <div class="mini-bar" :style="{ width: progress[stage.id] + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Spirit Jack -->
        <div class="spirit-jack" :style="{ bottom: (totalProgress * 0.75) + '%' }">
          <div class="spirit-body"></div>
          <div class="spirit-trail"></div>
          <div class="spirit-light"></div>
        </div>

        <!-- HUD / UI -->
        <div class="ui-layer">
          <div class="header-title">
            <h1>{{ $t('message.title') }}</h1>
            <div class="subtitle">{{ $t('message.loader.system_ascension') }}</div>
          </div>

          <div class="status-bar">
            <div class="action-log">
              <span class="icon">✨</span>
              <span class="text">{{ currentAction }}</span>
            </div>
            <div class="percent-counter">
              {{ Math.round(totalProgress) }}%
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
