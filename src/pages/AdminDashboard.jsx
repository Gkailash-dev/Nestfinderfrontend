import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [counts, setCounts] = useState({ houses: 0, parking: 0, shop: 0 });
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: null, id: null });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const colors = {
    primary: '#1e293b',
    secondary: '#64748b',
    accent: '#8b5cf6',
    light: '#f8fafc',
    white: '#ffffff',
    border: '#e2e8f0',
    cardBg: '#ffffff',
    shadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
  };

  useEffect(() => {
    if (activeTab === 'dashboard') fetchCounts();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'properties') fetchProperties();
  }, [activeTab]);

  const fetchCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/counts');
      setCounts({
        houses: data.houses || 0,
        parking: data.parking || 0,
        shop: data.shop || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/admin/getuser');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/all');
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.data) list = data.data;
      else if (data?.properties) list = data.properties;
      else if (data) list = [data];
      setProperties(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const { type, id } = deleteModal;
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      if (type === 'user') {
        await apiFetch(`/admin/delete/${id}`, { method: 'DELETE' });
        setUsers(users.filter(u => u.id !== id && u._id !== id));
      } else if (type === 'property') {
        await apiFetch(`/admin/deletepro/${id}`, { method: 'DELETE' });
        setProperties(properties.filter(p => p.id !== id && p._id !== id));
      }
      setDeleteModal({ show: false, type: null, id: null });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.phoneNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredProperties = properties.filter(p =>
    (p.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.propertyType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.ownerName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // For bar chart: find max count
  const maxCount = Math.max(counts.houses, counts.parking, counts.shop, 1);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(145deg, #f1f5f9 0%, #e9eef3 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        borderRight: `1px solid ${colors.border}`,
        padding: '28px 0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0,0,0,0.02)'
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: colors.accent,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            transform: 'rotate(-5deg)',
            boxShadow: `0 8px 16px ${colors.accent}40`
          }}>
            🏠
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: colors.primary }}>NestFinder</h1>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: colors.secondary }}>admin console</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {[
            { key: 'dashboard', label: 'Dashboard', icon: '📊' },
            { key: 'users', label: 'Users', icon: '👥' },
            { key: 'properties', label: 'Properties', icon: '🏠' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '14px 24px',
                border: 'none',
                background: activeTab === item.key ? `${colors.accent}15` : 'transparent',
                color: activeTab === item.key ? colors.accent : colors.secondary,
                fontSize: '15px',
                fontWeight: activeTab === item.key ? 600 : 400,
                textAlign: 'left',
                cursor: 'pointer',
                borderLeft: activeTab === item.key ? `4px solid ${colors.accent}` : '4px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${colors.accent}10`}
              onMouseLeave={e => {
                if (activeTab !== item.key) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0 24px', marginTop: '20px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              border: `1px solid ${colors.border}`,
              borderRadius: '40px',
              background: 'rgba(255,255,255,0.6)',
              color: colors.secondary,
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.target.style.background = colors.white;
              e.target.style.borderColor = colors.accent;
              e.target.style.color = colors.accent;
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(255,255,255,0.6)';
              e.target.style.borderColor = colors.border;
              e.target.style.color = colors.secondary;
            }}
          >
            <span>🚪</span> Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* Header with Search (if needed) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 600, color: colors.primary, margin: 0, letterSpacing: '-0.5px' }}>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'properties' && 'Property Management'}
            </h1>
            <p style={{ margin: '6px 0 0', color: colors.secondary, fontSize: '14px' }}>
              {activeTab === 'dashboard' && 'Overview of your listings'}
              {activeTab === 'users' && 'Manage registered users'}
              {activeTab === 'properties' && 'Manage property listings'}
            </p>
          </div>
          {activeTab !== 'dashboard' && (
            <div style={{ position: 'relative', animation: 'fadeIn 0.3s' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  padding: '12px 20px 12px 46px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '40px',
                  fontSize: '14px',
                  width: '280px',
                  outline: 'none',
                  background: colors.white,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = colors.accent}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
              <span style={{ position: 'absolute', left: '18px', top: '12px', color: colors.secondary, fontSize: '16px' }}>🔍</span>
            </div>
          )}
        </div>

        {error && (
          <div style={{
            padding: '14px 20px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '16px',
            color: '#b91c1c',
            marginBottom: '24px',
            animation: 'slideDown 0.3s'
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '48px', height: '48px', border: `4px solid ${colors.border}`, borderTopColor: colors.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {!loading && activeTab === 'dashboard' && (
          <>
            {/* Stats Cards with Bar Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {[
                { label: 'Houses', value: counts.houses, icon: '🏡', color: '#8b5cf6' },
                { label: 'Parking Spaces', value: counts.parking, icon: '🅿️', color: '#10b981' },
                { label: 'Shops', value: counts.shop, icon: '🏪', color: '#f59e0b' },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  style={{
                    background: colors.white,
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: colors.shadow,
                    animation: `fadeInUp 0.4s ${idx * 0.1}s both`,
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: colors.secondary }}>{stat.label}</div>
                      <div style={{ fontSize: '40px', fontWeight: 700, color: colors.primary, lineHeight: 1.2 }}>{stat.value}</div>
                    </div>
                    <div style={{ fontSize: '48px', opacity: 0.7 }}>{stat.icon}</div>
                  </div>
                  {/* Bar chart representation */}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: colors.secondary, marginBottom: '6px' }}>
                      {Math.round((stat.value / maxCount) * 100)}% of max
                    </div>
                    <div style={{ height: '8px', background: colors.border, borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(stat.value / maxCount) * 100}%`,
                          height: '100%',
                          background: stat.color,
                          borderRadius: '4px',
                          transition: 'width 0.5s ease-out'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions / Insights (optional) */}
            <div style={{ background: colors.white, borderRadius: '24px', padding: '24px', boxShadow: colors.shadow, animation: 'fadeInUp 0.4s 0.3s both' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: colors.primary }}>Recent Activity</h3>
              <p style={{ color: colors.secondary }}>No recent activity to display.</p>
            </div>
          </>
        )}

        {!loading && activeTab === 'users' && (
          <div style={{ background: colors.white, borderRadius: '24px', boxShadow: colors.shadow, overflow: 'auto', animation: 'fadeIn 0.3s' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}`, background: colors.light }}>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>ID</th>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>Name</th>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>Email</th>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>Phone</th>
                  <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: 600, color: colors.primary }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: colors.secondary }}>No users found</td></tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id || user._id} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = colors.light} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '18px 20px', fontSize: '14px' }}>{user.id || user._id}</td>
                      <td style={{ padding: '18px 20px', fontWeight: 500 }}>{user.name}</td>
                      <td style={{ padding: '18px 20px' }}>{user.email}</td>
                      <td style={{ padding: '18px 20px' }}>{user.phoneNumber}</td>
                      <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                        <button
                          onClick={() => setDeleteModal({ show: true, type: 'user', id: user.id || user._id })}
                          style={{
                            padding: '8px 18px',
                            background: '#fee2e2',
                            border: 'none',
                            borderRadius: '40px',
                            color: '#b91c1c',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.target.style.background = '#fecaca'; e.target.style.transform = 'scale(1.02)'; }}
                          onMouseLeave={e => { e.target.style.background = '#fee2e2'; e.target.style.transform = 'scale(1)'; }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && activeTab === 'properties' && (
          <div style={{ background: colors.white, borderRadius: '24px', boxShadow: colors.shadow, overflow: 'auto', animation: 'fadeIn 0.3s' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}`, background: colors.light }}>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>ID</th>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>Type</th>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>Location</th>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>Rent</th>
                  <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: 600, color: colors.primary }}>Owner</th>
                  <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: 600, color: colors.primary }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: colors.secondary }}>No properties found</td></tr>
                ) : (
                  filteredProperties.map(prop => (
                    <tr key={prop.id || prop._id} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = colors.light} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '18px 20px', fontSize: '14px' }}>{prop.id || prop._id}</td>
                      <td style={{ padding: '18px 20px' }}>{prop.propertyType}</td>
                      <td style={{ padding: '18px 20px' }}>{prop.location}</td>
                      <td style={{ padding: '18px 20px' }}>INR {prop.rent?.toLocaleString()}/mo</td>
                      <td style={{ padding: '18px 20px' }}>{prop.ownerName}</td>
                      <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                        <button
                          onClick={() => setDeleteModal({ show: true, type: 'property', id: prop.id || prop._id })}
                          style={{
                            padding: '8px 18px',
                            background: '#fee2e2',
                            border: 'none',
                            borderRadius: '40px',
                            color: '#b91c1c',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.target.style.background = '#fecaca'; e.target.style.transform = 'scale(1.02)'; }}
                          onMouseLeave={e => { e.target.style.background = '#fee2e2'; e.target.style.transform = 'scale(1)'; }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s'
        }}>
          <div style={{
            background: colors.white,
            borderRadius: '32px',
            padding: '32px',
            maxWidth: '420px',
            width: '90%',
            boxShadow: colors.shadow,
            animation: 'scaleIn 0.2s'
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '22px', color: colors.primary }}>Confirm Deletion</h3>
            <p style={{ margin: '0 0 28px', color: colors.secondary, lineHeight: 1.6 }}>
              Are you sure you want to delete this {deleteModal.type}? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteModal({ show: false, type: null, id: null })}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '40px',
                  color: colors.secondary,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.target.style.background = colors.light; e.target.style.borderColor = colors.secondary; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = colors.border; }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '12px 28px',
                  background: '#b91c1c',
                  border: 'none',
                  borderRadius: '40px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => { e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 8px 16px rgba(185,28,28,0.3)'; }}
                onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}