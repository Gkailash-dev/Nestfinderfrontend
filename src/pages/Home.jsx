import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../services/api'

export default function HomeMobileCompact(){
  const [counts, setCounts] = useState({ houses: 0, parking: 0, shop: 0 })
  const [animatedCounts, setAnimatedCounts] = useState({ houses: 0, parking: 0, shop: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const loggedIn = localStorage.getItem('loggedIn') === 'true' || !!localStorage.getItem('role')

  async function fetchWho(){
    try {
      const who = await apiFetch('/who')
      setUser(who || null)
      if (who?.role) {
        localStorage.setItem('role', who.role)
        localStorage.setItem('loggedIn', 'true')
      }
    } catch (err) {
      console.warn('who fetch failed', err)
    }
  }

  async function fetchCounts() {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch('/counts')
      setCounts({
        houses: data.houses || 0,
        parking: data.parking || 0,
        shop: data.shop || 0
      })
      animateCounts(data.houses || 0, data.parking || 0, data.shop || 0)
    } catch (err) {
      console.error('Failed to fetch /counts', err)
      setError(err.message || 'Failed to load counts')
    } finally {
      setLoading(false)
    }
  }

  const animateCounts = (targetHouses, targetParking, targetShop) => {
    const duration = 1500
    const steps = 60
    const step = duration / steps
    
    let currentHouses = 0
    let currentParking = 0
    let currentShop = 0
    
    const housesIncrement = targetHouses / steps
    const parkingIncrement = targetParking / steps
    const shopIncrement = targetShop / steps
    
    const timer = setInterval(() => {
      currentHouses = Math.min(currentHouses + housesIncrement, targetHouses)
      currentParking = Math.min(currentParking + parkingIncrement, targetParking)
      currentShop = Math.min(currentShop + shopIncrement, targetShop)
      
      setAnimatedCounts({
        houses: Math.floor(currentHouses),
        parking: Math.floor(currentParking),
        shop: Math.floor(currentShop)
      })
      
      if (currentHouses >= targetHouses && 
          currentParking >= targetParking && 
          currentShop >= targetShop) {
        clearInterval(timer)
      }
    }, step)
  }

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
    fetchCounts()
    fetchWho()
  }, [])

  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('loggedIn')
    setUser(null)
    navigate('/')
    window.location.reload()
  }

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f8f9fa;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    .mobile-home {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding-bottom: 80px;
      opacity: 0;
      animation: fadeIn 0.6s ease forwards;
    }

    /* Header */
    .header {
      background: transparent;
      padding: 16px 16px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-box {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: pulse 2s ease-in-out infinite;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 800;
      color: white;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s;
      color: white;
      text-decoration: none;
    }

    .icon-btn:active {
      transform: scale(0.95);
      background: rgba(255,255,255,0.3);
    }

    /* Hero Section - Compact */
    .hero-compact {
      padding: 20px 16px;
      animation: slideUp 0.8s ease;
    }

    .welcome-box {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px;
      color: white;
      margin-bottom: 20px;
    }

    .welcome-title {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .welcome-subtitle {
      font-size: 14px;
      opacity: 0.9;
    }

    /* Quick Stats - Small Boxes */
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }

    .stat-box {
      background: white;
      border-radius: 12px;
      padding: 16px 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      animation: slideUp 0.6s ease;
      animation-fill-mode: both;
    }

    .stat-box:nth-child(1) { animation-delay: 0.1s; }
    .stat-box:nth-child(2) { animation-delay: 0.2s; }
    .stat-box:nth-child(3) { animation-delay: 0.3s; }

    .stat-icon {
      font-size: 28px;
      margin-bottom: 8px;
      animation: float 3s ease-in-out infinite;
    }

    .stat-number {
      font-size: 22px;
      font-weight: 800;
      color: #667eea;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 11px;
      color: #718096;
      font-weight: 600;
    }

    /* Content Section */
    .content-section {
      background: #f8f9fa;
      border-radius: 24px 24px 0 0;
      padding: 24px 16px;
      min-height: 60vh;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #2d3748;
    }

    .see-all {
      font-size: 13px;
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
    }

    /* Category Grid - Small Boxes */
    .category-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }

    .category-box {
      background: white;
      border-radius: 16px;
      padding: 20px 16px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      color: inherit;
      animation: slideUp 0.6s ease;
      animation-fill-mode: both;
    }

    .category-box:nth-child(1) { animation-delay: 0.1s; }
    .category-box:nth-child(2) { animation-delay: 0.2s; }
    .category-box:nth-child(3) { animation-delay: 0.3s; }
    .category-box:nth-child(4) { animation-delay: 0.4s; }

    .category-box:active {
      transform: scale(0.97);
    }

    .category-icon-wrapper {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
      position: relative;
    }

    .category-icon-wrapper::before {
      content: '';
      position: absolute;
      inset: -4px;
      background: inherit;
      border-radius: 16px;
      opacity: 0.2;
      filter: blur(8px);
    }

    .category-icon {
      font-size: 28px;
      position: relative;
      z-index: 1;
    }

    .category-name {
      font-size: 15px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 4px;
    }

    .category-count {
      font-size: 12px;
      color: #a0aec0;
      font-weight: 500;
    }

    /* Feature Boxes */
    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }

    .feature-box {
      background: white;
      border-radius: 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      animation: slideUp 0.6s ease;
      animation-fill-mode: both;
    }

    .feature-box:nth-child(1) { animation-delay: 0.1s; }
    .feature-box:nth-child(2) { animation-delay: 0.2s; }
    .feature-box:nth-child(3) { animation-delay: 0.3s; }

    .feature-icon-box {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .feature-content {
      flex: 1;
    }

    .feature-title {
      font-size: 14px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 4px;
    }

    .feature-desc {
      font-size: 12px;
      color: #718096;
      line-height: 1.4;
    }

    /* CTA Box */
    .cta-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 24px 20px;
      color: white;
      text-align: center;
      margin-bottom: 24px;
      animation: slideUp 0.8s ease;
      animation-delay: 0.4s;
      animation-fill-mode: both;
    }

    .cta-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .cta-subtitle {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 16px;
    }

    .cta-button {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .cta-button:active {
      transform: scale(0.97);
    }

    /* Bottom Navigation */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      padding: 12px 16px 16px;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-around;
      z-index: 100;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 10px;
      transition: all 0.3s;
      text-decoration: none;
      color: #a0aec0;
      min-width: 60px;
    }

    .nav-item.active {
      color: #667eea;
      background: rgba(102,126,234,0.1);
    }

    .nav-icon {
      font-size: 22px;
    }

    .nav-label {
      font-size: 11px;
      font-weight: 600;
    }

    /* Loading */
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .error-box {
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 16px;
      color: white;
      text-align: center;
      margin: 20px 16px;
    }

    @media (min-width: 768px) {
      .mobile-home {
        max-width: 480px;
        margin: 0 auto;
        box-shadow: 0 0 40px rgba(0,0,0,0.2);
      }
    }
  `

  return (
    <>
      <style>{styles}</style>
      <div className="mobile-home">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="logo-box">
              <div className="logo-icon">🏠</div>
              <div className="logo-text">NestFinder</div>
            </div>
            <div className="header-actions">
              {token ? (
                <button className="icon-btn" onClick={handleLogout}>🚪</button>
              ) : (
                <>
                  <Link to="/login" className="icon-btn">🔐</Link>
                  <Link to="/signup" className="icon-btn">✨</Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-compact">
          <div className="welcome-box">
            <h1 className="welcome-title">Find Your Perfect Nest</h1>
            <p className="welcome-subtitle">
              Discover houses, parking, and shops in one place
            </p>
          </div>

          {/* Quick Stats - Small Boxes */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="error-box">⚠️ {error}</div>
          ) : (
            <div className="quick-stats">
              <div className="stat-box">
                <div className="stat-icon">🏡</div>
                <div className="stat-number">{animatedCounts.houses}</div>
                <div className="stat-label">Houses</div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">🅿️</div>
                <div className="stat-number">{animatedCounts.parking}</div>
                <div className="stat-label">Parking</div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">🏪</div>
                <div className="stat-number">{animatedCounts.shop}</div>
                <div className="stat-label">Shops</div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="content-section">
          {/* Categories */}
          <div className="section-header">
            <h2 className="section-title">Browse Categories</h2>
            <Link to="/login" className="see-all">See All →</Link>
          </div>

          <div className="category-grid">
            <Link to="/login" className="category-box">
              <div className="category-icon-wrapper">
                <div className="category-icon">🏡</div>
              </div>
              <div className="category-name">Houses</div>
              <div className="category-count">{counts.houses} available</div>
            </Link>

            <Link to="/login" className="category-box">
              <div className="category-icon-wrapper">
                <div className="category-icon">🅿️</div>
              </div>
              <div className="category-name">Parking</div>
              <div className="category-count">{counts.parking} spots</div>
            </Link>

            <Link to="/login" className="category-box">
              <div className="category-icon-wrapper">
                <div className="category-icon">🏪</div>
              </div>
              <div className="category-name">Shops</div>
              <div className="category-count">{counts.shop} listings</div>
            </Link>

            <Link to="/login" className="category-box">
              <div className="category-icon-wrapper">
                <div className="category-icon">🏢</div>
              </div>
              <div className="category-name">Apartments</div>
              <div className="category-count">Coming soon</div>
            </Link>
          </div>

          {/* Features */}
          <div className="section-header">
            <h2 className="section-title">Why Choose Us?</h2>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-box">🔍</div>
              <div className="feature-content">
                <div className="feature-title">Smart Search</div>
                <div className="feature-desc">Find properties that match your needs</div>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-icon-box">✓</div>
              <div className="feature-content">
                <div className="feature-title">Verified Listings</div>
                <div className="feature-desc">All properties are verified</div>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-icon-box">💬</div>
              <div className="feature-content">
                <div className="feature-title">Direct Contact</div>
                <div className="feature-desc">Message owners instantly</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          {!loggedIn && (
            <div className="cta-box">
              <div className="cta-title">Ready to Get Started?</div>
              <div className="cta-subtitle">
                Join thousands who found their perfect space
              </div>
              <Link to="/signup" className="cta-button">
                Sign Up Free
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
         
          
            <Link to="/login" className="nav-itm">
              <div className="nav-icon">➕</div>
              <div className="nav-label">Add</div>
            </Link>
          
         
         
        </div>
      </div>
    </>
  )
}