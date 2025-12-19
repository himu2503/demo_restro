import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const { loginWithPassword, sendLoginOtp, verifyLoginOtp } = useAuth()
  const navigate = useNavigate()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!phone || !password) {
      setError('Please enter phone and password')
      return
    }
    try {
      await loginWithPassword(phone, password)
      navigate('/')
    } catch (err: any) {
      setError(err?.message || String(err))
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!phone) {
      setError('Please enter phone')
      return
    }
    try {
      const vId = await sendLoginOtp(phone)
      setVerificationId(vId)
      setInfo('OTP sent. Enter code to sign in.')
    } catch (err: any) {
      setError(err?.message || String(err))
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    const code = (e.target as any).code?.value
    if (!verificationId || !code) {
      setError('No verification in progress or code missing')
      return
    }
    try {
      await verifyLoginOtp(verificationId, code)
      navigate('/')
    } catch (err: any) {
      setError(err?.message || String(err))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-white via-warm-cream to-orange-light overflow-hidden">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Login to LunchBox</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        {info && <div className="text-sm text-green-600 mb-2">{info}</div>}

        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button className="w-full bg-gradient-to-r from-[#ff7b00] to-[#ff6b3b] text-white py-3 rounded-xl font-semibold shadow hover:from-[#ff6b3b] hover:to-[#e55a2c] disabled:opacity-60" >
              {'Login with Password'}
            </button>
        </form>

        <div className="my-4 text-center">OR</div>

        {!verificationId ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone for OTP</label>
              <input
                name="phoneOtp"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div> 
            <button className="w-full bg-gradient-to-r from-[#ff7b00] to-[#ff6b3b] text-white py-3 rounded-xl font-semibold shadow hover:from-[#ff6b3b] hover:to-[#e55a2c] disabled:opacity-60" >
              {'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <input name="code" className="w-full border rounded px-3 py-2" />
            </div>
            <button className="w-full bg-primary text-white py-2 rounded">Verify & Sign in</button>
          </form>
        )}

        <div id="recaptcha-container-login"></div>

        <p className="mt-4 text-sm">
          Don&apos;t have an account? <Link to="/signup" className="text-primary">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
