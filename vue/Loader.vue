<template>
  <transition name="fade">
    <div v-if="!completed" class="desert-overlay">
      <div class="sky"></div>
      <div class="sun"></div>

      <div class="clouds">
        <span class="cloud"></span>
        <span class="cloud"></span>
        <span class="cloud"></span>
      </div>

      <div class="dunes">
        <div class="dune back"></div>
        <div class="dune mid"></div>
        <div class="dune front"></div>
      </div>

      <div class="oasis-card">
        <div class="oasis-header">
          <div class="oasis-chip">{{ $t('message.loader.oasis_route') }}</div>
          <h1>{{ $t('message.title') }}</h1>
          <p class="oasis-tagline">{{ $t('message.loader.oasis_tagline') }}</p>
        </div>

        <div class="water-gauge">
          <div class="gauge-bar">
            <div class="gauge-fill" :class="progressClass" :style="{ width: totalProgress + '%' }"></div>
            <div class="gauge-glare"></div>
          </div>
          <div class="gauge-caption" :class="{ 'is-error': hasError }">
            <span class="action-text">{{ currentAction }}</span>
            <span v-if="!hasError" class="percent-text">{{ Math.round(totalProgress) }}%</span>
            <span v-else class="error-flag">{{ $t('message.loader.error_flag') }}</span>
          </div>
        </div>

        <div class="stage-chips">
          <div
            v-for="stage in stages"
            :key="stage.id"
            class="stage-pill"
            :class="{ done: progress[stage.id] === 100, next: progress[stage.id] > 0 && progress[stage.id] < 100 }"
          >
            <span class="pill-label">{{ stage.label }}</span>
            <span class="pill-percent">{{ progress[stage.id] || 0 }}%</span>
          </div>
        </div>

        <div class="oasis-visual">
          <div class="palms">
            <img src="https://cdn-icons-png.freepik.com/512/4777/4777231.png" alt="palm tree" />
            <img class="palm-small" src="https://cdn-icons-png.freepik.com/512/1565/1565143.png" alt="palm tree small" />
          </div>
          <div class="lagoon">
            <div class="water"></div>
            <div class="ripples"></div>
          </div>
          <div class="camps">
            <img class='camel' src="https://cdn-icons-png.freepik.com/512/15622/15622680.png" alt="camel" />
            <img class="tent" src="https://cdn-icons-png.freepik.com/512/998/998851.png" alt="tent" />
          </div>
        </div>
      </div>

      <div class="caravan">
        <img v-for="camel in 4" :key="camel" src="https://cdn-icons-png.freepik.com/512/6369/6369769.png" alt="camel" />
      </div>

      <img class="cactus" src="https://cdn-icons-png.freepik.com/512/12385/12385789.png" alt="cactus" />
    </div>
  </transition>
</template>

<script src="./Loader.js"></script>
