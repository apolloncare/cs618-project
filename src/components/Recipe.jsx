import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { User } from './User.jsx'
import slug from 'slug'

function RatingStars({ avgRating, ratingCount, myRating, canRate, onRate }) {
  // When logged in, display *only* the user's rating in the stars.
  // When logged out, display the average.
  const displayRating = canRate ? myRating || 0 : avgRating || 0
  const roundedAvg = avgRating ? avgRating.toFixed(1) : '0.0'

  const handleClick = (value) => {
    if (!canRate) return
    onRate?.(value)
  }

  return (
    <div>
      {/* Stars display (5 stars) */}
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = displayRating >= star
        return (
          <button
            type='button'
            key={star}
            onClick={() => handleClick(star)}
            aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
            style={{
              cursor: canRate ? 'pointer' : 'default',
              color: isFilled ? 'gold' : '#ccc',
              fontSize: '1.4rem',
              marginRight: '2px',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            ★
          </button>
        )
      })}

      {/* Text under the stars */}
      {canRate ? (
        <div style={{ fontSize: '0.9rem' }}>
          {myRating ? (
            <>
              Your rating: <strong>{myRating}</strong> / 5
            </>
          ) : (
            <>You haven&apos;t rated this recipe yet.</>
          )}
        </div>
      ) : (
        <div style={{ fontSize: '0.9rem' }}>
          <strong>{roundedAvg}</strong> / 5{' '}
          <span>
            ({ratingCount} vote{ratingCount === 1 ? '' : 's'})
          </span>
        </div>
      )}
    </div>
  )
}

RatingStars.propTypes = {
  avgRating: PropTypes.number.isRequired,
  ratingCount: PropTypes.number.isRequired,
  myRating: PropTypes.number,
  canRate: PropTypes.bool,
  onRate: PropTypes.func,
}

export function Recipe({
  _id,
  title,
  ingredients,
  imageUrl,
  author,
  tags,
  avgRating,
  ratingCount,
  myRating,
  canRate,
  onRate,
  fullRecipe = false,
}) {
  return (
    <article>
      {/* Title: plain in full view, clickable link in list view */}
      {fullRecipe ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/recipes/${_id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}

      {/* Rating: only show in fullRecipe view (as you coded) */}
      {fullRecipe && (
        <RatingStars
          avgRating={avgRating || 0}
          ratingCount={ratingCount || 0}
          myRating={canRate ? myRating : null}
          canRate={canRate}
          onRate={(value) => onRate?.(value)}
        />
      )}

      {/* Tags */}
      {tags?.length > 0 && (
        <p>
          <strong>Tags:</strong> {tags.join(', ')}
        </p>
      )}

      {/* Ingredients (only in full view) */}
      {fullRecipe && (
        <>
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </>
      )}

      {/* Image (only in full view) */}
      {fullRecipe && imageUrl && (
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
          {fullRecipe && <br />}
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}

Recipe.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageUrl: PropTypes.string,
  author: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  avgRating: PropTypes.number,
  ratingCount: PropTypes.number,
  myRating: PropTypes.number,
  canRate: PropTypes.bool,
  onRate: PropTypes.func,
  fullRecipe: PropTypes.bool,
}
