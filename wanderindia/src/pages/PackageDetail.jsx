import { useParams, Link } from 'react-router-dom';
import { packages } from '../data/packages';
import './PackageDetail.css';

const PackageDetail = () => {
  const { id } = useParams();
  const pkg = packages.find(p => p.id === parseInt(id));

  if (!pkg) {
    return (
      <div className="package-detail">
        <div className="container">
          <div className="not-found">
            <h1>Package Not Found</h1>
            <p>The package you're looking for doesn't exist.</p>
            <Link to="/packages" className="btn-primary">Back to Packages</Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="package-detail">
      <div className="container">
        {/* Hero Section */}
        <div className="package-hero">
          <img src={pkg.image} alt={pkg.name} />
          <div className="hero-overlay">
            <h1>{pkg.name}</h1>
            <div className="package-meta">
              <span className="duration"> {pkg.duration}</span>
              <span className="price">₹{pkg.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="package-content">
          <div className="main-content">
            <section className="description">
              <h2>Package Overview</h2>
              <p>{pkg.description}</p>
            </section>

            <section className="inclusions">
              <h2>What's Included</h2>
              <div className="inclusions-grid">
                {pkg.inclusions.map((inclusion, index) => (
                  <div key={index} className="inclusion-item">
                    <span className="check-icon">✓</span>
                    <span>{inclusion}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="itinerary">
              <h2>Detailed Itinerary</h2>
              <div className="itinerary-list">
                {pkg.itinerary.map((day, index) => (
                  <div key={index} className="itinerary-day">
                    <div className="day-header">
                      <span className="day-number">Day {day.day}</span>
                      <h3>{day.title}</h3>
                    </div>
                    <p>{day.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="booking-card">
              <h3>Book This Package</h3>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Package Price</span>
                  <span>₹{pkg.price.toLocaleString()}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{pkg.price.toLocaleString()}</span>
                </div>
              </div>
              <Link to="/book" className="btn-primary">
                Book Now
              </Link>
            </div>

            <div className="package-info">
              <h4>Package Information</h4>
              <ul>
                <li><strong>Duration:</strong> {pkg.duration}</li>
                <li><strong>Destinations:</strong> Multiple cities</li>
                <li><strong>Group Size:</strong> 2-15 people</li>
                <li><strong>Languages:</strong> English, Hindi</li>
              </ul>
            </div>

            <div className="contact-info">
              <h4>Need Help?</h4>
              <p> +91 98765 43210</p>
              <p> info@wanderindia.com</p>
              <p> Live chat available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;