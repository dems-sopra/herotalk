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
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleHeroClick = (hero) => {
    setSelectedHero(hero);
    setMessages([]); // reset chat when hero changes
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const fakeTranslation = {
      scooby: 'Scooby a peur, mais il est prêt à aider !',
      jerry: 'Jerry veut manger du fromage 🍕',
      pikachu: 'Pikachu est plein d’énergie ⚡',
      simba: 'Simba affirme sa royauté 🦁',
      donald: 'Donald est fâché 😡',
    };

    const message = {
      text: input,
      translation: fakeTranslation[selectedHero.id] || 'Traduction non disponible',
    };

    setMessages([...messages, message]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="hero-selection-container">
      <h1>Select the Hero you want to understand...</h1>

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
        <div className="chat-section">
          <h2>💬 The hero that is currently speaking is  : {selectedHero.name}</h2>

          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className="chat-bubble">
                <strong>{selectedHero.name} :</strong> {msg.text}
                <div className="chat-translation">🧠 {msg.translation}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Écris ton message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-button" onClick={handleSend}>Envoyer</button>
            <button className="mic-button">🎤</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroSelectionPage;