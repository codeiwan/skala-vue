<script setup>
// import WeatherMockup from './components/exercise/WeatherMockup.vue'
// import WeatherParent from './components/exercise/WeatherParent.vue'

import { RouterView, useRoute } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
const route = useRoute()

// import SampleOne from './components/practices/basic/SampleOne.vue'
// import SampleTwo from './components/practices/basic/SampleTwo.vue'

// import VueHtml from './components/practices/basic/VueHtml.vue'
// import VueHtmlXss from './components/practices/basic/VueHtmlXss.vue'
// import VueText from './components/practices/basic/VueText.vue'
// import VueBind from './components/practices/basic/VueBind.vue'
// import VueBindClass from './components/practices/basic/VueBindClass.vue'
// import VueBindStyle from './components/practices/basic/VueBindStyle.vue'
// import VueBindShorthand from './components/practices/basic/VueBindShorthand.vue'

// import VueIf from './components/practices/basic/VueIf.vue'
// import VueShow from './components/practices/basic/VueShow.vue'
// import VueFor from './components/practices/basic/VueFor.vue'

// import EventBasic from './components/practices/basic/EventBasic.vue'
// import EventObject from './components/practices/basic/EventObject.vue'
// import EventModifier from './components/practices/basic/EventModifier.vue'

// import ModelBasic from './components/practices/basic/ModelBasic.vue'
// import ModerForm from './components/practices/basic/ModelForm.vue'
// import ModelModifier from './components/practices/basic/ModelModifier.vue'
// import StyleScoped from './components/practices/basic/StyleScoped.vue'

// import ReactiveRef from './components/practices/composition/ReactiveRef.vue'
// import ReactiveReactive from './components/practices/composition/ReactiveReactive.vue'

// import ComputedBasic from './components/practices/composition/ComputedBasic.vue'
// import WhatchersBasic from './components/practices/composition/WatchersBasic.vue'
// import WhatcherMulti from './components/practices/composition/WatchersMulti.vue'
// import WatcherDeep from './components/practices/composition/WatchersDeep.vue'
// import WatcherReactive from './components/practices/composition/WatchersReactive.vue'
// import WatcherWatchEffect from './components/practices/composition/WatchersWatchEffect.vue'

// import LifecycleParent from './components/practices/component/LifecycleParent.vue'

// import PropsEmitsParent from './components/practices/component/PropsEmitsParent.vue'

// import SlotDefaultParent from './components/practices/component/SlotDefaultParent.vue'
// import SlotNamedParent from './components/practices/component/SlotNamedParent.vue'
// import SlotScopedParent from './components/practices/component/SlotScopedParent.vue'

// import StoreCounter from './components/practices/library/StoreCounter.vue'

// import AxiosWeather from './components/practices/library/AxiosWeather.vue'
// import AxiosJson from './components/practices/library/AxiosJson.vue'

// import ElementPlus from './components/practices/library/ElementPlus.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="navigation">
        <div class="brand-area">
          <RouterLink to="/" class="brand"> WEATHER SIGNAL </RouterLink>

          <el-tag size="small" type="primary" effect="plain" round> Vue </el-tag>
        </div>

        <div class="navigation-right">
          <el-menu
            :default-active="route.path"
            mode="horizontal"
            router
            :ellipsis="false"
            class="main-menu"
          >
            <el-menu-item index="/"> 날씨 </el-menu-item>

            <el-menu-item index="/activity-guide"> Activity Guide </el-menu-item>

            <el-menu-item index="/about"> 소개 </el-menu-item>
          </el-menu>

          <UnitToggler />
        </div>
      </div>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
  <!-- <div style="padding: 20px"> -->
  <!-- <WeatherMockup /> -->
  <!-- <WeatherParent /> -->

  <!-- <SampleOne /> -->
  <!-- <SampleTwo /> -->

  <!-- <VueHtml /> -->
  <!-- <VueHtmlXss /> -->
  <!-- <VueText /> -->
  <!-- <VueBind /> -->
  <!-- <VueBindClass /> -->
  <!-- <VueBindStyle /> -->
  <!-- <VueBindShorthand /> -->

  <!-- <VueIf /> -->
  <!-- <VueShow /> -->
  <!-- <VueFor /> -->

  <!-- <EventBasic /> -->
  <!-- <EventObject /> -->
  <!-- <EventModifier /> -->

  <!-- <ModelBasic /> -->
  <!-- <ModerForm /> -->
  <!-- <ModelModifier /> -->
  <!-- <StyleScoped /> -->

  <!-- <ReactiveRef /> -->
  <!-- <ReactiveReactive /> -->

  <!-- <ComputedBasic /> -->
  <!-- <WhatchersBasic /> -->
  <!-- <WhatcherMulti /> -->
  <!-- <WatcherDeep /> -->
  <!-- <WatcherReactive /> -->
  <!-- <WatcherWatchEffect /> -->

  <!-- <LifecycleParent /> -->

  <!-- <PropsEmitsParent /> -->

  <!-- <SlotDefaultParent /> -->
  <!-- <SlotNamedParent /> -->
  <!-- <SlotScopedParent /> -->

  <!-- <StoreCounter /> -->

  <!-- <AxiosWeather /> -->
  <!-- <AxiosJson /> -->

  <!-- <ElementPlus /> -->
  <!-- </div> -->
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

@media (max-width: 760px) {
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

<!-- <style>
@import '@/assets/practice.css';
</style> -->
