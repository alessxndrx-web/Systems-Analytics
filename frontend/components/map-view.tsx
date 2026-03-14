<<<<<<< ours
﻿'use client';

import { LatLngBounds } from 'leaflet';
import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Lead } from '../lib/types';
import { formatStatusLabel } from '../lib/format';

const defaultCenter: [number, number] = [9.93, -84.08];

function FitToLeads({ leads }: { leads: Lead[] }) {
  const map = useMap();

  useEffect(() => {
    if (!leads.length) {
      map.setView(defaultCenter, 11);
      return;
    }

    const points = leads.map((lead) => [lead.business.latitude, lead.business.longitude] as [number, number]);
    const bounds = new LatLngBounds(points);
    map.fitBounds(bounds.pad(0.22), { animate: false });
  }, [leads, map]);

  return null;
}

export function MapView({ leads }: { leads: Lead[] }) {
  return (
    <MapContainer center={defaultCenter} zoom={11} className="h-[460px] w-full" scrollWheelZoom={false} zoomControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitToLeads leads={leads} />
      {leads.map((lead) => {
        const score = lead.score ?? 0;
        const radius = Math.max(8, Math.min(18, score / 6));
        const color = score >= 75 ? '#34d399' : score >= 50 ? '#67e8f9' : '#f59e0b';

        return (
          <CircleMarker
            key={lead.id}
            center={[lead.business.latitude, lead.business.longitude]}
            radius={radius}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.38,
              opacity: 0.95,
              weight: 1.5
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white">{lead.business.name}</div>
                <div className="text-xs text-slate-300">{lead.business.city} • Score {score}</div>
              </div>
            </Tooltip>
            <Popup>
              <div className="space-y-3 p-1">
                <div>
                  <div className="text-sm font-semibold text-white">{lead.business.name}</div>
                  <div className="text-xs text-slate-400">{lead.business.address}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div>
                    <div className="text-slate-500">Score</div>
                    <div className="mt-1 font-semibold text-white">{score}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Status</div>
                    <div className="mt-1 font-semibold text-white">{formatStatusLabel(lead.status)}</div>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
=======
'use client';

import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Lead } from '../lib/api';

export function MapView({ leads }: { leads: Lead[] }) {
  return (
    <MapContainer center={[9.93, -84.08]} zoom={12} style={{ height: 520, width: '100%' }}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {leads.map((lead) => (
        <Marker key={lead.id} position={[lead.business.latitude, lead.business.longitude]}>
          <Popup>
            <strong>{lead.business.name}</strong>
            <p>Score: {lead.score}</p>
            <p>Status: {lead.status === 'SENT' ? 'CONTACTED' : lead.status}</p>
          </Popup>
        </Marker>
      ))}
      {leads.map((lead) => (
        <Circle
          key={`${lead.id}-heat`}
          center={[lead.business.latitude, lead.business.longitude]}
          radius={Math.max(200, lead.score * 10)}
          pathOptions={{ color: statusColor(lead.status), fillOpacity: 0.2 }}
        />
      ))}
    </MapContainer>
  );
}

function statusColor(status: Lead['status']) {
  if (status === 'REPLIED' || status === 'INTERESTED') return '#22c55e';
  if (status === 'SENT') return '#06b6d4';
  if (status === 'DISCARDED') return '#64748b';
  return '#f97316';
}
>>>>>>> theirs
