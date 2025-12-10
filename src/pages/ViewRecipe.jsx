// src/pages/ViewRecipe.jsx

import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Header } from '../components/Header.jsx'
import { Recipe } from '../components/Recipe.jsx'
import { getRecipeById, rateRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useMemo } from 'react'

export function ViewRecipe({ recipeId }) {
  const [token] = useAuth()
  const queryClient = useQueryClient()

  // decode user id from JWT (sub)
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

  const recipeQuery = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
  })
  const recipe = recipeQuery.data

  const rateRecipeMutation = useMutation({
    mutationFn: ({ recipeId, value }) => rateRecipe(token, recipeId, value),
    onSuccess: () => {
      // refresh this recipe
      queryClient.invalidateQueries(['recipe', recipeId])
      // and the recipes list, if open elsewhere
      queryClient.invalidateQueries(['recipes'])
    },
  })

  const handleRate = (value) => {
    if (!token || !recipe) return
    rateRecipeMutation.mutate({ recipeId: recipe._id, value })
  }

  // Compute myRating from the recipe's ratings array
  let myRating = null
  if (currentUserId && recipe?.ratings) {
    const mine = recipe.ratings.find((r) => {
      if (typeof r.user === 'string') return r.user === currentUserId
      if (r.user && r.user._id) return r.user._id === currentUserId
      return false
    })
    myRating = mine ? mine.value : null
  }

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      {recipe ? (
        <Recipe
          _id={recipe._id}
          title={recipe.title}
          ingredients={recipe.ingredients}
          imageUrl={recipe.imageUrl}
          author={recipe.author}
          tags={recipe.tags}
          avgRating={recipe.avgRating ?? 0}
          ratingCount={recipe.ratingCount ?? 0}
          myRating={myRating ?? undefined}
          canRate={!!token}
          onRate={handleRate}
          fullRecipe
        />
      ) : (
        <>Recipe with id {recipeId} not found.</>
      )}
    </div>
  )
}

ViewRecipe.propTypes = {
  recipeId: PropTypes.string.isRequired,
}
