import * as React from 'react';
import { useState, useRef } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import { useQuery } from 'react-query';
import Reports from '../../../services/api/Reports';
import 'leaflet/dist/leaflet.css';
const { getExchangeCount } = new Reports();

const MapCluster = () => {
  const position = [32.167342, 53.460555];
  const { data } = useQuery('getExchangeCount', getExchangeCount);

  const sorted =
    data &&
    data.length &&
    data.sort(function (a, b) {
      return a.item2 - b.item2;
    });
  const definedmax = 40;

  const count = sorted && sorted.length;
  const max =
    sorted &&
    sorted.length &&
    Math.max.apply(
      Math,
      sorted.map(function (o) {
        return o.item2;
      })
    );

  function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) {
      factor = 0.5;
    }
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }
  // My function to interpolate between two colors completely, returning an array
  function interpolateColors(color1, color2, steps) {
    var stepFactor = 1 / (steps - 1),
      interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for (var i = 0; i < steps; i++) {
      interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
  }

  var colors = interpolateColors('rgb(0, 0, 255)', 'rgb(255, 0, 0)', count);

  return (
    <MapContainer
      center={position}
      style={{ height: 445, width: '100%', overflow: 'disabled' }}
      zoom={5}
      scrollWheelZoom={false}
      preferCanvas={false}
      zoomControl={true}
      dragging={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {sorted &&
        sorted &&
        sorted.length &&
        sorted.map((entry, index) => (
          <div>
            {'zoneLabel'}
            <Circle
              key={index}
              center={{
                lat: entry.item4,
                lng: entry.item3,
              }}
              fillColor={`rgb(${colors[index]})`}
              color={`rgb(${colors[index]})`}
              fillOpacity="0.7"
              radius={(definedmax / max) * entry.item2 * 2000}
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
