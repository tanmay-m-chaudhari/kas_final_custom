import { ref, computed } from 'vue'
import { recipes, categories } from '../data/recipes.js'

export function useRecipes() {
  const selectedCategory = ref('All')

  const filteredRecipes = computed(() => {
    if (selectedCategory.value === 'All') return recipes
    return recipes.filter((r) => r.category === selectedCategory.value)
  })

  function setCategory(cat) {
    selectedCategory.value = cat
  }

  return {
    recipes,
    categories,
    selectedCategory,
    filteredRecipes,
    setCategory,
  }
}
