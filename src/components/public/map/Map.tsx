import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) =>
  createStyles({
    container: {
      '& .mapboxgl-ctrl-bottom-right': {
        display: 'none',
      },
    },
  })
);

interface Props {
  onClick?: (e: any) => void;
}

const Map: React.FC<Props> = (props) => {
  const { onClick } = props;
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
  const defaultCoordinates: [number, number] = [59.526950363917827, 36.321029857543529];

  useEffect(() => {
    const initializeMap = (setMap: any, mapContainer: any): any => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: defaultCoordinates,
        zoom: 14
      });

      map.on('load', () => {
        setMap(map);
        map.resize();
      });

      map.on('click', (e: any): any => {
        // geojson.features[0].geometry.coordinates = [e.lngLat.lng, e.lngLat.lat];
        // map.jumpTo({ center: [e.lngLat.lng, e.lngLat.lat] });
        console.log('e:', e);
        const geojson = {
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: defaultCoordinates
              }
            }
          ]
        };
        const marker = new mapboxgl.Marker({
          draggable: true
        })
          .setLngLat(defaultCoordinates)
          .addTo(map);
  
        marker.on('dragend', (e: any) => {
          const lngLat = marker.getLngLat();
          if (onClick) onClick({ lngLat: { ...lngLat } });
        });
  
        // map.
        // new mapboxgl.Marker({
        //   draggable: true
        // })
        //   .setLngLat([e.lngLat.lng, e.lngLat.lat])
        //   .addTo(map);

        // map.flyTo({
        //   center: e.features[0].geometry.coordinates
        //   });
        if (onClick) onClick(e);
      });
    };

    if (!map) initializeMap(setMap, mapContainer);
  }, [map]);

  return (
    <div
      className={ container }
      ref={ mapContainer }
      style={ {
        width: '90vw',
        height: 'calc(100vh - 150px)',
        maxHeight: '400px',
        // position: 'absolute',
        direction: 'rtl',
      } }
    />
  );
};

export default Map;
