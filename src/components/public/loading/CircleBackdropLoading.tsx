import React, { useEffect } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
)

interface PropInterfact {
  isOpen: boolean
}

const CircleBackdropLoading: React.FC<PropInterfact> = (props): JSX.Element => {
  const { isOpen } = props
  const classes = useStyles()

  //   const [open, setOpen] = React.useState(false);
  //   const handleToggle = (): any => {
  //     setOpen(!open);
  //   };

  //   useEffect(() => {
  //     handleToggle();
  //   }, [isOpen]);

  return (
    <div>
      { isOpen &&
        <Backdrop className={ classes.backdrop } open={ isOpen }>
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    </div>
  )
}

export default CircleBackdropLoading
