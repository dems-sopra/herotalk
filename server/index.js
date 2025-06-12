import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import https from 'https';

const PORT = process.env.PORT || 8080;
const API_KEY = process.env.SEAROUTES_KEY || 'QobuoO29sE5ZhBpLcFHyLTXZxC6gb6X6KiKWAEXc';

if (!API_KEY) {
  console.error('Missing SEAROUTES_KEY environment variable');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

app.get('/api/sea', async (req, res) => {
  const { oriLat, oriLon, destLat, destLon, geometry = 'true' } = req.query;

  if (!oriLat || !oriLon || !destLat || !destLon) {
    return res.status(400).json({ error: 'Missing coordinates' });
  }

  const url = `https://api.searoutes.com/route/v2/sea/${oriLon},${oriLat};${destLon},${destLat}?geometry=${geometry}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
        Accept: 'application/json',
      },
      agent: httpsAgent,
    });

    const body = await response.text(); // could be large, keep as text
    res.status(response.status).send(body);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

app.get('/api/nearest-port', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat/lon' });
  }

  const url = `https://api.searoutes.com/geocoding/v2/closest?point=${lon},${lat}&type=port`;
  try {
    const resp = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
        Accept: 'application/json',
      },
      agent: httpsAgent,
    });
    const json = await resp.json();
    if (!json.features?.length) {
      return res.status(404).json({ error: 'No port found' });
    }
    const feature = json.features[0];
    const coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
    res.send({ name: feature.properties.name || 'Nearest port', coords });
  } catch (err) {
    console.error('Nearest port proxy error:', err);
    res.status(500).json({ error: 'Nearest port proxy failed' });
  }
});

app.listen(PORT, () => console.log(`SeaRoutes proxy listening on http://localhost:${PORT}`)); 