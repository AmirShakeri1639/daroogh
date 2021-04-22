import React, { useEffect, useRef, useState } from 'react'
import mapboxgl, { setRTLTextPlugin } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createStyles, makeStyles } from '@material-ui/core/styles'
// @ts-ignore
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  () => {},
  true // Lazy load the plugin
)

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
)

interface Props {
  onClick?: (e: any) => void
  defaultLatLng?: [number, number]
  maxHeight?: string
  draggable: boolean
  getGeoLocation?: boolean
  hasGeocoder?: boolean
}

const Map: React.FC<Props> = (props) => {
  const {
    onClick,
    maxHeight = '400px',
    defaultLatLng,
    draggable,
    getGeoLocation = false,
    hasGeocoder = false,
  } = props
  const LATLNG: [number, number] = [59.526950363917827, 36.321029857543529]
  const { container } = useStyle()

  const [map, setMap] = useState<any>(null)
  const mapContainer = useRef(null)

  mapboxgl.accessToken =
    'pk.eyJ1IjoiZWJpYW0iLCJhIjoiY2tkNzFuY3F2MDFtczM0azZiN3libXd1MSJ9.oIxVbKvhmqhQKJASb6iXag'
  // mapboxgl.setRTLTextPlugin(
  //   'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.1/mapbox-gl-rtl-text.js',
  //   null,
  //   true // Lazy load the plugin
  // );
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  })

  const [pos, setPos] = useState<[number, number] | undefined>(undefined)
  useEffect(() => {
    async function getLoc() {
      if (window.navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition((position) => {
          setPos([position.coords.longitude, position.coords.latitude])
        })
      }
    }

    getLoc()
  }, [])

  useEffect(() => {
    const initializeMap = (setMap: any, mapContainer: any): any => {
      const defPos = pos ?? defaultLatLng ?? LATLNG
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: defPos,
        zoom: 14,
      })

      let marker: any
      if (hasGeocoder) {
        map.addControl(geocoder)
      }

      map.addControl(new mapboxgl.NavigationControl())

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
      map.addControl(geolocate)

      if (getGeoLocation && pos) {
        if (onClick) {
          onClick({
            lngLat: {
              lat: pos[1],
              lng: pos[0],
            },
          })
        }
        if (marker) marker.remove()
        marker = new mapboxgl.Marker({
          draggable: draggable,
        })
          .setLngLat(pos)
          .addTo(map)
        map.setCenter(pos)
      }

      if (!getGeoLocation && defaultLatLng && defaultLatLng.length) {
        marker = new mapboxgl.Marker({
          draggable: draggable,
        })
          .setLngLat(defaultLatLng)
          .addTo(map)
        map.setCenter(defPos)
      }

      map.on('load', () => {
        setMap(map)
        map.resize()
      })

      map.on('click', (e: any): any => {
        if (draggable) {
          if (marker) {
            marker.remove()
          }
          marker = new mapboxgl.Marker({ draggable: true }).setLngLat(e.lngLat).addTo(map)
          if (onClick) onClick(e)
          if (marker !== undefined) {
            marker.on('dragend', markerDragHandler)
          }
        }
      })
      const markerDragHandler = (): void => {
        const lngLat = marker.getLngLat()
        if (onClick) onClick({ lngLat: { ...lngLat } })
      }
      if (marker !== undefined) {
        marker.on('dragend', markerDragHandler)
      }
    }

    if (!map) initializeMap(setMap, mapContainer)
  }, [map, pos, defaultLatLng])

  return (
    <div
      className={container}
      ref={mapContainer}
      style={{
        width: '100%',
        height: 'calc(100vh - 150px)',
        maxHeight: maxHeight,
        // position: 'absolute',
        direction: 'rtl',
      }}
    />
  )
}

export default Map
