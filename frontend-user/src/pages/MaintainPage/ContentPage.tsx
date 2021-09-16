import React from "react";
import { makeStyles } from "@material-ui/core";
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme: any) => ({
  notfound: {

    width: '100%',
    height: '700px',
    position: 'relative',
    background: '#0A0A0A',
    [theme.breakpoints.down('xs')]: {
      height: '640px',
    },

    '&.mgt': {
      marginTop: '-80px',
    },

    '& .rectangle': {
      width: '100%',
      height: '250px',
      [theme.breakpoints.down('xs')]: {
        height: '150px',
      },
      '& img': {
        width: '100%',
        height: '100%',
      },
      '&.bottom': {
        transform: 'rotate(-180deg)'
      }
    },

    '& .content': {
      display: 'grid',
      gridTemplateColumns: '310px auto',
      gap: '40px',
      placeItems: "center",
      placeContent: "center",
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      },
      '& img': {
        [theme.breakpoints.down('xs')]: {
          height: '160px',
        },
      },
      '& .text': {
        [theme.breakpoints.down('sm')]: {
          display: 'grid',
          placeItems: 'center',
        },
        '& h1': {
          fontWeight: 600,
          fontFamily: 'Space Ranger',
          fontStyle: 'normal',
          fontSize: '48px',
          mixBlendMode: 'normal',
          color: '#fff',
          textAlign: 'left',
          [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
            fontSize: '36px'
          },
        },
        '& h3': {
          fontWeight: 600,
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontSize: '16px',
          mixBlendMode: 'normal',
          color: '#D1D1D1',
          textAlign: 'left',
          marginBottom: '20px',
          [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
          },
          [theme.breakpoints.down('xs')]: {
            fontSize: '14px',
          },
        },
        '& a': {
          background: '#72F34B',
          color: '#000',
          fontWeight: 600,
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontSize: '14px',
          mixBlendMode: 'normal',
          textAlign: 'center',
          textDecoration: 'none',
          padding: '10px 0',
          width: '200px',
          display: 'block',
        }
      }
    }

  }
}))

const ContentPage = (props: any) => {
  const styles = useStyles();
  return (
    <div
      className={clsx(styles.notfound, {
        mgt: props.isShowBannerContract
      })}
    >
      <div className="rectangle top bl">
        <img src="/images/landing/rectangle-black.png" alt="" />
      </div>

      <div className="content">
        <img
          src="/images/maintain.png"
          alt="404"
        />
        <div className="text">
          <h1>System maintenance</h1>
          <h3>Sorry, we were unable to find that page</h3>
          <Link to="/">
            Back to Home Page
          </Link>
        </div>
      </div>

      <div className="rectangle bottom bl">
        <img src="/images/landing/rectangle-black.png" alt="" />
      </div>
    </div>
  );
};

export default ContentPage;
