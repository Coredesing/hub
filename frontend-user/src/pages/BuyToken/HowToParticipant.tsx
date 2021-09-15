import React, {useState} from 'react';
import useStyles from "./style";
import BigNumber from "bignumber.js";
import moment from 'moment'
import momentTimezone from 'moment-timezone';

function HowToParticipant(props: any) {
  const styles = useStyles();
  const [showHowTo, setShowHowTo] = useState<boolean>(false);
  const today = new Date();
  const {
    poolDetails,
    joinTimeInDate,
    endJoinTimeInDate,
    currentUserTier,

    alreadyJoinPool,
    joinPoolSuccess,
    whitelistCompleted,
    isKYC,
  } = props;

  const announcementTime = poolDetails?.whitelistBannerSetting?.announcement_time ? new Date(Number(poolDetails?.whitelistBannerSetting?.announcement_time) * 1000): undefined;
  const announcementTimeDisplay = momentTimezone.tz(announcementTime, moment.tz.guess()).format("dddd, MMMM DD, YYYY");
  const endJoinTimeDisplay = momentTimezone.tz(endJoinTimeInDate, moment.tz.guess()).format("dddd, MMMM DD, YYYY");
  // console.log('announcementTimeDisplay======>', announcementTime, announcementTimeDisplay);
  // console.log('endJoinTimeDisplay======>', endJoinTimeInDate, endJoinTimeDisplay);

  const availableJoin = (poolDetails?.method === 'whitelist' && joinTimeInDate && endJoinTimeInDate) ? today <= endJoinTimeInDate : false;
  if (!availableJoin) {
    return <></>;
  }
  const enoughtMinTier = new BigNumber(currentUserTier?.level || 0).gte(poolDetails?.minTier);
  const appliedWhiteList = alreadyJoinPool || joinPoolSuccess;
  const isAppliedSuccess = isKYC && appliedWhiteList && enoughtMinTier;

  return (
    <>
      <div className={styles.bottomBoxHowTo}>
        <div className={styles.boxHowTo}>
          <div className={styles.titleBoxHowTo} onClick={() => setShowHowTo(!showHowTo)}>
            How to participate?
            <img className={styles.iconHowTo} src={`/images/icons/${showHowTo ? 'icon_how_to_close' : 'icon_how_to'}.svg`} alt="" />
          </div>
          {
            showHowTo &&
            <div className={styles.contentHowTo}>
              <ul className={styles.listHowTo}>
                <li className={`${styles.itemHowTo} ${isKYC && styles.activeItemHowTo}`}>
                  <div className={`${styles.checkmark} ${isKYC && styles.activeCheckmark}`}></div>
                  KYC Verification
                </li>
                <li className={`${styles.itemHowTo} ${enoughtMinTier && styles.activeItemHowTo}`}>
                  <div className={`${styles.checkmark} ${enoughtMinTier && styles.activeCheckmark}`}></div>
                  Achieve Min Rank of pool
                </li>
                <li className={`${styles.itemHowTo} ${appliedWhiteList && styles.activeItemHowTo}`}>
                  <div className={`${styles.checkmark} ${appliedWhiteList && styles.activeCheckmark}`}></div>
                  Apply Whitelist
                </li>
              </ul>
              <div className={styles.textClickHowTo}>
                {isAppliedSuccess &&
                  (
                  <>
                    {!whitelistCompleted &&
                    'Please wait until your whitelist application is approved. We will check and verify later in a short time.'
                    }
                    {whitelistCompleted &&
                    <>
                      {announcementTimeDisplay &&
                      `You are ready for the IDO. Please stay tune for winner annoucement on ${announcementTimeDisplay}`
                      }
                      {!announcementTimeDisplay &&
                      `You are ready for the IDO. Please stay tune for winner annoucement on ${endJoinTimeDisplay}`
                      }
                    </>
                    }
                  </>
                  )
                }
                {!isAppliedSuccess &&
                  'Click Apply Whitelist button to join the whitelist.'
                }
              </div>
            </div>
          }
        </div>
      </div>

    </>
  );
}

export default React.memo(HowToParticipant);
