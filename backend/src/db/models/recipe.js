import mongoose, { Schema } from 'mongoose'

const ratingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, min: 1, max: 5, required: true },
  },
  { _id: false },
)

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    ingredients: [{ type: String, required: true }], // array of ingredient strings
    imageUrl: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, trim: true }], // Added: Array of tags
    ratings: [ratingSchema], // Added: Array of user ratings
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Recipe = mongoose.model('recipe', recipeSchema)
