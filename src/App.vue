<script setup>
// import WeatherMockup from './components/exercise/WeatherMockup.vue'
// import WeatherParent from './components/exercise/WeatherParent.vue'
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

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
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="navigation">
        <RouterLink to="/" class="brand"> WEATHER SIGNAL </RouterLink>

        <div class="navigation-right">
          <nav class="nav-links">
            <RouterLink to="/"> 날씨 </RouterLink>

            <RouterLink to="/activity-guide"> Activity Guide </RouterLink>

            <RouterLink to="/about"> 소개 </RouterLink>
          </nav>

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
  z-index: 10;

  width: 100%;

  background-color: rgba(255, 255, 255, 0.96);

  border-bottom: 1px solid #e5e7eb;
}

.navigation {
  display: flex;

  align-items: center;
  justify-content: space-between;

  width: 100%;
  max-width: 1448px;

  box-sizing: border-box;

  margin: 0 auto;
  padding: 16px 24px;
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

  gap: 18px;
}

.nav-links {
  display: flex;

  align-items: center;

  gap: 8px;
}

.nav-links a {
  padding: 9px 14px;

  border-radius: 8px;

  color: #475569;

  font-weight: 700;

  text-decoration: none;

  white-space: nowrap;
}

.nav-links a:hover {
  background-color: #f1f5f9;
}

.nav-links a.router-link-exact-active {
  background-color: #eff6ff;

  color: #2563eb;
}

.app-content {
  width: 100%;
}

@media (max-width: 760px) {
  .navigation {
    align-items: flex-start;
    flex-direction: column;

    gap: 12px;
  }

  .navigation-right {
    width: 100%;

    align-items: flex-start;
    flex-direction: column;

    gap: 10px;
  }

  .nav-links {
    width: 100%;

    overflow-x: auto;
  }
}
</style>

<!-- <style>
@import '@/assets/practice.css';
</style> -->
