import React, { memo } from 'react';
import { Message } from 'interfaces';
import { Grid, Hidden, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Convertor } from 'utils';
import { MaterialContainer } from 'components/public';
import styled from 'styled-components';
import { ColorEnum } from 'enum';

const StyledMaterialContainer = styled(MaterialContainer)`
  display: 'flex';
  justify-content: center !important;
`;

interface MessageBoxProps {
  message: Message;
}

const { convertISOTime } = Convertor;

const MessageBox: React.FC<MessageBoxProps> = memo(({ message }) => {
  const { message1, sendDate, subject } = message;

  const { t } = useTranslation();

  return (
    <StyledMaterialContainer>
      <Grid container xs={12} sm={12} md={10} lg={10} justify="center">
        <Paper
          style={{
            padding: '16px 16px 0px 16px',
            marginTop: 24,
            width: '100%',
            borderRight: '3px solid #f80501',
          }}
          elevation={1}
        >
          <Grid item xs={12} spacing={0}>
            <Grid container xs={12} spacing={1}>
              <Hidden smDown>
                <Grid
                  item
                  xs={1}
                  alignItems="center"
                  style={{ alignSelf: 'center' }}
                  spacing={0}
                >
                  <img src="/message.jpg" style={{ width: '100%' }} />
                </Grid>
              </Hidden>

              <Grid item xs={12} sm={11} spacing={0}>
                <Grid container xs={12} spacing={0}>
                  <Grid item xs={12} spacing={1}>
                    <strong style={{ color: `${ColorEnum.DeepBlue}` }}>{subject}</strong>
                  </Grid>
                  <Grid item xs={12} spacing={1}>
                    <p>{message1}</p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} justify="flex-end" style={{ textAlign: 'left' }}>
              <span className="text-muted txt-xs">
                {t('date.sendDate')}:
                <span dir="rtl">{convertISOTime(sendDate)}</span>
              </span>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </StyledMaterialContainer>
  );
});

export { MessageBox };
