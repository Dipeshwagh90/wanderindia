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

  if (loading) {
    return <LoadingSpinner message="Loading curated tour packages..." />;
  }

  return (
    <div className="packages-page">
      <div className="page-hero-banner">
        <h1>Tour Packages</h1>
        <p>Choose from {filteredPackages.length} curated travel packages</p>
      </div>

      <SearchBar onSearch={handleSearch} value={searchTerm} />

      <div className="filters">
        <div className="filters-header">
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700 }}>Price Range</h3>
            <input
              type="range"
              min="0"
              max={maxPriceAvailable}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="premium-range-slider"
            />
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: '0.5rem 0 0', fontWeight: 600 }}>
              Up to ₹{maxPrice.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="filters-actions">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                Minimum Duration
              </label>
              <select 
                value={minDuration}
                onChange={(e) => setMinDuration(Number(e.target.value))}
                className="premium-select"
              >
                <option value={0}>Any Duration</option>
                <option value={3}>3+ Days</option>
                <option value={5}>5+ Days</option>
                <option value={7}>7+ Days</option>
                <option value={10}>10+ Days</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                Sort by
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="premium-select"
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
          padding: '4rem 2rem',
          background: 'rgba(16, 97, 244, 0.03)',
          borderRadius: '24px',
          marginTop: '2rem',
          border: '1px dashed rgba(79, 70, 229, 0.15)'
        }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 700 }}>No packages found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Try adjusting your filters or search terms</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setMaxPrice(maxPriceAvailable);
              setMinDuration(0);
              setSortBy('name');
            }}
            className="reset-filters-btn"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem', fontWeight: 500 }}>
            Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
          </p>
          <div className="packages-grid">
            {filteredPackages.map((pkg, idx) => (
              <div key={pkg._id} className="card-entry-animate" style={{ animationDelay: `${idx * 0.05}s` }}>
                <PackageCard package={pkg} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PackagesPage;