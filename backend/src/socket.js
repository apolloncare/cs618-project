import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import { getUserInfoById } from './services/users.js'

let ioInstance = null

export function initSocket(httpServer) {
  // Determine allowed origins based on environment
  let allowedOrigins = []

  if (process.env.NODE_ENV === 'development') {
    // In development, allow common local/codespace URLs
    allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      /\.app\.github\.dev$/, // Allow all GitHub Codespaces domains
    ]
  } else {
    // In production, use specific domain
    allowedOrigins = process.env.FRONTEND_URL || '*'
  }

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
      allowEIO3: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      return next()
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.warn('socket.io auth failed:', err.message)
        return next()
      }
      socket.auth = decodedToken
      socket.user = await getUserInfoById(socket.auth.sub)
      return next()
    })
  })

  io.on('connection', (socket) => {
    console.log(
      'socket connected:',
      socket.id,
      socket.user ? `user=${socket.user.username}` : '(guest)',
    )

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id)
    })
  })

  ioInstance = io
  return io
}

export function broadcastNewRecipe(recipe) {
  if (!ioInstance) {
    console.warn('broadcastNewRecipe called before socket.io initialized')
    return
  }

  ioInstance.emit('recipe.created', {
    id: recipe._id.toString(),
    title: recipe.title,
    createdAt: recipe.createdAt,
    author: recipe.author,
  })
}
