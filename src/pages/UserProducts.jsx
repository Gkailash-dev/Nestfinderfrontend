import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UserProducts() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [userName, setUserName] = useState('');
  
  // New state for filters and sorting
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');
  const [favorites, setFavorites] = useState([]);
  
  const query = useQuery();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Modern color palette with purple accent
  const colors = {
    primary: '#1e293b',
    secondary: '#64748b',
    accent: '#8b5cf6',
    light: '#f8fafc',
    white: '#ffffff',
    border: '#e2e8f0',
    cardBg: '#ffffff',
    shadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)'
  };

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    fetchProperties();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(user.name || 'Guest');
  }, []);

  // Apply filters and sorting whenever search, type, sort, or properties change
  useEffect(() => {
    let result = [...properties];

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.location?.toLowerCase().includes(term) ||
        p.propertyType?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.ownerName?.toLowerCase().includes(term)
      );
    }

    // Filter by property type
    if (selectedType !== 'ALL') {
      result = result.filter(p => p.propertyType === selectedType);
    }

    // Apply sorting
    if (sortBy === 'priceLowHigh') {
      result.sort((a, b) => (a.rent || 0) - (b.rent || 0));
    } else if (sortBy === 'priceHighLow') {
      result.sort((a, b) => (b.rent || 0) - (a.rent || 0));
    }

    setFiltered(result);
  }, [searchTerm, properties, selectedType, sortBy]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProperties = () => {
    setLoading(true);
    setError(null);
    apiFetch('/all')
      .then(data => {
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (data?.data) list = data.data;
        else if (data?.properties) list = data.properties;
        else if (data) list = [data];
        setProperties(list);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load properties');
      })
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Helper to get image URL
  const getImageUrl = (property) => {
    const img = property.imageUrl || property.imageUrls || property.image;
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `https://nestfinder-2.onrender.com/${img.replace(/^\/+/, '')}`;
  };

  // Fallback image based on property type
  const fallbackImage = (type) => {
    const map = {
      APARTMENT: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200',
      HOUSE: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200',
      STUDIO: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=200',
      CONDO: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200'
    };
    return map[type] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200';
  };

  // Format area (e.g., 1500 -> 1.5k ft²)
  const formatArea = (area) => {
    if (!area) return '—';
    if (area >= 1000) return `${(area / 1000).toFixed(1)}k ft²`;
    return `${area} ft²`;
  };

  // Handle phone click
  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // Toggle favorite
  const toggleFavorite = (propertyId) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setSortBy('default');
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to add property page
  const handleAddProperty = () => {
    navigate('/add-property'); // Adjust the route as needed
  };

  // Calculate percentage for the bar chart
  const percentage = properties.length > 0 ? (filtered.length / properties.length) * 100 : 0;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      paddingBottom: '20px'
    }}>
      {/* Sticky Header */}
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${colors.border}`, 
        position: 'sticky', 
        top: 0, 
        zIndex: 10,
        padding: '12px 16px',
        boxShadow: colors.shadow
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Logo */}
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: colors.accent,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              transform: 'rotate(-5deg)',
              boxShadow: `0 4px 8px ${colors.accent}80`,
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(-5deg)'}
            >
              🏠
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: colors.primary }}>
                NestFinder
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: colors.secondary }}>
                Welcome back, {userName}!
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: '30px',
              color: colors.secondary,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = colors.light;
              e.target.style.borderColor = colors.accent;
              e.target.style.color = colors.accent;
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = colors.border;
              e.target.style.color = colors.secondary;
            }}
          >
            Logout
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by location, type, owner..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 40px 14px 48px',
              border: `1px solid ${colors.border}`,
              borderRadius: '40px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: colors.white,
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
            onFocus={e => {
              e.target.style.borderColor = colors.accent;
              e.target.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
              e.target.style.transform = 'scale(1.02)';
            }}
            onBlur={e => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          />
          <span style={{ 
            position: 'absolute', 
            left: '18px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: colors.secondary,
            fontSize: '18px'
          }}>
            🔍
          </span>
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: colors.secondary,
                padding: '4px',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = colors.light;
                e.target.style.color = colors.accent;
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = colors.secondary;
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter and Sort Controls */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {/* Property Type Filter */}
          
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '30px',
              border: `1px solid ${colors.border}`,
              fontSize: '13px',
              backgroundColor: colors.white,
              color: colors.primary,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="default">Sort by: Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            style={{
              padding: '8px 16px',
              backgroundColor: colors.light,
              border: `1px solid ${colors.border}`,
              borderRadius: '30px',
              fontSize: '13px',
              color: colors.secondary,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = colors.accent;
              e.target.style.color = 'white';
              e.target.style.borderColor = colors.accent;
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = colors.light;
              e.target.style.color = colors.secondary;
              e.target.style.borderColor = colors.border;
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* Animated properties count with bar chart */}
        {!loading && !error && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                key={filtered.length}
                style={{
                  fontSize: '13px',
                  color: colors.secondary,
                  animation: 'popIn 0.3s ease-out',
                  display: 'inline-block'
                }}
              >
                {filtered.length} properties found
              </span>
              <span style={{ fontSize: '11px', color: colors.secondary }}>
                {Math.round(percentage)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: colors.border,
              borderRadius: '3px',
              marginTop: '4px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: colors.accent,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease-out'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ padding: '16px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: colors.secondary }}>
            <div style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 16px',
              border: `3px solid ${colors.border}`,
              borderTopColor: colors.accent,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Loading...
          </div>
        )}

        {error && (
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fee2e2', 
            border: '1px solid #fecaca', 
            borderRadius: '16px', 
            color: '#b91c1c',
            fontSize: '14px',
            animation: 'fadeIn 0.3s'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                backgroundColor: colors.white, 
                borderRadius: '24px', 
                color: colors.secondary,
                boxShadow: colors.shadow,
                animation: 'fadeInUp 0.4s'
              }}>
                No properties match your search.
              </div>
            ) : (
              filtered.map((p, idx) => {
                const imageUrl = getImageUrl(p) || fallbackImage(p.propertyType);
                const isFavorite = favorites.includes(p._id || p.id);
                return (
                  <div
                    key={p._id || p.id || idx}
                    style={{
                      backgroundColor: colors.cardBg,
                      borderRadius: '24px',
                      boxShadow: colors.shadow,
                      display: 'flex',
                      overflow: 'hidden',
                      padding: '12px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      animation: `fadeInUp 0.4s ${idx * 0.05}s both`
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = colors.shadow;
                    }}
                  >
                    {/* Left: Image */}
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      flexShrink: 0,
                      marginRight: '14px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <img
                        src={imageUrl}
                        alt={p.propertyType}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.src = fallbackImage(p.propertyType)}
                      />
                    </div>

                    {/* Right: Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Type and price row with favorite heart */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: 600, 
                          color: colors.accent,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          backgroundColor: `${colors.accent}10`,
                          padding: '2px 8px',
                          borderRadius: '30px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.backgroundColor = `${colors.accent}20`}
                        onMouseLeave={e => e.target.style.backgroundColor = `${colors.accent}10`}
                        >
                          {p.propertyType || 'PROPERTY'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 700, color: colors.primary }}>
                            INR {p.rent?.toLocaleString()}/mo
                          </span>
                          {/* Favorite heart */}
                          <button
                            onClick={() => toggleFavorite(p._id || p.id || idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '20px',
                              cursor: 'pointer',
                              padding: 0,
                              lineHeight: 1,
                              transition: 'transform 0.2s',
                              color: isFavorite ? '#ef4444' : colors.secondary
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            {isFavorite ? '❤️' : '🤍'}
                          </button>
                        </div>
                      </div>

                      {/* Location */}
                      <p style={{ 
                        margin: '0 0 8px', 
                        fontSize: '13px', 
                        color: colors.secondary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                       Location: {p.location || 'Location not specified'}
                      </p>

                      {/* Features row: bedrooms, bathrooms, heart, area */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        alignItems: 'center',
                        fontSize: '13px',
                        color: colors.primary,
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontWeight: 500 }}>{p.bedrooms ?? '—'}</span>
                        <span style={{ fontWeight: 500 }}>{p.bathrooms ?? '—'}</span>
                        <span style={{ color: '#ef4444', fontSize: '15px', animation: 'heartBeat 1.5s infinite' }}>♥</span>
                        <span style={{ fontWeight: 500 }}>{formatArea(p.area)}</span>
                      </div>

                      {/* Owner info & clickable phone */}
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                        color: colors.secondary
                      }}>
                        {p.ownerName && <span>👤 {p.ownerName}</span>}
                        {p.phoneNumber && (
                          <button
                            onClick={() => handleCall(p.phoneNumber)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              color: colors.accent,
                              fontWeight: 600,
                              fontSize: '12px',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => {
                              e.target.style.color = colors.primary;
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                              e.target.style.color = colors.accent;
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            📞 {p.phoneNumber}
                          </button>
                        )}
                        {p.advancePayment && (
                          <span style={{ 
                            color: colors.accent, 
                            fontWeight: 500,
                            backgroundColor: `${colors.accent}10`,
                            padding: '2px 8px',
                            borderRadius: '30px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.target.style.backgroundColor = `${colors.accent}20`}
                          onMouseLeave={e => e.target.style.backgroundColor = `${colors.accent}10`}
                          >
                            Advance: {p.advancePayment}
                          </span>
                        )}
                      </div>

                      {/* Optional description (truncated) */}
                      {p.description && (
                        <p style={{ 
                          margin: '8px 0 0', 
                          fontSize: '12px', 
                          color: colors.secondary,
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                         Description: {p.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Floating scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: colors.accent,
            color: 'white',
            border: 'none',
            boxShadow: `0 4px 12px ${colors.accent}80`,
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            animation: 'fadeInUp 0.3s',
            zIndex: 20
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = `0 6px 16px ${colors.accent}`;
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = `0 4px 12px ${colors.accent}80`;
          }}
        >
          ↑
        </button>
      )}

      {/* Icon button with animation */}
      <button
        onClick={handleAddProperty}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#3b67a0',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(41, 42, 42, 0.4)',
          fontSize: '24px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          animation: 'bounce 2s ease-in-out infinite',
          zIndex: 20
        }}
        onMouseEnter={e => {
          e.target.style.backgroundColor = '#5dade2';
          e.target.style.boxShadow = '0 6px 16px rgba(93, 173, 226, 0.5)';
          e.target.style.transform = 'translateX(-50%) scale(1.1)';
        }}
        onMouseLeave={e => {
          e.target.style.backgroundColor = '#87ceeb';
          e.target.style.boxShadow = '0 4px 12px rgba(135, 206, 235, 0.4)';
          e.target.style.transform = 'translateX(-50%) scale(1)';
        }}
      >
        +
      </button>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          40% { transform: scale(1); }
          60% { transform: scale(1.1); }
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          80% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}