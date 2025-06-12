import React, { useEffect, useState } from 'react';
import './CountdownTimer.css';

function pad(n) {
  return n.toString().padStart(2, '0');
}

export default function CountdownTimer() {
  // Cherche une échéance stockée ou crée-en une nouvelle (24 h)
  const [deadline] = useState(() => {
    const saved = localStorage.getItem('missionDeadline');
    if (saved) return parseInt(saved, 10);

    const newDeadline = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('missionDeadline', newDeadline.toString());
    return newDeadline;
  });

  const [remaining, setRemaining] = useState(deadline - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(deadline - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (remaining <= 0) {
    return <div className="countdown-timer expired">⏰ 00:00:00</div>;
  }

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  return (
    <div className="countdown-timer">
      ⏰ {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </div>
  );
} 