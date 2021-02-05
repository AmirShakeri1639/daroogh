import Paper from '@material-ui/core/Paper/Paper';
import React, { PureComponent } from 'react';
import Utils from '../utility/Utils';
import Fa from '../xml/stimulsoft/localization/fa.xml';
const win: any = window;
let Stimulsoft: any;

class ReportViewerContainer extends PureComponent<any, any> {
  private viewer: any;

  constructor(props: any) {
    super(props);
  }

  componentWillMount(): any {
    Stimulsoft = win.Stimulsoft;
    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile(Fa);
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7plofUOqPB1a4HBIXJB621mau2oiAIj+ysU7gKUXfjn/D5BocmduNB+ZMiDGPxFrAp3PoD0nYNkkWh8r7gBZ1v/JZSXGE3bQDrCQCNSy6mgby+iFAMV8/PuZ1z77U+Xz3fkpbm6MYQXYp3cQooLGLUti7k1TFWrnawT0iEEDJ2iRcU9wLqn2g9UiWesEZtKwI/UmEI2T7nv5NbgV+CHguu6QU4WWzFpIgW+3LUnKCT/vCDY+ymzgycw9A9+HFSzARiPzgOaAuQYrFDpzhXV+ZeX31AxWlnzjDWqpfluygSNPtGul5gyNt2CEoJD1Yom0VN9fvRonYsMsimkFFx2AwyVpPcs+JfVBtpPbTcZscnzUdmiIvxv8Gcin6sNSibM6in/uUKFt3bVgW/XeMYa7MLGF53kvBSwi78poUDigA2n12SmghLR0AHxyEDIgZGOTbNI33GWu7ZsPBeUdGu55R8w=';

    const output = [{ dev_name: 'قرارداداول', dev_contractsubject: 'ABC' }];

    const data = {
      data: output,
      root: {
        reportDate: Utils.getPersianDate(new Date(), true),
      },
    };

    const dataSet = new Stimulsoft.System.Data.DataSet('data');
    dataSet.readJson(JSON.stringify(data));

    const CampusReport = new Stimulsoft.Report.StiReport();
    CampusReport.loadFile('/reportFiles/ContractReport.mrt');
    CampusReport.regData(dataSet.dataSetName, 'data', dataSet);
    this.setState({
      campusReport: CampusReport,
    });
  }

  componentDidMount(): any {
    this.setupViewer();
  }

  setupViewer = (): any => {
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    options.appearance.scrollbarsMode = true;
    options.toolbar.showDesignButton = false;
    options.toolbar.showCloseButton = true;
    options.appearance.rightToLeft = true;
    options.toolbar.showAboutButton = false;
    options.height = '80vh';
    this.viewer = new Stimulsoft.Viewer.StiViewer(options, 'viewer', false);
    this.viewer.report = this.state.currentReport;
    this.viewer.renderHtml('viewer');
    this.selectReport('campusReport');
  };

  renderReport = (): any => {
    this.viewer.report = this.state.currentReport;
  };

  selectReport = (prop: string): any => {

    return Promise.resolve()
      .then(() => {
        return new Promise((resolve: any) => {
          this.setState({ currentReport: this.state[prop] }, resolve);
        });
      })
      .then(this.renderReport);
  };

  openMenu = (e: any): any => {
    this.setState({ anchorEl: e.currentTarget });
  };

  closeMenu = (): any => {
    return new Promise((resolve: any) => {
      this.setState({ anchorEl: undefined }, resolve);
    });
  };

  render(): JSX.Element {
    return (
      <Paper>
        <div id="viewer">&nbsp;</div>
      </Paper>
    );
  }
}

export default ReportViewerContainer;
