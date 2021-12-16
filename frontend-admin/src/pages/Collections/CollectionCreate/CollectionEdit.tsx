import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import DefaultLayout from '../../../components/Layout/DefaultLayout';
import {adminRoute} from "../../../utils";
import CollectionForm from "./CollectionForm";
import {getPoolDetail} from "../../../request/staking-pool";
import moment from "moment";
import {DATETIME_FORMAT} from "../../../constants";
import BackButton from "../../../components/Base/ButtonLink/BackButton";
import {useDispatch, useSelector} from "react-redux";
import {get} from 'lodash';
import {getPoolBlockchainInfo} from "../../../utils/blockchain";
import {alertFailure} from "../../../store/actions/alert";

const CollectionEdit: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const isEdit = true;
  const { match } = props;
  const dispatch = useDispatch();
  const { data: loginUser } = useSelector((state: any) => state.user);
  const [collectionDetail, setCollectionDetail] = useState();

  // @ts-ignore
  const id = match.params?.id;

  const getPoolInfoInBlockchain = async (data: any) => {
    if (!get(collectionDetail, 'is_deploy')) {
      return;
    }
    try {
      const response = await getPoolBlockchainInfo(loginUser, data);
    } catch (e) {
      console.log('ERROR: ', e);
    }
  };

  useEffect(() => {
    getPoolDetail(id)
      .then(async (res) => {
        if (res.status !== 200) {
          dispatch(alertFailure('Server Error: ' + (res.message || 'Load collection fail !!!')));
          return false;
        }
        const data = res.data;

        setCollectionDetail(data);

        return res.data;
      })
      .catch((e) => {
        console.log('Error: ', e);
        dispatch(alertFailure('Collection load fail !!!'));
      });
  }, [id]);

  return (
    <DefaultLayout>
      <BackButton to={adminRoute('/collections')}/>
      <CollectionForm
        isEdit={isEdit}
        collectionDetail={collectionDetail}
      />
    </DefaultLayout>
  )
}

export default withRouter(CollectionEdit);
