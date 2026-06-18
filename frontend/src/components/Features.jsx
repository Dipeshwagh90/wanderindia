import React from 'react';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: '💰',
      title: 'Best Prices Guaranteed',
      description: 'Unbeatable deals on travel packages across India'
    },
    {
      id: 2,
      icon: '🗺️',
      title: 'Expert Local Guides',
      description: 'Professional guides with deep local knowledge'
    },
    {
      id: 3,
      icon: '📅',
      title: 'Flexible Itineraries',
      description: 'Customize your journey to match your preferences'
    },
    {
      id: 4,
      icon: '💬',
      title: '24/7 Support',
      description: 'Round-the-clock assistance whenever you need it'
    },
    {
      id: 5,
      icon: '✅',
      title: 'Hassle-Free Booking',
      description: 'Simple and secure booking process in minutes'
    },
    {
      id: 6,
      icon: '⭐',
      title: 'Unforgettable Experiences',
      description: 'Create memories that last a lifetime'
    },
    {
      id: 7,
      icon: '🏨',
      title: 'Premium Heritage Stays',
      description: 'Vetted luxury accommodations and local heritage palaces'
    },
    {
      id: 8,
      icon: '🌱',
      title: 'Eco-Friendly Travel',
      description: 'Supporting sustainable tourism and reducing environmental footprint'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Why Choose WanderIndia?</h2>
        <p>Experience travel like never before with our premium services</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={feature.id} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
