import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({ title, ingredients, imageUrl, author }) {
  return (
    <article>
      <h3>{title}</h3>

      <h3>Ingredients</h3>
      <ul>
        {ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>

      {imageUrl && (
        <>
          <h3>Image</h3>
          <a
            href={imageUrl}
            target='_blank'
            rel='noopener noreferrer'
            style={{ display: 'inline-block' }}
          >
            <img
              src={imageUrl}
              alt={title}
              style={{
                maxWidth: '150px',
                maxHeight: '150px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </a>
          <div>
            <small>
              <a href={imageUrl} target='_blank' rel='noopener noreferrer'>
                Open full image
              </a>
            </small>
          </div>
        </>
      )}

      {author && (
        <em>
          <br />
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageUrl: PropTypes.string,
  author: PropTypes.string,
}
