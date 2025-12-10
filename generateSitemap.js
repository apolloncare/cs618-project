import slug from 'slug'
import dotenv from 'dotenv'
dotenv.config()
const baseUrl = process.env.FRONTEND_URL
export async function generateSitemap() {
  const recipesRequest = await fetch(`${process.env.VITE_BACKEND_URL}/recipes`)
  const recipes = await recipesRequest.json()
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${baseUrl}</loc>
</url>
<url>
<loc>${baseUrl}/signup</loc>
</url>
<url>
<loc>${baseUrl}/login</loc>
</url>
${recipes
  .map(
    (recipe) => `
<url>
<loc>${baseUrl}/recipes/${recipe._id}/${slug(recipe.title)}</loc>
<lastmod>${recipe.updatedAt ?? recipe.createdAt}</lastmod>
</url>`,
  )
  .join('')}
</urlset>`
}
