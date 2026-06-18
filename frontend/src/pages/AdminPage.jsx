import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaMapMarkerAlt, 
  FaSuitcase, 
  FaCalendarCheck, 
  FaUsers, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaPlus,
  FaUserShield
} from 'react-icons/fa';

const AdminPage = () => {
  const { token, isAdmin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('destinations');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [activeTab, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditing(item._id);
    setFormData(item);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      if (activeTab === 'packages' && payload.destination?._id) {
        payload.destination = payload.destination._id;
      }
      if (activeTab === 'bookings') {
        if (payload.package?._id) {
          payload.package = payload.package._id;
        }
        if (payload.user?._id) {
          payload.user = payload.user._id;
        }
      }

      const res = await fetch(`http://localhost:5000/api/admin/${activeTab}/${editing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditing(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/${activeTab}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({});
        fetchData();
      }
    } catch (error) {
      console.error('Error creating:', error);
    }
  };

  const tabLabels = {
    destinations: 'Destinations',
    packages: 'Packages',
    bookings: 'Bookings',
    users: 'Users'
  };

  const tabIcons = {
    destinations: <FaMapMarkerAlt />,
    packages: <FaSuitcase />,
    bookings: <FaCalendarCheck />,
    users: <FaUsers />
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <h1>Admin Login Required</h1>
        <p>Please sign in with your admin credentials to access the admin panel.</p>
        <Link to="/login" className="cta-button">Go to Login</Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <h1>Access Denied</h1>
        <p>Your account does not have admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <p className="admin-intro">Manage all destinations, packages, bookings, and users from a single admin dashboard.</p>
      <div className="admin-tabs">
        {['destinations', 'packages', 'bookings', 'users'].map(tab => (
          <button
            key={tab}
            className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="tab-icon">{tabIcons[tab]}</span>
            <span className="tab-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="admin-grid">
            <div className="create-form">
              <div className="create-form-header">
                <h3>Create New {tabLabels[activeTab].slice(0, -1)}</h3>
                <p className="create-note">Fill in the details below to add a new record.</p>
              </div>

              {activeTab === 'destinations' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <button onClick={handleCreate} className="cta-button admin-create-btn"><FaPlus /> Create</button>
                </>
              )}

              {activeTab === 'packages' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Destination ID"
                    value={formData.destination || ''}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                  <button onClick={handleCreate} className="cta-button admin-create-btn"><FaPlus /> Create</button>
                </>
              )}

              {activeTab === 'bookings' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    value={formData.date ? new Date(formData.date).toISOString().slice(0, 10) : ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Number of People"
                    value={formData.numPeople || ''}
                    onChange={(e) => setFormData({ ...formData, numPeople: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="User ID"
                    value={formData.user || ''}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Package ID"
                    value={formData.package || ''}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  />
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={handleCreate} className="cta-button admin-create-btn"><FaPlus /> Create</button>
                </>
              )}

              {activeTab === 'users' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <select
                    value={formData.role || 'user'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button onClick={handleCreate} className="cta-button admin-create-btn"><FaPlus /> Create</button>
                </>
              )}
            </div>

            <div className="data-list">
              {data.map((item) => (
                <div key={item._id} className="data-item">
                  {editing === item._id ? (
                    <div className="edit-form">
                      {activeTab === 'destinations' && (
                        <>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                          <input
                            type="text"
                            value={formData.image || ''}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          />
                          <div className="edit-actions">
                            <button onClick={handleSave} className="admin-action-btn btn-save"><FaSave /> Save</button>
                            <button onClick={() => setEditing(null)} className="admin-action-btn btn-cancel"><FaTimes /> Cancel</button>
                          </div>
                        </>
                      )}
                      {activeTab === 'packages' && (
                        <>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                          <input
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          />
                          <input
                            type="text"
                            value={formData.duration || ''}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          />
                          <div className="edit-actions">
                            <button onClick={handleSave} className="admin-action-btn btn-save"><FaSave /> Save</button>
                            <button onClick={() => setEditing(null)} className="admin-action-btn btn-cancel"><FaTimes /> Cancel</button>
                          </div>
                        </>
                      )}
                      {activeTab === 'bookings' && (
                        <>
                          <select
                            value={formData.status || ''}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="edit-actions">
                            <button onClick={handleSave} className="admin-action-btn btn-save"><FaSave /> Save</button>
                            <button onClick={() => setEditing(null)} className="admin-action-btn btn-cancel"><FaTimes /> Cancel</button>
                          </div>
                        </>
                      )}
                      {activeTab === 'users' && (
                        <>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                          <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                          <select
                            value={formData.role || ''}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <div className="edit-actions">
                            <button onClick={handleSave} className="admin-action-btn btn-save"><FaSave /> Save</button>
                            <button onClick={() => setEditing(null)} className="admin-action-btn btn-cancel"><FaTimes /> Cancel</button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="item-display">
                      <div className="item-info">
                        {activeTab === 'destinations' && (
                          <>
                            <h4>{item.name}</h4>
                            <p className="admin-dest-desc">{item.description}</p>
                          </>
                        )}
                        {activeTab === 'packages' && (
                          <>
                            <h4>{item.name}</h4>
                            <p className="admin-pkg-meta">
                              <strong>Price:</strong> ₹{item.price?.toLocaleString('en-IN')} | <strong>Duration:</strong> {item.duration}
                            </p>
                          </>
                        )}
                        {activeTab === 'bookings' && (
                          <>
                            <div className="admin-booking-header">
                              <h4>{item.name}</h4>
                              <span className={`status-pill ${item.status || 'pending'}`}>{item.status || 'pending'}</span>
                            </div>
                            <p className="admin-pkg-name">Package: {item.package?.name || 'Custom Tour'}</p>
                            <p className="admin-booking-meta">Date: {new Date(item.date).toLocaleDateString('en-IN')} | Travelers: {item.numPeople || 1}</p>
                            <p className="admin-booking-contact">{item.email} · {item.phone}</p>
                            <p className="admin-booking-paymethod">Paid via: <span className="payment-type-text">{item.paymentMethod?.replace('_', ' ').toUpperCase()}</span></p>
                          </>
                        )}
                        {activeTab === 'users' && (
                          <>
                            <div className="admin-user-header">
                              <h4>{item.name}</h4>
                              {item.role === 'admin' && <span className="admin-badge"><FaUserShield /> Admin</span>}
                            </div>
                            <p className="admin-user-email">{item.email}</p>
                          </>
                        )}
                      </div>
                      <div className="item-actions">
                        <button onClick={() => handleEdit(item)} className="admin-action-btn btn-edit"><FaEdit /> Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="admin-action-btn btn-delete"><FaTrash /> Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;