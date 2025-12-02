export interface User {
  id: number
  full_name: string
  email: string
  role: string | null
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export interface LoginResponse {
  user: User
  token: string
}
