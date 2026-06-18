import React from 'react';
import ReactStars from 'react-rating-stars-component';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Business Executive',
      image: 'PS',
      rating: 5,
      text: 'WanderIndia made our trip to Goa absolutely unforgettable! The package was perfectly curated with great hotels and guides.',
      destination: 'Goa'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Adventure Enthusiast',
      image: 'RK',
      rating: 5,
      text: 'The Himalayas trek was incredible! Professional guides and the itinerary was flexible to our needs. Highly recommend!',
      destination: 'Himalayas'
    },
    {
      id: 3,
      name: 'Ananya Desai',
      role: 'Cultural Lover',
      image: 'AD',
      rating: 4.5,
      text: 'Exploring the temples and heritage sites through WanderIndia was enlightening. Great support throughout the journey.',
      destination: 'Varanasi'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>What Our Travelers Say</h2>
        <p>Real experiences from real adventurers</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-stars">
              {'*'.repeat(Math.floor(testimonial.rating))}
              {testimonial.rating % 1 !== 0 && '*'}
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">
              <div className="author-avatar">{testimonial.image}</div>
              <div className="author-info">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
