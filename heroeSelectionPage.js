import React, { useState } from 'react';

function HeroSelectionPage() {
  const [hero, setHero] = useState('');
  const [message, setMessage] = useState('');

  const handleClick = (name) => {
    setHero(name);
    if (name === 'Scooby') setMessage('Scooby says: Ruh-roh!');
    else if (name === 'Jerry') setMessage('Jerry says: I want cheese!');
    else if (name === 'Groot') setMessage('Groot says: I am Groot!');
  };

  return (
    <div>
      <h2>Select a Hero</h2>
      <button onClick={() => handleClick('Scooby')}>Scooby</button>
      <button onClick={() => handleClick('Jerry')}>Jerry</button>
      <button onClick={() => handleClick('Groot')}>Groot</button>
      <p>{message}</p>
    </div>
  );
}

export default HeroSelectionPage;