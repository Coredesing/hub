import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import DefaultLayout from '../../../components/Layout/DefaultLayout';
import KycUserDetailPage from './Detail/KycUserDetailPage';
import {Grid} from '@material-ui/core';

import {RouteComponentProps, withRouter} from 'react-router-dom';
import {useCommonStyle} from '../../../styles';
import {adminRoute} from "../../../utils";
import BackButton from "../../../components/Base/ButtonLink/BackButton";
import {getKycUserDetail} from "../../../request/kyc-user";

interface MatchParams {
  id: string;
}

const KycUserEdit: React.FC<RouteComponentProps<MatchParams>> = (props: RouteComponentProps<MatchParams>) => {
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();
  const { match } = props;
  const id = match.params.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);

  const getRowInfo = async () => {
    try {
      setLoading(true);
      const resObject = await getKycUserDetail(id);
      if (resObject.status === 200) {
        setUser(resObject.data);
        setFailure(false);
      } else {
        setFailure(true);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setFailure(true);
    }
  };

  useEffect(() => {
    getRowInfo();
  }, []);

  return (
    <DefaultLayout>
      <div className={commonStyle.headPage}>
        <div className={commonStyle.headPageLeft}>
          <BackButton to={adminRoute('/kyc-users')}/>
        </div>
      </div>
      <div className="contentPage">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {loading &&
              <>
                Loading
              </>
            }
            {!loading &&
              <KycUserDetailPage
                user={user}
                loading={loading}
                failure={failure}
                isCreate={false}
              />
            }
          </Grid>
        </Grid>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(KycUserEdit);
