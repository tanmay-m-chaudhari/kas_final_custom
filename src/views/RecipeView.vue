<template>
  <div v-if="recipe" class="recipe-detail">
    <RouterLink to="/" class="back-link">← Back to recipes</RouterLink>

    <div class="recipe-hero">
      <span class="hero-category">{{ recipe.category }}</span>
      <h1>{{ recipe.title }}</h1>
      <p class="hero-desc">{{ recipe.description }}</p>
      <div class="hero-meta">
        <div class="meta-item"><span class="meta-label">Prep</span><span class="meta-val">{{ recipe.prepTime }} min</span></div>
        <div class="meta-item"><span class="meta-label">Cook</span><span class="meta-val">{{ recipe.cookTime }} min</span></div>
        <div class="meta-item"><span class="meta-label">Total</span><span class="meta-val">{{ recipe.prepTime + recipe.cookTime }} min</span></div>
        <div class="meta-item"><span class="meta-label">Serves</span><span class="meta-val">{{ recipe.servings }}</span></div>
      </div>
    </div>

    <div class="recipe-body">
      <div class="ingredients-section">
        <h2>Ingredients</h2>
        <ul>
          <li v-for="(ing, i) in recipe.ingredients" :key="i">{{ ing }}</li>
        </ul>
      </div>

      <div class="steps-section">
        <h2>Instructions</h2>
        <ol>
          <li v-for="(step, i) in recipe.steps" :key="i">{{ step }}</li>
        </ol>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Recipe not found.</p>
    <RouterLink to="/">Go back home</RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { recipes } from '../data/recipes.js'

const route = useRoute()
const recipe = computed(() => recipes.find((r) => r.id === Number(route.params.id)))
</script>

<style scoped>
.back-link { font-size: 0.875rem; color: #4f46e5; display: inline-block; margin-bottom: 1.5rem; }
.recipe-hero { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 2rem; margin-bottom: 1.5rem; }
.hero-category { font-size: 0.75rem; font-weight: 600; color: #6d28d9; background: #ede9fe; display: inline-block; padding: 2px 10px; border-radius: 12px; margin-bottom: 0.75rem; }
.recipe-hero h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
.hero-desc { color: #6b7280; font-size: 0.95rem; margin-bottom: 1.25rem; }
.hero-meta { display: flex; gap: 2rem; flex-wrap: wrap; }
.meta-item { display: flex; flex-direction: column; }
.meta-label { font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
.meta-val { font-size: 1rem; font-weight: 600; color: #1c1c1c; }
.recipe-body { display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; }
.ingredients-section, .steps-section { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 1.5rem; }
.ingredients-section h2, .steps-section h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
.ingredients-section ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.ingredients-section ul li { font-size: 0.9rem; color: #374151; padding-left: 16px; position: relative; }
.ingredients-section ul li::before { content: '•'; position: absolute; left: 0; color: #6d28d9; }
.steps-section ol { list-style: none; counter-reset: steps; display: flex; flex-direction: column; gap: 14px; }
.steps-section ol li { font-size: 0.9rem; color: #374151; padding-left: 2.5rem; position: relative; counter-increment: steps; }
.steps-section ol li::before { content: counter(steps); position: absolute; left: 0; top: 0; background: #4f46e5; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
.not-found { text-align: center; padding: 4rem; color: #9ca3af; }
.not-found a { color: #4f46e5; display: block; margin-top: 1rem; }
</style>
