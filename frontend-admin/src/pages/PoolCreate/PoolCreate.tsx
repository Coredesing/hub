import React, { useEffect, useState } from 'react';
import {RouteComponentProps, withRouter, useLocation} from 'react-router-dom';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import {adminRoute} from "../../utils";
import PoolForm from "./PoolForm";
import BackButton from "../../components/Base/ButtonLink/BackButton";

const PoolCreate: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const isEdit = false;
  const location : any = useLocation();
  const [poolDetailClone, setPoolDetailClone] = useState<any>({});

  useEffect(() => {
    
    if (location.state?.poolDetail) {
      let poolData = { ...location.state?.poolDetail };
      poolData.id = null;
      console.log('Clone poolDetail', poolData);
      setPoolDetailClone(poolData);
    }
  }, [location]);

  return (
    <DefaultLayout>
      <BackButton to={adminRoute('/campaigns')}/>
      <PoolForm
        isEdit={isEdit}
        poolDetail={poolDetailClone}
      />
    </DefaultLayout>
  )
}

export default withRouter(PoolCreate);
