import * as React from 'react';
import { useState, useRef } from 'react';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import { useQuery } from 'react-query';
import Reports from '../../../services/api/Reports';
import 'leaflet/dist/leaflet.css';
const { getExchangeCount } = new Reports();

const MapCluster = () => {
  const position = [32.167342, 53.460555];
  const { data } = useQuery('getExchangeCount', getExchangeCount);
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={position}
      style={{ height: 445, width: '100%', overflow: 'disabled' }}
      zoom={5}
      scrollWheelZoom={false}
      preferCanvas={false}
      zoomControl={false}
      dragging={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data &&
        data &&
        data.length &&
        data.map((entry, index) => (
          <div>
            {'zoneLabel'}
            <Circle
              key={index}
              center={{
                lat: entry.item4,
                lng: entry.item3,
              }}
              fillColor="blue"
              radius={entry.item2 * 2000}
            >
              <Popup>
                <span>{entry.item1}</span>
              </Popup>
            </Circle>
          </div>
        ))}
    </MapContainer>
  );
};

export default MapCluster;
