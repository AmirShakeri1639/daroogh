import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

interface Props {
    onClick?: (e: any) => void;
    defaultLatLng?: [number, number];
    zoom?: number;
  }

const LeafLetMap: React.FC<Props> = (props)=>{
    const {
        onClick,
        zoom = 8,
        defaultLatLng = [59.526950363917827, 36.321029857543529],
      } = props;
      const [position, setPosition] = useState(defaultLatLng)
    const map = useMapEvents({
        click() {
          map.locate()
        },
        locationfound(e) {
          setPosition([e.latlng.lat,e.latlng.lng])
          map.flyTo(e.latlng, map.getZoom())
        },
      })
     

    return (
        <MapContainer center={defaultLatLng} zoom={zoom} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={defaultLatLng}>

          </Marker>
        </MapContainer>
      );
};

export default LeafLetMap;