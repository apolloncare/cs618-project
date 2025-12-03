import { initDatabase } from './db/init.js'
import { Recipe } from './db/models/recipe.js'
import dotenv from 'dotenv'
dotenv.config()
await initDatabase()
const recipe = new Recipe({
  title: 'My yummy pancakes',
  author: '693071a0507f54606b8de666',
  ingredients: [
    '100g plain flour',
    '2 large eggs',
    '300ml milk',
    '1 tbsp vegetable oil',
    'sugar',
  ],
  imageUrl: '<img src="img_yummy_pancake.jpg">',
})
await recipe.save()
const recipes = await Recipe.find()
console.log(recipes)
