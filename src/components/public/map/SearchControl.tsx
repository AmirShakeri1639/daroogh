import { makeStyles, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}
interface Location {
  x?: number
  y?: number
}
interface OptionType {
  title: string
  address?: string
  neighbourhood?: string
  region?: string
  type?: string
  category?: string
  location?: Location
}

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
})
interface Props {
  onSelect: (e: Location | undefined) => void
}

const SearchControl: React.FC<Props> = (props) => {
  const defaultLatLng = [32.167342, 53.460555]
  const [position, setPosition] = useState({
    latitude: defaultLatLng[0],
    longitude: defaultLatLng[1],
  })
  const [term, setTerm] = useState('')
  const [options, setoptions] = useState([])
  const classes = useStyles()

  const positionClass = POSITION_CLASSES.topright

  const handelChange = (e: any) => {
    // setTerm(e.target.value);
    fetch(
      `https://api.neshan.org/v1/search?term=${e.target.value}&lat=${defaultLatLng[0]}&lng=${defaultLatLng[1]}`,
      {
        method: 'Get',
        headers: {
          'Api-Key': 'service.pAAcIhXE5ZPxKPohrU41OUjNn0XhjElNYjp6A5nj',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setoptions(data.items)
      })
  }
  return (
    <div
      style={{ position: 'absolute' }}
      onClick={(e) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }}
      className={positionClass}
    >
      <div className="leaflet-control leaflet-bar">
        <Autocomplete
          id="search"
          size="small"
          noOptionsText={'موردی یافت نشد'}
          style={{ width: 400, backgroundColor: 'white', fontSize: '8px' }}
          options={options as OptionType[]}
          classes={{
            option: classes.option,
          }}
          autoHighlight
          onChange={(event: object, value: OptionType | null, reason: string) => {
            if (reason == 'select-option') if (props.onSelect) props.onSelect(value?.location)
          }}
          getOptionLabel={(option) => option.title}
          renderOption={(option) => (
            <React.Fragment>
              <span>
                {option.title} {option.region ? `(${option.region})` : ''}
              </span>
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={handelChange}
              label="جستجو"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
        />
      </div>
    </div>
  )
}

export default SearchControl
