<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="sun-glow"></div>
      <div class="water-caustics"></div>

      <div class="reef-blooms">
        <img class="reef-bloom bloom-left" src="https://cdn-icons-png.freepik.com/128/18285/18285335.png" alt="jellyfish" />
        <img class="reef-bloom bloom-mid" src="https://www.svgrepo.com/show/68646/jellyfish.svg" alt="starfish" />
        <img class="reef-bloom bloom-right" src="https://cdn-icons-png.freepik.com/512/2972/2972730.png" alt="sea shell" />
      </div>

      <div class="bubble-lift">
        <span
          v-for="bubble in 14"
          :key="bubble"
          class="micro-bubble"
          :style="{ animationDelay: bubble * 0.18 + 's' }"
        ></span>
      </div>

      <div class="drift-fish">
        <img
          v-for="(fish, idx) in driftSquids"
          :key="fish.id"
          class="drift-fish__item"
          :src="fish.src"
          alt="drifting squid"
          :style="{
            '--x': fish.x,
            '--dur': fish.dur,
            '--delay': fish.delay,
            '--x-wiggle': fish.xWiggle
          }"
          @animationiteration="reshuffleSquid(idx)"
        />
      </div>

      <div class="reef-card">
        <div class="reef-card__header">
          <div class="reef-badge">{{ $t('message.loader.coral_badge') }}</div>
          <h1>{{ $t('message.title') }}</h1>
          <p class="reef-tagline">{{ $t('message.loader.coral_tagline') }}</p>
        </div>

        <div class="progress-shell">
          <div class="progress-meter">
            <div class="meter-fill" :class="progressClass" :style="{ width: totalProgress + '%' }"></div>
          </div>
          <div class="progress-caption" :class="{ 'is-error': hasError }">
            <span class="action-text">{{ currentAction }}</span>
            <span v-if="!hasError" class="percent-text">{{ Math.round(totalProgress) }}%</span>
            <span v-else class="error-flag">{{ $t('message.loader.error_flag') }}</span>
          </div>
        </div>

        <div class="stage-timeline">
          <div
            v-for="stage in stages"
            :key="stage.id"
            class="stage-chip"
            :class="{ 'is-done': progress[stage.id] === 100, 'is-next': progress[stage.id] > 0 && progress[stage.id] < 100 }"
          >
            <div class="chip-dot"></div>
            <div class="chip-text">
              <span>{{ stage.label }}</span>
              <small>{{ progress[stage.id] || 0 }}%</small>
            </div>
          </div>
        </div>

        <div class="reef-illustration">
          <div class="coral-stack">
            <img src="https://cdn-icons-png.freepik.com/512/11913/11913765.png" alt="coral detail" />
            <img src="https://freesvg.org/img/1684755256coral.png" alt="coral" />
            <img src="https://cdn-icons-png.freepik.com/512/2739/2739429.png" alt="coral detail" />
          </div>
          <div class="shell-ring">
            <div class="pearl"></div>
            <div class="shell-wave"></div>
          </div>
        </div>
      </div>

      <div class="kelp-forest">
        <span v-for="kelp in 6" :key="kelp" :style="{ animationDelay: kelp * 0.3 + 's' }"></span>
      </div>
      <div class="seabed-mask"></div>
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
