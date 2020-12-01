import { createStyles, makeStyles } from '@material-ui/core';
import React from 'react';
import CardContainer from '../../../public/card/CardContainer';
import './transfer.scss';

const style = makeStyles((theme) => createStyles({
  root: {
    backgroundColor: '#ebebeb',
    height: '100vh',
    padding: theme.spacing(2, 1),
  }
}));

const TransferDrug: React.FC = () => {
  const { root } = style();

  return (
    <div className={root}>
      <div>
        <CardContainer
          basicDetail={<p>اطلاعات اولیه</p>}
        />
        <CardContainer
          basicDetail={<p>Basic detail</p>}
          isPack
          collapsableContent={<p>Collapsabe content</p>}
        />
        <CardContainer
          basicDetail={<p>Basic detail</p>}

        />
        <CardContainer
          basicDetail={<p>Basic detail</p>}

        />
        <CardContainer
          basicDetail={<p>Basic detail</p>}

        />
        <CardContainer
          basicDetail={<p>Basic detail</p>}

        />
      </div>
    </div>
  );
}

export default TransferDrug;
