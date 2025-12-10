import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Recipe } from './Recipe.jsx'

export function RecipeList({
  recipes = [],
  canRate = false,
  currentUserId = null,
  onRate,
}) {
  if (!recipes.length) {
    return <p>No recipes found.</p>
  }

  return (
    <div>
      {recipes.map((recipe) => {
        let myRating = null
        if (currentUserId && Array.isArray(recipe.ratings)) {
          const mine = recipe.ratings.find((r) => {
            if (typeof r.user === 'string') return r.user === currentUserId
            if (r.user && r.user._id) return r.user._id === currentUserId
            return false
          })
          myRating = mine ? mine.value : null
        }

        return (
          <Fragment key={recipe._id}>
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
              canRate={canRate}
              onRate={(value) => onRate?.(recipe._id, value)}
              fullRecipe={false}
            />
            <hr />
          </Fragment>
        )
      })}
    </div>
  )
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape(Recipe.propTypes)).isRequired,
  canRate: PropTypes.bool,
  currentUserId: PropTypes.string,
  onRate: PropTypes.func,
}
