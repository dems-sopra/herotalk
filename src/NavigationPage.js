import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const HQ_COORDS = [40.748876, -73.968009]; // UN Headquarters in NYC

// Photo réelle du siège de l'ONU à placer dans public/hq.jpg
const hqIcon = new L.Icon({
  iconUrl: '/hq.jpg',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
  className: 'hq-marker-icon',
});

// Icône symbole pour le HQ (bâtiment stylisé). Placez hq-icon.png dans public/
const hqSymbol = new L.Icon({
  iconUrl: '/hq-icon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIconPng,
  shadowUrl: markerShadow,
});

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

// Calcule une route "maritime" simplifiée : ligne droite entre l'origine et le HQ
function buildSeaPath(start, end, steps = 100) {
  const path = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const lat = start[0] + (end[0] - start[0]) * t;
    const lon = start[1] + (end[1] - start[1]) * t;
    path.push([lat, lon]);
  }
  return path;
}

function NavigationPage() {
  const [userPos, setUserPos] = useState(null);
  const [route, setRoute] = useState(null);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [portCity, setPortCity] = useState('');
  const [portCountry, setPortCountry] = useState('');
  const [portCoords, setPortCoords] = useState(null);
  const [roadToPort, setRoadToPort] = useState(null);
  const [loading, setLoading] = useState(false);

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

      if (portCity && portCountry) {
        // géocoder port
        try {
          const pcoords = await geocodeCity(portCity, portCountry);
          setPortCoords(pcoords);
          // route route -> port
          const dataPort = await fetchRoute(coords, pcoords);
          if (dataPort.code === 'Ok') setRoadToPort(dataPort.routes[0]);
        } catch {
          setError('Port city not found');
        }
      } else {
        setPortCoords(null);
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
            <Marker position={userPos}>
              <Popup>Current position</Popup>
            </Marker>
            <Marker position={HQ_COORDS} icon={hqSymbol}>
              <Popup>UN Headquarters</Popup>
            </Marker>
            {roadToPort ? (
              <Polyline positions={roadToPort.geometry.coordinates.map((c)=>[c[1], c[0]])} color="blue" />
            ) : (
              <Polyline positions={route.geometry.coordinates.map((c) => [c[1], c[0]])} color="blue" />
            )}
            {/* Maritime path */}
            {portCoords && (
              <Polyline positions={buildSeaPath(portCoords, HQ_COORDS)} color="cyan" dashArray="4" />
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