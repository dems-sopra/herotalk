import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const HQ_COORDS = [40.748876, -73.968009]; // UN Headquarters in NYC

const SEA_TOKEN = 'QobuoO29sE5ZhBpLcFHyLTXZxC6gb6X6KiKWAEXc';

const STATIC_PORTS = [
  { name: 'Port of New York', country: 'United States', coords: [40.6848, -74.1628] },
  { name: 'Port of Los Angeles', country: 'United States', coords: [33.732, -118.27] },
  { name: 'Port of Le Havre', country: 'France', coords: [49.483, 0.105] },
  { name: 'Port of Rotterdam', country: 'Netherlands', coords: [51.95, 4.14] },
  { name: 'Port of Casablanca', country: 'Morocco', coords: [33.599, -7.64] },
  { name: 'Port of Tanger Med', country: 'Morocco', coords: [35.8804, -5.5263] },
  { name: 'Port of Shanghai', country: 'China', coords: [31.4, 121.5] },
  { name: 'Port of Mumbai', country: 'India', coords: [18.95, 72.84] },
  { name: 'Port of Mundra', country: 'India', coords: [22.73, 69.7] },
  { name: 'Port of Santos', country: 'Brazil', coords: [-23.96, -46.328] },
  { name: 'Port of Durban', country: 'South Africa', coords: [-29.87, 31.02] },
  { name: 'Port of Sydney', country: 'Australia', coords: [-33.86, 151.2] },
  { name: 'Port of Yokohama', country: 'Japan', coords: [35.45, 139.64] },
];

const haversine = (a, b) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

