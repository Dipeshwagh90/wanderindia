import React from 'react';

const Statistics = () => {
  const stats = [
    { icon: '', label: 'Happy Travelers', value: '50K+' },
    { icon: '', label: 'Destinations', value: '100+' },
    { icon: '', label: 'Packages', value: '500+' },
    { icon: '', label: 'Rating', value: '4.8/5' }
  ];

  return (
    <section style={{
      padding: '3rem',
      background: 'linear-gradient(135deg, rgba(16, 97, 244, 0.1), rgba(124, 58, 237, 0.1))',
      borderRadius: '2rem',
      margin: '2rem 0'
    }}>
      <div className="testimonials-header">
        <h2>Our Impact & Achievements</h2>
        <p>Building a community of travel enthusiasts across India</p>
      </div>

      <div style={{
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        marginTop: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              background: 'var(--surface)',
              padding: '2rem',
              borderRadius: '1.5rem',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              animation: `slideUpIn 0.6s ease backwards`,
              animationDelay: `${index * 0.1}s`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(15, 23, 42, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {stat.value}
            </div>
            <div style={{ color: 'var(--muted)', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
