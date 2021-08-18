import useStyles from './style';
import {Dialog, DialogTitle, DialogContent, Button} from '@material-ui/core';
import { getEtherscanTransactionLink } from "../../../../utils/network";
import { numberWithCommas } from "../../../../utils/formatNumber";

const ModalShowDetail = (props: any) => {
  const styles = useStyles();
  const { data, openModalDetail, closeModalDetail } = props;

  const unstakedTotal = data?.unstaked?.reduce((totalUnstaked: any, unstaked: any) => totalUnstaked + parseInt(unstaked?.calculatedAmount, 10), 0);

  return (
    <Dialog
      open={openModalDetail}
      keepMounted
      className={styles.modalModalShowDetail}
      onClose={() => closeModalDetail()}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className={styles.headModalShowDetail}>
        DETAIL
        <Button className={styles.btnColseModal} variant="contained" onClick={() => closeModalDetail()} aria-label="close">
          <img src="/images/account_v3/icons/icon_close_modal.svg" alt="" />
        </Button>
      </DialogTitle>
      <DialogContent className={styles.comtentModalShowDetail}>
        <ul className={styles.listItem}>
          <li className={styles.Item}>
            <div className={styles.groupItem}>
              <div className={styles.nameItem}>
                Stake Txn Hash
              </div> 
              <div 
                onClick={() => {
                  const url = getEtherscanTransactionLink({ appChainID: 'eth', transactionHash: data?.staked?.tx });
                  data?.staked?.tx && window.open(url as string, '_blank')
                }}
                className={`${styles.valueItem} ${styles.unStakedTx}`}
              >
                {data?.staked?.tx?.slice(0, 3)}
                ...
                {data?.staked?.tx?.substr(data?.staked?.tx?.length - 4)}
              </div> 
            </div>
            <div className={styles.groupItem}>
              <div className={styles.nameItem}>
                Value
              </div> 
              <div className={styles.valueItem}>
                {data?.staked?.amount ? numberWithCommas(data?.staked?.amount?.toString()) : '0'} PKF
              </div> 
            </div>
          </li>
          <li className={styles.Item}>
            <div className={styles.groupItem}>
              <div className={styles.nameItem}>
                Unstake Txn Hash
              </div> 
              <div className={styles.valueItem}>
                {data?.unstaked?.length}
              </div>
            </div>
            <div className={styles.groupItem}>
              <div className={styles.nameItem}>
                Value
              </div> 
              <div className={styles.valueItem}>
                {data?.unstaked ? numberWithCommas(unstakedTotal.toString()) : '0'} PKF
              </div>
            </div>
            { data?.unstaked?.length > 0 &&
              <ul className={styles.listUnstake}>
                {
                  data?.unstaked?.map((item_unstaked: any, i: number) => {
                    return (
                      <li className={styles.itemUnstake} key={i}>
                        <div className={styles.groupItem}>
                          <div className={styles.nameItemUnstake}>Unstake Txn Hash</div>
                          <span 
                            onClick={() => {
                              const url = getEtherscanTransactionLink({ appChainID: 'eth', transactionHash: item_unstaked?.tx });
                              item_unstaked?.tx && window.open(url as string, '_blank')
                            }}
                            className={`${styles.valueItemUnstake} ${styles.unStakedTx}`}
                          >
                            {item_unstaked?.tx?.slice(0, 3)}
                            ...
                            {item_unstaked?.tx?.substr(item_unstaked?.tx?.length - 4)}
                          </span>
                        </div>
                        <div className={styles.groupItem}>
                          <div className={styles.nameItemUnstake}>Calculated Unstake Value</div>
                          <div className={styles.valueItemUnstake}>
                            {item_unstaked?.calculatedAmount ? numberWithCommas(item_unstaked?.calculatedAmount?.toString()) : '0'}
                            /
                            {item_unstaked?.unstakedAmount ? numberWithCommas(item_unstaked?.unstakedAmount?.toString()) : '0'} PKF
                          </div>
                        </div>
                        <div className={styles.groupItem}>
                          <div className={styles.nameItemUnstake}>Remaining Unstake Value</div>
                          <div className={styles.valueItemUnstake}>
                            {item_unstaked?.remainingAmount ? numberWithCommas(item_unstaked?.remainingAmount?.toString()) : '0'} PKF
                          </div>
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            }
          </li>
          <li className={styles.Item}>
            <div className={styles.groupItem}>
              <div className={styles.nameItem}>
                Stake Balance
              </div> 
              <div className={styles.valueItem}>
                {data?.balance ? numberWithCommas(data?.balance?.toString()) : '0'} PKF
              </div> 
            </div>
            <div className={styles.groupItem}>
              <div className={styles.nameItem}>
                Age
              </div> 
              <div className={styles.valueItem}>
                {data?.days ? numberWithCommas(data?.days?.toString()) : '0'} days
              </div> 
            </div>
            <div className={styles.groupItem}>
              <div className={styles.nameItem}>
                Bonus
              </div> 
              <div className={styles.valueItem}>
              {data?.percent ? numberWithCommas(data?.percent?.toString()) : '0'} %/day
              </div> 
            </div>
            <div className={styles.groupItem}>
              <div className={styles.nameItem}>
                RKPs
              </div> 
              <div className={styles.valueItem}>
                {data?.points ? numberWithCommas(data?.points?.toString()) : '0'}
              </div> 
            </div>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default ModalShowDetail;
