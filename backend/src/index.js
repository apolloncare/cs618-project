import http from 'http'
import dotenv from 'dotenv'
dotenv.config()

import { initDatabase } from './db/init.js'
import { app } from './app.js'
import { initSocket } from './socket.js'

const PORT = process.env.PORT

await initDatabase()

// Create HTTP server and attach Express app
const httpServer = http.createServer(app)

// Initialize Socket.io on the same server
initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.info(`express + socket.io server running on http://localhost:${PORT}`)
})
