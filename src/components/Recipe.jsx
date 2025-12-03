import PropTypes from 'prop-types'
import { User } from './User.jsx'
export function Recipe({ title, ingredients, imageUrl, author }) {
  return (
    <article>
      <h3>{title}</h3>
      <div>{ingredients}</div>
      <div>{imageUrl}</div>
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
  ingredients: PropTypes.string,
  imageUrl: PropTypes.string,
  author: PropTypes.string,
}
