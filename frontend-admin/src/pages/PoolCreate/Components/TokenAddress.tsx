import React, {useEffect, useState} from 'react';
import {getTokenInfo} from "../../../utils/token";
import {CircularProgress, Tooltip, Button} from "@material-ui/core";
import useStyles from "../style";
import {debounce} from "lodash";
import {renderErrorCreatePool} from "../../../utils/validate";
import {useDispatch, useSelector} from "react-redux";

import {
  CHAIN_ID_NAME_MAPPING, TOKEN_TYPE
} from "../../../constants";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {Controller} from "react-hook-form";
import {getPoolContract} from "../../../services/web3";
import {updateDeploySuccess} from "../../../request/pool";
import {alertFailure, alertSuccess} from "../../../store/actions/alert";

function TokenAddress(props: any) {
  const classes = useStyles();
  const { currentNetworkId } = useSelector((state: any) => state).userCurrentNetwork;
  const [loadingToken, setLoadingToken] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const { data: loginUser } = useSelector(( state: any ) => state.user);
  const {
    register, setValue, errors, control, watch, getValues, needValidate,
    poolDetail,
    token, setToken,
  } = props;
  const renderError = renderErrorCreatePool;
  const dispatch = useDispatch();

  const networkAvailable = watch('networkAvailable');
  const isDeployed = !!poolDetail?.is_deploy;

  useEffect(() => {
    if (poolDetail && poolDetail.token) {
      // First load when poolDetail change
      setValue('token', poolDetail.token, { shouldValidate: true });

      loadingTokenData(poolDetail.token, poolDetail.token_type);
    }
  }, [poolDetail]);

  useEffect(() => {
    if (poolDetail && networkAvailable) {
      // Auto load token when:
      // 1. Change network in Metamask
      // 2. Change select Network Available (Pool)
      const tokenAddressInputed = getValues('token');

      setValue('token', tokenAddressInputed, { shouldValidate: true });
      setValue('token_type', poolDetail.token_type);
      loadingTokenData(tokenAddressInputed, poolDetail.token_type);
    }
  }, [networkAvailable, currentNetworkId]);

  const loadingTokenData = async (tokenValue: string, token_type: string) => {
    try {
      setToken(null);
      setLoadingToken(true);

      const tokenAddress = tokenValue;
      const token = await getTokenInfo(tokenAddress, token_type);
      if (token) {
        const { name, symbol, decimals, address, token_type } = token;
        setLoadingToken(false);
        setToken({
          name,
          symbol,
          decimals,
          address,
          token_type,
        });
      }
    } catch (err) {
      setLoadingToken(false);
    };
  };

  const handleTokenGetInfo = debounce(async (e: any) => {
    const token_type = getValues('token_type');
    await loadingTokenData(e.target.value, token_type);
  }, 500);

  const changeEditForm = async (value: boolean) => {
    setEditForm(value)
  }

  const changeTokenSale = async () => {
    try {
      if (!loginUser || !loginUser.wallet_address) {
        console.log('login user null')
        return
      }

      if (!poolDetail || !poolDetail.network_available || !poolDetail.campaign_hash) {
        console.log('pool detail null')
        return
      }

      const newTokenAddress = getValues('token')
      const contractInstance = await getPoolContract({
        networkAvailable: poolDetail.network_available,
        poolHash: poolDetail.campaign_hash,
        isClaimable: true
      })

      if (!contractInstance) {
        console.log('contract instance null')
        return
      }

      const tx = await contractInstance.methods.changeSaleToken(newTokenAddress).send({from: loginUser.wallet_address});
      if (!tx || !tx.events || !tx.events.TokenChanged) {
        console.log('tx failed', tx)
        dispatch(alertFailure(`Change Token sale blockchain error`))
        return
      }

      // save to backend
      const updateData = {
        campaign_hash: poolDetail.campaign_hash,
        token_symbol: token.symbol,
        token_name: token.name,
        token_decimals: token.decimals,
        token_address: token.address,
      };

      await updateDeploySuccess(updateData, poolDetail.id)
          .then(() => {
            dispatch(alertSuccess(`Change Token sale successfully`))
          }).catch(() => {
            dispatch(alertFailure(`Change Token sale backend error`))
          });
    }
    catch (e) {
      dispatch(alertFailure(`Change Token sale error: ${e.message}`))
    }
  }

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Token Type</label>

        <Controller
            rules={{ required: true }}
            control={control}
            defaultValue={poolDetail ? poolDetail.token_type : ''}
            name="token_type"
            as={
              <RadioGroup row>
                <FormControlLabel
                    value={TOKEN_TYPE.ERC20} control={<Radio />}
                    label={TOKEN_TYPE.ERC20}
                    disabled={isDeployed}
                />
                <FormControlLabel
                    value={TOKEN_TYPE.ERC721} control={<Radio />}
                    label={TOKEN_TYPE.ERC721 + ' (NFT)'}
                    disabled={isDeployed}
                />
                <FormControlLabel
                    value={TOKEN_TYPE.MYSTERY_BOX} control={<Radio />}
                    label={TOKEN_TYPE.MYSTERY_BOX}
                    disabled={isDeployed}
                />
              </RadioGroup>
            }
        />
      </div>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Token address</label>
        { isDeployed && !editForm &&
          <Button
            variant="contained"
            color="primary"
            onClick={() => changeEditForm(true)}
            style={{marginLeft: 10, marginBottom: 10, float: 'right'}}
          >Edit Token</Button>
        }
        { isDeployed && editForm &&
        <Button
            variant="contained"
            color="primary"
            onClick={() => changeEditForm(false)}
            style={{marginLeft: 10, marginBottom: 10, float: 'right'}}
        >Cancel</Button>
        }
        {isDeployed && editForm && !loadingToken &&
          <Button
              variant="contained"
              color="primary"
              onClick={() => changeTokenSale()}
              style={{ marginLeft: 10, marginBottom: 10, float: 'right' }}
          >Change Token</Button>
        }
        <div className={classes.formControlInputLoading}>
          <input
            type="text"
            name="token"
            ref={register({
              // required: true,
              validate: {
                invalidToken: async (val: string) => {
                  try {
                    const token_type = poolDetail ? poolDetail.token_type : getValues('token_type');
                    if (!needValidate) {
                      if (val) {
                        const token = await getTokenInfo(val, token_type);
                      }
                      return true;
                    }
                    const token = await getTokenInfo(val, token_type);
                    return token;
                  } catch (err: any) {
                    return err.message;
                  }
                },
              }
            })}
            maxLength={255}
            onChange={handleTokenGetInfo}
            className={classes.formControlInput}
            disabled={isDeployed && !editForm}
          />
          {
            loadingToken ?
              <div className={classes.circularProgress}>
                <CircularProgress size={25} />
              </div> : (
                errors['token'] && (errors['token'].type === 'tokenAlreadyUsed' || errors['token'].type === 'invalidToken') ? <img src="/images/icon_close.svg" className={classes.loadingTokenIcon} /> : (token && <img src="/images/icon_check.svg" className={classes.loadingTokenIcon} />
                ))
          }
        </div>
        <p className={`${classes.formErrorMessage}`}>
          {
            renderError(errors, 'token')
          }
        </p>

        {errors?.token?.type &&
          <>
            <p className={`${classes.formErrorMessage}`}>
              You should check corresponding token with network.
            </p>
            <p className={`${classes.formErrorMessage}`}>
              Network Available Selected: <span style={{textTransform: 'uppercase'}}>{networkAvailable}</span>
            </p>
            <p className={`${classes.formErrorMessage}`}>
              Metamask User Network: <span>{CHAIN_ID_NAME_MAPPING[currentNetworkId]} ({currentNetworkId})</span>
            </p>
          </>
        }
      </div>
      {
        token && (
          <div className={classes.tokenInfo}>
            <div className="tokenInfoBlock">
              <span className="tokenInfoLabel">Token Info</span>
              <div className="tokenInfoContent">
                <img src="/images/eth.svg" alt="erc20" />
                <Tooltip title={<p style={{ fontSize: 15 }}>{token.name}</p>}>
                  <p className="tokenInfoText wordBreak">{`${token.name}`}</p>
                </Tooltip>
              </div>
            </div>
            <div className="tokenInfoBlock">
              <span className="tokenInfoLabel">Symbol</span>
              <div className="tokenInfoContent">
                {`${token.symbol}`}
              </div>
            </div>
            <div className="tokenInfoBlock">
              <span className="tokenInfoLabel">Decimals</span>
              <div className="tokenInfoContent">
                {`${token.decimals}`}
              </div>
            </div>
            <div className="tokenInfoBlock">
              <span className="tokenInfoLabel">Type</span>
              <div className="tokenInfoContent">
                {`${token.token_type}`}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}

export default TokenAddress;
