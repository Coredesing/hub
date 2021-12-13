import React, {useEffect, useState} from 'react';
import useStyles from "./style";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import {CircularProgress, Grid} from "@material-ui/core";
import {withRouter} from "react-router-dom";

import DisplayCollectionSwitch from "./Components/CollectionDisplaySwitch";
import CollectionType from "./Components/CollectionType";
import CollectionName from "./Components/CollectionName";
import CollectionLogo from "./Components/CollectionLogo";
import CollectionWebsite from "./Components/CollectionWebsite";
import UseExternalURI from "./Components/UseExternalURI";
import TokenAddress from "./Components/TokenAddress";
import NetworkAvailable from "./Components/NetworkAvailable";

import CollectionBanner from './Components/CollectionBanner';
import CollectionImage from './Components/CollectionImage';
import CollectionDefaultImage from './Components/CollectionDefaultImage';
import CollectionTelegram from './Components/CollectionTelegram';
import CollectionTwitter from './Components/CollectionTwitter';
import CollectionMedium from './Components/CollectionMedium';
import CollectionPriority from './Components/CollectionPriority';
import CollectionSlug from './Components/CollectionSlug';
import { addCollection, getCollections, updateCollection } from '../../../store/actions/collections';

function PoolForm(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { match } = props;
  const itemID = match.params.id;
  const isEdit = !!itemID
  const { collection_info, loading, failure } = useSelector(( state: any ) => state.collection_info);
  const collectionDetail = collection_info?.data

  const { register, setValue, getValues, clearErrors, errors, handleSubmit, control, watch } = useForm({
    mode: "onChange",
    defaultValues: collectionDetail,
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    const loadCollections = () => {
        dispatch(getCollections(itemID))
    }
    loadCollections();
}, [dispatch]);

  const handleCreate = (data: any) => {
    const collectionData = {
      token_address: data?.token_address,
      description: data?.description,
      name: data?.name,
      logo: data?.logo,
      banner: data?.banner,
      image: data?.image,
      default_image: data?.default_image,
      website: data?.website,
      telegram: data?.telegram,
      twitter: data?.twitter,
      medium: data?.medium,
      type: data?.type,
      priority: data?.priority,
      network: data?.network,
      use_external_uri: Number.parseInt(data?.use_external_uri),
      slug: data?.slug
    }

    dispatch(addCollection(collectionData))
  }

  const handleUpdate = (data: any) => {
    const collectionData = {
      token_address: data?.token_address,
      description: data?.description,
      name: data?.name,
      logo: data?.logo,
      banner: data?.banner,
      image: data?.image,
      default_image: data?.default_image,
      website: data?.website,
      telegram: data?.telegram,
      twitter: data?.twitter,
      medium: data?.medium,
      type: data?.type,
      is_show: data?.is_show,
      priority: data?.priority,
      network: data?.network,
      use_external_uri: Number.parseInt(data?.use_external_uri),
      slug: data?.slug
    }

    dispatch(updateCollection(itemID, collectionData))
  }
  
  const handleCollectionCreateUpdate = () => {

    !isEdit ? handleSubmit(handleCreate)() : handleSubmit(handleUpdate)()
}

  return (
  <>
    <div className="contentPage">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className="">
            <div className={classes.exchangeRate}>
              {!!collectionDetail?.id &&
                <DisplayCollectionSwitch
                  collectionDetail={collectionDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  control={control}
                  id={itemID}
                />
              }

              <CollectionType
                collectionDetail={collectionDetail}
                register={register}
                setValue={setValue}
                errors={errors}
                control={control}
              />

              <TokenAddress
                collectionDetail={collectionDetail}
                setValue={setValue}
                register={register}
              />

              <NetworkAvailable
                collectionDetail={collectionDetail}
                setValue={setValue}
                register={register}
                errors={errors}
                control={control}
                isEdit={isEdit}
              />

              <CollectionName
                collectionDetail={collectionDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <CollectionLogo
                collectionDetail={collectionDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <CollectionWebsite
                collectionDetail={collectionDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <UseExternalURI
                collectionDetail={collectionDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />
              <CollectionSlug
                collectionDetail={collectionDetail}
                setValue={setValue}
                register={register}
                errors={errors}
                isEdit={isEdit}
              />
            </div>
          </div>
        </Grid>

        <Grid item xs={6}>
          <div className={classes.exchangeRate}>
            <CollectionBanner
              collectionDetail={collectionDetail}
              setValue={setValue}
              register={register}
              errors={errors}
            />
            <CollectionImage
              collectionDetail={collectionDetail}
              setValue={setValue}
              register={register}
              errors={errors}
            />
            <CollectionDefaultImage
              collectionDetail={collectionDetail}
              setValue={setValue}
              register={register}
              errors={errors}
            />
            <CollectionTelegram
              collectionDetail={collectionDetail}
              setValue={setValue}
              register={register}
              errors={errors}
            />
            <CollectionTwitter
              collectionDetail={collectionDetail}
              setValue={setValue}
              register={register}
              errors={errors}
            />
            <CollectionMedium
              collectionDetail={collectionDetail}
              setValue={setValue}
              register={register}
              errors={errors}
            />
            <CollectionPriority
              collectionDetail={collectionDetail}
              setValue={setValue}
              register={register}
              errors={errors}
            />
          </div>

        </Grid>

      </Grid>

      <button
        disabled={loading}
        className={classes.formButtonUpdatePool}
        onClick={handleCollectionCreateUpdate}
      >
        {
          (loading) ? <CircularProgress size={25} /> : (isEdit ? 'Update' : 'Create')
        }
      </button>

    </div>

  </>
  );
}

export default withRouter(PoolForm);
