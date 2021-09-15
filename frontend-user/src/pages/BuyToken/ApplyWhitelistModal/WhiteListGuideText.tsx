import React from 'react';
import useStyles from './style';

function WhiteListGuideText(props: any) {
  const styles = useStyles();
  return (
    <>
      <p style={{ paddingBottom: 10, color: '#FFFFFF' }}>
        In order to participate in the IDO, you must fullfil requirements as below. 
      </p>
      <div className={styles.whitelistContentModal}>
        <p>
          Eagle and Phoenix ranks are not required to do the social requirements. However, we recommend 
          following our official Twitter and Telegram groups to stay up-to-date with important announcements.
        </p>
      </div>
    </>
  );
}

export default WhiteListGuideText;
