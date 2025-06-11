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
    setMessages([]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const message = {
      text: input,
      translation: 'Here would come the translation.....', // Placeholder for future AI translation
    };

    setMessages([...messages, message]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="hero-selection-container">
      <div className="hero-selection-header">
        <h1>Select the Hero You Want to Understand</h1>
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
      </div>

      {selectedHero && (
        <div className="chat-section">
          <p className="chat-info">
            The hero currently selected is: <strong>{selectedHero.name}</strong>
          </p>

          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className="chat-bubble">
                <strong>{selectedHero.name}:</strong> {msg.text}
                <div className="chat-translation">Translated: {msg.translation}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-button" onClick={handleSend}>
              Send
            </button>
            <button className="mic-button" title="Voice input (coming soon)">
              🎤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroSelectionPage;