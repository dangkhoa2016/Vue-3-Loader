<template>
  <transition name="fade">
    <div v-if="!completed" class="loader-overlay">
      <div class="forest-scene">
        
        <!-- Sky & Atmosphere -->
        <div class="sky-gradient"></div>
        <div class="sun-moon"></div>
        <div class="clouds">
          <div class="cloud c1"></div>
          <div class="cloud c2"></div>
        </div>
        
        <!-- Background Layer -->
        <div class="forest-back">
          <div class="tree-silhouette t1"></div>
          <div class="tree-silhouette t2"></div>
          <div class="tree-silhouette t3"></div>
        </div>

        <!-- The Ancient Tree (Progress) -->
        <div class="ancient-tree-container">
          <svg class="tree-svg" viewBox="0 0 200 300" preserveAspectRatio="xMidYMax">
            <!-- Trunk -->
            <path 
              class="trunk-base" 
              d="M90,300 Q80,250 95,200 Q85,150 95,100 Q100,80 100,80 Q100,80 105,100 Q115,150 105,200 Q120,250 110,300 Z" 
              fill="#5D4037"
            />
            <!-- Progress Fill in Trunk -->
            <path 
              class="trunk-fill" 
              d="M90,300 Q80,250 95,200 Q85,150 95,100 Q100,80 100,80 Q100,80 105,100 Q115,150 105,200 Q120,250 110,300 Z" 
              fill="#FFD700"
              :style="{ clipPath: `inset(${100 - totalProgress}% 0 0 0)` }"
            />
            
            <!-- Branches (Left) -->
            <path class="branch b1" d="M95,200 Q70,180 50,190" fill="none" stroke="#5D4037" stroke-width="4" stroke-linecap="round" />
            <path class="branch b2" d="M95,150 Q60,130 40,140" fill="none" stroke="#5D4037" stroke-width="3" stroke-linecap="round" />
            
            <!-- Branches (Right) -->
            <path class="branch b3" d="M105,210 Q130,190 150,200" fill="none" stroke="#5D4037" stroke-width="4" stroke-linecap="round" />
            <path class="branch b4" d="M105,160 Q140,140 160,150" fill="none" stroke="#5D4037" stroke-width="3" stroke-linecap="round" />

            <!-- Branch Leaves (New) -->
            <g class="branch-leaves" :style="{ opacity: totalProgress > 20 ? 1 : 0, transition: 'opacity 1s' }">
              <circle cx="50" cy="190" r="12" fill="#4CAF50" />
              <circle cx="40" cy="140" r="10" fill="#66BB6A" />
              <circle cx="150" cy="200" r="12" fill="#4CAF50" />
              <circle cx="160" cy="150" r="10" fill="#66BB6A" />
            </g>
          </svg>

          <!-- Canopy (Leaves) - Grows with progress -->
          <div class="canopy-group" 
            :class="{ 'mature': totalProgress >= 75 }"
            :style="{ transform: `scale(${0.3 + (totalProgress / 100) * 1.5})` }"
          >
            <!-- Connector Leaf to hide trunk top -->
            <div class="leaf-cluster l-connector"></div>
            
            <div class="leaf-cluster l1">
              <div class="fruit red" style="top: 30%; left: 20%"></div>
              <div class="fruit yellow" style="top: 60%; left: 70%"></div>
            </div>
            <div class="leaf-cluster l2" :style="{ 
              top: `${0 - totalProgress * 0.6}px`, 
              left: `${-140 - totalProgress * 0.6}px` 
            }">
              <div class="fruit pink" style="top: 40%; left: 30%"></div>
              <div class="fruit red" style="top: 70%; left: 60%"></div>
            </div>
            <div class="leaf-cluster l3" :style="{ 
              top: `${0 - totalProgress * 0.6}px`, 
              left: `${30 + totalProgress * 0.6}px` 
            }">
              <div class="fruit yellow" style="top: 20%; left: 50%"></div>
              <div class="fruit pink" style="top: 50%; left: 20%"></div>
            </div>
            <div class="leaf-cluster l4">
              <div class="fruit red" style="top: 40%; left: 40%"></div>
            </div>
            <div class="leaf-cluster l5">
              <div class="fruit yellow" style="top: 30%; left: 60%"></div>
            </div>
            <!-- Extra leaves for fullness at end -->
            <div class="leaf-cluster l6" v-if="totalProgress > 50">
              <div class="fruit pink" style="top: 30%; left: 30%"></div>
              <div class="fruit red" style="top: 60%; left: 60%"></div>
            </div>
            <div class="leaf-cluster l7" v-if="totalProgress > 75">
              <div class="fruit yellow" style="top: 40%; left: 40%"></div>
              <div class="fruit red" style="top: 20%; left: 70%"></div>
            </div>
          </div>
        </div>

        <!-- Stage Spirits (Fireflies) -->
        <div class="spirits-container">
          <div 
            v-for="(stage, index) in stages" 
            :key="stage.id"
            class="spirit-wrapper"
            :class="{ 
              'active': progress[stage.id] > 0,
              'completed': progress[stage.id] === 100
            }"
            :style="getSpiritPosition(index, stages.length)"
          >
            <div class="spirit-orb">
              <div class="wing w1"></div>
              <div class="wing w2"></div>
            </div>
            <div class="spirit-label">
              {{ stage.label }}
            </div>
          </div>
        </div>

        <!-- Ground -->
        <div class="ground-layer">
          <div class="grass g1"></div>
          <div class="grass g2"></div>
          <div class="grass g3"></div>
          <div class="mushroom m1"></div>
          <div class="mushroom m2"></div>
        </div>

        <!-- HUD -->
        <div class="forest-hud">
          <h1 class="title">{{ $t('message.title') }}</h1>
          <div class="scroll-board">
            <div class="scroll-content">
              <span class="loading-icon">🌿</span>
              {{ currentAction }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
import { reactive, computed, ref, onMounted } from 'vue';
// Re-implementing logic here to add the positioning helper
// In a real scenario, we might extend the mixin, but for this demo we'll inline or mix
import loaderLogic from './Loader.js';

export default {
  ...loaderLogic,
  methods: {
    getSpiritPosition(index, total) {
      // Position spirits in a semi-circle around the tree
      const angle = -180 + (index + 1) * (180 / (total + 1)); // Spread across top semi-circle
      const radius = 120; // Distance from center tree
      // Convert polar to cartesian, relative to center bottom (50% 70%)
      // Adjusting for CSS positioning
      // We'll use a simpler absolute positioning approach based on percentage
      
      // Let's just place them manually or use a simpler arc
      // Using a fixed set of positions might be safer for CSS, but let's try dynamic style
      // Center is 50% left, 60% top roughly
      
      const x = 50 + 35 * Math.cos(angle * Math.PI / 180);
      const y = 60 + 35 * Math.sin(angle * Math.PI / 180);
      
      return {
        left: `${x}%`,
        top: `${y}%`
      };
    }
  }
}
</script>
