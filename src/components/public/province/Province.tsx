import React, { useEffect, useState } from 'react'
import { CountryDivision } from '../../../services/api'
import { ProvincePropsInterface } from '../../../interfaces'
import { createStyles, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../../utils'

const useStyles = makeStyles((theme) =>
  createStyles({
    formControl: {
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
)

const { getAllCities2 } = new CountryDivision()

const Province: React.FC<ProvincePropsInterface> = (props) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [provinceList, setProvinceList] = useState<any[]>([])

  const { provinceHandler, countyId, value, className } = props

  useEffect(() => {
    setSelectedProvince(String(value))
  }, [value])

  const classes = useStyles()
  const { t } = useTranslation()

  useEffect(() => {
    ;(async (): Promise<any> => {
      try {
        const res = await getAllCities2(countyId)
        setProvinceList([])
        res.items.forEach((i: any) => {
          setProvinceList((v: any) => [...v, { name: i.name, code: i.code }])
        })
      } catch (e) {
        errorHandler(e)
      }
    })()
  }, [countyId])

  const provinceListGenerator = (): JSX.Element[] | null => {
    if (provinceList !== null) {
      return provinceList.map((item: any) => {
        return (
          <MenuItem key={item.code} value={item.code}>
            {item.name}
          </MenuItem>
        )
      })
    }

    return null
  }

  return (
    <FormControl variant="outlined" className={className ? className : classes.formControl}>
      <InputLabel id="province">{t('province.province')}</InputLabel>
      <Select
        labelId="province"
        id="province_id"
        label={t('province.province')}
        value={selectedProvince}
        onChange={(e): void => {
          const val = e.target.value as string
          setSelectedProvince(val)
          if (provinceHandler !== undefined) {
            provinceHandler(val)
          }
        }}
      >
        {provinceListGenerator()}
      </Select>
    </FormControl>
  )
}

export default Province;
