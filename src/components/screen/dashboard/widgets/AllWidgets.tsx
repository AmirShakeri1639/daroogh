import React, { useEffect, useState } from 'react';
import { Reports } from 'services/api';
import dashboardWidgets from './widgets';
import { WidgetInterface } from 'interfaces';
import { StatsWidget } from 'components/public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from 'enum';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const AllWidgets: React.FC = () => {
  const { getWidgetInfo } = new Reports()
  const { t } = useTranslation()
  const [widgetData, setWidgetData] = useState<WidgetInterface[]>()

  useEffect(() => {
    async function getWidgetData() {
      const result = await getWidgetInfo()
      setWidgetData(result)
    }

    getWidgetData()
  }, [])

  return (
    <Grid item xs={12} container spacing={3}>
      {widgetData &&
        widgetData?.length > 0 &&
        widgetData.map((wData: WidgetInterface) => {
          let w = dashboardWidgets.filter((i) => i.name === wData.name)[0]
          w = {
            ...w,
            // title: wData.title,
            title: t(`widget.${w.name}`),
            value: wData.value,
          }
          return (
            <Grid item xs={12} sm={6} md={3} xl={3}>
              <div>
                <StatsWidget
                  title={w.title ?? ''}
                  value={w.value ?? 0}
                  icon={<FontAwesomeIcon icon={w.icon ?? faInfoCircle} size="4x" />}
                  backColor={w.backColor ?? ColorEnum.White}
                  color={w.color ?? ColorEnum.Black}
                  titleFontSize={w.titleFontSize}
                  to={w.to ?? undefined}
                />
              </div>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default AllWidgets
