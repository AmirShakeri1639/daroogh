import { Container, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';

const useClasses = makeStyles((theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1),
    },
  })
);

const MaterialContainer: React.FC = (props) => {
  const { container } = useClasses();

  const { children } = props;

  return (
    <Container maxWidth="lg" className={container}>
      {children || <></>}
    </Container>
  );
};

export default MaterialContainer;
