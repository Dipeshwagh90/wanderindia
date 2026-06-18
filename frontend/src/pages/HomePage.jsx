import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import Statistics from '../components/Statistics';
import TravelTips from '../components/TravelTips';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import { destinations as fallbackDestinations } from '../data/destinations';
import { packages as fallbackPackages } from '../data/packages';

const HomePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, pkgRes] = await Promise.all([
          axiosInstance.get('/destinations'),
          axiosInstance.get('/packages')
        ]);
        setDestinations(destRes.data);
        setPackages(pkgRes.data);
      } catch (err) {
        console.error('Error fetching dynamic home page data, using fallback mock data:', err);
        setDestinations(fallbackDestinations);
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredDestinations = destinations.slice(0, 3);
  const featuredPackages = packages.slice(0, 3);

  if (loading) {
    return <LoadingSpinner message="Loading WanderIndia experiences..." />;
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Premium travel experiences</span>
          <h1>Discover the Magic of India with WanderIndia</h1>
          <p>
            Explore breathtaking destinations, curated packages, and unforgettable adventures across the vibrant landscapes of India.
          </p>
          <div className="hero-actions">
            <Link to="/destinations" className="cta-button">Explore Destinations</Link>
            <Link to="/packages" className="cta-secondary">View Packages</Link>
          </div>
        </div>
        
      </section>

      <Features />

      <Statistics />

      <section className="home-section">
        <div className="section-header">
          <h2>Top Destinations</h2>
          <Link to="/destinations" className="section-link">See all →</Link>
        </div>
        <div className="home-grid">
          {featuredDestinations.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Popular Packages</h2>
          <Link to="/packages" className="section-link">Browse packages →</Link>
        </div>
        <div className="home-grid">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg._id} package={pkg} />
          ))}
        </div>
      </section>

      <TravelTips />

      <Testimonials />

      <section className="home-section" style={{ background: 'linear-gradient(135deg, rgba(16, 97, 244, 0.12), rgba(124, 58, 237, 0.12))', borderRadius: '1.5rem', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Ready to Start Your Journey?</h2>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            Join thousands of travelers who have experienced India through WanderIndia
          </p>
          <Link to="/book" className="cta-button" style={{ display: 'inline-flex' }}>
            Book Your Trip Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;