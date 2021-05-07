import React, { memo, useEffect, useState } from 'react'
import { Button, Container, Divider, Paper } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const About: React.FC = () => {
  const { t } = useTranslation()
  const [version, setVersion] = useState<any>(null)

  useEffect(() => {
    const v = localStorage.getItem('version')
    setVersion(v)
  }, [])

  return (
    <Container maxWidth="lg" className="padding-3">
      <Paper className="padding-3">
        <h2>
          { t('general.systemFullTitle') }
        </h2>
        <Divider />
        <div className="v-spacing-3">
          { t('general.callNo') }: <br />
          <span>
            { t('general.daroogPhoneNumber') }
          </span>
          &nbsp;
          <Button
            variant="outlined"
            onClick={ (e: any): any => {
              e.stopPropagation()
            } }
            href={ 'tel:02191016361' }
          >
            { t('general.call') }
          </Button>
        </div>
        { version &&
          <div className="v-spacing-3">
            { t('general.appVersion') }: <br />
            { version }
          </div>
        }
      </Paper>
    </Container>
  )
}

export default memo(About)
