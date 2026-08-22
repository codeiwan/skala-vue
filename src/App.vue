<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const route = useRoute()

const activeMenu = computed(() => {
  if (route.name === 'HikingHome' || route.name === 'MountainDetail') return '/'
  if (route.name === 'HikingGuide') return '/hiking-guide'
  if (route.name === 'WeatherHome' || route.name === 'WeatherDetail') return '/weather'
  if (route.name === 'Practice') return '/practice'
  if (route.name === 'About') return '/about'
  return ''
})

const showUnitToggler = computed(() => {
  return route.name === 'WeatherHome' || route.name === 'WeatherDetail'
})
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="navigation">
        <RouterLink to="/welcome" class="brand-area">
          <div class="brand-mark">
            <span class="brand-peak"></span>
          </div>

          <div class="brand-copy">
            <strong>HIKING SIGNAL</strong>
            <span>Mountain & Weather Guide</span>
          </div>
        </RouterLink>

        <div class="navigation-right">
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            router
            :ellipsis="false"
            class="main-menu"
          >
            <el-menu-item index="/">산 찾기</el-menu-item>
            <el-menu-item index="/hiking-guide">산행 가이드</el-menu-item>
            <el-menu-item index="/weather">날씨</el-menu-item>
            <el-menu-item index="/practice">Vue Lab</el-menu-item>
            <el-menu-item index="/about">소개</el-menu-item>
          </el-menu>

          <UnitToggler v-if="showUnitToggler" />
        </div>
      </div>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-shell {
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(250, 251, 248, 0.94);
  border-bottom: 1px solid var(--color-border-soft);
  box-shadow: var(--shadow-header);
  backdrop-filter: blur(14px);
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: var(--content-width-wide);
  min-height: 68px;
  margin: 0 auto;
  padding: 0 28px;
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-mark {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--color-primary);
}

.brand-peak {
  width: 19px;
  height: 19px;
  transform: translateY(5px) rotate(45deg);
  border-radius: 3px 0 0;
  background: #ffffff;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.brand-copy strong {
  color: var(--color-primary-deep);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.5px;
}
.brand-copy span {
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.navigation-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.main-menu {
  background: transparent !important;
  border-bottom: none !important;
}

.main-menu.el-menu--horizontal > .el-menu-item {
  height: 68px;
  border-bottom-width: 2px;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.main-menu.el-menu--horizontal > .el-menu-item:hover {
  background: transparent;
  color: var(--color-primary);
}

.main-menu.el-menu--horizontal > .el-menu-item.is-active {
  color: var(--color-primary-deep) !important;
  font-weight: 800;
}

.app-content {
  width: 100%;
}

@media (max-width: 900px) {
  .navigation {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding: 14px 18px 0;
  }
  .navigation-right {
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
  .main-menu {
    width: 100%;
    overflow-x: auto;
  }
  .main-menu.el-menu--horizontal > .el-menu-item {
    height: 48px;
  }
}

@media (max-width: 520px) {
  .brand-copy span {
    display: none;
  }
}
</style>
