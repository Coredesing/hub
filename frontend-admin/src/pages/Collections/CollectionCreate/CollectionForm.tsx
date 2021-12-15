import React, { useState, useEffect } from 'react'
import useStyles from './style2';
import { components  } from 'react-select'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Switch from "react-switch";
import { createCollection, getCollectionDetail, updateCollection } from '../../../request/collections';
import { useDispatch } from 'react-redux';
import { alertFailure, alertSuccess } from '../../../store/actions/alert';
import { CircularProgress } from '@material-ui/core';

const GameInformation: React.FC<any> = (props: any) => {
    const classes = useStyles();
    let { itemId, isEdit } = props
    const [collectionInfo, setCollectionInfo] = useState({
      banner: '',
      default_image: '',
      description: '',
      image: '',
      is_show: 0,
      logo: '',
      medium: '',
      name: '',
      network: '',
      priority: 1,
      slug: '',
      telegram: '',
      token_address: '',
      twitter: '',
      type: '',
      use_external_uri: 0,
      website: ''
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
      console.log(isEdit)
        if (!isEdit) {
            return
        }
        
        getCollectionDetail(itemId)
        .then(async (res) => {
          if (res.status !== 200) {
            dispatch(alertFailure('Server Error: ' + (res.message || 'Load pool fail !!!')));
            return false;
          }
          const data = res.data;

          setCollectionInfo(data);
          console.log(collectionInfo)

          return res.data;
        })
        .catch((e) => {
          console.log('Error: ', e);
          dispatch(alertFailure('Pool load fail !!!'));
        });

        // if (
        //     (!collectionInfo?.name && !!collectionDetail?.name) ||
        //     (!collectionInfo?.banner && !!collectionDetail?.banner) ||
        //     (!collectionInfo?.logo && !!collectionDetail?.logo) ||
        //     (!collectionInfo?.website && !!collectionDetail?.website) ||
        //     (!collectionInfo?.image && !!collectionDetail?.image) ||
        //     (!collectionInfo?.default_image && !!collectionDetail?.default_image) ||
        //     (!collectionInfo?.network && !!collectionDetail?.network) ||
        //     (!collectionInfo?.token_address && !!collectionDetail?.token_address) ||
        //     (!collectionInfo?.type && !!collectionDetail?.type) ||
        //     (!collectionInfo?.use_external_uri && !!collectionDetail?.use_external_uri) ||
        //     (!collectionInfo?.slug && !!collectionDetail?.slug) ||
        //     (!collectionInfo?.priority && !!collectionDetail?.priority) ||
        //     (!collectionInfo?.is_show && !!collectionDetail?.is_show) ||
        //     (!collectionInfo?.telegram && !!collectionDetail?.telegram) ||
        //     (!collectionInfo?.medium && !!collectionDetail?.medium) ||
        //     (!collectionInfo?.twitter && !!collectionDetail?.twitter)
        // ) {
        //     setCollectionInfo(collectionDetail)
        // }
    }, [props])

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    }

     const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    const handleGameCreateUpdate = async () => {
      setLoading(true)
      if (!isEdit) {
        await createCollection(collectionInfo).then(res => {
          if (!res || !res.data) {
            setLoading(false)
            dispatch(alertFailure('Create Collection Failed'))
            return
          }

          dispatch(alertSuccess('Create Collection Successfully'))
          setLoading(false)
          window.location.replace('/#/dashboard/collections')
        }).catch(e => {
          setLoading(false)
          dispatch(alertFailure('Create Collection Failed'))
        })
      } else {

        await updateCollection(itemId, collectionInfo).then(res => {
          if (!res || !res.data) {
            setLoading(false)
            dispatch(alertFailure('Update Collection Failed'))
            return
          }

          dispatch(alertSuccess('Update Collection Successfully'))
          setLoading(false)
        }).catch(e => {
          setLoading(false)
          dispatch(alertFailure('Update Collection Failed'))
        })
      }
  }

    const onChangeName = (event: any) => {
        let newData = {...collectionInfo}
        newData.name = event?.target?.value
        setCollectionInfo(newData)
    }
    const onChangeNetwork = (event: any) => {
        let newData = {...collectionInfo}
        newData.network = event?.target?.value
        setCollectionInfo(newData)
    }
    const onChangeTokenAddress = (event: any) => {
        let newData = {...collectionInfo}
        newData.token_address = event?.target?.value
        setCollectionInfo(newData)
    }
    const onChangeLogo = (event: any) => {
      let newData = {...collectionInfo}
      newData.logo = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeBanner = (event: any) => {
      let newData = {...collectionInfo}
      newData.banner = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeSlug = (event: any) => {
      let newData = {...collectionInfo}
      newData.slug = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeImage = (event: any) => {
      let newData = {...collectionInfo}
      newData.image = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeDefaultImage = (event: any) => {
      let newData = {...collectionInfo}
      newData.default_image = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeWebsite = (event: any) => {
      let newData = {...collectionInfo}
      newData.website = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeTelegram = (event: any) => {
      let newData = {...collectionInfo}
      newData.telegram = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeMedium = (event: any) => {
      let newData = {...collectionInfo}
      newData.medium = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeTwitter = (event: any) => {
      let newData = {...collectionInfo}
      newData.twitter = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangePriority = (event: any) => {
      let newData = {...collectionInfo}
      newData.priority = event?.target?.value
      setCollectionInfo(newData)
    }
    const onChangeURI = (checked: any) => {
      let newData = {...collectionInfo}
      newData.use_external_uri = checked ? 1 : 0
      setCollectionInfo(newData)
    }
    const onChangeShow = (checked: any) => {
      let newData = {...collectionInfo}
      newData.is_show = checked ? 1 : 0
      setCollectionInfo(newData)
    }
    const onChangeDescription = (event: any) => {
      console.log('des', event)
      let newData = {...collectionInfo}
      newData.description = event?.target?.value
      setCollectionInfo(newData)
    }
    return (
            <div className={classes.infoBox}>
                <div className={classes.infoForm}>
                    <div className={classes.formControlFullWidth}>
                        <label className={classes.formControlLabel}>Name of Collection</label>
                        <input
                            type="text"
                            name="name"
                            onChange={onChangeName}
                            defaultValue={collectionInfo?.name}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Network</label>
                        <input
                            type="text"
                            name="network"
                            defaultValue={collectionInfo?.network}
                            onChange={onChangeNetwork}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Token Address</label>
                        <input
                            type="text"
                            name="token_address"
                            onChange={onChangeTokenAddress}
                            defaultValue={collectionInfo?.token_address}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Logo</label>
                        <input
                            type="text"
                            name="logo"
                            onChange={onChangeLogo}
                            defaultValue={collectionInfo?.logo}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Banner</label>
                        <input
                            type="text"
                            name="banner"
                            onChange={onChangeBanner}
                            defaultValue={collectionInfo?.banner}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Slug (Unique)</label>
                        <input
                            type="text"
                            name="slug"
                            onChange={onChangeSlug}
                            defaultValue={collectionInfo?.slug}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Image</label>
                        <input
                            type="text"
                            name="image"
                            onChange={onChangeImage}
                            defaultValue={collectionInfo?.image}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Default Image</label>
                        <input
                            type="text"
                            name="default_image"
                            onChange={onChangeDefaultImage}
                            defaultValue={collectionInfo?.default_image}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Website</label>
                        <input
                            type="text"
                            name="website"
                            onChange={onChangeWebsite}
                            defaultValue={collectionInfo?.website}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Telegram</label>
                        <input
                            type="text"
                            name="telegram"
                            onChange={onChangeTelegram}
                            defaultValue={collectionInfo?.telegram}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Medium</label>
                        <input
                            type="text"
                            name="medium"
                            onChange={onChangeMedium}
                            defaultValue={collectionInfo?.medium}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Twitter</label>
                        <input
                            type="text"
                            name="twitter"
                            onChange={onChangeTwitter}
                            defaultValue={collectionInfo?.twitter}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Priority</label>
                        <input
                            type="number"
                            name="priority"
                            min={1}
                            onChange={onChangePriority}
                            defaultValue={collectionInfo?.priority}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControlInline}>
                        <Switch onChange={onChangeURI} checked={!!collectionInfo?.use_external_uri} />
                        <label style={{marginLeft: '0.75em'}} className={classes.formControlLabel}>Use External URI</label>
                    </div>

                    <div className={classes.formControlInline}>
                        <Switch onChange={onChangeShow} checked={!!collectionInfo?.is_show} />
                        <label style={{marginLeft: '0.75em'}} className={classes.formControlLabel}>Show Collection</label>
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Description</label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            value={collectionInfo?.description ? collectionInfo.description : ''}
                            onChange={onChangeDescription}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter description for the collection'}

                        />
                    </div>
                </div>
                <button
                  disabled={loading}
                  className={classes.formButtonUpdatePool}
                  onClick={handleGameCreateUpdate}
                >
                    {
                        (loading) ? <CircularProgress size={25} /> : (isEdit ? 'Update' : 'Create')
                    }
                </button>
            </div>
    )
}

export default GameInformation;
