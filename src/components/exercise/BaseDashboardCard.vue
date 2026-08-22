<template>
  <section class="dashboard-card">
    <slot></slot>
  </section>
</template>

<style scoped>
.dashboard-card {
  margin-bottom: 16px;
  padding: 24px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-medium);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}
</style>
