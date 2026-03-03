import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function SignupMobile(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  function isValidEmail(e) {
    return /^\S+@\S+\.\S+$/.test(e)
  }

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const u = username.trim()
    const p = password.trim()
    const em = email.trim()
    
    // Validate email
    if (!isValidEmail(em)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate password length
    if (p.length <= 4) {
      setError('Password must be more than 4 characters')
      return
    }

    setLoading(true)
    try {
      const body = new URLSearchParams({ username: u, password: p, email: em })
      const res = await axios.post('https://nestfinder-2.onrender.com/adduser', body, { withCredentials: true })
      const data = res.data
      setSuccess(data?.message || 'Signup successful! Redirecting...')
      
      const role = data?.role
      if (role) {
        localStorage.setItem('role', role)
        localStorage.setItem('loggedIn', 'true')
        // Redirect to user dashboard
        setTimeout(() => navigate('/user/user_product'), 800)
      } else {
        // If no role returned, still redirect to dashboard
        localStorage.setItem('loggedIn', 'true')
        setTimeout(() => navigate('/user/user_product'), 800)
      }
    } catch (err) {
      console.error('Signup error', err)
      const resp = err?.response
      const status = resp?.status
      const msg = resp?.data?.message || resp?.data || err.message || 'Signup failed'
      setError(`${msg}`)
    } finally { 
      setLoading(false) 
    }
  }

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f5f7fa;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% center;
      }
      100% {
        background-position: 200% center;
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    @keyframes checkmark {
      0% {
        stroke-dashoffset: 100;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }

    .signup-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .signup-container::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: float 6s ease-in-out infinite;
    }

    .signup-container.visible {
      animation: fadeInUp 0.6s ease;
    }

    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 44px;
      height: 44px;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      z-index: 10;
      transition: all 0.3s;
      text-decoration: none;
      color: white;
    }

    .back-button:active {
      transform: scale(0.95);
      background: rgba(255,255,255,0.3);
    }

    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 60px;
      margin-bottom: 40px;
      animation: slideDown 0.8s ease;
    }

    .logo-container {
      position: relative;
      margin-bottom: 20px;
    }

    .logo {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #7c5cdb 0%, #6b4fc4 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      animation: pulse 2s ease-in-out infinite;
      position: relative;
      z-index: 2;
    }

    .logo::before {
      content: '';
      position: absolute;
      inset: -5px;
      background: linear-gradient(135deg, #7c5cdb 0%, #6b4fc4 100%);
      border-radius: 28px;
      opacity: 0.5;
      filter: blur(15px);
      z-index: -1;
    }

    .app-name {
      font-size: 32px;
      font-weight: 800;
      color: white;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .app-tagline {
      font-size: 16px;
      color: rgba(255,255,255,0.9);
      font-weight: 500;
    }

    .signup-card {
      background: white;
      border-radius: 24px;
      padding: 32px 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      animation: fadeInUp 1s ease;
      position: relative;
      z-index: 2;
    }

    .signup-title {
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 8px;
      text-align: center;
    }

    .signup-subtitle {
      font-size: 14px;
      color: #718096;
      text-align: center;
      margin-bottom: 32px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 8px;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: #a0aec0;
      z-index: 1;
    }

    .form-input {
      width: 100%;
      padding: 14px 16px 14px 48px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      outline: none;
      transition: all 0.3s;
      background: #f7fafc;
    }

    .form-input:focus {
      border-color: #7c5cdb;
      background: white;
      box-shadow: 0 0 0 3px rgba(124,92,219,0.1);
    }

    .password-toggle {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      z-index: 2;
    }

    .password-strength {
      margin-top: 8px;
      display: flex;
      gap: 4px;
    }

    .strength-bar {
      height: 4px;
      flex: 1;
      background: #e2e8f0;
      border-radius: 2px;
      transition: all 0.3s;
    }

    .strength-bar.active {
      background: #10b981;
    }

    .strength-bar.active.medium {
      background: #f59e0b;
    }

    .strength-bar.active.strong {
      background: #10b981;
    }

    .error-message {
      background: #fff5f5;
      border: 2px solid #feb2b2;
      color: #c53030;
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: shake 0.5s ease;
    }

    .success-message {
      background: #f0fdf4;
      border: 2px solid #86efac;
      color: #15803d;
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: fadeInUp 0.5s ease;
    }

    .submit-button {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #7c5cdb 0%, #6b4fc4 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 16px;
      position: relative;
      overflow: hidden;
    }

    .submit-button:active:not(:disabled) {
      transform: scale(0.98);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .submit-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.3),
        transparent
      );
      transition: left 0.5s;
    }

    .submit-button:hover::before {
      left: 100%;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 24px 0;
    }

    .divider-line {
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    .divider-text {
      font-size: 14px;
      color: #a0aec0;
      font-weight: 500;
    }

    .google-button {
      width: 100%;
      padding: 14px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #2d3748;
    }

    .google-button:active {
      transform: scale(0.98);
      border-color: #cbd5e0;
    }

    .google-icon {
      width: 20px;
      height: 20px;
    }

    .login-link {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #718096;
    }

    .login-link a {
      color: #7c5cdb;
      font-weight: 700;
      text-decoration: none;
      margin-left: 4px;
    }

    .terms-text {
      text-align: center;
      font-size: 12px;
      color: #a0aec0;
      margin-top: 16px;
      line-height: 1.5;
    }

    .terms-text a {
      color: #7c5cdb;
      text-decoration: none;
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      overflow: hidden;
      z-index: 1;
      pointer-events: none;
    }

    .shape {
      position: absolute;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }

    .shape1 {
      width: 100px;
      height: 100px;
      top: 10%;
      left: -50px;
      animation: float 8s ease-in-out infinite;
    }

    .shape2 {
      width: 150px;
      height: 150px;
      top: 40%;
      right: -75px;
      animation: float 10s ease-in-out infinite reverse;
    }

    .shape3 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 20%;
      animation: float 6s ease-in-out infinite;
      animation-delay: 2s;
    }

    @media (min-width: 768px) {
      .signup-container {
        max-width: 480px;
        margin: 0 auto;
        box-shadow: 0 0 40px rgba(0,0,0,0.1);
      }
    }
  `

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return 0
    if (pwd.length < 6) return 1
    if (pwd.length < 10) return 2
    return 3
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <>
      <style>{styles}</style>
      <div className={`signup-container ${isVisible ? 'visible' : ''}`}>
        {/* Floating background shapes */}
        <div className="floating-shapes">
          <div className="shape shape1"></div>
          <div className="shape shape2"></div>
          <div className="shape shape3"></div>
        </div>

        {/* Back button */}
        <Link to="/" className="back-button">←</Link>

        {/* Logo section */}
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo">🏠</div>
          </div>
          <h1 className="app-name">NestFinder</h1>
          <p className="app-tagline">Find Your Perfect Nest</p>
        </div>

        {/* Signup form card */}
        <div className="signup-card">
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Join us and start finding your perfect space</p>

          <form onSubmit={handleSubmit}>
            {/* Username field */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="Choose a username"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {password && (
                <div className="password-strength">
                  <div className={`strength-bar ${passwordStrength >= 1 ? 'active' : ''}`}></div>
                  <div className={`strength-bar ${passwordStrength >= 2 ? 'active medium' : ''}`}></div>
                  <div className={`strength-bar ${passwordStrength >= 3 ? 'active strong' : ''}`}></div>
                </div>
              )}
              <div style={{fontSize: '12px', color: password.length > 4 ? '#10b981' : '#a0aec0', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                {password.length > 4 ? '✓' : '•'} Password must be more than 4 characters
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="error-message">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="success-message">
                <span>✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Submit button */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span style={{marginLeft: '8px'}}>Creating account...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Terms */}
            <div className="terms-text">
              By signing up, you agree to our{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>
            </div>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>

            {/* Google signup */}
            <button
              type="button"
              className="google-button"
              onClick={() => {
                window.location.href = 'https://nestfinder-2.onrender.com/oauth2/authorization/google'
              }}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Login link */}
          <div className="login-link">
            Already have an account?
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  )
}