async function fetchSeaRoute(origin, dest) {
  const url =
    `http://localhost:8080/api/sea?oriLat=${origin[0]}&oriLon=${origin[1]}` +
    `&destLat=${dest[0]}&destLon=${dest[1]}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error('Sea routing failed');
  const geo = await res.json();
  const coordsLonLat = geo.features[0].geometry.coordinates;
  return coordsLonLat.map(([lon, lat]) => [lat, lon]);
}

function fetchRoute(start, end) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
  return fetch(url).then((res) => res.json());
}

// Utilitaire de géocodage ville/pays (Nominatim)
async function geocodeCity(city, country) {
  const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'HeroTalk/1.0',
    },
  });
  const data = await res.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  throw new Error('City not found');
}

function NavigationPage() {
  const [userPos, setUserPos] = useState(null);
  const [route, setRoute] = useState(null);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const HQ_PORT = { name: 'Port of New York', coords: [40.6848, -74.1628] };

  const [startPort, setStartPort] = useState(null);
  const [roadToPort, setRoadToPort] = useState(null);
  const [seaPath, setSeaPath] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch nearest port when user position is known
  useEffect(() => {
    const run = async () => {
      if (!userPos) return;
      const computeDriving = async (from, to) => {
        const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false`;
        const json = await fetch(url).then((r) => r.json());
        return json.code === 'Ok' ? json.routes[0].distance : Infinity;
      };

      const pickShortestPort = async (ports) => {
        let best = null;
        let bestDist = Infinity;
        for (const port of ports) {
          const dist = await computeDriving(userPos, port.coords);
          if (dist < bestDist) {
            bestDist = dist;
            best = port;
          }
        }
        return best;
      };

      let chosen;

      // Préfiltrer par pays si renseigné
      const candidatePorts = STATIC_PORTS.filter((p) =>
        (!country ? true : p.country?.toLowerCase() === country.toLowerCase()),
      );

      if (!chosen) {
        chosen = await pickShortestPort(candidatePorts.length ? candidatePorts : STATIC_PORTS);
      }

      setStartPort(chosen);
    };
    run();
  }, [userPos]);

  // Acquire user position via Geolocation API (optionnel)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(coords);
        },
        () => setError('Unable to fetch your location. Allow location access or enter it manually.'),
      );
    }
  }, []);

  // Compute route when both positions are known
  useEffect(() => {
    if (userPos) {
      fetchRoute(userPos, HQ_COORDS)
        .then((data) => {
          if (data.code === 'Ok') {
            setRoute(data.routes[0]);
          } else {
            setError('Route calculation failed.');
          }
        })
        .catch(() => setError('Route calculation failed.'));
    }
  }, [userPos]);

  // Road route to start port whenever both positions are known
  useEffect(() => {
    if (!userPos || !startPort?.coords) return;
    if (!Array.isArray(startPort.coords) || startPort.coords.length !== 2) return;
    fetchRoute(userPos, startPort.coords)
      .then((data) => {
        if (data.code === 'Ok') setRoadToPort(data.routes[0]);
      })
      .catch(() => {});
  }, [userPos, startPort]);

  // Fetch sea route when startPort is defined
  useEffect(() => {
    if (!startPort?.coords || startPort.coords.length !== 2) return;
    fetchSeaRoute(startPort.coords, HQ_PORT.coords)
      .then((path) => {
        setSeaPath(path);
      })
      .catch(() => {
        setError('Sea routing failed');
      });
  }, [startPort]);

  // Gestion du formulaire manuel
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!city || !country) {
      setError('Please enter both origin city and country');
      return;
    }

    try {
      setLoading(true);
      const coords = await geocodeCity(city, country);
      setUserPos(coords);
      setError('');

      if (startPort) {
        // route route -> port
        const dataPort = await fetchRoute(coords, startPort.coords);
        if (dataPort.code === 'Ok') setRoadToPort(dataPort.routes[0]);
      } else {
        setRoadToPort(null);
      }
    } catch (err) {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Navigation Assistance</h1>
      <p>
        This tool guides the selected hero from their current position to the United Nations HQ
        (NYC). Grant geolocation permission or input coordinates below.
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* City/Country form is always visible to allow manual override */}
      <form onSubmit={handleManualSubmit} style={{ margin: '20px auto', maxWidth: '400px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          />
        </div>
        <button type="submit" className="choice-btn" style={{ marginTop: '10px' }} disabled={loading}>
          {loading ? 'Searching…' : 'Calculate Route'}
        </button>
      </form>

      {userPos && route ? (
        <>
          <img
            src="/hq.jpg"
            alt="UN Headquarters"
            style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', marginBottom: '20px' }}
          />
          <p>
            Distance: {(route.distance / 1000).toFixed(2)} km – Estimated Time:{' '}
            {(() => {
              const hrs = Math.floor(route.duration / 3600);
              const mins = Math.round((route.duration % 3600) / 60);
              return `${hrs} h ${mins} min`;
            })()}
          </p>
          <MapContainer
            center={userPos}
            zoom={6}
            style={{ height: '500px', width: '100%', marginTop: '20px', borderRadius: '12px' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CircleMarker center={userPos} radius={8} pathOptions={{ color: 'red' }}>
              <Popup>Start position</Popup>
            </CircleMarker>
            <CircleMarker center={HQ_COORDS} radius={8} pathOptions={{ color: 'green' }}>
              <Popup>UN Headquarters</Popup>
            </CircleMarker>
            {roadToPort ? (
              <Polyline positions={roadToPort.geometry.coordinates.map((c)=>[c[1], c[0]])} color="blue" />
            ) : (
              <Polyline positions={route.geometry.coordinates.map((c) => [c[1], c[0]])} color="blue" />
            )}
            {/* Maritime path */}
            {seaPath && (
              <Polyline positions={seaPath} color="cyan" dashArray="4" />
            )}
          </MapContainer>
          <p style={{ marginTop: '10px' }}>
            Remaining travel time: {(() => {
              const hrs = Math.floor(route.duration / 3600);
              const mins = Math.round((route.duration % 3600) / 60);
              return `${hrs} h ${mins} min`;
            })()}
          </p>
        </>
      ) : (
        <p>{loading ? 'Retrieving route…' : 'Retrieving location…'}</p>
      )}
    </div>
  );
}

export default NavigationPage;