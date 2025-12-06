// src/components/CreateRecipe.jsx
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe as createRecipeApi } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [ingredientsText, setIngredientsText] = useState('') // string in textarea
  const [imageUrl, setImageUrl] = useState('')

  const [token] = useAuth()
  const queryClient = useQueryClient()

  const createRecipeMutation = useMutation({
    mutationFn: () => {
      // convert the textarea string into an array of strings
      const ingredientsArray = ingredientsText
        .split('\n') // split by line
        .map((s) => s.trim()) // trim whitespace
        .filter(Boolean) // remove empty lines

      return createRecipeApi(token, {
        title,
        ingredients: ingredientsArray,
        imageUrl,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes'])
      // reset form
      setTitle('')
      setIngredientsText('')
      setImageUrl('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }

  if (!token) return <div>Please log in to create new recipes.</div>

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div>
        <label htmlFor='create-title'>Title</label>
        <br />
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Chocolate cake'
        />
      </div>

      <br />

      {/* Ingredients */}
      <div>
        <label htmlFor='create-ingredients'>Ingredients (one per line)</label>
        <br />
        <textarea
          id='create-ingredients'
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          rows={6}
          placeholder={'200g flour\n100g sugar\n2 eggs\n...'}
        />
      </div>

      <br />

      {/* Image URL */}
      <div>
        <label htmlFor='create-imageUrl'>Image URL</label>
        <br />
        <input
          type='url'
          id='create-imageUrl'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder='https://example.com/my-delicious-cake.jpg'
        />
      </div>

      <br />

      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create'}
        disabled={
          !title ||
          !ingredientsText.trim() ||
          !imageUrl.trim() ||
          createRecipeMutation.isPending
        }
      />

      <br />

      {createRecipeMutation.isSuccess && (
        <span>Recipe created successfully!</span>
      )}

      {createRecipeMutation.isError && (
        <span style={{ color: 'red' }}>
          Error:{' '}
          {createRecipeMutation.error?.message || 'Failed to create recipe'}
        </span>
      )}
    </form>
  )
}
