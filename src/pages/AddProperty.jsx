import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiFetch } from '../services/api';

export default function AddProperty() {
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState(''); // will hold selected value
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [description, setDescription] = useState('');
  const [advancePayment, setAdvancePayment] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Navy blue based color palette
  const colors = {
    primary: '#0a1929',    // navy
    secondary: '#1e3a5f',  // lighter navy
    accent: '#3b82f6',     // bright blue for contrast
    light: '#f0f4fa',
    white: '#ffffff',
    border: '#b0c4de',
    cardBg: 'rgba(255,255,255,0.9)',
    shadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  };

  useEffect(() => {
    let mounted = true;
    apiFetch('/who')
      .then(() => {})
      .catch(() => {
        if (mounted) navigate('/login');
      });
    return () => { mounted = false; };
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!ownerName.trim() || !phoneNumber.trim() || !email.trim() || !propertyType || !location.trim() || rent === '') {
      setError('Please fill required fields');
      return;
    }

    const data = new FormData();
    data.append('ownerName', ownerName.trim());
    data.append('phoneNumber', phoneNumber.trim());
    data.append('email', email.trim());
    data.append('propertyType', propertyType);
    data.append('location', location.trim());
    data.append('rent', String(parseFloat(rent)));
    data.append('description', description.trim());
    data.append('advancePayment', advancePayment.trim());
    if (imageFile) data.append('imageUrls', imageFile);

    setLoading(true);
    try {
      const res = await axios.post('https://nestfinder-2.onrender.com/add', data, { withCredentials: true });
      setSuccess(res.data?.message || 'Property added successfully');
      // Clear form
      setOwnerName('');
      setPhoneNumber('');
      setEmail('');
      setPropertyType('');
      setLocation('');
      setRent('');
      setDescription('');
      setAdvancePayment('');
      setImageFile(null);
    } catch (err) {
      console.error('Add property failed', err);
      const resp = err?.response;
      const msg = resp?.data?.message || resp?.data || err.message || 'Failed to add property';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a1929 0%, #1e3a5f 50%, #0a1929 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientMove 15s ease infinite',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated floating orbs for extra motion */}
      <div style={orbStyle(1, '30%', '20%', '150px', '#3b82f6')} />
      <div style={orbStyle(2, '70%', '80%', '200px', '#1e3a5f')} />
      <div style={orbStyle(3, '85%', '40%', '120px', '#0a1929')} />

      {/* Form card */}
      <div style={{
        backgroundColor: colors.cardBg,
        backdropFilter: 'blur(12px)',
        borderRadius: '32px',
        boxShadow: colors.shadow,
        width: '100%',
        maxWidth: '700px',
        padding: '40px',
        animation: 'fadeInUp 0.6s ease-out',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {/* Header with back link */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: colors.primary,
            fontSize: '24px',
            marginRight: '16px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.target.style.transform = 'translateX(-3px)'}
          onMouseLeave={e => e.target.style.transform = 'translateX(0)'}
          >
            ←
          </Link>
          <h1 style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: 600,
            color: colors.primary,
            letterSpacing: '-0.5px'
          }}>
            Add New Property
          </h1>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Two‑column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <InputField
              label="Owner Name"
              value={ownerName}
              onChange={setOwnerName}
              placeholder="John Doe"
              required
              colors={colors}
            />
            <InputField
              label="Phone Number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="+91 98765 43210"
              required
              colors={colors}
            />
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="owner@example.com"
              required
              colors={colors}
            />
            
            {/* Property Type as dropdown */}
            <div>
              <label style={labelStyle(colors)}>Property Type *</label>
              <select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                required
                style={selectStyle(colors)}
              >
                <option value="" disabled>Select type</option>
                <option value="house">House</option>
                <option value="shop">Shop</option>
                <option value="parking">Parking</option>
              </select>
            </div>

            <InputField
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="City, Area"
              required
              colors={colors}
            />
            <InputField
              label="Rent (INR)"
              type="number"
              step="0.01"
              value={rent}
              onChange={setRent}
              placeholder="15000"
              required
              colors={colors}
            />
            <InputField
              label="Advance Payment"
              value={advancePayment}
              onChange={setAdvancePayment}
              placeholder="2 months"
              colors={colors}
            />
            {/* File input spans both columns */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle(colors)}>Property Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0] || null)}
                style={fileInputStyle(colors)}
              />
            </div>
          </div>

          {/* Description field (full width) */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle(colors)}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the property (amenities, nearby places, etc.)"
              rows={4}
              style={textareaStyle(colors)}
            />
          </div>

          {/* Messages */}
          {error && (
            <div style={messageStyle('error', colors)}>
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div style={messageStyle('success', colors)}>
              <span>✅</span> {success}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px' }}>
            <Link to="/" style={buttonStyle('secondary', colors)}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={buttonStyle('primary', colors, loading)}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span style={spinnerStyle(colors)} />
                  Submitting...
                </span>
              ) : (
                'Add Property'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Reusable input component (same as before)
function InputField({ label, value, onChange, placeholder, type = 'text', required, step, colors }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <label style={labelStyle(colors)}>{label}{required && ' *'}</label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle(colors, focused)}
      />
    </div>
  );
}

// Style helpers
const labelStyle = (colors) => ({
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.primary,
});

const inputStyle = (colors, focused) => ({
  width: '100%',
  padding: '12px 16px',
  border: `1px solid ${focused ? colors.accent : colors.border}`,
  borderRadius: '16px',
  fontSize: '15px',
  outline: 'none',
  backgroundColor: colors.white,
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
  boxShadow: focused ? `0 0 0 3px ${colors.accent}20` : 'none',
});

const selectStyle = (colors) => ({
  width: '100%',
  padding: '12px 16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '16px',
  fontSize: '15px',
  outline: 'none',
  backgroundColor: colors.white,
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  color: colors.primary,
});

const textareaStyle = (colors) => ({
  width: '100%',
  padding: '12px 16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '16px',
  fontSize: '15px',
  outline: 'none',
  backgroundColor: colors.white,
  boxSizing: 'border-box',
  transition: 'border 0.2s ease, box-shadow 0.2s ease',
  fontFamily: 'inherit',
  resize: 'vertical',
});

const fileInputStyle = (colors) => ({
  width: '100%',
  padding: '10px 0',
  fontSize: '14px',
  color: colors.secondary,
  border: `1px dashed ${colors.border}`,
  borderRadius: '16px',
  backgroundColor: colors.light,
  cursor: 'pointer',
  transition: 'border 0.2s ease',
});

const buttonStyle = (variant, colors, loading = false) => ({
  padding: '12px 28px',
  border: 'none',
  borderRadius: '40px',
  fontSize: '16px',
  fontWeight: 600,
  cursor: loading ? 'not-allowed' : 'pointer',
  backgroundColor: variant === 'primary' ? colors.accent : 'transparent',
  color: variant === 'primary' ? 'white' : colors.primary,
  border: variant === 'secondary' ? `1px solid ${colors.border}` : 'none',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  opacity: loading ? 0.7 : 1,
  boxShadow: variant === 'primary' ? `0 8px 16px ${colors.accent}80` : 'none',
});

const messageStyle = (type, colors) => ({
  padding: '14px 20px',
  borderRadius: '16px',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px',
  animation: 'fadeInUp 0.3s ease',
  backgroundColor: type === 'error' ? '#fee2e2' : '#dcfce7',
  color: type === 'error' ? '#b91c1c' : '#166534',
  border: type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
});

const spinnerStyle = (colors) => ({
  display: 'inline-block',
  width: '16px',
  height: '16px',
  border: `2px solid rgba(255,255,255,0.3)`,
  borderTopColor: 'white',
  borderRadius: '50%',
  animation: 'spin 0.6s linear infinite',
});

// Floating orb helper
const orbStyle = (index, left, top, size, color) => ({
  position: 'absolute',
  left,
  top,
  width: size,
  height: size,
  borderRadius: '50%',
  background: `radial-gradient(circle at 30% 30%, ${color}80, transparent 70%)`,
  filter: 'blur(40px)',
  animation: `float ${8 + index * 2}s ease-in-out infinite`,
  zIndex: 1,
  pointerEvents: 'none',
});