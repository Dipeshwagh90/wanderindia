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
      <div style={{ marginBottom: '2rem' }}>
        <h1>Explore Indian Destinations</h1>
        <p style={{ color: 'var(--muted)' }}>Discover {filteredDestinations.length} amazing places to visit</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="filters">
        <div className="filters-header">
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600 }}>Filter by Category</h3>
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    background: category === cat ? 'var(--primary)' : 'var(--surface)',
                    color: category === cat ? 'white' : 'var(--text)',
                    borderColor: category === cat ? 'var(--primary)' : 'rgba(15, 23, 42, 0.12)'
                  }}
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                Minimum Rating
              </label>
              <select 
                value={minRating} 
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="sort-dropdown"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars ⭐</option>
                <option value={4.5}>4.5+ Stars ⭐⭐</option>
                <option value={5}>5 Stars ⭐⭐⭐</option>
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
          padding: '3rem 1rem',
          background: 'rgba(16, 97, 244, 0.05)',
          borderRadius: '1.5rem',
          marginTop: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No destinations found</h2>
          <p style={{ color: 'var(--muted)' }}>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
            Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
          </p>
          <div className="destinations-grid">
            {filteredDestinations.map(dest => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DestinationsPage;