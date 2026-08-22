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
        <div class="brand-area">
          <RouterLink to="/" class="brand">HIKING SIGNAL</RouterLink>
          <el-tag size="small" type="success" effect="plain" round>Vue</el-tag>
        </div>

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
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #e5e7eb;
  backdrop-filter: blur(12px);
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1448px;
  margin: 0 auto;
  padding: 0 24px;
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand {
  color: #2563eb;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-decoration: none;
  white-space: nowrap;
}

.navigation-right {
  display: flex;
  align-items: center;
  gap: 22px;
}
.main-menu {
  border-bottom: none !important;
}
.app-content {
  width: 100%;
}

@media (max-width: 820px) {
  .navigation {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
  }
  .navigation-right {
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
  .main-menu {
    width: 100%;
    overflow-x: auto;
  }
}
</style>
