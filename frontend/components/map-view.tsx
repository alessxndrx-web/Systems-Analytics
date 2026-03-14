'use client';
import { MapContainer, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function MapView({ leads }: { leads: any[] }) {
  return (
    <MapContainer center={[9.93, -84.08]} zoom={12} style={{ height: 520, width: '100%' }}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {leads.map((lead) => (
        <Marker key={lead.id} position={[lead.business.latitude, lead.business.longitude]}>
          <Popup>
            <strong>{lead.business.name}</strong>
            <p>Score: {lead.score}</p>
          </Popup>
        </Marker>
      ))}
      {leads.map((lead) => (
        <Circle
          key={`${lead.id}-heat`}
          center={[lead.business.latitude, lead.business.longitude]}
          radius={Math.max(200, lead.score * 10)}
          pathOptions={{ color: 'orange', fillOpacity: 0.15 }}
        />
      ))}
    </MapContainer>
  );
}
