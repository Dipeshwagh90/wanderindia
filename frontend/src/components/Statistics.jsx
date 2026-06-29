import React from 'react';

const Statistics = () => {
  const stats = [
    { icon: '', label: 'Happy Travelers', value: '50K+' },
    { icon: '', label: 'Destinations', value: '100+' },
    { icon: '', label: 'Packages', value: '500+' },
    { icon: '', label: 'Rating', value: '4.8/5' }
  ];

  return (
    <section className="statistics-section">
      <div className="testimonials-header">
        <h2>Our Impact & Achievements</h2>
        <p>Building a community of travel enthusiasts across India</p>
      </div>

      <div className="statistics-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
