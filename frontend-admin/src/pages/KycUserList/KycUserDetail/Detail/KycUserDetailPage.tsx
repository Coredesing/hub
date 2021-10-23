import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import {withRouter} from 'react-router-dom';
import useStyles from '../styles';
import FormKycUser from "./FormKycUser";

const KycUserDetailPage = (props: any) => {
  const styles = useStyles();
  const { history, match, user, loading, failure, isCreate } = props;

  const showFormCreate = () => {
    return (
      <>
        <FormKycUser
          user={user || {}}
          isCreate={isCreate}
        />
      </>
    )
  };

  const showFormDetail = () => {
    if (user) {
      return (
        <>
          <FormKycUser
            user={user}
            isCreate={isCreate}
          />
        </>
      )
    } else if (failure) {
      return <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>There is no user that does exists</p>;
    }

    return (
      <div className={styles.skeletonLoading}>
        {
          [...Array(10)].map((num, index) => (
          <div key={index}>
            <Skeleton className={styles.skeleton} width="100%" />
          </div>
          ))
        }
      </div>
    );
  };

  return (
      <div className={styles.boxCampaignDetail}>
        <div className={styles.headBoxCampaignDetail}>
          <h2 className={styles.titleBoxCampaignDetail}>
            {isCreate ? 'Admin Create' : 'Admin Detail'}
          </h2>
        </div>
        <div className="clearfix"></div>
        <div className={styles.formShow}>
          {isCreate ? showFormCreate() : showFormDetail()}
        </div>
      </div>
  );
};

export default withRouter(KycUserDetailPage);
