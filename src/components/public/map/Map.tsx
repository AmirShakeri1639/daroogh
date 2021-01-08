import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) =>
  createStyles({
    container: {
      '& .mapboxgl-ctrl-bottom-right': {
        display: 'none',
      },
      '& .mapboxgl-ctrl-bottom-left': {
        display: 'none',
      },
    },
  })
);

interface Props {
  onClick?: (e: any) => void;
  defaultLatLng?: [number, number];
}

const Map: React.FC<Props> = (props) => {
  const {
    onClick,
    defaultLatLng = [59.526950363917827, 36.321029857543529],
  } = props;
  const { container } = useStyle();

  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  mapboxgl.accessToken =
    'pk.eyJ1IjoiZWJpYW0iLCJhIjoiY2tkNzFuY3F2MDFtczM0azZiN3libXd1MSJ9.oIxVbKvhmqhQKJASb6iXag';
  // mapboxgl.setRTLTextPlugin(
  //   'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.1/mapbox-gl-rtl-text.js',
  //   null,
  //   true // Lazy load the plugin
  // );

  useEffect(() => {
    const initializeMap = (setMap: any, mapContainer: any): any => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: defaultLatLng,
        zoom: 14,
      });

      let marker = new mapboxgl.Marker({
        draggable: true,
      })
        .setLngLat(defaultLatLng)
        .addTo(map);

      const markerDragHandler = (): void => {
        const lngLat = marker.getLngLat();
        if (onClick) onClick({ lngLat: { ...lngLat } });
      };
      marker.on('dragend', markerDragHandler);

      map.on('load', () => {
        setMap(map);
        map.resize();
      });

      map.on('click', (e: any): any => {
        if (marker) {
          marker.remove();
        }
        marker = new mapboxgl.Marker({ draggable: true })
          .setLngLat(e.lngLat)
          .addTo(map);
        if (onClick) onClick(e);

        marker.on('dragend', markerDragHandler);
      });
    };

    if (!map) initializeMap(setMap, mapContainer);
  }, [map]);

  return (
    <div
      className={container}
      ref={mapContainer}
      style={{
        width: '100%',
        height: 'calc(100vh - 150px)',
        maxHeight: '400px',
        // position: 'absolute',
        direction: 'rtl',
      }}
    />
  );
};

export default Map;
