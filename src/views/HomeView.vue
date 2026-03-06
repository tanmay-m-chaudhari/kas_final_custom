<template>
  <div>
    <div class="page-header">
      <h1>Recipes</h1>
      <p class="subtitle">{{ filteredRecipes.length }} recipe{{ filteredRecipes.length === 1 ? '' : 's' }} found</p>
    </div>

    <div class="category-filters">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['filter-btn', { active: selectedCategory === cat }]"
        @click="setCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <div class="recipe-grid">
      <RouterLink
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :to="`/recipe/${recipe.id}`"
        class="recipe-card"
      >
        <div class="card-category">{{ recipe.category }}</div>
        <h2 class="card-title">{{ recipe.title }}</h2>
        <p class="card-desc">{{ recipe.description }}</p>
        <div class="card-meta">
          <span>⏱ {{ recipe.prepTime + recipe.cookTime }} min</span>
          <span>🍽 {{ recipe.servings }} serving{{ recipe.servings === 1 ? '' : 's' }}</span>
          <span>📋 {{ recipe.ingredients.length }} ingredients</span>
        </div>
      </RouterLink>

      <div v-if="filteredRecipes.length === 0" class="empty-state">
        No recipes in this category yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useRecipes } from '../composables/useRecipes.js'

const { categories, selectedCategory, filteredRecipes, setCategory } = useRecipes()
</script>

<style scoped>
.page-header { margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.75rem; font-weight: 700; }
.subtitle { color: #6b7280; font-size: 0.9rem; margin-top: 4px; }
.category-filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1.75rem; }
.filter-btn { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 6px 16px; font-size: 0.875rem; color: #374151; transition: all 0.15s; }
.filter-btn.active { background: #4f46e5; border-color: #4f46e5; color: #fff; }
.recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.recipe-card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 1.25rem; display: flex; flex-direction: column; gap: 8px; transition: box-shadow 0.15s; }
.recipe-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.card-category { font-size: 0.75rem; font-weight: 600; color: #6d28d9; background: #ede9fe; display: inline-block; padding: 2px 10px; border-radius: 12px; width: fit-content; }
.card-title { font-size: 1.05rem; font-weight: 700; color: #1c1c1c; }
.card-desc { font-size: 0.875rem; color: #6b7280; flex: 1; }
.card-meta { display: flex; gap: 12px; font-size: 0.8rem; color: #9ca3af; flex-wrap: wrap; margin-top: 4px; }
.empty-state { grid-column: 1/-1; text-align: center; padding: 3rem; color: #9ca3af; }
</style>
