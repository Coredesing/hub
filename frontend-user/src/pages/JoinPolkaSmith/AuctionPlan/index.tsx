import React, {useEffect, useState} from "react";
import useStyles from './style';
import {formatNumber} from "../index";

const banner = 'images/polkasmith/BannerLanding.png';


const AuctionPlan = (props: any) => {
    const styles = useStyles();
    return (
        <div>
            <h1>PolkaSmith Auction Plan</h1>
            <div className={styles.auctionPlanContainer}>
                <div className={styles.auctionPlanDetail} style={{borderTopLeftRadius: 10}}>
                    <p><span
                        style={{display: "inline-block", fontSize: 44, lineHeight: 2, fontWeight: "bold"}}>1st - 8th</span>
                    </p>
                    <div className={styles.auctionKeyword}>Parachain Slot</div>
                    <p className={styles.auctionDes}>If PolkaSmith doesn't win the first auction, we will continue to bid in the subsequent auctions. If PolkaSmith fails to win an auction for six weeks after the beginning of the crowdloan, it will end the crowdloan and return all funds to holders.</p>
                </div>
                <div className={styles.auctionPlanDetail1}>
                    <p><span
                        style={{display: "inline-block", fontSize: 44, lineHeight: 2, fontWeight: "bold"}}>~350 PKS</span><span>/ 1 KSM</span>
                    </p>
                    <div className={styles.auctionKeyword}>Winning reward</div>
                    <p className={styles.auctionDes}>If PolkaSmith wins, every KSM contributed to PolkaSmith in the Kusama Parachain auction through the crowdloan will be entitled to ~350 $PKS as a reward. PKS is the native token of PolkaSmith.</p>
                </div>
                <div className={styles.auctionPlanDetail} style={{borderTopRightRadius: 10}}>
                    <p><span
                        style={{display: "inline-block", fontSize: 44, lineHeight: 2, fontWeight: "bold"}}>500 </span><span> Red Kite Points/1 KSM</span>
                    </p>
                    <div className={styles.auctionKeyword}>Whether Win or Lose</div>
                    <p className={styles.auctionDes}>Each Red Kite point is equivalent to 1 PKF staked on Red Kite launchpad. Even if you don't stake any PKF on Red Kite, you can get the same rank benefits when owning a corresponding amount of Red Kite Point. For example, holding 500 Red Kite Points gives you all the Dove rank benefits (including joining IDOs) without staking 500 PKFs.
                    </p>
                </div>
                <div className={styles.auctionPlanDetail1} style={{borderBottomLeftRadius: 10}}>
                    <p><span style={{
                        display: "inline-block",
                        fontSize: 44,
                        lineHeight: 2,
                        fontWeight: "bold"
                    }}>10</span><span>%</span></p>
                    <div className={styles.auctionKeyword}>Early bird</div>
                    <p className={styles.auctionDes}>Contributors who contribute their KSM for PolkaSmith’s
                        crowdloan regardless of the platform for the first seven days since the crowdloan
                        starts will receive an additional 10% of their reward PKS.</p>
                </div>
                <div className={styles.auctionPlanDetail}>
                    <p><span
                        style={{display: "inline-block", fontSize: 44, lineHeight: 2, fontWeight: "bold"}}>{formatNumber(10500000, 0, false)} PKS</span>
                    </p>
                    <div className={styles.auctionKeyword}>Reward Pool</div>
                    <p className={styles.auctionDes}>The PolkaSmith’s prize tool for Kusama Parachain Slot Auction is worth 10,500,000 PKS, 15% of PKS’s total supply (70,000,000 PKS). All contributors will share the auction reward pool. The amount of PKS each contributor receives will be prorated based on the amount of KSM each person has contributed.</p>
                </div>
                <div className={styles.auctionPlanDetail1} style={{borderBottomRightRadius: 10}}>
                    <p><span style={{
                        display: "inline-block",
                        fontSize: 44,
                        lineHeight: 1.5,
                        fontWeight: "bold"
                    }}>Rewards<br/>Distribution</span></p>
                    <p className={styles.auctionDes}>As soon as contributors join the PolkaSmith crowdloan, they will receive 100% Red Kite Point. After PolkaSmith wins a parachain slot, 35% of the PKS tokens in the reward pool will go to the contributors' wallet addresses. The remaining 65% of PKS tokens will be locked during the 1st month then be vested over 10 months later.</p>
                </div>
            </div>
        </div>
    )
}

export default AuctionPlan;