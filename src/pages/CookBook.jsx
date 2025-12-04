import { RecipeList } from '../components/RecipeList.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
import { Header } from '../components/Header.jsx'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'
import { useState } from 'react'
export function CookBook() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const recipesQuery = useQuery({
    queryKey: ['recipes', { author, sortBy, sortOrder }],
    queryFn: () => getRecipes({ author, sortBy, sortOrder }),
  })
  const recipes = recipesQuery.data ?? []
  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <br />
      <h2>Find and Create the Best Recipes!</h2>
      <CreateRecipe />
      <hr />
      Filter by:
      <RecipeFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <RecipeSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <RecipeList recipes={recipes} />
    </div>
  )
}
