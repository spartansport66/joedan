import React, { useState, useEffect } from 'react';
import { getSettings } from '../api';
import './Hero.css';

function Hero() {
  const [settings, setSettings] = useState({
    hero_image: '',
    hero_video: '',
    hero_video_rotation: '0'
  });
  const [, setLoading] = useState(true);

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
        hero_video: settingsObj.hero_video || '',
        hero_video_rotation: settingsObj.hero_video_rotation || '0'
      });
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const hasVideo = Boolean(settings.hero_video);
  const rotation = parseInt(settings.hero_video_rotation, 10) || 0;
  const heroStyle = !hasVideo && settings.hero_image
    ? {
        backgroundImage: `url('${settings.hero_image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  return (
    <section className="hero" style={heroStyle}>
      {hasVideo && (
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
        >
          <source src={settings.hero_video} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      )}

      <div className="hero-content"></div>
      <div className="hero-overlay"></div>
    </section>
  );
}

export default Hero;
