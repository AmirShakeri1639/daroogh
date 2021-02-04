import React from 'react';
import Fa from '../xml/stimulsoft/localization/fa.xml';
import Utils from '../utility/Utils';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import Grid from '@material-ui/core/Grid/Grid';

declare global {
  interface Window {
    Stimulsoft: any;
  }
}

const Stimulsoft = window.Stimulsoft;
let Viewer: any;

const Transition = React.forwardRef<
  TransitionProps,
  { children?: React.ReactElement<any, any> }
>((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const useClasses = makeStyles((theme) =>
  createStyles({
    root: theme.mixins.gutters({
      margin: '1rem auto',
      padding: '0.3rem 0.3rem',
      maxWidth: '98vw',
    }),
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[700],
    },
  })
);

interface ReportProp {
  reportName: string;
  webApiUrl: string;
  inputModel?: object;
  className: string;
  isShowReport: boolean;
}

const Report = (props: ReportProp): JSX.Element => {
  const { isShowReport = false, className = '' } = props;
  const { closeButton } = useClasses();

  const [showReport, setShowReport] = React.useState(false);
  const [, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    options.appearance.scrollbarsMode = true;
    options.toolbar.showDesignButton = false;
    options.toolbar.showCloseButton = true;
    options.appearance.rightToLeft = true;
    options.toolbar.showAboutButton = false;
    options.toolbar.zoom = 150;
    // options.toolbar.viewMode = Stimulsoft.Viewer.StiWebViewMode.WholeReport;
    // options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;
    options.height = '700px';

    Viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);

    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile(Fa);
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7plofUOqPB1a4HBIXJB621mau2oiAIj+ysU7gKUXfjn/D5BocmduNB+ZMiDGPxFrAp3PoD0nYNkkWh8r7gBZ1v/JZSXGE3bQDrCQCNSy6mgby+iFAMV8/PuZ1z77U+Xz3fkpbm6MYQXYp3cQooLGLUti7k1TFWrnawT0iEEDJ2iRcU9wLqn2g9UiWesEZtKwI/UmEI2T7nv5NbgV+CHguu6QU4WWzFpIgW+3LUnKCT/vCDY+ymzgycw9A9+HFSzARiPzgOaAuQYrFDpzhXV+ZeX31AxWlnzjDWqpfluygSNPtGul5gyNt2CEoJD1Yom0VN9fvRonYsMsimkFFx2AwyVpPcs+JfVBtpPbTcZscnzUdmiIvxv8Gcin6sNSibM6in/uUKFt3bVgW/XeMYa7MLGF53kvBSwi78poUDigA2n12SmghLR0AHxyEDIgZGOTbNI33GWu7ZsPBeUdGu55R8w=';
  });

  const onGetData = async (): Promise<any> => {
    // const result = await fetch(`${UrlAddress.baseUrl}${webApiUrl}`, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(inputModel),
    // });
    // const output = await result.json();
    const output = [{ dev_name: 'قرارداداول', dev_contractsubject: 'ABC' }];
    setData(output);

    const data = {
      data: output,
      root: {
        reportDate: Utils.getPersianDate(new Date(), true),
      },
    };

    const dataSet = new Stimulsoft.System.Data.DataSet('data');
    const report = new Stimulsoft.Report.StiReport();

    // report.loadFile(`/reportFiles/${reportName}.mrt`);
    report.loadFile(`/reportFiles/ContractReport.mrt`);
    dataSet.readJson(JSON.stringify(data));
    report.regData(dataSet.dataSetName, 'data', dataSet);

    Viewer.report = report;

    Viewer.renderHtml('viewer');
  };

  React.useEffect(() => {
    setShowReport(isShowReport);
    if (showReport === false && isShowReport === false) return;
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    options.appearance.scrollbarsMode = false;
    options.toolbar.showDesignButton = false;
    options.toolbar.showCloseButton = true;
    options.appearance.rightToLeft = true;
    options.toolbar.showAboutButton = false;
    // options.toolbar.zoom = Stimulsoft.Viewer.StiZoomMode.PageWidth;
    options.toolbar.zoom = 100;
    options.height = '80٪';

    Viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);

    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile(Fa);
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7plofUOqPB1a4HBIXJB621mau2oiAIj+ysU7gKUXfjn/D5BocmduNB+ZMiDGPxFrAp3PoD0nYNkkWh8r7gBZ1v/JZSXGE3bQDrCQCNSy6mgby+iFAMV8/PuZ1z77U+Xz3fkpbm6MYQXYp3cQooLGLUti7k1TFWrnawT0iEEDJ2iRcU9wLqn2g9UiWesEZtKwI/UmEI2T7nv5NbgV+CHguu6QU4WWzFpIgW+3LUnKCT/vCDY+ymzgycw9A9+HFSzARiPzgOaAuQYrFDpzhXV+ZeX31AxWlnzjDWqpfluygSNPtGul5gyNt2CEoJD1Yom0VN9fvRonYsMsimkFFx2AwyVpPcs+JfVBtpPbTcZscnzUdmiIvxv8Gcin6sNSibM6in/uUKFt3bVgW/XeMYa7MLGF53kvBSwi78poUDigA2n12SmghLR0AHxyEDIgZGOTbNI33GWu7ZsPBeUdGu55R8w=';

    (async (): Promise<any> => {
      await onGetData();
    })();
  }, [isShowReport]);

  return (
    <div className="alignright">
      <Dialog
        onClose={(): any => setShowReport(false)}
        open={showReport}
        TransitionComponent={Transition}
        fullScreen={true}
      >
        <AppBar>
          <Toolbar
            variant="dense"
            style={{ backgroundColor: 'rgb(164, 191, 226)' }}
          >
            <MuiDialogTitle
              disableTypography
              style={{
                margin: '1rem auto',
                padding: '0',
              }}
            >
              <Typography variant="h6" style={{ color: 'black' }}>
                جزئیات گزارش
              </Typography>
              <IconButton
                className={closeButton}
                edge="start"
                color="inherit"
                onClick={(): any => setShowReport(false)}
              >
                <CloseIcon />
              </IconButton>
            </MuiDialogTitle>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div style={{ marginTop: 70 }}>
            <div className="col-9" dir="ltr" id="viewer"></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Report;
