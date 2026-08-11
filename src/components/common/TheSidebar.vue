<script setup>
const navItems = [
  { to: '/', label: '대시보드', icon: '🏠' },
  { to: '/maintenance', label: '정비 이력', icon: '🔧' },
  { to: '/settings', label: '설정', icon: '⚙️' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-icon">🚗</span>
      <span class="brand-name">My Car</span>
    </div>
    <nav class="nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        active-class="nav-item--active"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  padding: 0 8px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
}

.nav-item:hover {
  background: var(--color-surface-alt);
  color: var(--color-text);
}

.nav-item--active {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

@media (max-width: 720px) {
  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
  }

  .nav {
    flex-direction: row;
  }
}
</style>
