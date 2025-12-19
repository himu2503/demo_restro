import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signOut,
  linkWithCredential,
} from 'firebase/auth'
import { auth } from '../firebase/setup'

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

const phoneToEmail = (phone: string) => `${phone.replace(/[^0-9]/g, '')}@phone.lunchbox`

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  // ReCAPTCHA helpers
  const ensureRecaptcha = (containerId = 'recaptcha-container') => {
    if (typeof window === 'undefined') {
      throw new Error('Recaptcha must be initialized in a browser environment')
    }

    // ensure container exists (some pages may not render the div in markup)
    if (!document.getElementById(containerId)) {
      const d = document.createElement('div')
      d.id = containerId
      // keep it invisible by default
      d.style.display = 'none'
      document.body.appendChild(d)
    }

    // store the verifier on window to reuse across calls
    // @ts-ignore
    if (!(window as any).recaptchaVerifier) {
      // @ts-ignore
      ;(window as any).recaptchaVerifier = new RecaptchaVerifier(containerId, { size: 'invisible' }, auth)
      // attempt to render immediately; ignore render errors but don't silently swallow important failures
      try {
        ;(window as any).recaptchaVerifier.render().catch(() => {})
      } catch (e) {
        // render may throw synchronously in some environments; ignore here but surface later when using phone auth
      }
    }

    // @ts-ignore
    return (window as any).recaptchaVerifier as RecaptchaVerifier
  }

  const signUpWithPhoneAndPassword = async (phone: string, password: string) => {
    const email = phoneToEmail(phone)
    await createUserWithEmailAndPassword(auth, email, password)
    // send OTP via PhoneAuthProvider and return verificationId
    const verifier = ensureRecaptcha('recaptcha-container')
    const provider = new PhoneAuthProvider(auth)
    try {
      const verificationId = await provider.verifyPhoneNumber(phone, verifier)
      return verificationId
    } catch (err) {
      // rethrow with a clearer message
      throw new Error('Failed to send verification SMS: ' + (err as any)?.message || String(err))
    }
  }

  const verifySignUpOtp = async (verificationId: string, code: string) => {
    const credential = PhoneAuthProvider.credential(verificationId, code)
    if (auth.currentUser) {
      await linkWithCredential(auth.currentUser, credential)
    } else {
      throw new Error('No signed-in user to link')
    }
  }

  const loginWithPassword = async (phone: string, password: string) => {
    const email = phoneToEmail(phone)
    await signInWithEmailAndPassword(auth, email, password)
  }

  const sendLoginOtp = async (phone: string) => {
    const verifier = ensureRecaptcha('recaptcha-container-login')
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier)
      // @ts-ignore
      return confirmationResult.verificationId || confirmationResult._verificationId
    } catch (err) {
      throw new Error('Failed to send OTP: ' + (err as any)?.message || String(err))
    }
  }

  const verifyLoginOtp = async (verificationId: string, code: string) => {
    const credential = PhoneAuthProvider.credential(verificationId, code)
    await signInWithCredential(auth, credential)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signUpWithPhoneAndPassword, verifySignUpOtp, loginWithPassword, sendLoginOtp, verifyLoginOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
