import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByIngredient,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null
let sampleRecipes = []

beforeAll(async () => {
  testUser = await createUser({ username: 'sample', password: 'user' })
  // match current Recipe schema: title, ingredients[], imageUrl, author(ObjectId)
  sampleRecipes = [
    {
      title: 'Classic Spaghetti Carbonara',
      author: testUser._id,
      ingredients: [
        'spaghetti',
        'eggs',
        'pancetta',
        'pecorino cheese',
        'black pepper',
      ],
      imageUrl: 'https://example.com/spaghetti-carbonara.jpg',
    },
    {
      title: 'Vegetable Stir Fry',
      author: testUser._id,
      ingredients: [
        'broccoli',
        'bell peppers',
        'carrots',
        'soy sauce',
        'ginger',
        'garlic',
      ],
      imageUrl: 'https://example.com/vegetable-stir-fry.jpg',
    },
    {
      title: 'Chocolate Chip Cookies',
      author: testUser._id,
      ingredients: [
        'flour',
        'butter',
        'brown sugar',
        'chocolate chips',
        'vanilla extract',
        'baking soda',
      ],
      imageUrl: 'https://example.com/chocolate-chip-cookies.jpg',
    },
    {
      title: 'Greek Salad',
      author: testUser._id,
      ingredients: [
        'cucumber',
        'tomatoes',
        'red onion',
        'feta cheese',
        'olives',
        'olive oil',
        'oregano',
      ],
      imageUrl: 'https://example.com/greek-salad.jpg',
    },
    {
      title: 'Chicken Curry',
      author: testUser._id,
      ingredients: [
        'chicken breast',
        'coconut milk',
        'curry powder',
        'onion',
        'garlic',
        'ginger',
        'tomatoes',
      ],
      imageUrl: 'https://example.com/chicken-curry.jpg',
    },
  ]
})

let createdSampleRecipes = []

beforeEach(async () => {
  await Recipe.deleteMany({})
  createdSampleRecipes = []
  for (const recipe of sampleRecipes) {
    const createdRecipe = new Recipe(recipe)
    createdSampleRecipes.push(await createdRecipe.save())
  }
})

describe('getting a recipe', () => {
  test('should return the full recipe', async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id)
    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')
    expect(recipe).toEqual(null)
  })
})

describe('updating recipes', () => {
  test('should update the specified property', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      title: 'Updated title',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.title).toEqual('Updated title')
  })

  test('should not update other properties', async () => {
    const originalImageUrl = createdSampleRecipes[0].imageUrl
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      title: 'Updated title',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.imageUrl).toEqual(originalImageUrl)
  })

  test('should update the updatedAt timestamp', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      title: 'Updated title',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(
      createdSampleRecipes[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const recipe = await updateRecipe(
      testUser._id,
      '000000000000000000000000',
      {
        title: 'Updated title',
      },
    )
    expect(recipe).toEqual(null)
  })
})

describe('deleting recipes', () => {
  test('should remove the recipe from the database', async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(deletedRecipe).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deleteRecipe(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})

describe('listing recipes', () => {
  test('should return all recipes', async () => {
    const recipes = await listAllRecipes()
    expect(recipes.length).toEqual(createdSampleRecipes.length)
  })

  test('should return recipes sorted by creation date descending by default', async () => {
    const recipes = await listAllRecipes()
    const sortedSampleRecipes = [...createdSampleRecipes].sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(recipes.map((recipe) => recipe.createdAt.getTime())).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.createdAt.getTime()),
    )
  })

  test('should take into account provided sorting options', async () => {
    const recipes = await listAllRecipes({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSampleRecipes = [...createdSampleRecipes].sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(recipes.map((recipe) => recipe.updatedAt.getTime())).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.updatedAt.getTime()),
    )
  })

  test('should be able to filter recipes by author', async () => {
    const recipes = await listRecipesByAuthor(testUser.username)
    expect(recipes.length).toBe(5)
  })

  test('should be able to filter recipes by ingredients', async () => {
    const recipes = await listRecipesByIngredient('eggs')
    expect(recipes.length).toBe(1)
  })
})

describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'Hello Mongoose!',
      ingredients: ['mongoose', 'mongodb'],
      imageUrl: 'http://example.com/mongoose.png',
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const recipe = {
      ingredients: ['empty'],
      imageUrl: 'http://example.com/empty.png',
    }
    await expect(createRecipe(testUser._id, recipe)).rejects.toThrow(
      mongoose.Error.ValidationError,
    )
  })

  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a title',
      ingredients: ['flour'],
      imageUrl: 'http://example.com/minimal.png',
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
