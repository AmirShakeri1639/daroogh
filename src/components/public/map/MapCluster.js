import * as React from 'react';
import { useState, useRef } from 'react';
import { render } from 'react-dom';
import MapGL, { Source, Layer, setRTLTextPlugin, Marker } from 'react-map-gl';
import { useQuery } from 'react-query';
import Reports from '../../../services/api/Reports';
import { clusterLayer } from './layers';

// import './style.css';

setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  () => {},
  true // Lazy load the plugin
);

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiZWJpYW0iLCJhIjoiY2tkNzFuY3F2MDFtczM0azZiN3libXd1MSJ9.oIxVbKvhmqhQKJASb6iXag'; // Set your mapbox token here
const { getExchangeCount } = new Reports();
const MapCluster = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 240,
    latitude: 35.6892,
    longitude: 51.389,
    zoom: 6,
    mapboxApiAccessToken: MAPBOX_TOKEN,
  });

  const [marker] = useState({
    latitude: 35.6892,
    longitude: 51.389,
  });
  const { data } = useQuery('getExchangeCount', getExchangeCount);
  const mapRef = useRef(null);

  const onClick = (event) => {
    debugger;
    if (event.features.length == 0) {
      return;
    }
    const feature = event.features[0];

    const clusterId = feature.properties.cluster_id;

    const mapboxSource = mapRef.current.getMap().getSource('earthquakes');

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      setViewport({
        ...viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500,
      });
    });
  };
  const size = 20;
  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={setViewport}
        ref={mapRef}
        interactiveLayerIds={[clusterLayer.id]}
        onClick={onClick}
      >
        {data &&
          data &&
          data.length &&
          data.map((entry, index) => (
            <div key={index}>
              <Marker latitude={entry.item4} longitude={entry.item3}>
                <svg
                  overflow="visible"
                  height={entry.item2 * 2.1}
                  width={entry.item2 * 2.1}
                  viewBox={'0 0 ' + entry.item2 * 2.1 + ' ' + entry.item2 * 2.1}
                >
                  <g>
                    <circle
                      cx={entry.item2}
                      cy={entry.item2}
                      r={entry.item2}
                      stroke="blue"
                      fill="blue"
                    />
                    <text 
                      fontSizeAdjust="0.50"
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      fill="white"
                    >
                      {entry.item1}
                    </text>
                  </g>
                </svg>
              </Marker>
            </div>
          ))}
        {/* <Source
          id="earthquakes"
          type="geojson"
          data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source> */}
      </MapGL>
    </>
  );
};

export default MapCluster;
