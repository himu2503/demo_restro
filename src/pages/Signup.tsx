import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const { signUpWithPhoneAndPassword, verifySignUpOtp } = useAuth()
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    if (!phone || !password) {
      setError('Please enter phone and password')
      setLoading(false)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    try {
      const vId = await signUpWithPhoneAndPassword(phone, password)
      setVerificationId(vId)
      setInfo('OTP sent. Please enter the code to verify your phone.')
      setLoading(false)
    } catch (err: any) {
      setError(err.message || String(err))
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    const code = (e.target as any).code?.value
    if (!verificationId || !code) {
      setError('No verification in progress or code missing')
      setLoading(false)
      return
    }
    try {
      await verifySignUpOtp(verificationId, code)
      setInfo('Phone verified and linked. Redirecting...')
      navigate('/')
      setLoading(false)
    } catch (err: any) {
      setError(err.message || String(err))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-white via-warm-cream to-orange-light overflow-hidden">
      <div className="w-full max-w-lg bg-gradient-to-br from-white to-[#fff7f2] p-8 rounded-2xl shadow-xl border border-transparent">
        <h2 className="text-3xl font-bold mb-3 text-[#111827]">Create your Swiggy account</h2>
        <p className="text-sm text-gray-600 mb-4">Sign up with your phone to get started — we'll send an OTP to verify.</p>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        {info && <div className="text-sm text-green-600 mb-2">{info}</div>}

        {!verificationId ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
              <input
                name="phone"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Confirm</label>
                <input
                  type="password"
                  name="confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-[#ff7b00] to-[#ff6b3b] text-white py-3 rounded-xl font-semibold shadow hover:from-[#ff6b3b] hover:to-[#e55a2c] disabled:opacity-60" disabled={loading}>
              {loading ? 'Sending…' : 'Sign up & Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Enter OTP</label>
              <input name="code" className="w-full border border-gray-200 rounded-xl px-4 py-3" />
            </div>
            <button className="w-full bg-gradient-to-r from-[#ff7b00] to-[#ff6b3b] text-white py-3 rounded-xl font-semibold shadow" disabled={loading}>{loading ? 'Verifying…' : 'Verify OTP'}</button>
          </form>
        )}

        <div id="recaptcha-container" />

        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-[#ff6b3b] font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
