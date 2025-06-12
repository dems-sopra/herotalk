# HeroTalk 🚀

HeroTalk is a React web application that lets users
1. talk to (and translate for) famous cartoon heroes;
2. guide those heroes from any city in the world to the United Nations Headquarters within 24 h (road + sea routing).

The project is split into two parts:
* **Client** – React (Create React App) inside the repository root.
* **Server** – a tiny Node/Express proxy in `server/` that hides the SeaRoutes API key and bypasses CORS.

---
## Prerequisites
* Node ≥ 18
* npm or pnpm / yarn

---
## Setup
```bash
# Clone & enter repository
git clone <repo-url>
cd herotalk

# Install client dependencies
npm install

# Install proxy dependencies
npm install --prefix server
```

---
## Environment variables
Create `server/.env` (not committed – see `.gitignore`):
```
SEAROUTES_KEY=YOUR_SEAROUTES_API_KEY
PORT=8080            # optional, defaults to 8080
```
You can generate a free SeaRoutes key from https://my.searoutes.com (≈2 000 calls / month).

---
## Development workflow
Open **two** terminals:

1. Start the SeaRoutes proxy (port 8080):
   ```bash
   npm start --prefix server
   ```
2. Start the React dev-server (port 3000):
   ```bash
   npm start
   ```
Then browse to http://localhost:3000.

---
## Available npm scripts (root)
* `npm start` – start CRA dev server.
* `npm test` – run test suite.
* `npm run build` – production build in `build/`.
* `npm run proxy` – alias for `npm start --prefix server`.

---
## Folder structure
```
herotalk/
│  README.md
│  .gitignore
│  package.json            # client
│
├─src/                     # React source
│   ├─App.js
│   ├─NavigationPage.js    # mapping + routing logic
│   └─…
│
└─server/                  # Express proxy → SeaRoutes
    ├─index.js             # /api/sea  /api/nearest-port /api/ports-by-country
    ├─package.json
    └─.env.example         # template for env vars
```

---
## Deployment (production)
1. Build the client:
   ```bash
   npm run build
   ```
2. Serve the contents of `build/` **and** run the proxy on the same origin (e.g. Nginx reverse-proxy to port 8080). This avoids CORS in production.

---
## License
MIT © 2025 HeroTalk contributors
