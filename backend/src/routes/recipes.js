import {
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByIngredient,
  listRecipesByTag,
  getRecipeById,
  deleteRecipe,
  updateRecipe,
  createRecipe,
  rateRecipe,
} from '../services/recipes.js'
import { requireAuth } from '../middleware/jwt.js'
import { broadcastNewRecipe } from '../socket.js'

export function postsRoutes(app) {
  app.get('/api/v1/recipes', async (req, res) => {
    const { sortBy, sortOrder, author, ingredient, tag } = req.query
    const options = { sortBy, sortOrder }

    try {
      const filters = [author, ingredient, tag].filter(Boolean).length
      if (filters > 1) {
        return res.status(400).json({
          error: 'query by only one of author, ingredient or tag',
        })
      } else if (author) {
        return res.json(await listRecipesByAuthor(author, options))
      } else if (ingredient) {
        return res.json(await listRecipesByIngredient(ingredient, options))
      } else if (tag) {
        return res.json(await listRecipesByTag(tag, options))
      } else {
        return res.json(await listAllRecipes(options))
      }
    } catch (err) {
      console.error('error listing recipes', err)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/recipes/:id', async (req, res) => {
    const { id } = req.params
    try {
      const recipe = await getRecipeById(id)
      if (recipe === null) return res.status(404).end()
      return res.json(recipe)
    } catch (err) {
      console.error('error getting recipe', err)
      return res.status(500).end()
    }
  })

  app.post('/api/v1/recipes', requireAuth, async (req, res) => {
    try {
      const recipe = await createRecipe(req.auth.sub, req.body)
      broadcastNewRecipe(recipe)
      return res.json(recipe)
    } catch (err) {
      console.error('error creating recipe', err)
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/recipes/:id', requireAuth, async (req, res) => {
    try {
      const recipe = await updateRecipe(req.auth.sub, req.params.id, req.body)
      return res.json(recipe)
    } catch (err) {
      console.error('error updating recipe', err)
      return res.status(500).end()
    }
  })

  app.delete('/api/v1/recipes/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deleteRecipe(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('error deleting recipe', err)
      return res.status(500).end()
    }
  })

  // NEW: rate a recipe
  app.post('/api/v1/recipes/:id/rating', requireAuth, async (req, res) => {
    try {
      const { value } = req.body
      const recipe = await rateRecipe(req.auth.sub, req.params.id, value)
      return res.json(recipe)
    } catch (err) {
      console.error('error rating recipe', err)
      return res.status(400).json({ error: err.message })
    }
  })
}
