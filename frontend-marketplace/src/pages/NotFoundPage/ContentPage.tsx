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
      height: '460px',
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

      '&.top': {
      },
      '&.bottom': {
        transform: 'rotate(-180deg)'
      }
    },

    '& .content': {
      display: 'grid',
      placeItems: "center",
      placeContent: "center",
      gap: '10px',
      '& img': {
        [theme.breakpoints.down('xs')]: {
          height: '60px',
        },
      },
      '& h3': {
        fontWeight: 600,
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontSize: '20px',
        mixBlendMode: 'normal',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '20px',
        [theme.breakpoints.down('xs')]: {
          fontSize: '16px',
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
          src="/images/404-v1.png"
          alt="404"
        />
        <h3>Sorry, we were unable to find that page</h3>
        <Link to="/">
          Back to Home Page
        </Link>
      </div>

      <div className="rectangle bottom bl">
        <img src="/images/landing/rectangle-black.png" alt="" />
      </div>
    </div>
  );
};

export default ContentPage;
