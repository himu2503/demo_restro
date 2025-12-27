import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Meals from './components/Meals/Meals'
import Cart from './components/Cart/Cart'
import FeaturesFooter from './components/FeaturesFooter/FeaturesFooter'
import { CartProvider } from './context/CartContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PartnerSignup from './pages/PartnerSignup'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<> <Hero /> <Meals /> <Cart /> <FeaturesFooter /> </>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/partner" element={<PartnerSignup />} />
      </Routes>
      {/* Floating Become Partner Button - only for logged-in users */}
      {user && (
        <Link
          to="/partner"
          className="fixed bottom-6 right-6 bg-primary text-white px-4 py-3 rounded-full font-medium shadow-lg hover:bg-primary/90 transition-all hover:scale-105 z-50 flex items-center gap-2"
        >
          <span>Become Partner</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  )
}

export default App
