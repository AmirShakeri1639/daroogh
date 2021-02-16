import * as React from 'react';
import { useState, useRef } from 'react';
import { render } from 'react-dom';
import MapGL, { Source, Layer, setRTLTextPlugin } from 'react-map-gl';

import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from './layers';
// import './style.css';

setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  () => {},
  true // Lazy load the plugin
);

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiZWJpYW0iLCJhIjoiY2tkNzFuY3F2MDFtczM0azZiN3libXd1MSJ9.oIxVbKvhmqhQKJASb6iXag'; // Set your mapbox token here

const MapCluster = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.67,
    longitude: -103.59,

    zoom: 3,
    bearing: 0,
    pitch: 0,
  });
  const mapRef = useRef(null);
  
  const onClick = (event) => {
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

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id]}
        onClick={onClick}
        ref={mapRef}
      >
        <Source
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
        </Source>
      </MapGL>
    </>
  );
};

export default MapCluster;
