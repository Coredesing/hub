import React, { useEffect, useState } from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import DefaultLayout from '../../../components/Layout/DefaultLayout';
import {adminRoute} from "../../../utils";
import CollectionForm from "./CollectionForm";
import BackButton from "../../../components/Base/ButtonLink/BackButton";

const CollectionCreate: React.FC<RouteComponentProps<{ id: any }>> = (props: RouteComponentProps<{ id: any }>) => {
  const isEdit = new URLSearchParams(props.location.search).get('edit') === 'true';
  const itemId = props.match.params.id;

  return (
    <DefaultLayout>
      <BackButton to={adminRoute('/collections')}/>
      <CollectionForm
        itemId={itemId}
        isEdit={isEdit}
      />
    </DefaultLayout>
  )
}

export default withRouter(CollectionCreate);
