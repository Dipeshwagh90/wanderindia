import React, { useState, useEffect } from 'react';
import DestinationCard from '../components/DestinationCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import axiosInstance from '../api/axiosInstance';
import { destinations as fallbackDestinations } from '../data/destinations';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get('/destinations');
        setDestinations(res.data);
      } catch (err) {
        console.error('Error fetching destinations, using fallback mock data:', err);
        setDestinations(fallbackDestinations);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    let filtered = [...destinations];

    // Apply category filter
    if (category !== 'All') {
      filtered = filtered.filter(dest => dest.category === category);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter(dest => dest.rating >= minRating);
    }

    // Apply sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    setFilteredDestinations(filtered);
  }, [destinations, category, searchTerm, minRating, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const categories = ['All', 'Beach', 'Mountain', 'Heritage', 'Adventure', 'City', 'Spiritual'];

  return (
    <div className="destinations-page">
      <div className="page-hero-banner">
        <h1>Explore Indian Destinations</h1>
        <p>Discover {filteredDestinations.length} amazing places to visit</p>
      </div>

      <SearchBar onSearch={handleSearch} value={searchTerm} />

      <div className="filters">
        <div className="filters-header">
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700 }}>Filter by Category</h3>
            <div className="glass-category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`glass-category-btn ${category === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filters-actions">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                Minimum Rating
              </label>
              <select 
                value={minRating} 
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="premium-select"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars ⭐</option>
                <option value={4.5}>4.5+ Stars ⭐⭐</option>
                <option value={5}>5 Stars ⭐⭐⭐</option>
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
                <option value="rating">Rating (High to Low)</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredDestinations.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'rgba(16, 97, 244, 0.03)',
          borderRadius: '24px',
          marginTop: '2rem',
          border: '1px dashed rgba(79, 70, 229, 0.15)'
        }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 700 }}>No destinations found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Try adjusting your filters or search terms</p>
          <button 
            onClick={() => {
              setCategory('All');
              setSearchTerm('');
              setMinRating(0);
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
            Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
          </p>
          <div className="destinations-grid">
            {filteredDestinations.map((dest, idx) => (
              <div key={dest._id} className="card-entry-animate" style={{ animationDelay: `${idx * 0.05}s` }}>
                <DestinationCard destination={dest} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DestinationsPage;