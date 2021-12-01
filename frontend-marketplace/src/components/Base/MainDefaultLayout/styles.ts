import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    mainLayout: {
      gridArea: 'main',
      width: '100%',
      position: 'relative',
      '& .page-content': {
        position: 'relative',
        zIndex: 1,
        minHeight: 'calc(100vh - 300px)',
        [theme.breakpoints.down('xs')]: {
          minHeight: '300px',
        }
      },
      '& .rectangle': {
        '-webkit-mask-image': '-webkit-gradient(linear, left bottom, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        // zIndex: 0,
        '& img': {
          width: '100%',
        }
      }
    },
  };
});

export default useStyles;
