// src/components/NewRecipeNotifications.jsx
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../contexts/AuthContext.jsx'

export function NewRecipeNotifications() {
  const [token] = useAuth()
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_HOST, {
      auth: token ? { token } : undefined,
    })

    socket.on('connect', () => {
      console.log('Socket connected for recipe notifications:', socket.id)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket.io connect error:', err.message)
    })

    socket.on('recipe.created', (payload) => {
      console.log('Received recipe.created event:', payload)
      setNotification({
        id: payload.id,
        title: payload.title,
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  if (!notification) return null

  const handleClick = () => {
    // Navigate without needing React Router context
    window.location.href = `/recipes/${notification.id}`
    setNotification(null)
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        backgroundColor: '#333',
        color: '#fff',
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        zIndex: 1000,
        maxWidth: '280px',
        border: 'none',
        textAlign: 'left',
      }}
    >
      <strong>New recipe added</strong>
      <div style={{ marginTop: '0.25rem' }}>{notification.title}</div>
      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.8 }}>
        Click to view
      </div>
    </button>
  )
}
