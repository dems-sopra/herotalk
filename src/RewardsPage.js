import React, { useEffect, useState } from 'react';
import './RewardsPage.css';

const heroes = [
  { id: 1, name: 'Scooby', image: '/heroes/scooby.png' },
  { id: 2, name: 'Jerry', image: '/heroes/jerry.png' },
  { id: 3, name: 'Pikachu', image: '/heroes/pikachu.png' },
  { id: 4, name: 'Simba', image: '/heroes/simba.png' },
  { id: 5, name: 'Donald', image: '/heroes/donald.png' },
  { id: 6, name: 'Goku', image: '/heroes/goku.png' },
];

const RewardsPage = () => {
  const [giver, setGiver] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [pointsData, setPointsData] = useState({});
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedPoints = localStorage.getItem('heroPoints');
    const savedHistory = localStorage.getItem('rewardHistory');

    if (savedPoints) setPointsData(JSON.parse(savedPoints));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleGiverSelect = (hero) => {
    setGiver(hero);
    setReceiver(null);
    setMessage('');
  };

  const handleReceiverSelect = (hero) => {
    if (hero.id === giver.id) return;
    setReceiver(hero);
    setMessage('');
  };

  const handleReward = (amount) => {
    if (!giver || !receiver) return;

    // Update leaderboard points
    const updatedPoints = { ...pointsData };
    updatedPoints[receiver.name] = (updatedPoints[receiver.name] || 0) + amount;
    setPointsData(updatedPoints);
    localStorage.setItem('heroPoints', JSON.stringify(updatedPoints));

    // Update reward history
    const newEntry = {
      from: giver.name,
      to: receiver.name,
      amount,
      time: new Date().toLocaleString(),
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('rewardHistory', JSON.stringify(updatedHistory));

    // Show message
    setMessage(`${giver.name} rewarded ${receiver.name} with ${amount} points!`);
  };

  const sortedLeaderboard = Object.entries(pointsData).sort(([, a], [, b]) => b - a);

  return (
    <div className="rewards-container">
      <h2>Hero-to-Hero Rewards</h2>

      <div className="section">
        <p>Select your hero (who gives points):</p>
        <div className="hero-grid">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className={`hero-card ${giver?.id === hero.id ? 'selected' : ''}`}
              onClick={() => handleGiverSelect(hero)}
            >
              <img src={hero.image} alt={hero.name} className="hero-img" />
              <div className="hero-name">{hero.name}</div>
            </div>
          ))}
        </div>
      </div>

      {giver && (
        <div className="section">
          <p>Select the hero you want to reward (not yourself):</p>
          <div className="hero-grid">
            {heroes
              .filter((h) => h.id !== giver.id)
              .map((hero) => (
                <div
                  key={hero.id}
                  className={`hero-card ${receiver?.id === hero.id ? 'selected' : ''}`}
                  onClick={() => handleReceiverSelect(hero)}
                >
                  <img src={hero.image} alt={hero.name} className="hero-img" />
                  <div className="hero-name">{hero.name}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {giver && receiver && (
        <div className="section">
          <p>
            How many points should <strong>{giver.name}</strong> give to{' '}
            <strong>{receiver.name}</strong>?
          </p>
          <div className="buttons">
            {[10, 50, 100].map((amount) => (
              <button key={amount} onClick={() => handleReward(amount)}>
                +{amount}
              </button>
            ))}
          </div>
        </div>
      )}

      {message && <div className="reward-message animate">{message}</div>}

      <div className="section leaderboard">
        <h3>Leaderboard</h3>
        {sortedLeaderboard.length === 0 ? (
          <p>No rewards given yet.</p>
        ) : (
          <ul>
            {sortedLeaderboard.map(([hero, points], index) => (
              <li key={hero}>
                <span className="rank">{index + 1}.</span>
                <strong>{hero}</strong> — {points} pts
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section">
        <button className="show-history-button" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Hide History' : 'Show History'}
        </button>

        {showHistory && (
          <div className="history-list">
            <h3>Reward History</h3>
            <ul>
              {history.map((entry, i) => (
                <li key={i}>
                  <strong>{entry.from}</strong> → <strong>{entry.to}</strong> : {entry.amount} pts
                  <br />
                  <small>{entry.time}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;