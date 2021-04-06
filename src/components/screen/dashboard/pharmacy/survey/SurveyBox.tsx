import React, { memo } from 'react';
import { SurveyList } from 'interfaces';
import { Grid, Hidden, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Convertor } from 'utils';
import { MaterialContainer } from 'components/public';
import styled from 'styled-components';

const StyledMaterialContainer = styled(MaterialContainer)`
  display: 'flex';
  justify-content: center !important;
`;

interface SurveyBoxProps {
  survey: SurveyList;
}

const { convertISOTime } = Convertor;

const SurveyBox: React.FC<SurveyBoxProps> = memo(({ survey }) => {

  const { description, surveyAnswer, questionGroup } = survey;

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
                  {/* <img src="/survey.jpg" style={{ width: '100%' }} /> */}
                </Grid>
              </Hidden>

              <Grid item xs={12} sm={11} spacing={0}>
                <Grid container xs={12} spacing={0}>
                  <Grid item xs={12} spacing={1}>
                    <strong style={{ color: '#1d0d50' }}>
                      {questionGroup?.title}
                    </strong>
                  </Grid>
                  {questionGroup &&
                    questionGroup.question.map((rec) => (
                      <Grid item xs={12} spacing={1}>
                        <p>{rec.title}</p>
                        <ul>
                          {rec.questionOptions?.map((q) => (
                            <li>{q.title}</li>
                          ))}
                        </ul>
                        {surveyAnswer &&
                          surveyAnswer.filter(
                            (it) =>
                              it.questionID == rec.id && it.descriptiveAnswer
                          ).length > 0 && (
                            <>
                              <h3>پاسخ : </h3>
                              <p>
                                {
                                  surveyAnswer.filter(
                                    (it) => it.questionID == rec.id
                                  )[0].descriptiveAnswer
                                }
                              </p>
                            </>
                          )}
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} justify="flex-end" style={{ textAlign: 'left' }}>
              <span className="text-muted txt-xs">
                {t('date.sendDate')}:
                <span dir="rtl">{convertISOTime(sendDate)}</span>
              </span>
            </Grid> */}
          </Grid>
        </Paper>
      </Grid>
    </StyledMaterialContainer>
  );
});

export { SurveyBox };
