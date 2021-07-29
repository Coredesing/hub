import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID } from '../../../constants/network';
import React, {useEffect, useState} from "react";

const closeIcon = '/images/icons/close.svg'
const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL || "";
const BCSSCAN_URL = process.env.REACT_APP_BSCSCAN_BASE_URL || "";
const POLSCAN_URL = process.env.REACT_APP_POLSCAN_BASE_URL || "";

const ModalTransaction = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();
  const { appChainID } = useTypedSelector(state => state.appNetwork).data;

  const {
    transactionHashes,
    setTransactionHashes
  } = props;

  const handleClose = () => {
    let array = [...transactionHashes];
    array.shift();
    setTransactionHashes(array);
    console.log(array)
  }

  const [explorerUrl, setExplorerUrl] = useState<String>(ETHERSCAN_URL);
  const [explorerName, setExplorerName] = useState<String>("Etherscan");

  useEffect(()=>{
    switch(appChainID) {
      case BSC_CHAIN_ID:
        setExplorerUrl(BCSSCAN_URL);
        setExplorerName("Bscscan");
      break;

      case POLYGON_CHAIN_ID:
        setExplorerUrl(POLSCAN_URL);
        setExplorerName("Polygonscan");
      break;

      case ETH_CHAIN_ID:
        setExplorerUrl(ETHERSCAN_URL);
        setExplorerName("Etherscan");
        break;
    }
  }, [appChainID])

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalTransaction}>
        <div className="modal-content">
          <div className="modal-content__head">
            <img src={closeIcon} className="btn-close" onClick={handleClose}/>
            <h2 className="title">Transaction Submitted</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>TXn Hash</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={transactionHashes[0]}
                disabled
              />
            </div>
          </div>
          <div className="modal-content__foot">
            <a
              href={`${explorerUrl}/tx/${transactionHashes[0]}`}
              target="_blank"
              className={commonStyles.nnb1418d} rel="noreferrer"
            >View on {`${explorerName}`}</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalTransaction;
