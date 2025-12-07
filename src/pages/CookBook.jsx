// src/pages/CookBook.jsx

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { RecipeList } from '../components/RecipeList.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
import { Header } from '../components/Header.jsx'

import { getRecipes, rateRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function CookBook() {
  // filters & sorting
  const [author, setAuthor] = useState('')
  const [tag, setTag] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  // auth (token) – same hook you already use in CreateRecipe
  const [token] = useAuth()

  // decode user id from JWT so we can find the user's rating
  const currentUserId = useMemo(() => {
    if (!token) return null
    try {
      const [, payload] = token.split('.')
      const decoded = JSON.parse(atob(payload))
      return decoded.sub || decoded.userId || null
    } catch {
      return null
    }
  }, [token])

  const queryClient = useQueryClient()

  // load recipes with author/tag/sort
  const recipesQuery = useQuery({
    queryKey: ['recipes', { author, tag, sortBy, sortOrder }],
    queryFn: () => getRecipes({ author, tag, sortBy, sortOrder }),
  })
  const recipes = recipesQuery.data ?? []

  // rating mutation
  const rateRecipeMutation = useMutation({
    mutationFn: ({ recipeId, value }) => rateRecipe(token, recipeId, value),
    onSuccess: () => {
      // refresh all recipe queries (any filter/sort)
      queryClient.invalidateQueries(['recipes'])
    },
  })

  const handleRate = (recipeId, value) => {
    if (!token) return
    rateRecipeMutation.mutate({ recipeId, value })
  }

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <br />
      <h2>Find and Create the Best Recipes!</h2>
      {/* Create new recipe */}
      <CreateRecipe />
      <hr />
      {/* Filters */}
      Filter by:
      <RecipeFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      {'  '}
      <RecipeFilter
        field='tag'
        value={tag}
        onChange={(value) => setTag(value)}
      />
      <br />
      <RecipeSorting
        fields={['createdAt', 'updatedAt', 'avgRating']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <RecipeList
        recipes={recipes}
        canRate={!!token}
        currentUserId={currentUserId}
        onRate={handleRate}
      />
    </div>
  )
}
