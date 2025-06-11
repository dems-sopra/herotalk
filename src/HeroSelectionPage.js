import React, { useState } from 'react';
import './HeroSelectionPage.css';

const heroes = [
  { id: 'scooby', name: 'Scooby', image: '/heroes/scooby.png' },
  { id: 'jerry', name: 'Jerry', image: '/heroes/jerry.png' },
  { id: 'pikachu', name: 'Pikachu', image: '/heroes/pikachu.png' },
  { id: 'simba', name: 'Simba', image: '/heroes/simba.png' },
  { id: 'donald', name: 'Donald', image: '/heroes/donald.png' },
];

function HeroSelectionPage() {
  const [selectedHero, setSelectedHero] = useState(null);

  const handleHeroClick = (hero) => {
    setSelectedHero(hero);
  };

  return (
    <div className="hero-selection-container">
      <h1>Select Your Hero</h1>

      <div className="hero-grid">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className={`hero-card ${selectedHero?.id === hero.id ? 'selected' : ''}`}
            onClick={() => handleHeroClick(hero)}
          >
            <img src={hero.image} alt={hero.name} className="hero-img" />
            <div className="hero-name">{hero.name}</div>
          </div>
        ))}
      </div>

      {selectedHero && (
        <div className="voice-ui">
          <h2>🎤 Speak as: {selectedHero.name}</h2>
          <button className="voice-button">Envoyer un message vocal</button>
        </div>
      )}
    </div>
  );
}

export default HeroSelectionPage;