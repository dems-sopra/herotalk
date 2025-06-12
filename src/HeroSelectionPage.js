import React, { useState } from 'react';
import './HeroSelectionPage.css';

const heroes = [
  {
    id: 'scooby',
    name: 'Scooby',
    image: '/heroes/scooby.png',
    phrases: [
      "I smell something suspicious!",
      "We need to run now!",
      "Where's Shaggy?!"
    ]
  },
  {
    id: 'jerry',
    name: 'Jerry',
    image: '/heroes/jerry.png',
    phrases: [
      "Be careful, enemy is coming!",
      "We need to move silently.",
      "Tom is close, take the other route."
    ]
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    image: '/heroes/pikachu.png',
    phrases: [
      "I need more electricity!",
      "My power is low, find a charger!",
      "Stay close, danger ahead!"
    ]
  },
  {
    id: 'simba',
    name: 'Simba',
    image: '/heroes/simba.png',
    phrases: [
      "We must protect the pride!",
      "Hyenas are surrounding us!",
      "The way is blocked, take the cliff!"
    ]
  },
  {
    id: 'donald',
    name: 'Donald',
    image: '/heroes/donald.png',
    phrases: [
      "We're running out of time!",
      "Hold the elevator, I'm coming!",
      "The HQ door is locked!"
    ]
  },
  {
    id: 'goku',
    name: 'Son Goku',
    image: '/heroes/goku.png',
    phrases: [
      "Let me power up — buy us some time!",
      "This elevator isn't strong enough for Ultra Instinct!",
      "Teleporting... see you at HQ!"
    ]
  }
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
    if (!input.trim() || !selectedHero) return;

    const randomPhrase = selectedHero.phrases[
      Math.floor(Math.random() * selectedHero.phrases.length)
    ];

    const message = {
      text: input,
      translation: randomPhrase
    };

    setMessages([...messages, message]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const simulateVoiceInput = () => {
    if (!selectedHero) return;
  
    const simulatedInputs = [
      "Recording voice message...",
    ];
  
    const randomText = simulatedInputs[Math.floor(Math.random() * simulatedInputs.length)];
    setInput(randomText);
  
    setTimeout(() => {
      handleSend();
    }, 600); // Simulate short delay
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
            <button className="mic-button" onClick={simulateVoiceInput} title="Simulate voice input">
              🎤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroSelectionPage;