import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'

import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import SearchControl from './SearchControl'
L.Icon.Default.imagePath = 'images/'

interface Props {
  onClick?: (e: any) => void
  defaultLatLng?: [number, number]
  maxHeight?: string
  editable?: boolean
  draggable: boolean
  getGeoLocation?: boolean
  hasGeocoder?: boolean
}
interface MarkerProps {
  defaultLatLng?: [number, number]
}

const Map: React.FC<Props> = (props) => {
  const {
    onClick,
    maxHeight = '400px',
    defaultLatLng = [0, 0],
    draggable,
    editable = false,
    getGeoLocation = false,
    hasGeocoder = false,
  } = props

  const [position, setPosition] = useState(defaultLatLng)
  const [draggableRes, setDraggable] = useState(draggable)
  const onSearchSelect = (e: any) => {
    debugger
    setPosition([e.y, e.x])
  }

  return (
    <div style={{position:'relative'}}>
      <SearchControl  onSelect={onSearchSelect} />
      <MapContainer
        center={[32.167342, 53.460555]}
        style={{
          width: '100%',
          height: 'calc(100vh - 150px)',
          maxHeight: maxHeight,
          // position: 'absolute',
          direction: 'rtl',
        }}
        zoom={4}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AddMarkerToClick
          onClick={onClick}
          defaultLatLng={position}
          draggable={draggable}
          editable={editable}
        />
      </MapContainer>
    </div>
  )
}

interface MarkerProps {
  onClick?: (e: any) => void
  defaultLatLng?: [number, number]
  maxHeight?: string
  editable: boolean
  draggable: boolean
  getGeoLocation?: boolean
  hasGeocoder?: boolean
}
const AddMarkerToClick: React.FC<MarkerProps> = (props) => {
  const {
    onClick,
    maxHeight = '400px',
    defaultLatLng = [32.167342, 53.460555],
    draggable,
    editable,
    getGeoLocation = false,
    hasGeocoder = false,
  } = props
  const [position, setPosition] = useState({
    latitude: defaultLatLng[0],
    longitude: defaultLatLng[1],
  })
  const map = useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng
      setPosition({
        latitude: lat,
        longitude: lng,
      })
    },
  })
  useEffect(() => {
    setPosition({
      latitude: defaultLatLng[0],
      longitude: defaultLatLng[1],
    })
    map.setView([defaultLatLng[0], defaultLatLng[1]], map.getZoom())
  }, [defaultLatLng[0], defaultLatLng[1]])

  return position.latitude ? (
    <Marker position={[position.latitude, position.longitude]} draggable={draggable && editable} />
  ) : null
}

export default Map
