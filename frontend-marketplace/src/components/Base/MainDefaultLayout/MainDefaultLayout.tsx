import React from 'react';
import useStyles from './styles';

const Content: React.FC<any> = (props: any) => {
  const styles = useStyles();

  const {
    backgroundColor = '#030925'
  } = props

  return (
    <div className={styles.mainLayout}>
      <div className="page-content">
        {props.children}
      </div>
      <div className="rectangle">
        <img src="/images/rectangle.png" alt="" />
      </div>
    </div>
  );
};

export default Content;