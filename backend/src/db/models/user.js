import mongoose, { Schema } from 'mongoose'
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }], // added for milestone 2 and keep track of all recipes of a user
})
export const User = mongoose.model('user', userSchema)
