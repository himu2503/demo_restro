import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: string
  phone: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signUpWithPhoneAndPassword: (phone: string, password: string) => Promise<string>
  verifySignUpOtp: (verificationId: string, code: string) => Promise<void>
  loginWithPassword: (phone: string, password: string) => Promise<void>
  sendLoginOtp: (phone: string) => Promise<string>
  verifyLoginOtp: (verificationId: string, code: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = 'http://localhost:4000/api'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [otpPhone, setOtpPhone] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const signUpWithPhoneAndPassword = async (phone: string, password: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return 'verified' // No OTP needed for password signup
  }

  const verifySignUpOtp = async (_verificationId: string, _code: string): Promise<void> => {
    // Not used for password signup
  }

  const loginWithPassword = async (phone: string, password: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const sendLoginOtp = async (phone: string): Promise<string> => {
    setOtpPhone(phone)
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)
    return data.verificationId
  }

  const verifyLoginOtp = async (_verificationId: string, code: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: otpPhone, code })
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = async (): Promise<void> => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUpWithPhoneAndPassword,
      verifySignUpOtp,
      loginWithPassword,
      sendLoginOtp,
      verifyLoginOtp,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
