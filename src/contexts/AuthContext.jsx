import { createContext, useState, useContext } from 'react'
import PropTypes from 'prop-types'
export const AuthContext = createContext({
  token: null,
  setToken: () => {},
})
export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider')
  }
  const { token, setToken } = context
  return [token, setToken]
}
