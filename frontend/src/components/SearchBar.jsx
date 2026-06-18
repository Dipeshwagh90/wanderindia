import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search destinations or packages...' }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    onSearch(searchValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="search-bar" style={{ marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'var(--surface)',
        border: '1px solid rgba(15, 23, 42, 0.12)',
        borderRadius: '999px',
        padding: '0.3rem 1.25rem',
        maxWidth: '600px',
        transition: 'all 0.3s ease'
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 97, 244, 0.12)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.12)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>[?]</span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'inherit',
            fontSize: '1rem',
            padding: '0.75rem 0'
          }}
        />
        {value && (
          <button
            onClick={handleClear}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '1.1rem',
              opacity: 0.6,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.6'}
          >
            x
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;