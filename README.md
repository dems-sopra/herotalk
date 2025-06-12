# 🦸‍♂️ HeroTalk

**HeroTalk** is a mobile-first web app that allows users to communicate with non-speaking animated heroes, reward their actions, and assist them in reaching their headquarters. This project was built for a hackathon with creativity, collaboration, and accessibility in mind.

---

## 📱 Pages & Features

### 🔹 Translator Page (Hero Selection)
- Choose a hero (e.g. Pikachu, Scooby, Goku)
- Type or simulate a voice message on their behalf
- Automatically generate a mission-style translation
- Mobile-friendly chat interface

### 🔹 Reward Page
- Select your hero identity
- Choose another hero to reward
- Grant 10, 50, or 100 points
- Live leaderboard display
- History of rewards shown on button click

### 🔹 Navigation Page
- Enter your location to guide a hero to the UN HQ (New York)
- Interactive map powered by Leaflet.js
- Displays travel time and distance
- Countdown timer included

---

## 🧪 Tech Stack

- **React** (Create React App)
- **React Router DOM** (Navigation)
- **React Icons** (UI Icons)
- **Leaflet.js** (Map navigation)
- **CSS** (Responsive, mobile-first)
- **LocalStorage** (Store leaderboard & messages locally)

---

## 🚀 Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/herotalk.git
cd herotalk
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Open on your phone (same Wi-Fi):
```
http://YOUR_LOCAL_IP:3000
```

---

## 📁 Project Structure

```
src/
  ├── pages/
  │   ├── HeroSelectionPage.js
  │   ├── RewardsPage.js
  │   └── NavigationPage.js
  ├── Layout.js
  ├── App.js
public/
  └── heroes/  # hero images like scooby.png, pikachu.png, etc.
```

---

## 🌍 Demo Usage

To simulate voice:
- Click the mic icon 🎤
- A pre-written message will auto-fill and "send"
- Hero translation is randomly shown

---

## 📌 License

MIT — Free to use, improve and share.
