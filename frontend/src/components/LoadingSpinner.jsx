import React from 'react';

const LoadingSpinner = ({ message = 'Loading amazing places...' }) => {
  return (
    <div className="loading-spinner" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px'
    }}>
      <div className="spinner" style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(16, 97, 244, 0.1)',
        borderTop: '4px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{
        marginTop: '1.5rem',
        color: 'var(--muted)',
        fontSize: '1rem',
        fontWeight: 500,
        letterSpacing: '0.05em'
      }}>
        {message}
      </p>
      <div style={{
        marginTop: '1rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--primary)',
          animation: 'pulse 1.4s ease-in-out infinite',
          animationDelay: '0s'
        }}></div>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--primary)',
          animation: 'pulse 1.4s ease-in-out infinite',
          animationDelay: '0.2s'
        }}></div>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--primary)',
          animation: 'pulse 1.4s ease-in-out infinite',
          animationDelay: '0.4s'
        }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;