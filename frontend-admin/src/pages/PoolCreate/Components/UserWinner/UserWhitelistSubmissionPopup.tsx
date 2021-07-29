import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import Button from '@material-ui/core/Button';
import Link from "@material-ui/core/Link";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import useStyles from "../../style";
import { useForm } from "react-hook-form";


function UserWhitelistSubmissionPopup(props: any) {
  const classes = useStyles();
  const {
    isOpenEditPopup, setIsOpenEditPopup, editData, handleUpdateData, requirements
  } = props;

  const statusOptions = [
    {name: 'PENDING', value: 0},
    {name: 'COMPLETED', value: 1},
    {name: 'ERROR', value: 2},
    {name: 'REJECTED', value: 3},
  ]

  const {
    register, clearErrors, setValue, errors, handleSubmit, control,
    formState: { isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...editData
    }
  });

  const submitData = (data: any) => {
    handleUpdateData && handleUpdateData(data);
  };

  const handleSubmitPopup = () => {
    return handleSubmit(submitData)()
      .then((res) => {
        console.log('Res: ', isValid, errors);
        if (isValid) {
          clearErrors();
        }
      });
  };

  const approveAllAndSubmit = () => {
    setValue("self_twitter_status", 1);
    setValue("self_channel_status", 1);
    setValue("self_group_status", 1);
    setValue("self_retweet_post_status", 1);
    setValue("partner_twitter_status", 1);
    setValue("partner_channel_status", 1);
    setValue("partner_group_status", 1);
    setValue("partner_retweet_post_status", 1);
    return handleSubmitPopup();
  }

  return (
    <>
      <Dialog
        open={isOpenEditPopup}
        maxWidth={'md'}
        fullWidth
      >
        <DialogTitle>Validate Whitelist Submission</DialogTitle>
        <DialogContent>
          <div className={classes.formControl}>
            <div>
              <label className={classes.formControlLabel}>
                Twitter: <Link href={`https://twitter.com/${editData.user_twitter}`} target={'_blank'}>{editData.user_twitter}</Link>
              </label>
            </div>

            <div>
              <label className={classes.formControlLabel}>Telegram: {editData.user_telegram}</label>
            </div>

            <div>
              <label className={classes.formControlLabel}>Wallet address: {editData.wallet_address}</label>
              <input
                type="hidden"
                name="wallet_address"
                ref={register({ })}
                className={classes.formControlInput}
              />
              <input
                type="hidden"
                name="campaign_id"
                ref={register({ })}
                className={classes.formControlInput}
              />
            </div>
          </div>

          <Grid container justify="center" spacing={3}>
            <Grid key="self" item xs={12} sm={6}>
              <div className={classes.formControl}>
                <label className={classes.formControlLabel}>Follow Our Twitter: {requirements?.self_twitter ? requirements?.self_twitter : 'Not required'}</label>
                <select 
                  name="self_twitter_status"
                  ref={register({ })}
                  className={classes.formControlInput}>
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={classes.formControl}>
                <label className={classes.formControlLabel}>Join Our Group: {requirements?.self_group ? requirements?.self_group : 'Not required'}</label>
                <select 
                  name="self_group_status"
                  ref={register({ })}
                  className={classes.formControlInput}>
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={classes.formControl}>
                <label className={classes.formControlLabel}>Follow Our Channel: {requirements?.self_channel ? requirements?.self_channel : 'Not required'}</label>
                <select 
                  name="self_channel_status"
                  ref={register({ })}
                  className={classes.formControlInput}>
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={classes.formControl}>
                <label className={classes.formControlLabel}>
                  Like & Reweet Our Announcement: &nbsp;
                  {
                    requirements?.self_retweet_post ? 
                    <Link href={requirements?.self_retweet_post} target={'_blank'}>
                      Post
                    </Link> : 'Not required'
                  }
                </label>
                <select 
                  name="self_retweet_post_status"
                  ref={register({ })}
                  className={classes.formControlInput}>
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            </Grid>
            <Grid key="partner" item xs={12} sm={6}>
              
              <div className={classes.formControl}>
                <label className={classes.formControlLabel}>Follow Partner's Twitter: {requirements?.partner_twitter ? requirements?.partner_twitter : 'Not required'}</label>
                <select 
                  name="partner_twitter_status"
                  ref={register({ })}
                  className={classes.formControlInput}>
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={classes.formControl}>
                <label className={classes.formControlLabel}>Join Partner's Group: {requirements?.partner_group ? requirements?.partner_group : 'Not required'}</label>
                <select 
                  name="partner_group_status"
                  ref={register({ })}
                  className={classes.formControlInput}>
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={classes.formControl}>
                <label className={classes.formControlLabel}>Follow Partner's Channel: {requirements?.partner_channel ? requirements?.partner_channel : 'Not required'}</label>
                <select 
                  name="partner_channel_status"
                  ref={register({ })}
                  className={classes.formControlInput}>
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={classes.formControl}>
                <label className={classes.formControlLabel}>
                  Like & Reweet Partner's Announcement: &nbsp;
                  {
                    requirements?.partner_retweet_post ? 
                    <Link href={requirements?.partner_retweet_post} target={'_blank'}>
                      Post
                    </Link> : 'Not required'
                  }
                </label>
                <select 
                  name="partner_retweet_post_status"
                  ref={register({ })}
                  className={classes.formControlInput}>
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions style={{marginTop: '20px'}}>
          <Button onClick={approveAllAndSubmit} variant="contained" color="primary">
            Approve All
          </Button>
          <Button onClick={handleSubmitPopup} variant="contained" color="primary">
            Update
          </Button>
          <Button onClick={() => { setIsOpenEditPopup(false); }} variant="contained" color="default">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default UserWhitelistSubmissionPopup;
