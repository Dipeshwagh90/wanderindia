import React, { useState, useEffect } from 'react';
import PackageCard from '../components/PackageCard';
import SearchBar from '../components/SearchBar';
import { packages as fallbackPackages } from '../data/packages';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minDuration, setMinDuration] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axiosInstance.get('/packages');
        setPackages(res.data);
        // Set default max price to max price available from database
        if (res.data.length > 0) {
          const max = Math.max(...res.data.map(p => p.price));
          setMaxPrice(max);
        }
      } catch (err) {
        console.error('Error fetching packages, using fallback mock data:', err);
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    let filtered = [...packages];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(pkg => pkg.price <= maxPrice);

    // Apply duration filter
    if (minDuration > 0) {
      filtered = filtered.filter(pkg => {
        const duration = parseInt(pkg.duration.split(' ')[0]);
        return duration >= minDuration;
      });
    }

    // Apply sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'duration') {
      filtered.sort((a, b) => {
        const durA = parseInt(a.duration.split(' ')[0]);
        const durB = parseInt(b.duration.split(' ')[0]);
        return durA - durB;
      });
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, maxPrice, minDuration, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const maxPriceAvailable = packages.length > 0 ? Math.max(...packages.map(p => p.price)) : 100000;
  const maxDurationAvailable = packages.length > 0 ? Math.max(...packages.map(p => parseInt(p.duration.split(' ')[0]))) : 10;

  if (loading) {
    return <LoadingSpinner message="Loading curated tour packages..." />;
  }

  return (
    <div className="packages-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Tour Packages</h1>
        <p style={{ color: 'var(--muted)' }}>Choose from {filteredPackages.length} curated travel packages</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="filters">
        <div className="filters-header">
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600 }}>Price Range</h3>
            <input
              type="range"
              min="0"
              max={maxPriceAvailable}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: 'var(--primary)'
              }}
            />
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>
              Up to ₹{maxPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="filters-actions">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                Minimum Duration
              </label>
              <select 
                value={minDuration}
                onChange={(e) => setMinDuration(Number(e.target.value))}
                className="sort-dropdown"
              >
                <option value={0}>Any Duration</option>
                <option value={3}>3+ Days</option>
                <option value={5}>5+ Days</option>
                <option value={7}>7+ Days</option>
                <option value={10}>10+ Days</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                Sort by
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredPackages.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem',
          background: 'rgba(16, 97, 244, 0.05)',
          borderRadius: '1.5rem',
          marginTop: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No packages found</h2>
          <p style={{ color: 'var(--muted)' }}>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
            Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
          </p>
          <div className="packages-grid">
            {filteredPackages.map(pkg => (
              <PackageCard key={pkg._id} package={pkg} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PackagesPage;