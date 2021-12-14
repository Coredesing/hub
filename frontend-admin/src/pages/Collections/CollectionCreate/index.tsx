import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import DefaultLayout from '../../../components/Layout/DefaultLayout';
import {adminRoute} from "../../../utils";
import CollectionForm from "./CollectionForm";
import BackButton from "../../../components/Base/ButtonLink/BackButton";

const PoolCreate: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const isEdit = false;

  return (
    <DefaultLayout>
      <BackButton to={adminRoute('/collections')}/>
      <CollectionForm
        isEdit={isEdit}
      />
    </DefaultLayout>
  )
}

export default withRouter(PoolCreate);
