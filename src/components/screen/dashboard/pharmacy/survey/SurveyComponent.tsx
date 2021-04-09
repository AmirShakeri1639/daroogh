import { CircleLoading, EmptyContent, MaterialContainer } from 'components/public';
import { SurveyQueryEnum } from 'enum';
import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Survey } from 'services/api';
import { default as MatButton } from '@material-ui/core/Button';
import { Question, QuestionOptions, SurveyAnswer } from 'interfaces';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import DrugTransferContext, { TransferDrugContextInterface } from '../../drug-transfer/Context';

const { detailByExchangeNumber } = new Survey();

const SurveyComponent: React.FC<{ exchangeNumber?: string; onClose?: () => void }> = (props) => {
  const { exchangeNumber = '', onClose } = props;
  const { isLoading, data: { data = {} } = { data: {} } } = useQuery(
    [SurveyQueryEnum.DETAIL_BY_EXCHANGE_NUMBER],
    () => detailByExchangeNumber(exchangeNumber)
  );
  const [openSurvayModal, setOpenSurvayModal] = React.useState(true);

  return (
    <Dialog
      open={true}
      fullWidth={true}
      closeAfterTransition={true}
      onClose={() => {
        setOpenSurvayModal(false);
      }}
    >
      <DialogTitle style={{ borderBottom: '1px silver solid', textAlign: 'center' }}>
        {'نمایش نظر (نظرسنجی)'}
      </DialogTitle>
      <DialogContent>
        <MaterialContainer>
          <div id="container" style={{ margin: 8 }}>
            {data ? (
              <div style={{ margin: '15px' }}>
                <h2>{data.questionGroup?.title}</h2>
                {data.questionGroup?.question.map((item: Question) => (
                  <div style={{ padding: '5px', margin: '10px' }}>
                    <h3>{item.title}</h3>
                    <div style={{ padding: '10px' }}>
                      <SyrveyQuestion
                        question={item}
                        surveyAnswer={data.surveyAnswer?.filter(
                          (rec: SurveyAnswer) => rec.questionID == item.id
                        )}
                      />
                    </div>
                    <Divider variant="middle" />
                  </div>
                ))}
              </div>
            ) : isLoading ? (
              <CircleLoading />
            ) : (
              <EmptyContent />
            )}
          </div>
        </MaterialContainer>
      </DialogContent>
      <DialogActions style={{ borderTop: '1px silver solid' }}>
        <Grid container spacing={1}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <MatButton
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenSurvayModal(false);
                if (onClose) onClose();
                // history.push(desktop);
              }}
            >
              بستن
            </MatButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

const SyrveyQuestion: React.FC<{
  question: Question;
  surveyAnswer?: SurveyAnswer[];
}> = (props) => {
  const { question, surveyAnswer } = props;
  console.log(surveyAnswer);

  switch (question.type) {
    case 1:
      return (
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue={'1'}
          style={{ display: 'grid', direction: 'ltr' }}
        >
          {question?.questionOptions?.map((item: QuestionOptions, index: number) => {
            return (
              <FormControlLabel
                disabled={true}
                value={item.id.toString()}
                checked={
                  surveyAnswer && surveyAnswer.length > 0 && surveyAnswer[0].optionID == item.id
                }
                control={<Radio color="primary" />}
                label={item.title}
                labelPlacement="start"
              />
            );
          })}
        </RadioGroup>
      );

    case 2:
      return (
        <div style={{ textAlign: 'center' }}>
          <Rating
            disabled={true}
            value={surveyAnswer && surveyAnswer.length && surveyAnswer[0].barom}
            precision={1}
          />
        </div>
      );

    case 3:
      return (
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue={'1'}
          style={{ width: '100%', display: 'grid', direction: 'ltr' }}
        >
          {question?.questionOptions?.map((item: QuestionOptions, index: number) => {
            return (
              <FormControlLabel
                disabled={true}
                value={item.id.toString()}
                checked={
                  surveyAnswer && surveyAnswer.length > 0 && surveyAnswer[0].optionID == item.id
                }
                control={<Radio color="primary" />}
                label={item.title}
                labelPlacement="start"
              />
            );
          })}
        </RadioGroup>
      );

    case 4:
      return (
        <>
          {question?.questionOptions?.map((item: QuestionOptions, index: number) => {
            return (
              <FormControlLabel
                key={index}
                style={{ width: '100%' }}
                control={
                  <Checkbox
                    disabled={true}
                    checked={
                      surveyAnswer &&
                      surveyAnswer.length > 0 &&
                      surveyAnswer.findIndex((rec) => rec.optionID == item.id) != -1
                    }
                    value={item.id}
                    color="primary"
                  />
                }
                label={item.title}
              />
            );
          })}
        </>
      );

    case 5:
      return (
        <TextField
          label="توضیحات"
          required
          style={{ width: '100%' }}
          multiline={true}
          rows={5}
          size="small"
          variant="outlined"
          value={surveyAnswer && surveyAnswer.length && surveyAnswer[0].descriptiveAnswer}
          disabled={true}
        />
      );

    default:
      return <></>;
  }
};

export default SurveyComponent;
