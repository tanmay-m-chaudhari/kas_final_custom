<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <span class="logo">🍽 RecipeBrowser</span>
        <RouterLink to="/" class="nav-link">Home</RouterLink>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
    <footer class="app-footer">
      <p>{{ recipeCount }} recipes in the collection</p>
    </footer>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { recipes } from './data/recipes.js'

const recipeCount = recipes.length
<
</script>

<style>
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
.app-header { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 0 2rem; height: 56px; display: flex; align-items: center; }
.header-inner { max-width: 1100px; width: 100%; margin: 0 auto; display: flex; align-items: center; gap: 2rem; }
.logo { font-size: 1.15rem; font-weight: 700; color: #1c1c1c; }
.nav-link { font-size: 0.9rem; color: #4f46e5; }
.app-main { flex: 1; padding: 2rem; max-width: 1100px; width: 100%; margin: 0 auto; }
.app-footer { background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; padding: 1rem; font-size: 0.82rem; color: #9ca3af; }
</style>
