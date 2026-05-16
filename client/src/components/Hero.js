import React, { useState, useEffect } from 'react';
import { getSettings } from '../api';
import './Hero.css';

function Hero() {
  const [settings, setSettings] = useState({
    hero_image: '',
    hero_title: 'Premium Products For Your Lifestyle',
    hero_subtitle: 'Discover the finest collection of curated products'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getSettings();
      const settingsObj = {};
      res.data?.forEach(setting => {
        settingsObj[setting.key] = setting.value || '';
      });
      setSettings({
        hero_image: settingsObj.hero_image || '',
        hero_title: settingsObj.hero_title || 'Premium Products For Your Lifestyle',
        hero_subtitle: settingsObj.hero_subtitle || 'Discover the finest collection of curated products'
      });
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const heroStyle = settings.hero_image 
    ? {
        backgroundImage: `url('${settings.hero_image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } 
    : {};

  return (
    <section className="hero" style={heroStyle}>
      <div className="hero-content">
        <h1 className="hero-title">{settings.hero_title}</h1>
        <p className="hero-subtitle">{settings.hero_subtitle}</p>
        <a href="#products" className="hero-cta">
          Explore Collection
        </a>
      </div>
      <div className="hero-overlay"></div>
    </section>
  );
}

export default Hero;
